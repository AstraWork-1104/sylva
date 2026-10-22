# Flora UI - Warm Gray

**Separate second interactive mockup** using warm graphite, stone grays, taupe and sand accents. No files in the original `flora-ui/` were replaced.

**Open online:** https://astrawork-1104.github.io/sylva/flora-ui-warm/

Files:
- `index.html`, `styles.css`, `app.js` - independent modular version.
- `Flora-UI.html` - autonomous HTML bundle with embedded CSS/JS and auxiliary popup windows.
- `material-manager.html`, `model-analyzer.html` - theme-matched auxiliary windows.
- `AGENTS.md` - guidance for Codex.

The same Explorer, Scene, Favorites, Basket, Catalogs, Filters, Properties, Grid/Table, Tile Size and settings are preserved, along with 36 demonstration models. The warm variant stores UI state under its **own** localStorage namespace `flora-ui-warm-v1` so it cannot overwrite green-theme settings.

Plant preview colors remain natural and the Scene-presence indicator stays muted green for clarity. Other UI accents are warm sand and taupe.

The functional interface architecture is documented in [the original UI map](../flora-ui/docs/UI_MAP.md). Future updates to this variant should change modular sources first, then rebuild the standalone HTML. The original green site remains at https://astrawork-1104.github.io/sylva/.
