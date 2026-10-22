# Flora UI - 3ds Max Dark

**Independent second interactive Flora prototype styled after the Autodesk 3ds Max 2026 dark interface**. This replaces the previous Warm Gray colorway of this *second* variant, while keeping the original green Flora in `../flora-ui/` untouched.

**[Open the live mockup](https://astrawork-1104.github.io/sylva/flora-ui-warm/)**

The folder and URL retain the historical name `flora-ui-warm` to preserve existing links. The displayed design is now **3ds Max Dark**, not warm taupe.

## Visual scheme

- Neutral Autodesk-style graphite surfaces, layered gray panels and beveled-looking controls without changing Flora's existing compact flat layout.
- Steel-blue accents on active tabs, focus rings, selected controls, and interaction states. Amber selection outline on selected model cards.
- Light gray primary text, subdued gray metadata, matching input controls, table headers, modals, hover and Basket states.
- The small green Scene-presence dot remains green as an existing semantic indicator.
- Auxiliary Material Manager and Model Analyzer also use the matching gray palette.

The palette is a **visual approximation**, not an extracted, officially endorsed Autodesk theme or `.clrx` color file.

## Files and independence

`index.html`, `styles.css`, `app.js` are the sources. `Flora-UI.html` is the synchronized standalone page containing these sources and bundled auxiliary HTML. `material-manager.html` and `model-analyzer.html` also work as independent windows.

All 36 demo models, 8 folders, Explorer, Scene, Favorites, Basket, Catalogs, Properties, Filters, Grid/Table, Tile Size and Settings are unchanged.

The JS uses its own `flora-ui-warm-v1` localStorage namespace; existing preferences remain untouched by the color update. Architecture map: [UI_MAP.md](../flora-ui/docs/UI_MAP.md).

Browser-only demo - no real 3ds Max, Corona Proxy, filesystem, SQLite, MAXScript or .max import.
