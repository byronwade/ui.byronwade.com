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

## Workflow

1. Read current tokens in `app/globals.css`.
2. Change knobs only; rebuild mentally against cool paper (not cream) + one accent.
3. Verify light and dark.
4. Confirm `/theme` still reads as one system.
5. If documenting a new knob, update `design.md` in the same change.

## Anti-patterns

- Hex in components
- Second accent “for marketing”
- Warm cream paper defaults
- Brand-tinting danger/warning
