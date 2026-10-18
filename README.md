# Flora

Flora - плагин для Autodesk 3ds Max 2026 и Corona Renderer 14 (Python, PySide6, MAXScript).

**Актуальный утверждённый визуальный референс:** [Flora UI V2, ветка flora-ui-v2](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui). После скачивания архива ветки открыть `flora-ui/Flora-UI.html`.

HTML-прототип демонстрирует оформление и поведение UI, но не заменяет реальную PySide6/3ds Max-реализацию. Согласованные Filters содержат зависимые селекторы группы/категории растения и типа/категории среды, цветение и временно неактивные поля высоты.

Прежний ботанический FloraCat отменён; использовать SQLite FloraAtlas v1 и тематические FloraCOL. Требования к поиску, Properties, карточкам, Table View и очистке данных описаны в актуальной документации проекта.

**Главный источник требований:** [Flora - Описание плагина](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit). [Правила подготовки задач Codex](https://docs.google.com/document/d/14V25SqQXsu0g94dOhcydeVWaOVRo6zTAz7Ghf7KeuBM/edit).

**Разделение работы:** [Инструкция для отдельного чата-архитектора](https://docs.google.com/document/d/1Ohlf7RkIipPuNebNaDxLjsZ6TSHqbooHe0jdwukpR6g/edit). Пользователь утверждает идеи и проверяет результат, архитектор формулирует задания, Codex программирует и сохраняет сборки в локальную папку пользователя, администратор поддерживает документацию. Для файлов, созданных ChatGPT, основной канал выдачи - Google Диск. Дополнительные CI/PR/Issue-процессы не обязательны.

**Сопровождение веб-дизайна:** [инструкция отдельного чата UI-дизайна](https://docs.google.com/document/d/1POnwC_A4-ia7DAMOzJTLoR7d-4HgBFgalsYxEYZbSaw/edit). Его зона ответственности - браузерный прототип в `flora-ui-v2`, а не код плагина. Пользователь и архитектор утверждают UX, дизайнер поддерживает GitHub-макет, Codex реализует функциональность в локальных исходниках.

**Идеи на будущее:** [отдельный чат идей](https://docs.google.com/document/d/1Mng_1SV5dMVfvmmIGSxgQuhuygOTvBhoYErMXMdKNyw/edit) для свободного обсуждения и [единый банк будущих идей](https://docs.google.com/document/d/1UTZxVykKj0NNn96CyqdUP4J150iBLgFWgkrjnbFbbTg/edit) на Google Диске. Новые идеи сохраняются только по запросу пользователя и не считаются утверждёнными требованиями, готовыми задачами Codex или планом релиза.
