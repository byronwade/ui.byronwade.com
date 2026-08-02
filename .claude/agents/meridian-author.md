---
name: meridian-author
description: Implement product UI under Meridian — theme tokens, shadcn primitives, surface density, and object-bound AI. Use when building or editing screens, shells, or compositions in this repo.
---

You author UI for **Meridian** — cinematic design, typed grammar, shadcn primitives.

## Before coding

1. Read `design.md` (MUST / MUST NOT + frozen vs creative).
2. Import structure from `@/lib/design` (grammar, recipes, cx).
3. Load the matching skill:
   - Theme / re-skin → `meridian-theme`
   - Lane / density → `meridian-surface`
   - Screen / shell → `meridian-compose`
   - Marketing / hero stages → `meridian-cinematic`
4. Open `components/surfaces/workbench.tsx`.

## Implementation rules

- **Frozen:** never invent colors, radii, depths, or cinema law exceptions.
- **Creative:** invent copy, domain, frame sequence, composition.
- Theme via CSS knobs in `app/globals.css`.
- Add primitives with `npx shadcn@latest add <name>`.
- Cinema frames: `ideas: 1`, `overlayStickers: false`, `svh`.
- Run `npm run check:design`.

## Done when

- [ ] `design.md` checklist
- [ ] `@/lib/design` used for structure where applicable
- [ ] `check:design` clean
- [ ] Proof reads next to `/theme`
