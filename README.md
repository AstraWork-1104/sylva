# Flora UI V2 - веб-референс интерфейса

[Интерактивный веб-макет](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui) - визуальный референс Flora, **не исходный код работающего плагина 3ds Max** и не разрешение на полный редизайн PySide6.

## Что читать сначала

- [Карта веб-интерфейса UI_MAP.md](flora-ui/docs/UI_MAP.md) - DOM, состояние, функции, стили, автономная сборка и регрессии.
- [Правила веб-агентов](flora-ui/AGENTS.md) - границы редактирования и проверок.
- [Инструкция репозитория](AGENTS.md) - разграничение ролей.
- [Основное описание Flora](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit) - действующие требования, история и статусы.

Модульные файлы: `flora-ui/index.html`, `flora-ui/styles.css`, `flora-ui/app.js`. Автономная упаковка: `flora-ui/Flora-UI.html`. [ZIP ветки](https://github.com/AstraWork-1104/sylva/archive/refs/heads/flora-ui-v2.zip).

## Фактический веб-макет, 20.10.2026

HTML содержит Explorer, Catalogs, Scene, Favorites и Basket. Правая группа вкладок использует **иконки с видимыми подписями**; карточки показывают **зелёную точку** наличия в демонстрационной Scene. Представлены Grid/Table, Properties Edit, Filters, общий Geometry/Proxy, Settings, Proxy Cache и диалоги, Model Analyzer и Material Manager. Детали - в [README макета](flora-ui/README.md), [DESIGN](flora-ui/docs/DESIGN.md) и [SCREENS](flora-ui/docs/SCREENS.md).

Демо-сцена, localStorage и диалоги не работают с реальной сценой Max, библиотекой .max, Corona Renderer, INI или SQLite.

## Границы изменений настоящей Flora

Следующий **согласованный, но ещё не выданный** таск Codex: четыре точечные правки существующего PySide6-плагина - вкладка Scene; навигация Explorer слева / Catalogs, Scene, Favorites, Basket справа с иконками и подписями; зелёная точка на карточках; визуальная группировка существующего Settings по веб-референсу.

**Не переделывать всё окно и архитектуру ради соответствия HTML.** Сохранять Explorer, Filters, Basket, Geometry/Corona Proxy Merge, Proxy Cache, материалы, сцены и пользовательские данные. Предыдущий таск на Point Cloud и ручное редактирование Properties был выдан, но внедрение в рабочую сборку здесь не подтверждено.

Ботанические каталоги - SQLite `.floratlas` v1, тематические - `.floracol`. Старый `.floracat` отменён. Историческая карта рабочего плагина 1.0.0.28 не является картой веб-референса или текущего кода Max.
