---
name: meridian-theme
description: Apply or re-skin the Meridian theme — CSS tokens, brand accent, paper, radius, light/dark. Use when changing colors, theming a product, or teaching an AI how Meridian theme knobs work.
---

# Meridian theme

Meridian’s product is the **theme**. Components come from shadcn; personality comes from tokens.

## Source of truth

- Contract: `design.md` → “Theme knobs” + Accessibility
- Tokens: `app/globals.css` — strict **OKLCH** (`:root` + `.dark` + `[data-tone="theater"]`)
- Contrast: `lib/design/contrast.ts` · `npm run check:contrast`
- Live proof: `/theme`

## Knobs (safe to override)

```css
--brand
--brand-foreground
--brand-muted
--background
--foreground
--radius
```

Primary, ring, selected (`bg-brand/10`), chart-1, and success follow `--brand`.

## Do not override into decoration

- `--destructive` / `--warning` keep fixed meaning
- `--activity-*` encode agent steps only
- `--chart-2…5` stay a data ramp, not accents

## Workflow (preferred — MCP)

1. Pick closed presets on `/meridian/theme` (brand · radius · paper) or name ids.
2. Call MCP **`apply_prefs({ brand, radius, paper })`** — writes `app/contract-prefs.css` + `contract.prefs.json`.
3. Import the CSS. Do **not** invent OKLCH outside presets.
4. Layout / animations are **not** prefs — use recipes + `motionLaws`.
5. `validate_ui` on new UI. Confirm light/dark still read as one system.

## Workflow (this repo / manual)

1. Read current tokens in `app/globals.css`.
2. Change knobs only via preset values from `lib/design/knobs.ts`.
3. Verify light and dark.
4. Confirm `/meridian/theme` still reads as one system.
5. If documenting a new knob, update `design.md` + `docs/prefs.md` in the same change.

## Anti-patterns

- Hex in components
- Second accent “for marketing”
- Warm cream paper defaults
- Brand-tinting danger/warning
