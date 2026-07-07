# Linear UI — byronwade/ui

Linear-inspired shadcn component library at **ui.byronwade.com/linear**.

- **60 shadcn components** (`npx shadcn add --all`)
- Tokens from [`design-research/LINEAR-DESIGN-SYSTEM.md`](../../design-research/LINEAR-DESIGN-SYSTEM.md)
- Reskin via `app/linear-tokens.css` + `app/linear-components.css`

## Dev

From the monorepo root:

```bash
npm run dev:linear
```

Open [http://localhost:3000/linear](http://localhost:3000/linear) (basePath is `/linear`).

## Pages

| Route | Description |
| ----- | ----------- |
| `/` | Landing |
| `/styleguide` | All shadcn primitives |
| `/workspace` | Issue list + cycle panels + ⌘K command menu |

## Composites

| Component | File |
| --------- | ---- |
| `IssueRow` | `components/linear/issue-row.tsx` |
| `CyclePanel` | `components/linear/cycle-panel.tsx` |
| `CommandShell` | `components/linear/command-shell.tsx` |

## Deploy

Vercel project with **Root Directory** = `apps/linear`. See [`docs/monorepo.md`](../../docs/monorepo.md).
