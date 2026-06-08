# Спека: дропдаун Portfolio со списком кейсов в навигации

**Дата:** 2026-06-08
**Компонент:** `src/components/Nav.astro`
**Контекст:** этап ① (лендинг). Навигация уже свёрстана в новом дизайне (Factor A, ноль JS, CSS-only бургер). У пункта Portfolio стоит `dropdown: true` и нарисован шеврон, но сам дропдаун пустой. Задача — наполнить его ссылками на кейсы и заставить открываться на десктопе и в мобильном меню.

## Цель

В пункте навигации **Portfolio** добавить раскрывающийся список ссылок на все кейсы. Поведение взято из Webflow-экспорта русского сайта (`webflow-export/`), но реализуется средствами текущего проекта (CSS-only, без JS). Дизайн пунктов меню — текущий, не меняется.

## Решения (подтверждены пользователем)

- **Объём:** переносим только *поведение* дропдауна. Дизайн пунктов навигации остаётся текущим.
- **Механика открытия:** CSS-only.
  - Десктоп (≥768px): открытие по **hover** (`:hover` / `:focus-within` — клавиатура работает), как в Webflow.
  - Мобайл (<768px): **аккордеон внутри бургер-меню** (вложенный `<details>`).
  - Ноль JS — сохраняем архитектуру проекта.
- **Состав списка:** все кейсы + финальный пункт **«All cases →»** → `/portfolio.html`. Без эмодзи.
- **Название `ai-body`:** используем **Journey** (как в листинге `portfolio.html`), не «AI Body».
- **`chitay-gorod`:** **включаем**, первым пунктом (как в Webflow-дропдауне), имя `Chitai-Gorod`.

## Данные: список кейсов

18 кейсов. Порядок: `chitay-gorod` первым, далее — порядок страницы `portfolio.html`. Каждый href → `/portfolio/<slug>.html`.

| # | Название | href |
|---|---|---|
| 1 | Chitai-Gorod | /portfolio/chitay-gorod.html |
| 2 | Logistic SaaS | /portfolio/logistic-saas-platform.html |
| 3 | MTX Connect | /portfolio/mtx-connect.html |
| 4 | DeepGeo | /portfolio/deepgeo.html |
| 5 | Journey | /portfolio/ai-body.html |
| 6 | Algorithmics | /portfolio/algoritmika.html |
| 7 | Spherum | /portfolio/spherum.html |
| 8 | Congratz | /portfolio/congratz.html |
| 9 | SCAN | /portfolio/scan.html |
| 10 | GlobalLab | /portfolio/globallab.html |
| 11 | SweepNet | /portfolio/sweep-net.html |
| 12 | RealAtom | /portfolio/realatom.html |
| 13 | IDX | /portfolio/idx.html |
| 14 | MoneyWall | /portfolio/moneywall.html |
| 15 | PokerSwap | /portfolio/pokerswap.html |
| 16 | Dunice | /portfolio/dunice.html |
| 17 | Foodbuddy | /portfolio/foodbuddy.html |
| 18 | News360 | /portfolio/news360.html |

Финальный пункт: **All cases →** → `/portfolio.html`.

### Известное ограничение (не блокер)

Страниц кейсов на англ. сайте пока **нет** — их перенос это этап ③. До тех пор ссылки дропдауна ведут на будущие пути `/portfolio/<slug>.html` и вернут 404. Это ожидаемо и осознанно: пути совпадут, когда кейсы будут перенесены. Пути с расширением `.html` уже используются в текущем Nav (`/portfolio.html`, `/about.html`, `/contacts.html`) — остаёмся консистентны.

## Реализация

Правка одного файла — `src/components/Nav.astro` (frontmatter + разметка + `<style>`).

### Frontmatter
Добавить массив `cases` (название + href) и пункт «All cases». Существующий массив `links` не меняется по составу.

### Десктоп (≥768px) — CSS-only hover
- Пункт Portfolio оборачивается в контейнер `.site-nav__has-dropdown` с `position: relative`.
- Сам «Portfolio» остаётся ссылкой на `/portfolio.html`; шеврон — индикатор раскрытия.
- Панель `.site-nav__dropdown`: `position: absolute`, под пунктом; скрыта по умолчанию через `opacity:0; visibility:hidden; pointer-events:none` (не `display:none` — чтобы работал `:focus-within` и возможен плавный fade), появляется при `:hover` и `:focus-within` на контейнере.
- Вид панели: фон `--color-bg`, тень и скругление в стиле текущего мобильного меню, вертикальный список ссылок-кейсов, «All cases →» снизу с разделителем (`--border-subtle`).
- Доступность: `:focus-within` обеспечивает раскрытие при навигации с клавиатуры; ссылки фокусируемы.

### Мобайл (<768px) — аккордеон в бургере
- Внутри `.mobile-nav__menu` пункт Portfolio становится вложенным `<details>` (внутри внешнего `<details class="mobile-nav">`).
- `<summary>` = «Portfolio» + шеврон; тап раскрывает список кейсов под ним, не переходя сразу на страницу.
- Список кейсов — те же ссылки, со стилем мобильных пунктов (tap-target ≥44px), «All cases →» в конце.
- Полностью CSS-only.

### Что НЕ трогаем
Дизайн пунктов, лого, бургер-иконку, шрифты, прочие секции страницы. Меняется только пункт Portfolio.

## Критерии готовности (верификация)

1. **Десктоп 1440 и 1920:** при наведении на Portfolio открывается панель со всеми 18 кейсами + «All cases →»; ссылки кликабельны; панель не вылезает за правый край вьюпорта; горизонтального скролла нет.
2. **Клавиатура:** Tab до Portfolio раскрывает панель (`:focus-within`), пункты достижимы Tab'ом.
3. **Мобайл 390:** бургер → тап Portfolio раскрывает аккордеон со списком; layout не ломается; горизонтального скролла нет.
4. **Регрессия:** остальные пункты nav и секции страницы не изменились; сайт по-прежнему без JS.

Верификация — скриншот-замеры на 1440/1920 (панель открыта) и 390 (аккордеон), проверка ширины вьюпорта.
