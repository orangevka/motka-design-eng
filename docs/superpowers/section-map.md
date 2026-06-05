# Карта секций — лендинг «Design Subscription»

**Figma file:** `AKLK947vSjYe8BFz9wGO0Q`

| Что | node id | примечание |
|---|---|---|
| Оригинал (1600) | `1:11872` | артборд 1600×8000, поля 80px |
| **Копия 1440** | **`15:319`** (`home-1440`) | 1440×8000, edge-to-edge; **вёрстку ведём по ней** |
| Обёртка-контейнер (копия) | `15:320` | VERTICAL auto-layout, x=0, w=1440 |
| Плавающий элемент (копия) | `15:8901` | x=700 (сдвинут −80 от оригинала 780) |

> Вёрстка опирается на копию 1440 (`15:319`): числа и `get_design_context` берём с неё.

## Секции (node id копии ↔ продуктовая секция ↔ компонент)

Заполнено в T7 (прямые дети обёртки `15:320`, маппинг по тексту — имена слоёв ненадёжны).

| # | Продуктовая секция | node id (копия) | Figma-имя слоя | y / h | компонент-файл | примечания/риски |
|---|---|---|---|---|---|---|
| 1 | Nav | `15:321` | Header | 0 / 90 | `src/components/Nav.astro` | HORIZONTAL; «Portfolio…» |
| 2 | Hero | `15:334` | hero | 90 / 650 | `src/components/sections/Hero.astro` | лента `card works` 4559px |
| 3 | BenefitsCards | `15:6415` | Pain-point | 740 / 564 | `src/components/sections/BenefitsCards.astro` | «built for teams», 3 карточки |
| 4 | Statement | `15:6495` | Frame 2131328195 | 1304 / 96 | `src/components/sections/Statement.astro` | центр. текст «Good design…» |
| 5 | DesignKinds | `15:6497` | Coverage block | 1400 / 1060 | `src/components/sections/DesignKinds.astro` | тёмная карточка + чат + табы; **плавающий `15:8901` (y≈2269) поверх** |
| 6 | PriorityExamples | `15:6662` | Heading | 2460 / 1229 | `src/components/sections/PriorityExamples.astro` | «adapts to your priorities», спринт-бейджи |
| 7 | ClientLogos | `15:8343` | Coverage block | 3689 / 182 | `src/components/sections/ClientLogos.astro` | ряд логотипов |
| 8 | Testimonials | `15:8401` | Coverage block | 3871 / 748 | `src/components/sections/Testimonials.astro` | «What clients say», 3 отзыва + Clutch |
| 9 | Process | `15:8493` | Frame 2131328167 | 4619 / 682 | `src/components/sections/Process.astro` | «Simple process», гуттер 80px |
| 10 | Pricing | `15:8601` | Use cases | 5301 / 1214 | `src/components/sections/Pricing.astro` | «Two plans, clear pricing», 3 тарифа |
| 11 | Faq | `15:8788` | process block | 6515 / 870 | `src/components/sections/Faq.astro` | «Questions», аккордеон + тёмная CTA-карточка |
| 12 | Footer | `15:8852` | Group 2087329417 | 7385 / 381 | `src/components/Footer.astro` | «Main…», фон sand |

## Чекап-лист (накоплено в потоке — сузить позже)

- **DesignKinds:** шахматка прозрачности справа — **НАМЕРЕННО** (дизайн-решение): это фон под будущую анимацию (этап ④), оставляем как есть. Тёмная карточка сейчас — единый PNG-мокап (785×680); под/над ним позже ляжет анимация — пока плейсхолдер.
- **Hero:** 3-я (частичная) карточка ленты — неверный ассет (нужен лаймовый брендинг-кард node 15:576); финализируем вместе с анимацией ленты (этап ④).
- **ClientLogos:** «congratz» рендерится живым текстом в фолбэк-шрифте (Outfit нет в проекте) → заменить на SVG-вордмарк.
- **Faq:** тексты ответов свёрнутых пунктов 2–6 приблизительные (копирайтинг всё равно правим).
- **Process:** шахматка в мокапе шага 2 («Let's go») — намеренный вид (прозрачность/Figma-канва), оставляем.
- **Везде:** суб-пиксельные различия рендера шрифтов (Chrome vs Figma) — ожидаемо, не баг.

## Чекап мобильной полировки (адаптив)
- **PriorityExamples @390:** заголовок карточки обрезается («for Le…») — нужен перенос/полный текст; 2-й шильдик «2 weeks» отрывается вниз вместо верха карточки 2 — привязать бейдж к каждой карточке.
