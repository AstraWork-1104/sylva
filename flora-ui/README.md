# Flora UI V2 - браузерный макет

Ветка: `flora-ui-v2`. [Исходники в GitHub](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui).

Для автономного просмотра скачайте [архив ветки](https://github.com/AstraWork-1104/sylva/archive/refs/heads/flora-ui-v2.zip) и откройте `flora-ui/Flora-UI.html`. Модульная версия: `index.html`, `styles.css`, `app.js`; отдельные окна `model-analyzer.html`, `material-manager.html`.

## Реализовано в HTML

- Explorer, Favorites, Basket и демонстрационные тематические каталоги; выбор, Ctrl/Shift, избранное, корзина, меню добавления.
- Общий Tile Size в Explorer/Favorites/каталогах/Basket; крайнее положение включает компактную Table View. Grid адаптируется по ширине доступной области, не загружая данные повторно.
- Grid показывает имя исходного файла и RU/EN при наличии, без Vol/габаритов. Table содержит девять согласованных столбцов, без Preview и старой классификации. Есть сортировка по колонкам, их перетаскивание и изменение ширины; положение/ширина сохраняются локально.
- Search по имени файла, RU/EN/Latin, именам похожих растений. Filters: зависимые группы/среды, AND, цветение, отключённая высота, сброс, 4/2/1 колонки и собственная прокрутка.
- Properties без внутренней шапки и настройки полей. Фиксированные раскрываемые группы «Названия»/«Ботанические сведения», совпадающие значения при мультивыделении. «Домашние» соответствует `landscaped_json`.
- Settings > Library показывает FloraAtlas (.floratlas), FloraCOL (.floracol), Model Analyzer, Export JSON и подтверждаемую очистку тестовых метаданных и добавленных демо-каталогов. Отдельное окно Model Analyzer показывает только filename/relative path.

## Ограничения

**Это UI-макет, не работающий плагин.** Растения, превью, ботаника и тематические каталоги тестовые. Браузер не читает реальные .max, .floratlas, .floracol, папки, сцену 3ds Max; выбор файла сохраняет только имя, его содержимое не анализируется. Сброс данных лишь демонстрирует состояние UI. Favorites/Basket и интерфейсные параметры локальны браузеру. Proxy/Merge/Import в сцену не исполняются.

Актуальные требования: [описание Flora](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit). Состояние реального Python/PySide6-плагина не подтверждается этими изменениями. См. [DESIGN](docs/DESIGN.md) и [SCREENS](docs/SCREENS.md).
