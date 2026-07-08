# Polaris UI — byronwade/ui

Shopify Polaris–inspired shadcn component library at **ui.byronwade.com/polaris**.

- **60 shadcn components** (`npx shadcn add --all`)
- Tokens from [`design-research/SHOPIFY-DESIGN-SYSTEM.md`](../../design-research/SHOPIFY-DESIGN-SYSTEM.md)
- Reskin via `app/polaris-tokens.css` + `app/polaris-components.css`

## Dev

From the monorepo root:

```bash
npm run dev:polaris
```

Open [http://localhost:3000/polaris](http://localhost:3000/polaris) (basePath is `/polaris`).

## Pages

| Route | Description |
| ----- | ----------- |
| `/` | Landing |
| `/products` | Products index (admin shell) |
| `/orders` | Orders index (admin shell) |
| `/customers` | Customers list (admin shell) |
| `/settings` | Merchant settings intro (admin shell) |
| `/catalog` | Index of all 60 shadcn primitives |
| `/styleguide` | Live admin specimens (`#button`, `#table`, …) |

## Skin sync

After editing `app/polaris-components.css`, regenerate the main-site skin:

```bash
npm run gen:polaris-skin
```

## Deploy

Vercel project with **Root Directory** = `apps/polaris`. See [`docs/monorepo.md`](../../docs/monorepo.md).
