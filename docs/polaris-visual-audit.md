# Polaris visual audit

Companion to `docs/linear-visual-audit.md` for the Shopify Polaris themed app.

## Routes

| Route | Status | Notes |
| ----- | ------ | ----- |
| `/` | Live | Landing → styleguide |
| `/styleguide` | Live | All shadcn primitives with **admin** copy (products, orders, customers) |

## Gates

| Command | Purpose |
| ------- | ------- |
| `npm run gen:polaris-skin` | Sync `apps/polaris/app/polaris-components.css` → main site |
| `npm run build:polaris` | Production build |

## Visual signatures

- Gray canvas + white cards
- Dark-neutral primary buttons (not teal fill)
- Teal as success / brand accent
- 8px card radius, dense index tables
- No Linear issue/cycle language in demos

## Token sources

| Source | Role |
| ------ | ---- |
| `apps/polaris/app/polaris-tokens.css` | App tokens |
| `apps/polaris/app/polaris-components.css` | App `data-slot` reskin |
| `app/globals.css` `:root[data-skin="polaris"]` | Main-site token overrides |
| `app/polaris-skin.generated.css` | Generated component layer for main site |
| `registry.json` `polaris` item | Shipped `@byronwade/polaris` install |
