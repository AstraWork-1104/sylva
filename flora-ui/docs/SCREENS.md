# Flora UI V2 - экраны и состояние демонстрации

| Экран | Реализовано в HTML | За пределами браузера |
|---|---|---|
| Navigation | Explorer слева, Catalogs/Scene/Favorites/Basket справа, подсказки и aria-label, счётчик Basket | Реальный Qt UI |
| Explorer | Дерево папок, поиск, Grid/Table, Tile Size, выбор и контекстное меню | Чтение .max |
| Scene | FloraSource demo, группировка Geometry+Proxy, ×N, placeholder, Refresh, Select Model | Перебор/выбор настоящих узлов |
| Properties | «Названия»/«Ботанические сведения», Edit/Save/Cancel, валидация, сохранение per-source и защита несохранённых изменений | SQLite properties_overrides.sqlite |
| Filters | Группа/категория, природная/домашняя среда, цветение, высота disabled, AND, reset, адаптивность | Реальная FloraAtlas БД |
| Grid/Table | Filename, RU/EN, 9 колонок, изменение порядка/ширины, общий Tile Size, счётчики Scene | Индекс настоящей библиотеки |
| Search | Filename, RU/EN/Latin, похожие растения, ручные overrides | Импорт реальной SQLite |
| Favorites | Звёздочки, пользовательские коллекции | Связь с Max |
| Basket | Include, удаление, Clear, Geometry/Proxy, диалог Preview | Сценовый Merge и Corona Proxy |
| Catalogs | FloraCOL тематические демонстрации | Анализ .floracol |
| Settings | Use Instances OFF, Point Cloud, Proxy Cache, Clear с предупреждением, Uninstall с подтверждением | Изменение INI/.cgeo и удаление плагина |
| Model Analyzer | Filename и относительный путь, JSON модели | Открытие .max и анализ геометрии |
| Material Manager | Интерактивный отдельный экран | Управление материалами в 3ds Max |

Одинаковая основная логика находится в `index.html` + `styles.css` + `app.js` и автономном `Flora-UI.html`; автономная версия также содержит оба вспомогательных окна. **Установленный плагин и реальные сценарии Corona 14 не тестировались этим веб-макетом.**

[Исходники](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui) · [Утверждённые требования](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit)
