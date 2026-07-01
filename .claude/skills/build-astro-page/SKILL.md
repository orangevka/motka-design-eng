---
name: build-astro-page
description: Сверстать новую страницу/кейс motka.design по макету Figma в НОВОЙ Astro-системе (src/). Используй для новых страниц и кейс-стади (в т.ч. тёмных), НЕ для старого webflow-export. Триггеры — «свёрстай страницу/кейс по фигме», ссылка на фрейм Figma для новой страницы.
---

# Вёрстка новой страницы/кейса в Astro-системе motka.design

Репозиторий: `C:/Users/orang/Claude/motka-design-eng`. Новый сайт — **Astro** (`src/`), не webflow-export. Старый скилл `build-page` (webflow, `.mtk-*`) для этих задач НЕ подходит.

## Архитектура (как устроены страницы)

- `src/layouts/Base.astro` — общий каркас (`<head>`, `<html>`). Пропсы: `title`, `description`, `ogImage`, **`theme?: 'light' | 'dark'`** (dark → `<html data-theme="dark">`).
- `src/components/Nav.astro` — общая шапка (проп `cta?`). Читает **chrome-токены** — сама перекрашивается под тему.
- Футер: у страницы свой (`components/Footer.astro`, `sections/home/Footer.astro`, или кейс-специфичный тёмный).
- Страница = `src/pages/<route>.astro`: импортит `Base` + `Nav` + секции + `Footer`.
- Секции — по одному компоненту на секцию в `src/components/sections/<page>/<Name>.astro`, scoped `<style>`, BEM-ish класс-префикс. **NO Tailwind.**

## Сетка (обязательно: 1440 ↔ 1600 не должно прыгать)

Дизайнер часто отдаёт фрейм 1600, но контент внутри — **1440** (вложенный фрейм «sections»). Это 1:1 ложится на наш контейнер:
```css
max-width: var(--container-max); /* 1440 */
margin-inline: auto;
padding-inline: var(--container-pad); /* 40px (24 на ≤1024, 16 на ≤768) */
box-sizing: border-box;
```
Контент центрируется в 1440, фон секции — во всю ширину. На 1440 и 1600 позиции совпадают. **Никогда не хардкодь 1600** и не позиционируй от края вьюпорта — только от контейнера (`left: max(Xpx, calc(50% - 720px + Xpx))` для bleed-элементов).

## Тёмная тема обвязки (кейсы на тёмном фоне)

Механизм «светлая/тёмная тема» уже есть — chrome-токены в `src/styles/tokens.css`:
- Светлые дефолты в `:root`: `--chrome-bg`, `--chrome-fg`, `--chrome-border`, `--chrome-panel`, `--chrome-hover`, `--chrome-cta-bg`, `--chrome-cta-fg`.
- Тёмный оверрайд в `[data-theme="dark"]` + `--case-bg` (#1d222f).
- `html[data-theme="dark"] body { background: var(--case-bg); }` (в base.css).

Для тёмного кейса: `<Base theme="dark">` → Nav/Footer автоматически тёмные. Секции: `background: var(--case-bg)`, текст `#fff`. Логотип (красный блок с белым «MOTKA») theme-agnostic — свап не нужен. Есть и светлые, и тёмные кейсы — тема переключается пропом.

## Токены и типографика

- Заголовки/лейблы: `var(--font-display)` (Factor A). Body/serif: `var(--font-serif)` (Literata).
- Точные `font-size` / `line-height` / `letter-spacing` — из Figma (`get_design_context`). Letter-spacing у Literata — дефолтный (`normal`), см. `[[raster-retina-and-square-corners]]` в памяти.
- Цвета/отступы — токены (`var(--color-*)`, `var(--space-*)`), уникальные — из макета.

## Картинки и сложные визуалы

- **Растр всегда @2x (ретина)**: display-размер × 2. Экспорт `download_assets(defaultScale:2)`.
- **Прямые углы в файле, скругление в CSS.** НЕ экспортируй со скруглением. Если Figma-рамка имеет `cornerRadius` (печётся при экспорте + вылезают белые углы) — через `use_figma` (скилл `figma-use`!) обнули `cornerRadius` у внешней рамки, экспортни, **верни радиус обратно**. Вложенные скругления контента не трогай.
- Сложные композиции (маски, blend-mode, повороты, свечения, мокапы) — экспортируй одним PNG, НЕ воспроизводи в CSS. Реальный текст — всегда HTML.
- Ассеты → `public/assets/<page>/`. `loading="lazy"` для below-fold, `alt`/`aria-hidden`.

## Как читать Figma

- `get_screenshot(fileKey,nodeId,maxDimension)` — обзор.
- `get_metadata(fileKey,nodeId)` — структура (id/имена/размеры). Большие фреймы отдают >лимита → сохрани в файл, парси через node/python (ищи top-level секции по индентации, размеры 1440/1600).
- `get_design_context(fileKey,nodeId, excludeScreenshot:true)` — код + тексты + точные шрифты + URL ассетов.
- Секции обычно названы осмысленно (`section-hero`, `section-values`…) — используй как порядок и имена компонентов.

## Большие страницы — параллелить субагентами

Кейс на 15–20 секций верстай субагентами (`Agent`, general-purpose, model sonnet): 1–3 секции на агента, единый регламент (этот файл + готовый `Hero.astro` за образец), каждый пишет свой компонент + ассеты, НЕ трогает страницу и общие файлы. Оркестратор потом: подключает импорты в страницу, сверяет, полирует. Требуй от агентов вернуть: путь компонента, класс-префикс, созданные ассеты, TODO.

## Проверка (обязательно, кодом — не «на глаз»)

Playwright:
- Рендер на **ширине дизайна и на 1440** (для 1600-макета — обе): `document.documentElement.scrollWidth > clientWidth` должно быть **false** (нет горизонтального скролла).
- Скриншот результата → сверка с Figma-скриншотом секции (порядок, типографика, цвета, отступы). Итерируй до совпадения; указывай px-дельты.
- Мобилка (390): нет переполнения; секции стекаются.
- Тёмная тема: шапка/футер перекрашены, светлые страницы не задеты (регрессия).

## Разрешения для фоновой автономной работы

Если пользователь просит работать автономно/фоном без подтверждений — расширь `.claude/settings.local.json` (`permissions.allow`: Bash, Edit, Write, Task, `mcp__figma-remote-mcp__*`; `defaultMode: "bypassPermissions"`; `skipDangerousModePermissionPrompt: true`). Файл держи в `.gitignore` и вне индекса. См. скилл `update-config`.

## Деплой

Пуш в `master` → авто-деплой preview (preview.motka.design). Коммить осмысленными коммитами.
