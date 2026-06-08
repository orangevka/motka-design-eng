# Nav Portfolio Dropdown — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Наполнить пункт навигации Portfolio раскрывающимся списком из 18 кейсов (+ «All cases →»), открывающимся по hover на десктопе и аккордеоном в бургер-меню на мобайле, средствами CSS (без JS).

**Architecture:** Правка одного компонента `src/components/Nav.astro`. В frontmatter добавляется массив `cases`. На десктопе пункт Portfolio оборачивается в `.site-nav__has-dropdown` (position:relative) с абсолютно позиционированной панелью `.site-nav__dropdown`, показываемой через `:hover`/`:focus-within`. На мобайле Portfolio становится вложенным `<details>` внутри существующего бургер-`<details>`. Остальные пункты, лого, иконки, шрифты не меняются.

**Tech Stack:** Astro (статика, ноль JS), CSS на токенах (`--color-bg`, `--color-ink`, `--border-subtle`, `--font-display`, `--space-*`, `--container-pad`). Верификация — Playwright (`scripts/shoot.mjs` + ad-hoc hover-скрипт).

**Спецификация:** `docs/superpowers/specs/2026-06-08-nav-portfolio-dropdown-design.md`

---

## File Structure

- **Modify:** `src/components/Nav.astro` — единственный изменяемый файл. Frontmatter (массив `cases`), desktop-разметка (`.site-nav`), mobile-разметка (`.mobile-nav__menu`), блок `<style>` (десктопные и мобильные правила дропдауна).
- **Create (временный, удаляется в конце):** `scripts/shoot-hover.mjs` — снимок десктопа с открытым по hover дропдауном.

Предусловие: dev-сервер запущен (`npm run dev` → http://localhost:4321/). Astro делает hot-reload при правках.

---

### Task 1: Данные кейсов в frontmatter

**Files:**
- Modify: `src/components/Nav.astro` (frontmatter, строки 1–8)

- [ ] **Step 1: Добавить массив `cases` и `allCasesHref` в frontmatter**

Заменить весь текущий frontmatter-блок (строки 1–8):

```astro
---
const cases = [
  { label: 'Chitai-Gorod',  href: '/portfolio/chitay-gorod.html' },
  { label: 'Logistic SaaS', href: '/portfolio/logistic-saas-platform.html' },
  { label: 'MTX Connect',   href: '/portfolio/mtx-connect.html' },
  { label: 'DeepGeo',       href: '/portfolio/deepgeo.html' },
  { label: 'Journey',       href: '/portfolio/ai-body.html' },
  { label: 'Algorithmics',  href: '/portfolio/algoritmika.html' },
  { label: 'Spherum',       href: '/portfolio/spherum.html' },
  { label: 'Congratz',      href: '/portfolio/congratz.html' },
  { label: 'SCAN',          href: '/portfolio/scan.html' },
  { label: 'GlobalLab',     href: '/portfolio/globallab.html' },
  { label: 'SweepNet',      href: '/portfolio/sweep-net.html' },
  { label: 'RealAtom',      href: '/portfolio/realatom.html' },
  { label: 'IDX',           href: '/portfolio/idx.html' },
  { label: 'MoneyWall',     href: '/portfolio/moneywall.html' },
  { label: 'PokerSwap',     href: '/portfolio/pokerswap.html' },
  { label: 'Dunice',        href: '/portfolio/dunice.html' },
  { label: 'Foodbuddy',     href: '/portfolio/foodbuddy.html' },
  { label: 'News360',       href: '/portfolio/news360.html' },
];
const allCasesHref = '/portfolio.html';

const links = [
  { label: 'Portfolio', href: '/portfolio.html', dropdown: true },
  { label: 'About', href: '/about.html' },
  { label: 'Design Subscription', href: '/' },
  { label: 'Contact us', href: '/contacts.html' },
];
---
```

- [ ] **Step 2: Проверить, что Astro не упал**

Run: `Read scripts/_shots` не нужен; проверить вывод dev-сервера (фоновый процесс) — не должно быть ошибки компиляции. Открыть http://localhost:4321/ — страница рендерится (дропдаун ещё не виден, это норма).
Expected: страница грузится без ошибок Astro.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(Nav): cases data for Portfolio dropdown"
```

---

### Task 2: Десктопная разметка дропдауна

**Files:**
- Modify: `src/components/Nav.astro` (блок `<nav class="site-nav">`, текущие строки ~16–25)

- [ ] **Step 1: Заменить desktop-nav рендер на условный (dropdown vs обычный пункт)**

Заменить блок `<nav class="site-nav" aria-label="Primary"> ... </nav>` целиком на:

```astro
    <!-- Desktop nav (≥768px) -->
    <nav class="site-nav" aria-label="Primary">
      {links.map((l) => (
        l.dropdown ? (
          <div class="site-nav__has-dropdown">
            <a class="site-nav__item site-nav__item--dropdown" href={l.href}>
              {l.label}
              <img class="site-nav__chevron" src="/assets/nav/chevron.svg" width="20" height="20" alt="" aria-hidden="true" />
            </a>
            <div class="site-nav__dropdown" role="menu" aria-label="Portfolio cases">
              {cases.map((c) => (
                <a class="site-nav__drop-item" href={c.href} role="menuitem">{c.label}</a>
              ))}
              <a class="site-nav__drop-item site-nav__drop-item--all" href={allCasesHref} role="menuitem">All cases →</a>
            </div>
          </div>
        ) : (
          <a class="site-nav__item" href={l.href}>{l.label}</a>
        )
      ))}
    </nav>
```

- [ ] **Step 2: Проверить рендер DOM**

Run: `node -e "fetch('http://localhost:4321/').then(r=>r.text()).then(t=>console.log('drop-items:', (t.match(/site-nav__drop-item\b/g)||[]).length, '| has-dropdown:', t.includes('site-nav__has-dropdown')))"`
Expected: `drop-items: 19 | has-dropdown: true` (18 кейсов + «All cases», класс `--all` тоже содержит `site-nav__drop-item` → 19 совпадений базового класса; плюс ещё 1 у `--all`? Подсчёт по `\b` даёт по одному на элемент = 19).

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(Nav): desktop dropdown markup for Portfolio"
```

---

### Task 3: Десктопные стили hover-панели + верификация

**Files:**
- Modify: `src/components/Nav.astro` (блок `<style>`, после правил `.site-nav__chevron`, до `/* Mobile nav */`)
- Create (временный): `scripts/shoot-hover.mjs`

- [ ] **Step 1: Добавить стили дропдауна в `<style>`**

Вставить сразу после строки `.site-nav__chevron { width: 20px; height: 20px; }`:

```css
  /* ── Desktop dropdown (Portfolio) ─────────────────────── */
  .site-nav__has-dropdown { position: relative; display: inline-flex; align-items: center; }

  .site-nav__dropdown {
    position: absolute;
    top: 100%;            /* примыкает к пункту — без зазора, hover не теряется */
    left: 0;
    min-width: 220px;
    background: var(--color-bg);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: var(--space-2);
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-4px);
    transition: opacity .15s ease, transform .15s ease, visibility .15s;
    z-index: 200;
  }
  .site-nav__has-dropdown:hover .site-nav__dropdown,
  .site-nav__has-dropdown:focus-within .site-nav__dropdown {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  .site-nav__drop-item {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 18px;
    line-height: 1.3;
    letter-spacing: -0.4px;
    color: var(--color-ink);
    white-space: nowrap;
    padding: var(--space-2) var(--space-3);
    border-radius: 8px;
  }
  .site-nav__drop-item:hover { background: rgba(0, 0, 0, 0.04); }
  .site-nav__drop-item--all {
    margin-top: var(--space-1);
    padding-top: var(--space-3);
    border-top: 1px solid var(--border-subtle);
    border-radius: 0;
  }
```

- [ ] **Step 2: Создать временный hover-скрипт `scripts/shoot-hover.mjs`**

```js
// Снимок десктопа с открытым по hover дропдауном Portfolio.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('scripts/_shots', { recursive: true });
const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
for (const w of [1440, 1920]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.hover('.site-nav__has-dropdown');
  await page.waitForTimeout(300);
  const visible = await page.locator('.site-nav__dropdown').first().evaluate(el => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { opacity: s.opacity, visibility: s.visibility, right: Math.round(r.right), vw: el.ownerDocument.documentElement.clientWidth };
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: `scripts/_shots/nav-hover-${w}.png` });
  console.log(`nav-hover-${w}.png`, JSON.stringify(visible), 'hOverflow=', overflow);
  await page.close();
}
await browser.close();
```

- [ ] **Step 3: Запустить hover-скрипт и проверить открытие + отсутствие выхода за край**

Run: `node scripts/shoot-hover.mjs`
Expected: для обеих ширин `opacity` = `1`, `visibility` = `visible`, `right` ≤ `vw` (панель не вылезает за правый край), `hOverflow= false`.

- [ ] **Step 4: Глазами свериться со скриншотами**

Открыть `scripts/_shots/nav-hover-1440.png` и `nav-hover-1920.png` (Read как изображение). Убедиться: панель под Portfolio, 18 кейсов + «All cases →» с разделителем, фон/тень/скругление аккуратные, текст не обрезан.
Expected: панель открыта и читаема, список полный.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(Nav): desktop hover dropdown styles for Portfolio cases"
```

---

### Task 4: Мобильный аккордеон (разметка + стили) + верификация

**Files:**
- Modify: `src/components/Nav.astro` (блок `<nav class="mobile-nav__menu">` ~строки 42–51; стили внутри `@media (max-width: 767px)`)

- [ ] **Step 1: Заменить mobile-menu рендер на условный (вложенный `<details>` для Portfolio)**

Заменить блок `<nav class="mobile-nav__menu" aria-label="Mobile primary"> ... </nav>` целиком на:

```astro
      <nav class="mobile-nav__menu" aria-label="Mobile primary">
        {links.map((l) => (
          l.dropdown ? (
            <details class="mobile-nav__sub">
              <summary class="mobile-nav__item mobile-nav__item--dropdown">
                {l.label}
                <img class="mobile-nav__chevron" src="/assets/nav/chevron.svg" width="20" height="20" alt="" aria-hidden="true" />
              </summary>
              <div class="mobile-nav__sublist">
                {cases.map((c) => (
                  <a class="mobile-nav__subitem" href={c.href}>{c.label}</a>
                ))}
                <a class="mobile-nav__subitem mobile-nav__subitem--all" href={allCasesHref}>All cases →</a>
              </div>
            </details>
          ) : (
            <a class="mobile-nav__item" href={l.href}>{l.label}</a>
          )
        ))}
      </nav>
```

- [ ] **Step 2: Добавить мобильные стили аккордеона**

Внутри `@media (max-width: 767px)`, после правила `.mobile-nav__chevron { width: 20px; height: 20px; }` (последнее правило перед закрытием media-блока), вставить:

```css
    /* Вложенный аккордеон Portfolio */
    .mobile-nav__sub { border-bottom: 1px solid var(--border-subtle); }
    .mobile-nav__sub:last-child { border-bottom: none; }
    .mobile-nav__sub > summary {
      list-style: none;
      cursor: pointer;
      border-bottom: none;       /* граница уже на .mobile-nav__sub */
      justify-content: flex-start;
    }
    .mobile-nav__sub > summary::-webkit-details-marker { display: none; }
    .mobile-nav__sub[open] > summary .mobile-nav__chevron { transform: rotate(180deg); }
    .mobile-nav__chevron { transition: transform .2s ease; }

    .mobile-nav__sublist {
      display: flex;
      flex-direction: column;
      padding-left: var(--space-4);
      padding-bottom: var(--space-2);
    }
    .mobile-nav__subitem {
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 18px;
      line-height: 1.2;
      letter-spacing: -0.4px;
      color: var(--color-ink);
      white-space: nowrap;
      padding-block: var(--space-3);   /* 12px → tap target */
      display: flex;
      align-items: center;
    }
    .mobile-nav__subitem--all { font-weight: 700; }
```

Примечание: класс `.mobile-nav__item` на `<summary>` даёт нужный layout (flex, размер шрифта, padding-block 16px). Переопределение выше убирает его `border-bottom` (чтобы не дублировать с рамкой `.mobile-nav__sub`).

- [ ] **Step 3: Снять мобильный скриншот (меню + аккордеон открыты)**

Создать временную проверку — Run:
```
node -e "import('playwright').then(async({chromium})=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:1200}});await p.goto('http://localhost:4321/',{waitUntil:'networkidle'});await p.click('.mobile-nav__toggle');await p.click('.mobile-nav__sub > summary');await p.waitForTimeout(300);const o=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);await p.screenshot({path:'scripts/_shots/nav-mobile-390.png',fullPage:true});console.log('nav-mobile-390.png hOverflow=',o);await b.close();})"
```
Expected: `hOverflow= false`.

- [ ] **Step 4: Глазами свериться со скриншотом**

Открыть `scripts/_shots/nav-mobile-390.png` (Read как изображение). Убедиться: бургер открыт, Portfolio раскрыт аккордеоном, под ним список из 18 кейсов + «All cases →» с отступом слева, шеврон повёрнут, остальные пункты (About, Design Subscription, Contact us) на месте.
Expected: аккордеон работает, layout не разъехался, скролла по горизонтали нет.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(Nav): mobile accordion dropdown for Portfolio cases"
```

---

### Task 5: Финальная регрессия + очистка

**Files:**
- Delete: `scripts/shoot-hover.mjs`
- (скриншоты `scripts/_shots/*` не коммитятся — каталог временный)

- [ ] **Step 1: Прогнать общий снимок главной на всех ширинах (регрессия)**

Run: `node scripts/shoot.mjs http://localhost:4321/ nav-regress "1440,1920,768,390"`
Expected: для всех ширин `hOverflow=false`.

- [ ] **Step 2: Сверить, что остальная навигация и секции не изменились**

Открыть `scripts/_shots/nav-regress-1440.png` и `nav-regress-390.png` (Read как изображения). Шапка в закрытом состоянии выглядит как раньше (Portfolio ▾, About, Design Subscription, Contact us; лого; на 390 — бургер). Секции страницы без изменений.
Expected: визуально идентично прежней шапке в покое; дропдаун проявляется только по hover/тапу.

- [ ] **Step 3: Подтвердить ноль JS**

Run: `node -e "fetch('http://localhost:4321/').then(r=>r.text()).then(t=>console.log('inline <script> tags:', (t.match(/<script/g)||[]).length))"`
Expected: `0` (Astro не добавляет клиентский JS; в Nav скриптов нет).

- [ ] **Step 4: Удалить временный hover-скрипт**

```bash
git rm -f scripts/shoot-hover.mjs 2>/dev/null; rm -f scripts/shoot-hover.mjs
```
(если файл не был закоммичен — просто `rm`.)

- [ ] **Step 5: Финальный commit**

```bash
git add -A
git commit -m "chore(Nav): cleanup temp hover script; finalize Portfolio dropdown"
```

---

## Self-Review (заполняется автором плана)

**Spec coverage:**
- Данные 18 кейсов + «All cases →» → Task 1 ✓
- Десктоп CSS-only hover (`:hover`/`:focus-within`) → Task 2 (разметка) + Task 3 (стили) ✓
- Мобайл вложенный `<details>`-аккордеон → Task 4 ✓
- Journey (не AI Body), Chitai-Gorod первым → Task 1 данные ✓
- Без эмодзи → данные содержат только label ✓
- Пути `/portfolio/<slug>.html`, 404 до этапа ③ — заложено, отдельной реализации не требует ✓
- Критерии готовности (1440/1920 hover, клавиатура, 390 аккордеон, регрессия, ноль JS) → Task 3/4/5 ✓

**Placeholder scan:** код приведён полностью в каждом шаге; команд-плейсхолдеров нет.

**Type/имена-консистентность:** классы согласованы между разметкой и стилями — десктоп: `site-nav__has-dropdown`, `site-nav__dropdown`, `site-nav__drop-item`, `site-nav__drop-item--all`; мобайл: `mobile-nav__sub`, `mobile-nav__sublist`, `mobile-nav__subitem`, `mobile-nav__subitem--all`. Переменные `cases`/`allCasesHref` определены в Task 1, используются в Task 2/4.
