# Flora UI V2 - instructions for coding agents

Work here only on the **browser prototype** in the `flora-ui-v2` branch, not on the Autodesk 3ds Max plugin.

**READ FIRST:** [`docs/UI_MAP.md`](docs/UI_MAP.md). It maps screens, DOM IDs, state, JS functions, CSS override layers, standalone packaging, and regression checks.

Primary source files:
- `index.html` - semantic DOM and static control IDs.
- `styles.css` - styling and responsive layout; **later overrides can supersede early rules**.
- `app.js` - all interaction, demo data, state, rendering, events, localStorage.

`Flora-UI.html` is a bundled offline copy: after changing a source, keep its markup, inline CSS, inline JS, and embedded `material-manager.html` / `model-analyzer.html` identical to the current sources. Do **not** edit only the bundle. The root `index.html` routes GitHub Pages to it.

Do not invent live 3ds Max, Corona Proxy, SQLite, .max, or filesystem operations in this HTML mockup. Respect root `AGENTS.md` and user-approved requirements. Test responsive layout, interaction, JS syntax, and bundle parity. Update `docs/UI_MAP.md` when changing IDs, core functions, state schema, file relationships, or main user flows.
