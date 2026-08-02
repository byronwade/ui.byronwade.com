---
name: meridian-a11y
description: Audit Meridian UI for OKLCH-only color and WCAG AA contrast. Use on every UI or token change, before shipping, and when reviewing dark/theater surfaces.
---

# Meridian accessibility & contrast

Contrast is frozen. Agents audit it on every UI change — not as a polish pass.

## Source of truth

- Tokens: `app/globals.css` (strict **OKLCH** only)
- Pairs: `lib/design/contrast.ts`
- Lint: `npm run check:contrast` + `npm run check:design`
- Contract: `design.md` → Accessibility

## Hard rules

1. **OKLCH only** — no `hex`, `rgb()`, `hsl()`, `hwb()`, named CSS colors.
2. **Semantic tokens only** — `bg-background`, `text-foreground`, `text-brand`, `bg-dock`, `text-dock-muted`, …
3. **WCAG AA** — body/UI ≥ **4.5:1**; large/display ≥ **3:1**.
4. **No opacity cheats** — never `text-foreground/70` or `text-dock-foreground/65`. Use `text-muted-foreground` or `text-dock-muted`.
5. **Theater lift** — anything on `bg-dock` must live under `data-tone="theater"` so `--brand` lifts for readable links/fills.
6. **shadcn primitives** — compose `Button`, `Card`, `Badge`, `Input`, …; don’t restyle with raw color.

## Checklist (run every time)

- [ ] Changed tokens? Run `npm run check:contrast`.
- [ ] Paper: brand/muted/foreground readable on background.
- [ ] Theater/dark: brand + dock-muted readable on dock.
- [ ] Focus rings use `ring-ring` (brand-derived).
- [ ] Touch targets ≥ 44px on `data-surface="mobile"`.
- [ ] No information by color alone (pair with label/mono meta).

## Common failures

| Bad | Fix |
| --- | --- |
| Deep `--brand` link on `--dock` | Wrap stage in `data-tone="theater"` |
| `text-dock-foreground/70` | `text-dock-muted` |
| Hex in a component | Token utility |
| Custom panel `div` with ad-hoc colors | shadcn `Card` + tokens |
