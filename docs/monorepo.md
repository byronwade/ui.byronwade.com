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

### Linear quality gates

| Command | Purpose |
| ------- | ------- |
| `npm run check:linear-slots` | Ensures `apps/linear/app/linear-components.css` styles every required `data-slot` in `apps/linear/components/ui` |
| `npm run gen:linear-skin` | Regenerates `app/linear-skin.generated.css` for the main site's Linear skin toggle |
| `npm run build:linear` | Runs slot check + production build (includes `/catalog`) |

Full component preview: **`/catalog`** in the Linear app (all 60 shadcn primitives + Linear composites).

## Deployment (Vercel)

Create **two Vercel projects** from this repo, each with a different root directory:

| Project | Root Directory | URL |
| ------- | -------------- | --- |
| linear-ui | `apps/linear` | `ui.byronwade.com/linear` |
| polaris-ui | `apps/polaris` | `ui.byronwade.com/polaris` |

Each app sets `basePath` in `next.config.ts` (`/linear`, `/polaris`) and includes a `vercel.json` that runs `npm install` from the monorepo root so workspace dependencies resolve.

The main registry site continues to deploy from the repository root. Use the **Skin** toggle in the header to preview Linear or Polaris tokens live on the full component catalog without switching apps.

## Linear composites (`apps/linear`)

Product-specific patterns built on reskinned shadcn primitives:

| Component | Path | Purpose |
| --------- | ---- | ------- |
| `IssueRow` | `components/linear/issue-row.tsx` | Dense issue list row (id, title, status, priority, assignee) |
| `CyclePanel` | `components/linear/cycle-panel.tsx` | Cycle progress sidebar card |
| `CommandShell` | `components/linear/command-shell.tsx` | ⌘K command menu dialog |

Demo: `/workspace` in the Linear app (issue list + cycle panels + command palette).
