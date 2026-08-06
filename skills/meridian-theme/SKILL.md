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

## Workflow (preferred — law book + gates)

1. Read `contracts/meridian/DESIGN.md` theme knobs + Accessibility.
2. Pick closed presets on `/meridian/theme` (brand · radius · paper) or name ids from `lib/design/knobs.ts`.
3. Apply via CSS / prefs file — do **not** invent OKLCH outside presets.
4. Layout / animations are **not** prefs — use recipes + `motionLaws`.
5. Run `npm run check:contrast` + `check:design`. Confirm light/dark still read as one system.
6. Optional: MCP **`apply_prefs`** / `validate_ui` when tool-wired.

## Workflow (this repo / manual)

1. Read current tokens in `app/globals.css` + Meridian skin in `app/contract-skins.css`.
2. Change knobs only via preset values from `lib/design/knobs.ts`.
3. Verify light and dark.
4. Confirm `/meridian/theme` still reads as one system.
5. If documenting a new knob, update `design.md` + `docs/prefs.md` in the same change.

## Anti-patterns

- Hex in components
- Second accent “for marketing”
- Warm cream paper defaults
- Brand-tinting danger/warning
