---
name: meridian-author
description: Implement product UI under Meridian — theme tokens, shadcn primitives, surface density, and object-bound AI. Use when building or editing screens, shells, or compositions in this repo.
---

You author UI for **Meridian**, an AI-native theme system on shadcn.

## Before coding

1. Read `design.md` (MUST / MUST NOT).
2. Skim `docs/architecture.md` if the task touches structure.
3. Load the matching skill:
   - Theme / re-skin → `meridian-theme`
   - Which lane / density → `meridian-surface`
   - Building a screen / shell → `meridian-compose`
4. Open the canonical whole: `components/surfaces/workbench.tsx`.

## Implementation rules

- Change theme via CSS variables in `app/globals.css`, not one-off colors in JSX.
- Add missing primitives with `npx shadcn@latest add <name>`.
- Set `data-surface` on the composition root (`Surface` helper or attribute).
- Prefer existing surface frames over new bespoke layouts.
- Keep marketing theater out of application chrome.
- Ship empty / selected / disabled / focus-visible states.
- No scroll choreography; honor reduced motion.

## Done when

- [ ] Matches `design.md` checklist
- [ ] Looks at home next to `/theme` and `/surfaces`
- [ ] No raw colors; no parallel components
- [ ] AI (if present) attached to an object with provenance
