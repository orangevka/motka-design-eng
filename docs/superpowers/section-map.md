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

Заполняется в T7 (чтение прямых детей обёртки `15:320`).

| # | Продуктовая секция | node id (копия) | компонент-файл | примечания/риски |
|---|---|---|---|---|
| 1 | Nav | — | `src/components/Nav.astro` | Header h=90 |
| 2 | Hero | — | `src/components/sections/Hero.astro` | лента 4559px |
| 3 | BenefitsCards | — | `src/components/sections/BenefitsCards.astro` | 3 карточки |
| 4 | Statement | — | `src/components/sections/Statement.astro` | центр. текст |
| 5 | DesignKinds | — | `src/components/sections/DesignKinds.astro` | тёмная карточка + чат + табы |
| 6 | PriorityExamples | — | `src/components/sections/PriorityExamples.astro` | спринт-бейджи, статистика |
| 7 | ClientLogos | — | `src/components/sections/ClientLogos.astro` | ряд логотипов |
| 8 | Testimonials | — | `src/components/sections/Testimonials.astro` | 3 отзыва + Clutch |
| 9 | Process | — | `src/components/sections/Process.astro` | гуттер 80px |
| 10 | Pricing | — | `src/components/sections/Pricing.astro` | 3 тарифа |
| 11 | Faq | — | `src/components/sections/Faq.astro` | аккордеон + CTA-карточка |
| 12 | Footer | — | `src/components/Footer.astro` | фон sand |
