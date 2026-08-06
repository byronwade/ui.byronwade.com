---
name: atlas-compose
description: Compose Atlas product UI from shadcn primitives with fail-closed gates. Use when building screens.
---

# Atlas compose

Compose product wholes from **shadcn primitives** under Atlas DNA.

## Required loop (fail closed)

1. Load `contracts/atlas/DESIGN.md` + `AGENTS.md`.
2. Open this skill + `atlas-workbench`.
3. Prefer a task recipe over freeform layout.
4. `list` approved primitives — install missing via `npx shadcn@latest add …`.
5. Remap icons to `@/lib/icons`.
6. Compose under closed tokens (`bg-*`, `edge`, `depth-*`, radius intents).
7. **Done only when** `npm run check:design` (and platform/contrast as needed) is green.
8. Optional: MCP `get_contract` → `validate_ui` if the session is tool-wired.

## Anatomy

```
Surface [data-contract="atlas"]
├─ quiet chrome
├─ main (recipe-driven)
└─ optional object-bound AI rail
```

## Done

- Reused primitives — no twin Button/Card/shell
- Matches Atlas MUST / MUST NOT
- Gates green
