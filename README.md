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

## Текущая рабочая сборка Flora (по отчёту Codex)

**Flora 1.0.0.44**, commit `6a382cd`, установщик готов. По отчёту Codex реализованы четыре изменения: исправление компоновки и оформления редактирования Properties с сохранением Save/Cancel и SQLite overrides; новая Scene (группировка по `FloraSource`, счётчики `×N`, Select Model, placeholder); Explorer слева и Catalogs → Scene → Favorites → Basket справа с **иконками и видимыми подписями**; маленькая **зелёная точка** на карточках вместо галочки.

Целевые Qt-проверки и регрессии Import, Cache, Basket, lifecycle прошли **вне 3ds Max**; содержимое установщика проверено побайтово. В реальном 3ds Max остаются непроверенными Scene, Select Model, обновление после удаления объектов и Reset. Это не пользовательская приёмка 1.0.0.44.

**Flora 1.0.0.43** (`1b3793a`) - предыдущий релиз с Point Cloud для новых/cache-hit Corona Proxy и первичным Properties Editing. Исправление визуальной компоновки редакторов вошло уже в 1.0.0.44. Визуальная переделка Settings не входила в последние четыре изменения.

**Не смешивать** веб-макет с рабочим кодом Python/PySide6/MAXScript. Действующая карта рабочего плагина - локальная `FLORA_CODEMAP.md`, обновлённая Codex для 1.0.0.44; доступная Google-копия для 1.0.0.28 - архив. Плановые идеи Instance Import, Uninstall и улучшения Settings не считать выполненными по этому отчёту.

Ботанические каталоги - SQLite `.floratlas` v1, тематические - `.floracol`. Старый `.floracat` отменён. Историческая карта рабочего плагина 1.0.0.28 не является картой веб-референса или текущего кода Max.
