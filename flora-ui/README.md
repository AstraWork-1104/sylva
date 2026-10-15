# Flora UI V2 - интерактивный дизайн на проверку

Ветка: flora-ui-v2. Предыдущий согласованный дизайн на flora-ui оставлен без изменений.

## Как открыть

GitHub → ветка flora-ui-v2 → Code → Download ZIP. Распакуйте и откройте flora-ui/Flora-UI.html в браузере. Отдельные окна Material Manager и Model Analyzer встроены в автономный файл. Модульные исходники: index.html, styles.css, app.js, material-manager.html, model-analyzer.html.

## Что нового

- Постоянные Explorer, Favorites и Basket; одна выпадающая кнопка Catalogs с прокручиваемым списком и Add Catalog внутри.
- Тематические каталоги City, Forest, Landscape (демонстрационные). Дерево «тип пространства → готовая подборка». Группы Trees, Shrubs & Low Conifers, Perennials & Groundcovers в Grid и List.
- Properties: изменяемая ширина, три сворачиваемые группы, настройка видимости и порядка полей с сохранением, Reset to Default, Show All, Similar Plants и свойства выбранной композиции.
- Explorer Filters: тип растения, цвет листвы, цветение, высота, 30 динамических категорий применения озеленения с множественным выбором. Кнопка демонстрации добавления новой категории.
- Settings → Library → Model Analyzer: отдельное окно, выбор папок с чекбоксами, обязательное предупреждение Save / Don't Save / Cancel, симулируемое сканирование, прогресс и экспорт CSV.
- Import Descriptions в Explorer отдельно от Catalogs → Add Catalog.

## Границы задачи

Весь браузерный макет - демонстрация без реального чтения SQLite, геометрического анализа моделей, изменения сцены или Merge. Сохранены Explorer, Favorites, Basket, Drag & Drop, Corona Proxy и существующий Material Manager. Scatter не возвращён. Дизайн сохраняет первоначальный тёмно-зелёный стиль и плоские кнопки.

В файле docs/SCREENS.md указаны экраны, а docs/DESIGN.md фиксирует правила визуального оформления. Исходный дизайн ветки flora-ui нельзя заменять до утверждения новой версии.
