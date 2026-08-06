---
name: vellum-compose
description: Compose Vellum product UI from shadcn primitives with fail-closed gates. Use when building screens.
---

# Vellum compose

Compose product wholes from **shadcn primitives** under Vellum DNA.

## Required loop (fail closed)

1. Load `contracts/vellum/DESIGN.md` + `AGENTS.md`.
2. Open this skill + `vellum-reading`.
3. Prefer a task recipe over freeform layout.
4. `list` approved primitives — install missing via `npx shadcn@latest add …`.
5. Remap icons to `@/lib/icons`.
6. Compose under closed tokens (`bg-*`, `edge`, `depth-*`, radius intents).
7. **Done only when** `npm run check:design` (and platform/contrast as needed) is green.
8. Optional: MCP `get_contract` → `validate_ui` if the session is tool-wired.

## Anatomy

```
Surface [data-contract="vellum"]
├─ quiet chrome
├─ main (recipe-driven)
└─ optional object-bound AI rail
```

## Done

- Reused primitives — no twin Button/Card/shell
- Matches Vellum MUST / MUST NOT
- Gates green
