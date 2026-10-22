# Flora UI V2 - instructions for coding agents

Work here only on the **browser prototype** in the `flora-ui-v2` branch, not on the Autodesk 3ds Max plugin.

**READ FIRST:** [`docs/UI_MAP.md`](docs/UI_MAP.md). It maps screens, DOM IDs, state, JS functions, CSS override layers, standalone packaging, and regression checks.


The approved newer Qt/PySide6 UI cycle is documented in the [Flora product specification §21](https://docs.google.com/document/d/19MQLTbmyikvPj2wCLwIvuSqF3sdwJ8YUlSEtsMSkbZ0/edit) (22 Oct 2026). This includes centered/compact navigation, updated font defaults, collapsible FOLDERS, English property labels and filter controls while preserving Russian classification values, plus a one-row import footer and four-section rounded card context menu. These are **product decisions for the desktop plugin**, not a mandate to modify this HTML prototype; the latest corrective Codex task is not yet verified as completed. The browser mapping below describes current HTML rather than that Qt release.

Primary source files:
- `index.html` - semantic DOM and static control IDs.
- `styles.css` - styling and responsive layout; **later overrides can supersede early rules**.
- `app.js` - all interaction, demo data, state, rendering, events, localStorage.

`Flora-UI.html` is a bundled offline copy: after changing a source, keep its markup, inline CSS, inline JS, and embedded `material-manager.html` / `model-analyzer.html` identical to the current sources. Do **not** edit only the bundle. The root `index.html` routes GitHub Pages to it.

Do not invent live 3ds Max, Corona Proxy, SQLite, .max, or filesystem operations in this HTML mockup. Respect root `AGENTS.md` and user-approved requirements. Test responsive layout, interaction, JS syntax, and bundle parity. Update `docs/UI_MAP.md` when changing IDs, core functions, state schema, file relationships, or main user flows.
