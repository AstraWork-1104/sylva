# Flora - instructions for Codex and repository assistants

The current approved visual reference is [`flora-ui-v2/flora-ui`](https://github.com/AstraWork-1104/sylva/tree/flora-ui-v2/flora-ui). The HTML prototype is **not** the actual 3ds Max plugin. Work on existing Python/PySide6/MAXScript sources for plugin changes; consult the V2 design for colors/layout/interactions.

Latest confirmed user decisions take precedence over past instructions. Project feature description: https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit. Codex instructions: https://docs.google.com/document/d/14V25SqQXsu0g94dOhcydeVWaOVRo6zTAz7Ghf7KeuBM/edit. The technical SQLite v1 contract must stay compatible: `metadata`, `plants`, `models`, match by `relative_path`, `natural_json`, `landscaped_json`, `similar_json`. «Домашние» is the UI name for `landscaped_json`. Botanically obsolete `.floracat` is no longer supported; thematic `.floracol` remains.

Internet access, GitHub reference inspection, technical documentation, and relevant targeted tests are permitted when useful. Avoid unnecessary refactors, changes to source .max files, scene objects, Favorites, user collections, Basket, existing import/material/Proxy paths, and external catalog files. Never restore the old 30-category UI, old geometrical scanning, Scatter, or automatic batch preview generation.

Current approved next-step modifications (not automatically implemented): Filters V2, Properties without internal title/settings, RU/EN names on cards, cleaned Table View, search by names and related similar plants, and model metadata reset while preserving personal data.

## Roles and deliverables

The owner defines product requirements and accepts releases. ChatGPT architect discusses options and writes self-contained Codex tasks **only when asked**; it does not own code, implementation algorithms or build artifacts. Codex chooses the technical implementation, writes/tests/builds in the available local project, and saves builds to the user's established **local folder**. The separate ChatGPT admin maintains project documentation, not a mandatory task approval gate. Chat-created files are delivered through Google Drive when requested and supported. Do not require GitHub Issues/PR, CI or upload builds to Drive unless explicitly needed.

Architect instructions: https://docs.google.com/document/d/1Ohlf7RkIipPuNebNaDxLjsZ6TSHqbooHe0jdwukpR6g/edit

## Installed-code navigation map (2026-10-18)

The user confirmed `FLORA_CODEMAP.md` at `C:\Users\Astra\Documents\Codex\2026-10-13\files-pasted-by-the-user-flora\outputs\FLORA_CODEMAP.md` (Windows local path, inside an `outputs` directory). The same file is available on Google Drive: https://drive.google.com/file/d/1ZJgC6JR-IvMgWInNLY3fnfuUfMpjSPlk/view . The screenshot does NOT establish that `outputs` is the current source repository root. Verify file visibility and the actual working-tree root in each Codex environment. The map describes the extracted **Flora 1.0.0.26-atlas installer**, not independently verified current source. Use it to navigate, then validate actual local file paths before edits; do not treat it as implementation authority.

## UI V2 ownership

The [Flora UI-design chat](https://docs.google.com/document/d/1POnwC_A4-ia7DAMOzJTLoR7d-4HgBFgalsYxEYZbSaw/edit) maintains the browser HTML/CSS/JS prototype and design-specific GitHub documents in `flora-ui-v2` after user-approved UX decisions. The architect clarifies requirements and drafts Codex tasks; Codex owns the real PySide6/MAXScript implementation; the project admin maintains master Google Docs. Do not infer that approval or a browser-demo change means the installed 3ds Max plugin already implements the feature. Keep the modular web sources and standalone `Flora-UI.html` in sync when updating the mockup.

## Task context efficiency

Codex tasks must be self-contained in **approved product requirements, exact UI values/states, constraints, and acceptance checks**. Do not require opening every linked project document at the start of every task. For UI work, inspect the relevant areas of the approved `flora-ui-v2` visual prototype; consult FloraAtlas specifications only for actual data-format questions; use `FLORA_CODEMAP.md` only to locate candidate modules, then verify current working sources. Additional references are optional/on-demand, not a mandatory reading checklist. Never save tokens by omitting necessary behavior or regression constraints. Optimize total effort to produce a correct implementation, not just prompt length. No fixed limit on helpful links, no prohibition on technical research or targeted tests.
