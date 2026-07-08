<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Polaris themed app

Sibling of `apps/linear` — Shopify Polaris admin look on shadcn primitives.

## Ownership

| File | Role |
| ---- | ---- |
| `app/polaris-tokens.css` | Semantic tokens (gray canvas, dark primary, teal accent) |
| `app/polaris-components.css` | `data-slot` reskin layer |
| `app/styleguide/page.tsx` | Live primitive specimens — **Polaris/admin copy only** (never Linear/issue language) |

## Rules

- Prefer tokens over raw hex in new work; existing hex in token files is the intentional Polaris fork.
- After changing `polaris-components.css`, run `npm run gen:polaris-skin` from the monorepo root.
- Keep styleguide demos in admin domain: products, orders, customers — not issues/cycles.
- See `docs/monorepo.md` and `design-research/SHOPIFY-DESIGN-SYSTEM.md`.
