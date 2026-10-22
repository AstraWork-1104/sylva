# Flora UI - 3ds Max Dark (second independent mockup)

This `flora-ui-warm/` folder historically hosted the Warm Gray theme. It now hosts an **independent 3ds Max Dark** colorway at the unchanged GitHub Pages URL `/sylva/flora-ui-warm/`.

Keep `../flora-ui/` (original green) intact. The dark theme approximates Autodesk 3ds Max 2026: neutral charcoal panels, gray controls, restrained blue focus/active accents, amber model selection border, green Scene-presence indicator. It is not an official Autodesk theme file.

Source files: `index.html`, `styles.css`, `app.js`; bundled release `Flora-UI.html`. Also maintain `material-manager.html` and `model-analyzer.html` and re-embed them into the bundled HTML after source changes.

Shared DOM/function map: `../flora-ui/docs/UI_MAP.md`. UI functionality and 36-model demo dataset remain unchanged. The JS namespace `flora-ui-warm-v1` deliberately stays the same to preserve existing preferences.

Only change colors for theme requests, unless the user explicitly approves structural changes. Validate script parsing, bundle parity, responsiveness and interactions.
