---
name: harbor-theme
description: Theme tokens and closed prefs for Harbor. Use when changing brand, paper, or radius under Harbor.
---

# Harbor theme

Closed tokens for **Harbor**. Prefer skills + CI; MCP `apply_prefs` is optional.

## Steps

1. Read `contracts/harbor/DESIGN.md` and `docs/harbor.md`.
2. Skin via `data-contract="harbor"` (this site) or `CONTRACT_ID=harbor` in consuming apps.
3. One accent → `--brand`. Never invent OKLCH literals in components.
4. Closed prefs only when needed (brand / radius / paper ids) — not layout/motion marketplaces.
5. Run `npm run check:contrast` after token edits.
6. Optional: contract MCP `resolve_token` / `apply_prefs`.

## Anti-patterns

- Second accent or status-as-brand
- hex / rgb / hsl / arbitrary color utilities
- Copying another contract's paper (warm cinema, ink workbench, mist reading) without switching DNA
