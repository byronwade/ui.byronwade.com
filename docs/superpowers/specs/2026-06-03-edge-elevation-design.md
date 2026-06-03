# Edge-only elevation — retire drop shadows across the registry

**Date:** 2026-06-03
**Status:** Draft for review

## Goal

Replace shadow-based elevation with the `edge` hairline everywhere it makes sense
across the registry. No drop shadows anywhere — surfaces are defined by the
`--edge` inset hairline alone (crisp, flat). Applies to static surfaces **and**
floating overlays (fully flat, per decision).

## Background / key insight

The foundation already builds the hairline into its shadow utilities:

```
.shadow-float → drop-shadow layers + inset 0 0 0 1px var(--edge)
.shadow-card  → lighter drop-shadows + inset 0 0 0 1px var(--edge)
.edge         → inset 0 0 0 1px var(--edge)   (hairline only)
```

So the change is: **strip the drop-shadow layers, keep the hairline** — i.e.
`shadow-float`/`shadow-card` → `edge`, and remove every other drop-shadow.

## Decisions (locked)

1. **Swap to `edge` in components** (not a foundation-token redefine) — honest
   semantics; retire the shadow utilities from the foundation.
2. **Fully flat** — floating overlays (dropdown, popover, dialog, sheet, command,
   hover-card, morph-dock panels) get the hairline only, no lift.

## Transform rules

Across `registry/ui/`, `registry/components/`:

| From | To |
|------|-----|
| `shadow-float` | `edge` |
| `shadow-card` | `edge` |
| `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl` (incl. `group-hover:shadow-*`, `hover:shadow-*`) | **removed** (no shadow) |
| `shadow-none` (explicit overrides) | removed where now redundant |

**Component-specific:**
- `morph-dock.tsx`: `t.shell`/`t.panel` lose `shadow-float`/`shadow-card`, gain
  `edge`. The `bare` branch becomes truly nothing (no `edge`, no bg) instead of
  `shadow-none`.
- Check `chart.tsx`, `activity-ring.tsx` shadow usages individually (may be
  data-viz specific) and apply the same rule.

## Foundation (`registry.json`)

- Remove the `.shadow-float` and `.shadow-card` utility definitions.
- Keep `.edge` and the `--edge` token (light + dark) unchanged.
- Do **not** change `--edge` values or add a new elevation system (YAGNI).

## Shipped AI rule (`registry/rules/byronwade-ui.mdc`)

Reverse the elevation guidance:
- The line stating floating chrome "use `shadow-float` and carry **no** border"
  → floating chrome and cards use the **`edge` hairline; no drop shadows**.
- Update the house-utilities list (drop `shadow-float`/`shadow-card`, keep `edge`).
- Keep it aligned with the Design DNA in `AGENTS.md` (update that mention too).

## Testing

- Update component test assertions that reference `shadow-float`/`shadow-card`
  (e.g. morph-dock, card, dialog, popover…) to expect `edge` (or absence of
  shadow), and the morph-dock `bare` test (no longer `shadow-none`).
- `npm run test:ci` green: full suite + coverage thresholds (stmts ≥ 99 /
  branches ≥ 96 / functions 100 / lines ≥ 99).
- `npm run update:registry` clean (manifest + built `public/r` + examples).

## Out of scope

- Changing `--edge` token values or contrast.
- A new elevation/shadow scale.
- App/docs-site chrome (`app/_components/*`) — registry components only, unless a
  shared utility removal forces a touch-up.

## Risks

- **Overlays read flat** over busy content (only a 1px hairline). Accepted per
  decision; revisit `--edge` contrast if it's too subtle in practice.
- Removing foundation shadow utilities will break any **consumer** still
  referencing them — acceptable for this design system's own components; noted in
  the rule update so downstream AI output stops emitting them.
