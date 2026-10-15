# Flora - repository instructions

The only active UI prototype is in `flora-ui/` on the `flora-ui` branch.

Design baseline: the ORIGINAL flat Flora buttons and panels, not experiments with raised, embossed, beveled, glossy, satin, or tactile button styles. Do not import styles, commits, screenshots, or UI code from older branches/history. In particular, never reintroduce CSS blocks named `Flora 1.0 tactile depth`, `tactile depth / refinement`, or `Flora satin finish`.

The source files are `flora-ui/index.html`, `flora-ui/styles.css`, `flora-ui/app.js`, and `flora-ui/material-manager.html`. `flora-ui/Flora-UI.html` is their standalone offline packaging, **not** another design version. The embedded CSS must match `styles.css` exactly; embedded JavaScript must be syntactically valid.

Keep existing interface layout, controls and behavior unless a task explicitly requires changing them. Browser controls demonstrate UI only; do not represent them as functioning 3ds Max integration. Never generate UI images as a substitute for editing this repository.

When updating UI: inspect live sources, edit only necessary files, regenerate the standalone HTML, and verify that old tactile styles are absent.


Approved new UI requirements from "Flora - Описание концепции плагина" (15 October 2026):
- Import Basket is a tab inside Catalog, beside Explorer/Favorites, not a separate window.
- Add from model cards using the hover basket icon, right-click menu or Shift+right-click; preserve multi-selection, deduplicate model entries, keep included checkboxes, item removal, Clear Basket, and adjustable tile sizes.
- In the installed plugin (not HTML), selected Basket models use the same merge/material/Corona Proxy pipeline as normal Flora imports, keep original model names, place each pivot at (0,0,0), and use exactly one reusable layer named "Flora Import". Confirm duplicate object names across the entire scene before import. Never fabricate alternate merge/material logic.
- Successful real Basket import clears the entire basket; technical failure retains it. In this browser-only prototype the Import button is a preview and must NEVER claim success or clear basket.
- Explorer's separate "Import Plant Data" input is for informational .floracat files that enrich existing .max model records without opening additional tabs. Actual SQLite parsing belongs to the plugin. "Add Catalog" installs independent thematic catalogs.
- Scatter is not part of the current interface and must not be brought back.
