# Flora - instructions for Codex and repository assistants

The current approved visual reference is [`flora-ui-v2/flora-ui`](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui). The HTML prototype is **not** the actual 3ds Max plugin. Work on existing Python/PySide6/MAXScript sources for plugin changes; consult the V2 design for colors/layout/interactions.

Latest confirmed user decisions take precedence over past instructions. Project feature description: https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit. Codex instructions: https://docs.google.com/document/d/14V25SqQXsu0g94dOhcydeVWaOVRo6zTAz7Ghf7KeuBM/edit. The technical SQLite v1 contract must stay compatible: `metadata`, `plants`, `models`, match by `relative_path`, `natural_json`, `landscaped_json`, `similar_json`. «Домашние» is the UI name for `landscaped_json`. Botanically obsolete `.floracat` is no longer supported; thematic `.floracol` remains.

Internet access, GitHub reference inspection, technical documentation, and relevant targeted tests are permitted when useful. Avoid unnecessary refactors, changes to source .max files, scene objects, Favorites, user collections, Basket, existing import/material/Proxy paths, and external catalog files. Never restore the old 30-category UI, old geometrical scanning, Scatter, or automatic batch preview generation.

Current approved next-step modifications (not automatically implemented): Filters V2, Properties without internal title/settings, RU/EN names on cards, cleaned Table View, search by names and related similar plants, and model metadata reset while preserving personal data.
