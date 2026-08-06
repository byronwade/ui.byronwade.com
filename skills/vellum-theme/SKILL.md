---
name: vellum-theme
description: Theme tokens and closed prefs for Vellum. Use when changing brand, paper, or radius under Vellum.
---

# Vellum theme

Closed tokens for **Vellum**. Prefer skills + CI; MCP `apply_prefs` is optional.

## Steps

1. Read `contracts/vellum/DESIGN.md` and `docs/vellum.md`.
2. Skin via `data-contract="vellum"` (this site) or `CONTRACT_ID=vellum` in consuming apps.
3. One accent → `--brand`. Never invent OKLCH literals in components.
4. Closed prefs only when needed (brand / radius / paper ids) — not layout/motion marketplaces.
5. Run `npm run check:contrast` after token edits.
6. Optional: contract MCP `resolve_token` / `apply_prefs`.

## Anti-patterns

- Second accent or status-as-brand
- hex / rgb / hsl / arbitrary color utilities
- Copying another contract's paper (warm cinema, ink workbench, mist reading) without switching DNA
