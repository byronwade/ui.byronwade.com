---
name: meridian-compose
description: Compose Meridian product wholes from shadcn primitives and theme tokens — workbenches, shells, object-bound AI rails. Use when building screens, not when only tweaking a token.
---

# Meridian compose

Parts and wholes together: `@/lib/design` → shadcn atoms → product frames.

## Steps

1. Confirm surface with `meridian-surface` (default `application`).
2. Import structure helpers from `@/lib/design` (`bg`, `depth`, `defineWorkbench`, …).
3. Inventory needed primitives — missing? `npx shadcn@latest add …`
4. Remap any `lucide-react` imports to `@/lib/icons` (Phosphor, duotone).
5. Study `components/surfaces/workbench.tsx` as the merge proof.
6. Compose (Fluent 2 material + Cursor density):
   - Quiet chrome (sidebar / topbar) — thin `border-border` / `edge`
   - Control radius `rounded-lg`; pane shells `rounded-2xl`
   - Dense index or detail; hover `bg-muted/30–40`
   - Mono IDs + keyboard hints
   - Selected = `bg-brand/10` (not a loud border)
   - Focus = ring/stroke weight, not fill alone
   - Optional AI rail **on the selected object** with `data-provenance` + `activity-*`
7. Depth: `edge` first; raise only when floated (`materialLaws`).
8. Keep demo embeds from stealing scroll (`overflow-hidden`).
9. `npm run check:design`.

## Anatomy (application)

```
Surface
├─ nav chrome (quiet)
├─ main
│  ├─ command / search
│  └─ resource table | detail
└─ (optional) agent rail bound to object id
```

## Done

- Matches `design.md` checklist
- Reads as one system beside `/theme`
- No influence labels; no parallel kit
