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
| `/products/[id]` | Product detail — status, inventory, variants |
| `/orders` | Orders index (admin shell) |
| `/customers` | Customers list (admin shell) |
| `/settings` | Settings index (admin shell) |
| `/settings/general` | Store identity and defaults |
| `/settings/payments` | Payment providers and checkout |
| `/settings/shipping` | Shipping zones and rates |
| `/catalog` | Index of all 60 shadcn primitives |
| `/styleguide` | Live admin specimens (`#button`, `#table`, …) |

## Skin sync

After editing `app/polaris-components.css`, regenerate the main-site skin:

```bash
npm run gen:polaris-skin
```

## Gates

```bash
npm run check:polaris-slots    # core data-slot coverage
npm run check:polaris-catalog  # catalog ↔ UI parity
npm run check:polaris-visual   # no raw palette/hex in components
npm run build:polaris          # all gates + production build
```

## Deploy

Vercel project with **Root Directory** = `apps/polaris`. See [`docs/monorepo.md`](../../docs/monorepo.md).
