# motka.design EN — Этап ① (Фундамент + ДС + первая страница) — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять Astro-проект, извлечь дизайн-систему из утверждённого макета и сверстать лендинг «Design Subscription» pixel-perfect на 1440 + адаптив (1280/1024/768/390).

**Architecture:** Astro со статическим выводом, чистый CSS на токенах (`tokens.css`), компоненты `Base.astro` → `Nav`/`Footer` → `sections/*`. Источник истины — Figma; перед версткой делаем копию макета на 1440. Верстка идёт секция-за-секцией по pixel-perfect-циклу (Playwright-скриншот → PIL-замер vs Figma → правка).

**Tech Stack:** Astro 5, TypeScript, чистый CSS (CSS-переменные), Playwright (скриншоты), Python+Pillow (замер пикселей), Figma MCP (`get_design_context`, `get_screenshot`, `get_variable_defs`, `use_figma`).

**Спека:** `docs/superpowers/specs/2026-06-04-motka-eng-foundation-design.md`

---

## Подход к верификации (вместо классического TDD)

Это статический визуальный фронтенд — юнит-тесты нерелевантны. «Тест» = воспроизводимая проверка:
- **Сборка:** `npm run build` без ошибок.
- **Pixel-perfect (десктоп 1440):** Playwright рендерит страницу в viewport 1440 → PIL сравнивает с рендером Figma-копии 1440 (тот же node) → расхождения с px-дельтой устраняются.
- **Адаптив:** на каждом брейке нет горизонтального скролла (`scrollWidth <= clientWidth`), контент читаем, ничего не наезжает.

Каждая секция коммитится отдельно.

---

## Карта файлов

| Файл | Ответственность |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json` | конфиг Astro-проекта |
| `src/styles/tokens.css` | дизайн-токены (CSS-переменные) из Figma |
| `src/styles/base.css` | reset + базовая типографика + контейнер |
| `src/styles/global.css` | сборка стилей (импорт tokens+base) |
| `src/assets/fonts/*` | Factor A (woff/woff2), Spectral (woff2) |
| `src/layouts/Base.astro` | `<head>`, meta/OG, шрифты, global.css, `<slot/>` |
| `src/components/Nav.astro`, `Footer.astro` | общие шапка/подвал |
| `src/components/ui/*` | примитивы: Button, Tag, Card, Accordion, StarRating, Avatar |
| `src/components/sections/*` | 12 секций лендинга |
| `src/pages/index.astro` | сборка страницы из секций |
| `public/assets/*` | растровые/векторные ассеты, экспортированные из Figma |
| `scripts/shoot.mjs` | Playwright-скриншоты на заданных viewport |
| `scripts/measure.py` | PIL-замер и diff скриншота vs Figma-рендер |
| `docs/superpowers/section-map.md` | маппинг node id ↔ секция (создаётся в Task 7) |

Astro-проект живёт в корне репо и сосуществует с `webflow-export/` (кейсы для этапа ③) и `components/` (старые партиалы) — их НЕ трогаем.

---

## Фаза 0 — Скаффолд проекта

### Task 1: Astro-скаффолд

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `.gitignore` (дополнить)

- [ ] **Step 1: Создать `package.json`**

```json
{
  "name": "motka-design-eng",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "shoot": "node scripts/shoot.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "playwright": "^1.48.0"
  }
}
```

- [ ] **Step 2: Создать `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://motka.design',
  build: { format: 'file' }, // /about.html вместо /about/ — совместимо с rsync-деплоем и кейсами
});
```

- [ ] **Step 3: Создать `tsconfig.json`**

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 4: Временный `src/pages/index.astro` (smoke)**

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Motka — smoke</title></head>
  <body><h1>Motka EN — scaffold OK</h1></body>
</html>
```

- [ ] **Step 5: Дополнить `.gitignore`**

Добавить строки (если ещё нет): `node_modules/`, `dist/`, `.astro/`, `scripts/_shots/`.

- [ ] **Step 6: Установить и собрать**

Run: `npm install && npm run build`
Expected: сборка завершается без ошибок, появляется `dist/index.html` с «scaffold OK».

- [ ] **Step 7: Коммит**

```bash
git add package.json astro.config.mjs tsconfig.json src/ .gitignore
git commit -m "feat: Astro-скаффолд EN-проекта"
```

---

## Фаза 1 — Копия макета на 1440 + референс-рендеры

### Task 2: Создать копию макета на 1440 в Figma

**REQUIRED SUB-SKILL перед любым `use_figma`:** загрузить скил `figma-use`.

Исходник: file `AKLK947vSjYe8BFz9wGO0Q`, корневой фрейм `1:11872` (1600×8000). Контент — единая обёртка `1:11873` в x=80, ширина 1440.

- [ ] **Step 1: Загрузить скил figma-use** (обязательно до use_figma).

- [ ] **Step 2: Дублировать корневой фрейм через `use_figma`**

Логика скрипта use_figma: найти node `1:11872`, склонировать (`clone()`), переименовать клон в `home-1440`, разместить рядом (например x = исходный x + 1800), чтобы не перекрывал оригинал.

- [ ] **Step 3: Привести клон к 1440**

В том же/следующем use_figma: установить ширину клона = `1440`; у его потомка-обёртки (соответствует `1:11873`) установить `x = 0`. Если на обёртке есть constraints/auto-layout — проверить, что контент не растянулся; цель: контент edge-to-edge 1440 (контент 1360 + 40px гуттер по краям).

- [ ] **Step 4: Зафиксировать node id копии**

Вернуть/записать node id клона `home-1440` и его секций. Сохранить в `docs/superpowers/section-map.md` (заголовок + id копии; таблица секций заполнится в Task 7).

- [ ] **Step 5: Снять контрольный скриншот копии**

Через `get_screenshot` (nodeId = клон, maxDimension 1440). Скачать в `scripts/_shots/figma-1440-full.png`.
Expected: ширина 1440, контент не обрезан и не разъехался, поля по краям ~40px.

- [ ] **Step 6: Визуальная сверка с оригиналом**

Сравнить со старым рендером (`figma-home.png`): порядок и состав секций совпадают, изменилась только ширина/поля. Если что-то уехало — поправить через `use_figma` и повторить Step 5.

- [ ] **Step 7: Коммит**

```bash
git add docs/superpowers/section-map.md
git commit -m "chore: копия макета на 1440 (Figma) + фиксация node id"
```

> Если копию по какой-то причине создать не удаётся (ошибки use_figma на тяжёлом фрейме) — fallback: работать от оригинала 1:11872, снимать числа со сдвигом −80px по X. Зафиксировать выбор в section-map.md.

---

## Фаза 2 — Фундамент (токены, шрифты, layout, харнесс)

### Task 3: Дизайн-токены

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Снять токены из Figma**

Run (MCP): `get_variable_defs` для node `1:11872`. Уже известное ядро (значения подтвердить): цвета `text/primary #333`, `text/secondary #4a4a4a`, `text/quaternary #8a8a8a`, `background/page #fff`, `background/sunken #f3efed` (sand), `background/subtle #f2f2f2`, `color/red/500 #f81c1c` (brand), accent `#fe583e`, cta `#6cd6ab`, нейтраль `#fff/#f3efed/#a3a3a3/#4a4a4a`, бордеры `#bdbdbd / #a3a3a3 / #f3efed`. Spacing-шкала: 0,4,8,12,16,20,24,28,32,36,40,48,64,80. Радиусы: 16 (2xl), 32 (4xl). Шрифты: Factor A (Bold 44/46, 24/30, 22/26; Regular 40/52, 18/22), Spectral (Regular 22/26 ls-2, 20/24 ls-2).

- [ ] **Step 2: Написать `src/styles/tokens.css`**

```css
:root {
  /* fonts */
  --font-display: 'Factor A', system-ui, sans-serif;
  --font-serif: 'Spectral', Georgia, serif;

  /* colors */
  --color-ink: #333333;
  --color-text-secondary: #4a4a4a;
  --color-text-quaternary: #8a8a8a;
  --color-bg: #ffffff;
  --color-sand: #f3efed;
  --color-subtle: #f2f2f2;
  --color-brand: #f81c1c;
  --color-accent: #fe583e;
  --color-cta: #6cd6ab;
  --color-dark: #111111; /* тёмные карточки — подтвердить точное значение по секции FAQ/CTA */

  --color-neutral-0: #ffffff;
  --color-neutral-100: #f3efed;
  --color-neutral-300: #a3a3a3;
  --color-neutral-700: #4a4a4a;

  --border-default: #bdbdbd;
  --border-strong: #a3a3a3;
  --border-subtle: #f3efed;

  /* spacing */
  --space-0: 0; --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-7: 28px;
  --space-8: 32px; --space-9: 36px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px;

  /* radii */
  --radius-2xl: 16px;
  --radius-4xl: 32px;

  /* layout */
  --container-max: 1440px;
  --container-pad: 40px; /* гуттер по краям контейнера */
}
```

- [ ] **Step 3: Сверить значения**

Run: `git diff --stat` (файл создан). Глазами сверить с выводом `get_variable_defs` из Step 1: каждое значение присутствует и совпадает. Точные значения, не вошедшие в ядро, добавлять по мере встречи в секциях.

- [ ] **Step 4: Коммит**

```bash
git add src/styles/tokens.css
git commit -m "feat: дизайн-токены из Figma (tokens.css)"
```

### Task 4: Шрифты (Factor A + Spectral)

**Files:**
- Create: `src/assets/fonts/factor-a-regular.woff`, `factor-a-bold.woff`, `spectral-regular.woff2` (+ опц. woff2 для Factor A)
- Create: `src/styles/fonts.css`
- Modify: `src/styles/global.css` (в Task 5)

- [ ] **Step 1: Скачать Factor A с Motka CDN**

```bash
mkdir -p src/assets/fonts
curl -sL "https://cdn.prod.website-files.com/623a4d65378e3dda4dd20f87/6511a3eee51f3537baa144f9_Factor%20A-Regular-Web.woff" -o src/assets/fonts/factor-a-regular.woff
curl -sL "https://cdn.prod.website-files.com/623a4d65378e3dda4dd20f87/6511a3eec2a43dc012f581c1_Factor%20A-Bold-Web.woff" -o src/assets/fonts/factor-a-bold.woff
ls -l src/assets/fonts/
```
Expected: два .woff файла ненулевого размера.

- [ ] **Step 2: Скачать Spectral Regular (woff2) с Google Fonts**

```bash
curl -sL -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Spectral:wght@400&display=swap" -o /tmp/spectral.css
grep -o "https://[^)]*\.woff2" /tmp/spectral.css | head -1
```
Взять первый woff2 (latin) → скачать в `src/assets/fonts/spectral-regular.woff2`:
```bash
curl -sL "$(grep -o 'https://[^)]*\.woff2' /tmp/spectral.css | head -1)" -o src/assets/fonts/spectral-regular.woff2
ls -l src/assets/fonts/spectral-regular.woff2
```
Expected: woff2 ненулевого размера.

- [ ] **Step 3: (опц.) Конвертировать Factor A woff→woff2** для лучшего сжатия, если доступен `woff2_compress`/Python `fonttools`. Если инструмента нет — оставить .woff (рабочий вариант). Не блокирующий шаг.

- [ ] **Step 4: Написать `src/styles/fonts.css`**

```css
@font-face {
  font-family: 'Factor A';
  src: url('/src/assets/fonts/factor-a-regular.woff') format('woff');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Factor A';
  src: url('/src/assets/fonts/factor-a-bold.woff') format('woff');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Spectral';
  src: url('/src/assets/fonts/spectral-regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
```
> При импорте шрифтов из `src/` Astro/Vite корректно резолвит пути на этапе сборки. Если в проде путь не резолвится — перенести шрифты в `public/fonts/` и заменить url на `/fonts/...`.

- [ ] **Step 5: Коммит**

```bash
git add src/assets/fonts src/styles/fonts.css
git commit -m "feat: самохост шрифтов Factor A + Spectral"
```

### Task 5: Базовый layout + base.css + контейнер

**Files:**
- Create: `src/styles/base.css`, `src/styles/global.css`, `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/styles/base.css`** (reset + типографика + контейнер)

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-display);
  color: var(--color-ink);
  background: var(--color-bg);
  line-height: 1.3;
  -webkit-font-smoothing: antialiased;
}
img, picture, svg, video { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 700; }

.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```

- [ ] **Step 2: `src/styles/global.css`**

```css
@import './tokens.css';
@import './fonts.css';
@import './base.css';
```

- [ ] **Step 3: `src/layouts/Base.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
const { title, description = '', ogImage = '/assets/og.png' } = Astro.props;
import '../styles/global.css';
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <meta property="og:title" content={title} />
    {description && <meta property="og:description" content={description} />}
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Переписать `src/pages/index.astro` на layout**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Design Subscription — Motka Design" description="Fixed monthly price. Pause anytime.">
  <main class="container">
    <h1 style="font-size:44px">Motka EN — base layout OK</h1>
    <p style="font-family:var(--font-serif)">Spectral serif sample.</p>
  </main>
</Base>
```

- [ ] **Step 5: Собрать и проверить шрифты**

Run: `npm run build && npm run preview` (или `npm run dev`).
Expected: сборка ок; в браузере заголовок рисуется Factor A (не системным), serif-строка — Spectral. Проверить DevTools → Network: шрифты грузятся (200), `font-family` применяется.

- [ ] **Step 6: Коммит**

```bash
git add src/styles src/layouts src/pages/index.astro
git commit -m "feat: базовый layout, global.css, контейнер 1440"
```

### Task 6: Харнесс pixel-perfect (Playwright + PIL)

**Files:**
- Create: `scripts/shoot.mjs`, `scripts/measure.py`

- [ ] **Step 1: Установить Chromium для Playwright**

Run: `npx playwright install chromium`
Expected: установлен chromium.

- [ ] **Step 2: `scripts/shoot.mjs`** — скриншот dev-страницы на нужных viewport

```js
// Usage: node scripts/shoot.mjs <url> <outPrefix> [widths]
// Пример: node scripts/shoot.mjs http://localhost:4321/ home "1440,1280,1024,768,390"
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/';
const prefix = process.argv[3] ?? 'shot';
const widths = (process.argv[4] ?? '1440').split(',').map(Number);
mkdirSync('scripts/_shots', { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  // проверка горизонтального скролла
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: `scripts/_shots/${prefix}-${w}.png`, fullPage: true });
  console.log(`${prefix}-${w}.png  hOverflow=${overflow}`);
  await page.close();
}
await browser.close();
```

- [ ] **Step 3: `scripts/measure.py`** — замер и diff vs Figma-рендер

```python
# Usage: python scripts/measure.py <rendered.png> <figma.png> [y0 y1]
# Сравнивает по ширине 1440; печатает размеры, и (опц.) кропает обе по [y0:y1] и считает попиксельную дельту.
import sys
from PIL import Image, ImageChops

rendered = Image.open(sys.argv[1]).convert('RGB')
figma = Image.open(sys.argv[2]).convert('RGB')
print(f"rendered: {rendered.size}  figma: {figma.size}")

if len(sys.argv) >= 5:
    y0, y1 = int(sys.argv[3]), int(sys.argv[4])
    r = rendered.crop((0, y0, rendered.width, y1))
    f = figma.crop((0, y0, figma.width, y1))
    w = min(r.width, f.width)
    r = r.crop((0, 0, w, r.height)); f = f.crop((0, 0, w, f.height))
    h = min(r.height, f.height)
    r = r.crop((0, 0, w, h)); f = f.crop((0, 0, w, h))
    diff = ImageChops.difference(r, f)
    bbox = diff.getbbox()
    # доля заметно отличающихся пикселей (порог 24/255)
    gray = diff.convert('L')
    hist = gray.histogram()
    diffpx = sum(hist[24:])
    total = w * h
    print(f"crop {w}x{h}  diff-bbox={bbox}  diff>{24}: {diffpx} px ({100*diffpx/total:.2f}%)")
    diff.save('scripts/_shots/_diff.png')
```

- [ ] **Step 4: Прогон харнесса на smoke-странице**

Run: `npm run dev &` затем `node scripts/shoot.mjs http://localhost:4321/ smoke "1440,768,390"`
Expected: три png в `scripts/_shots/`, `hOverflow=false` на всех.

- [ ] **Step 5: Коммит**

```bash
git add scripts/shoot.mjs scripts/measure.py
git commit -m "chore: харнесс pixel-perfect (Playwright + PIL)"
```

---

## Фаза 3 — Секции лендинга (десктоп 1440, pixel-perfect)

### Task 7: Карта секций (node id ↔ компонент)

**Files:**
- Modify: `docs/superpowers/section-map.md`

- [ ] **Step 1: Прочитать структуру топ-уровневых узлов**

Для копии `home-1440` (или оригинала `1:11872`, если копии нет) вызвать `get_design_context` по каждому топ-узлу из таблицы спеки §4а: `1:11874, 1:11887, 1:17966, 1:18046, 1:18048, 1:18213, 1:19894, 1:19952, 1:20044, 1:20152, 1:20339, 1:20403`. (Для копии — соответствующие id клона.)

- [ ] **Step 2: Сопоставить с 12 продуктовыми секциями**

Сопоставить каждый node с визуальной секцией: Nav, Hero, BenefitsCards, Statement, DesignKinds, PriorityExamples, ClientLogos, Testimonials, Process, Pricing, Faq, Footer. (Известные: Nav=1:11874, Hero=1:11887, PriorityExamples≈Use cases 1:20152, Process=1:20339, Footer=1:20403. Остальные подтвердить по контенту.) Если одна Figma-секция содержит две продуктовые (или наоборот) — зафиксировать это в карте.

- [ ] **Step 3: Записать `docs/superpowers/section-map.md`** — таблица: `визуальная секция | node id (копия) | node id (оригинал) | компонент-файл | примечания/риски`.

- [ ] **Step 4: Коммит**

```bash
git add docs/superpowers/section-map.md
git commit -m "docs: карта секций node id ↔ компонент"
```

---

### Протокол сборки секции (Section Build Protocol)

Каждая секционная задача (Task 8–19) выполняется по этому протоколу. `<Section>` = имя компонента, `<node>` = node id из section-map (Task 7), `<file>` = `src/components/...`.

- [ ] **P1. Прочитать дизайн секции:** `get_design_context` по `<node>` (даёт разметку/стили/значения) + при необходимости `get_metadata` для точных позиций/размеров. Зафиксировать: размеры, отступы (px), font-size/line-height, цвета (сверить с токенами).
- [ ] **P2. Экспортировать ассеты секции:** растровые мокапы/фото — `get_screenshot` по их node id (maxDimension ≥ 2× отображаемого) → `public/assets/<section>/...png`; векторные логотипы/иконки — попытаться SVG из `get_design_context`/инлайн, иначе PNG@2x. Записать пути.
- [ ] **P3. Сверстать `<file>`** на токенах и классе `.container`, без хардкода цветов/отступов мимо токенов. Текст — из макета (готов к правкам копи). Подключить секцию в `src/pages/index.astro`.
- [ ] **P4. Снять рендер:** `npm run dev` → `node scripts/shoot.mjs http://localhost:4321/ <section> "1440"`.
- [ ] **P5. Снять Figma-референс секции:** `get_screenshot` по `<node>` (maxDimension 1440) → `scripts/_shots/figma-<section>.png`.
- [ ] **P6. Замерить:** `python scripts/measure.py scripts/_shots/<section>-1440.png scripts/_shots/figma-<section>.png` (+ кроп по y при необходимости). Перечислить расхождения с px-дельтой.
- [ ] **P7. Чинить и повторять P3–P6**, пока ключевые величины (ширина контейнера, размеры/отступы блоков, типографика, позиции) не совпадут. Отличать реальные баги (фиксить) от суб-пиксельного рендера шрифтов (отметить, не форсить).
- [ ] **P8. Коммит:** `git add <file> src/pages/index.astro public/assets/<section> && git commit -m "feat(section): <Section> pixel-perfect 1440"`.

> Примитивы из `src/components/ui/` (Button, Tag, Card, Accordion, StarRating, Avatar) создаются в момент первой встречи в секции и переиспользуются дальше (DRY). При создании примитива — отдельный под-коммит.

---

### Task 8: Nav (`src/components/Nav.astro`, node 1:11874)
Протокол сборки секции. Особенности: лого MOTKA (красное, экспорт SVG), пункты Portfolio/About/Design Subscription/Contact us, выравнивание по `.container`. Header h=90.

### Task 9: Hero (`src/components/sections/Hero.astro`, node 1:11887)
Протокол. **Риск:** `card works` — горизонтальная лента 4559px (x=429), реализовать как блок с `overflow:hidden`/маской или горизонтальным скроллом; ассеты-телефоны/блобы экспортировать (P2). Заголовок, подзаголовок, теги аудитории, 2 CTA (создать примитив `Button`: dark + outline). h=650.

### Task 10: BenefitsCards (`src/components/sections/BenefitsCards.astro`, node по карте ≈ Pain-point 1:17966)
Протокол. 3 карточки «built for teams…» со стрелками и мини-графикой (создать примитив `Card`). Подтвердить node по section-map.

### Task 11: Statement (`src/components/sections/Statement.astro`, node по карте)
Протокол. Центрированное утверждение «Good design connects…». Лёгкая секция (может быть `1:18046`-разделитель + текст).

### Task 12: DesignKinds (`src/components/sections/DesignKinds.astro`, node ≈ Coverage block 1:18048)
Протокол. Список типов дизайна + тёмная карточка «Keep Your Challenge» + чат-UI + табы категорий (теги — примитив `Tag`). **Сложная секция**, h≈1060. Экспорт мокапов чата.

### Task 13: PriorityExamples (`src/components/sections/PriorityExamples.astro`, node Use cases 1:20152)
Протокол. 2 примера со спринт-бейджами и статистикой + превью кейсов (экспорт изображений). h≈1214.

### Task 14: ClientLogos (`src/components/sections/ClientLogos.astro`, node по карте)
Протокол. Ряд логотипов (leverate, mtx connect, Algoritmika, congratz, hirebus) — экспорт SVG/PNG каждого.

### Task 15: Testimonials (`src/components/sections/Testimonials.astro`, node по карте)
Протокол. 3 отзыва: звёзды (примитив `StarRating`), аватары (примитив `Avatar`), имена; ссылка «More feedback on Clutch».

### Task 16: Process (`src/components/sections/Process.astro`, node process block 1:20339)
Протокол. **Риск:** гуттер 80px (не 40) — привести к общему контейнеру осознанно. Иконки интеграций (Trello/Slack и др. — экспорт) + 3 шага. h≈870.

### Task 17: Pricing (`src/components/sections/Pricing.astro`, node по карте ≈ часть Heading/Coverage)
Протокол. 3 тарифа (Trial/Demo, Standard 4500€, Premium 9500€) — карточки с фичами и CTA «Book a call» (примитив `Button` cta-green) + полоса «What happens after you subscribe».

### Task 18: Faq (`src/components/sections/Faq.astro`, node по карте)
Протокол. Аккордеон (примитив `Accordion` на `<details>/<summary>`, без JS-зависимостей) — 6 вопросов + тёмная CTA-карточка «No more design bottlenecks». Подтвердить точный `--color-dark` из этой секции.

### Task 19: Footer (`src/components/Footer.astro`, node 1:20403)
Протокол. Колонки Main / Portfolio / соцссылки (Clutch, LinkedIn, Behance) + лого + копирайт «© 2026 Motka». Фон sand.

---

## Фаза 4 — Адаптив (1280 / 1024 / 768 / 390)

> Мобильного макета нет → раскладки на усмотрение (ревью по результату). Брейки нисходящие, mobile-last (десктоп — база).

### Task 20: Адаптивный фундамент

**Files:**
- Modify: `src/styles/base.css` (контейнер/паддинги по брейкам), `src/styles/tokens.css` (адаптивная типошкала при необходимости)

- [ ] **Step 1: Адаптивные паддинги контейнера**

Добавить в `base.css`:
```css
@media (max-width: 1024px) { :root { --container-pad: 24px; } }
@media (max-width: 768px)  { :root { --container-pad: 16px; } }
```

- [ ] **Step 2: Базовая адаптивная типографика** (опц.) — уменьшить крупные заголовки на узких брейках через `clamp()` в местах их объявления (делается также в Task 21 по секциям).

- [ ] **Step 3: Коммит**

```bash
git add src/styles/base.css src/styles/tokens.css
git commit -m "feat(responsive): адаптивный контейнер и паддинги"
```

### Task 21: Адаптив по секциям (рефлоу)

Для КАЖДОЙ секции из Фазы 3, по нисходящим брейкам:

- [ ] **Step 1: Снять рендеры всех брейков**

Run: `node scripts/shoot.mjs http://localhost:4321/ home "1440,1280,1024,768,390"`
Expected: 5 png; в логе `hOverflow=false` на всех.

- [ ] **Step 2: Рефлоу секции** — многоколоночные блоки → стопка; сетки карточек → 1–2 колонки; крупная типографика → меньше; hero-лента → адаптированный показ (стопка/горизонтальный скролл на тач). Править CSS секции (media-queries рядом со стилями секции).

- [ ] **Step 3: Проверка на каждом брейке** — нет горизонтального скролла (`hOverflow=false`), контент читаем, ничего не наезжает, тач-таргеты ≥ 40px. Визуально просмотреть скриншоты `home-1280/1024/768/390`.

- [ ] **Step 4: Коммит (по секции или группе секций)**

```bash
git add src/components src/styles
git commit -m "feat(responsive): рефлоу секций на 1280/1024/768/390"
```

---

## Фаза 5 — Финальная сборка и QA

### Task 22: Полностраничный QA

- [ ] **Step 1: Полный билд**

Run: `npm run build`
Expected: без ошибок, `dist/index.html` + ассеты на месте.

- [ ] **Step 2: Pixel-perfect полной страницы на 1440**

Run: `node scripts/shoot.mjs http://localhost:4321/ home "1440"` затем `python scripts/measure.py scripts/_shots/home-1440.png scripts/_shots/figma-1440-full.png`.
Expected: расхождения только суб-пиксельные (рендер шрифтов); реальных смещений нет. Зафиксировать итог числами.

- [ ] **Step 3: Адаптив-QA на всех брейках**

Run: `node scripts/shoot.mjs http://localhost:4321/ home "1440,1280,1024,768,390"`.
Expected: `hOverflow=false` на всех; визуальный просмотр — раскладки осмысленные.

- [ ] **Step 4: Прогон по критериям успеха спеки §1** — отметить каждый пункт (1–5) как выполненный с доказательством (вывод команд/замеров).

- [ ] **Step 5: Финальный коммит**

```bash
git add -A
git commit -m "feat: лендинг Design Subscription — этап ① завершён (1440 pixel-perfect + адаптив)"
```

- [ ] **Step 6: Ревью с пользователем** — показать скриншоты 1440 + брейков; согласовать адаптив (ревью по результату per спека §6а); собрать правки копи, если есть.

---

## Самопроверка плана (выполнено при написании)

- **Покрытие спеки:** скаффолд (T1) ✓, копия 1440 §4а (T2) ✓, токены §4.1 (T3) ✓, шрифты §2 (T4) ✓, layout/Nav/Footer §3 (T5,T8,T19) ✓, примитивы §4.2 (в протоколе) ✓, 12 секций §5 (T8–T19) ✓, pixel-perfect §6 (харнесс T6 + протокол) ✓, адаптив §6а (T20–T21) ✓, критерии успеха §1 (T22) ✓.
- **Плейсхолдеры:** node id средних секций резолвятся в T7 (конкретная задача, не TODO); значение `--color-dark` подтверждается в T18; и то и другое — явные шаги, не размытые требования.
- **Консистентность имён:** `scripts/shoot.mjs`, `scripts/measure.py`, `scripts/_shots/`, `.container`, токены `--color-*/--space-*/--container-*`, примитивы `Button/Tag/Card/Accordion/StarRating/Avatar` — едины по всему плану.
