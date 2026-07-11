# Crumb

A React Native (Expo) recreation of the **Crumb** design handoff — a mobile app for
designing healthier baked goods. Built to high fidelity from `../README.md`.

## Screens

- **Recipe Library** — 5 recipes with per-serving macros (cal + P/C/F) and category
  filter chips.
- **Recipe Builder** — live macro card, 4-axis predicted texture profile
  (chewy / soft / airy / dense), and an ingredient list. Tapping an ingredient opens a
  bottom sheet to (a) adjust its amount (±5g stepper + signed texture-impact meters) and
  (b) swap it for a healthier alternative (exact per-serving macro deltas, apply/undo).

Everything (macros, macro bar, texture bars, sub-lines, impact meters, deltas) is
**derived on every render** from the store — nothing is precomputed.

## Run

```bash
cd crumb-app
npm install          # first time only
npx expo start       # then press i / a for a simulator, or scan the QR in Expo Go
npx expo start --web # run in a browser
```

## Structure

| Path | Purpose |
|---|---|
| `App.tsx` | Font loading + `screen` switch (library ↔ builder) |
| `src/theme/tokens.ts` | Design-token colors, font families, shadows |
| `src/data/defs.ts` | `DEFS` (19 ingredients), `SWAPS` (3), `RECIPES` (5), `AXES`, `THUMB` |
| `src/domain/engine.ts` | Pure macro + texture engine (`macros`, `texture`, `resolveDef`, `domTex`, `fmt`) |
| `src/store/useStore.ts` | zustand store — `screen`, `activeId`, `filter`, `amounts`, `swapped`, `open` |
| `src/screens/LibraryScreen.tsx` | Header, filter chips, recipe cards |
| `src/screens/BuilderScreen.tsx` | Header + back, macro card, animated texture bars, ingredient rows |
| `src/components/IngredientSheet.tsx` | Scrim + bottom sheet: amount stepper, impact meters, tip, swap block |

## Formulas (from the handoff spec)

- **Macros:** `Σ per100 · grams/100`; per-serving = total / servings. Macro-bar segments
  by calorie share (`P·4 / C·4 / F·9`).
- **Texture axis (0–100):** `clamp(round(50 + 58 · Σ(g·coef)/Σg), 4, 100)` per axis.
- **Impact meter:** fill `min(48, |coef|·48)%` from center; + right/axis-color, − left/`#C9BFA6`.
- **Swap delta:** `(swap.per100[x] − base.per100[x]) · g/100/servings` for cal/fat/protein.

## Notes / production caveats (per the handoff)

- Texture coefficients are plausible but illustrative — calibrate with real baking data.
- Ingredient/recipe data is hardcoded in `defs.ts`; in production it should come from a DB/API.
- Library thumbnails are tinted serif monograms — replace with real recipe photos.
- The iPhone device frame in the design references is a prototype artifact and is intentionally omitted.
