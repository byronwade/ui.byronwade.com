<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Linear themed app

Sibling of `apps/polaris` — Linear product-OS look on shadcn primitives.

## Ownership

| File | Role |
| ---- | ---- |
| `app/linear-tokens.css` | Semantic tokens (indigo accent, near-black ladder) |
| `app/linear-components.css` | `data-slot` reskin layer |
| `components/linear/` | Product composites (workspace/settings shells, issue rows, …) |

## Rules

- After changing `linear-components.css`, run `npm run gen:linear-skin` from the monorepo root.
- Keep demos in Linear domain: issues, cycles, projects, Ask Linear — not merchant admin copy.
- **Icons:** Lucide (`lucide-react`) is intentional in this themed app (product-faithful chrome). The main registry still requires Phosphor via `@/lib/icons`.
- See `docs/monorepo.md` and `design-research/LINEAR-DESIGN-SYSTEM.md`.
