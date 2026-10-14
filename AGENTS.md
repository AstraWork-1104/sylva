# Flora - repository instructions

The only active UI prototype is in `flora-ui/` on the `flora-ui` branch.

Design baseline: the ORIGINAL flat Flora buttons and panels, not experiments with raised, embossed, beveled, glossy, satin, or tactile button styles. Do not import styles, commits, screenshots, or UI code from older branches/history. In particular, never reintroduce CSS blocks named `Flora 1.0 tactile depth`, `tactile depth / refinement`, or `Flora satin finish`.

The source files are `flora-ui/index.html`, `flora-ui/styles.css`, `flora-ui/app.js`, and `flora-ui/material-manager.html`. `flora-ui/Flora-UI.html` is their standalone offline packaging, **not** another design version. The embedded CSS must match `styles.css` exactly; embedded JavaScript must be syntactically valid.

Keep existing interface layout, controls and behavior unless a task explicitly requires changing them. Browser controls demonstrate UI only; do not represent them as functioning 3ds Max integration. Never generate UI images as a substitute for editing this repository.

When updating UI: inspect live sources, edit only necessary files, regenerate the standalone HTML, and verify that old tactile styles are absent.
