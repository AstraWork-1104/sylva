# Flora UI V2 - экраны и статус

| Экран | Реализовано в HTML | Ограничение |
|---|---|---|
| Explorer | Search, сортировка, Grid/Table, общий Tile Size, Ctrl/Shift, Favorites/Basket, контекстное меню | Только тестовые модели |
| Filters | Зависимые группы и среды, AND, цветение, отключённая высота, reset, 4/2/1 и собственный scroll | Фильтрация по тестовой ботанике |
| Properties | «Названия»/«Ботанические сведения», фиксированные поля, сворачивание, мультивыделение, без шапки и настройки полей | Демо-значения |
| Grid | Filename и при наличии RU/EN, без Vol | Демо-превью |
| Table View | 9 актуальных столбцов, множество сред, сортировка, drag-порядок, изменение ширины, Favorites/Basket | Настройки в localStorage |
| Search | Имя файла, RU, EN, Latin, названия похожих растений | Демо-связи similar_json |
| Favorites | Звёздочки, пользовательские коллекции | Браузерное хранилище |
| Basket | Общий Tile Size, Grid/Table, чекбоксы, удаление, диалог перед очисткой/импортом | 3ds Max Import не выполняется |
| Catalogs | Тематические разделы, выбор FloraCOL | Файлы не парсятся; старый FloraCat отсутствует |
| Settings | Library, Import .floratlas/.floracol, Export, Fonts collapsed, подтверждение очистки | Очистка только тестового состояния |
| Model Analyzer | Filename/relative path, экспорт демо-JSON `models[{name,path}]` | Нет открытия .max, измерений или сброса сцены |
| Material Manager | Существующий веб-экран сохранён | Без изменений |

`index.html` + `styles.css` + `app.js` и автономный `Flora-UI.html` содержат одну версию основного интерфейса; автономная версия также содержит оба окна. **Реализация рабочего Python/PySide6-плагина и испытания в 3ds Max здесь не заявляются.**

[Исходники](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui) | [Утверждённые требования Flora](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit)
