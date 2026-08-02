---
name: meridian-compose
description: Compose Meridian product wholes from shadcn primitives and theme tokens — workbenches, shells, object-bound AI rails. Use when building screens, not when only tweaking a token.
---

# Meridian compose

Parts and wholes together: tokens → shadcn atoms → product frames.

## Steps

1. Confirm surface with `meridian-surface` (default `application`).
2. Inventory needed primitives — missing? `npx shadcn@latest add …`
3. Study `components/surfaces/workbench.tsx` as the merge proof.
4. Compose:
   - Quiet chrome (sidebar / topbar)
   - Dense index or detail
   - Mono IDs + keyboard hints
   - Selected = `bg-brand/10` (not a loud border)
   - Optional AI rail **on the selected object** with `data-provenance` + `activity-*`
5. Depth: `edge` first; raise only when floated.
6. Keep demo/marketing embeds from stealing page scroll (`overflow-hidden`, avoid nested scrollports).

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
