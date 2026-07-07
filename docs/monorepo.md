# Monorepo layout

This repository is an npm workspaces monorepo:

```
/
├── app/                    # Main byronwade/ui registry site (ui.byronwade.com)
├── registry/               # Hand-maintained component source
├── design-research/        # External design-system teardown papers
├── packages/               # Lint, MCP, eval tooling
└── apps/
    ├── linear/             # Linear-themed shadcn site (ui.byronwade.com/linear)
    └── polaris/            # Polaris-themed shadcn site (ui.byronwade.com/polaris)
```

## Apps

| App | Path | Design source | Dev command |
| --- | ---- | ------------- | ----------- |
| **byronwade** (main) | `/` | House warm-paper tokens + optional skins | `npm run dev` |
| **linear** | `apps/linear` | `design-research/LINEAR-DESIGN-SYSTEM.md` | `npm run dev:linear` |
| **polaris** | `apps/polaris` | `design-research/SHOPIFY-DESIGN-SYSTEM.md` | `npm run dev:polaris` |

Each themed app (`linear`, `polaris`) pulls the latest shadcn components with `npx shadcn add --all`, then applies design tokens and a `data-slot` component reskin layer — the same pattern as the Polaris skin in the main site's `app/globals.css`.

## Adding components to themed apps

```bash
cd apps/linear   # or apps/polaris
npx shadcn@latest add <component> -y
```

Re-run the styleguide at `/styleguide` to verify the reskin layer covers new `data-slot` targets.
