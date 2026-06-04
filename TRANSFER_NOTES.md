# EN-проект motka.design — что перенесено и откуда

> Создан 2026-06-04 переносом из `C:\Users\orang\Claude\motka-design` (общий репозиторий с RU-сайтом).
> Цель разделения: RU и EN — разные проекты, чтобы не путаться.

## Что это
Английская версия motka.design с **новым дизайном** и новым составом страниц.
**Кейсы остаются те же** (старые страницы как есть).

## Перенесено из старого проекта
| Что | Зачем |
|---|---|
| `webflow-export/` (целиком) | EN-сайт: страницы кейсов + `styles.css` + `images/` + `_https_/`. Кейсы работают сразу. |
| `components/` | Партиалы `_head`, `_nav`, `_footer`, `_contact-form`, `_scripts` (старый дизайн). |
| `serve.py` | Локальный сервер: `python serve.py` → http://127.0.0.1:8001/ |
| `parse_figma.py`, `sync-nav.py` | Тулинг (Figma-парсинг, синк навигации). |
| `.figma-token` | Токен Figma (gitignored). Проверить срок действия. |
| `SITE_SPEC.md`, `CSS_SYSTEM.md`, `PAGE_PROMPT_TEMPLATE.md`, `FIGMA_PREP.md` | Доки-референс. |
| `.claude/commands/build-page.md` | Скил верстки страниц. Путь поправлен на этот проект. |
| `netlify.toml`, `.github/workflows/deploy.yml` | Деплой-конфиги (требуют доводки, см. ниже). |

## НЕ перенесено (осталось в RU-проекте)
`build-case.md` (RU-скил), `webflow-export-ru/`, `sync-components-ru.py`, `reorganize-ru.py`,
`typograph.py` (рус. типографика), `chitay-gorod-texts.md`, `CASE_REVIEW_chitay-gorod.md`,
`QA_new_motka_ru_*`.

## Что доделать
- **Новый дизайн (WIP):** страницы нового состава верстать по новому Figma; старые top-level
  страницы (`index.html`, `about.html`, `services.html`…) заменять постепенно.
- **`build-page.md`:** список `.mtk-*` классов — от старого дизайна; обновить под новую CSS-систему.
- **Nav/footer кейсов:** когда новый дизайн шапки/футера будет готов — привести к нему страницы кейсов.
- **Деплой:** создать GitHub-репозиторий, добавить секрет `DEPLOY_KEY`, затем включить
  авто-триггер в `.github/workflows/deploy.yml` (сейчас только ручной `workflow_dispatch`).
