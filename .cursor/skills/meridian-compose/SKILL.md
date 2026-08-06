---
name: meridian-compose
description: Compose Meridian product wholes from shadcn primitives and theme tokens — workbenches, shells, object-bound AI rails. Use when building screens, not when only tweaking a token.
---

# Meridian compose

Parts and wholes together: **law book → skill → recipe → shadcn atoms → CI gates**. Contract MCP is optional.

## Fail-closed loop

1. Load `contracts/meridian/DESIGN.md` (or root `design.md`) + `agents.md`.
2. Confirm surface with `meridian-surface` (default `application`).
3. Call a task recipe when it fits (`list-resource`, `agent-rail`, …).
4. Inventory primitives — missing? `npx shadcn@latest add …` (or shadcn MCP).
5. Remap any `lucide-react` / `@phosphor-icons/react` imports to `@/lib/icons`.
6. Import structure helpers from `@/lib/design` (`bg`, `depth`, `defineWorkbench`, …).
7. Study `components/surfaces/workbench.tsx` as the merge proof.
8. Compose (Fluent 2 material + Cursor density):
   - Quiet chrome (sidebar / topbar) — thin `border-border` / `edge`
   - Control radius `rounded-lg`; pane shells `rounded-2xl`
   - Dense index or detail; hover `bg-muted/30–40`
   - Mono IDs + keyboard hints
   - Selected = `bg-brand/10` (not a loud border)
   - Focus = ring/stroke weight, not fill alone
   - Optional AI rail **on the selected object** with `data-provenance` + `activity-*`
9. Depth: `edge` first; raise only when floated (`materialLaws`).
10. **Done only when** `npm run check:design` (+ platform/contrast as needed) is green.
11. Optional: MCP `get_contract` / `validate_ui` if the session is tool-wired.

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
- Reused primitives — no twin kits
- Reads as one system beside `/meridian/theme`
- No influence labels; gates green
