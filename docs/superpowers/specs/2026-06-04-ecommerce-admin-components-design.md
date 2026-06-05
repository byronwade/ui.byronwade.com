# Ecommerce / admin-panel components — design spec

**Date:** 2026-06-04
**Branch:** `worktree-feat+ecommerce-admin-components` (off `origin/main`, isolated worktree)
**Status:** Approved — building

## Goal

Add a set of ecommerce / admin-panel components to the `byronwade/ui` registry,
modeled on Shopify's admin (Polaris) patterns, filling gaps the library does not
already cover. Each component is built fully to-spec against the Design DNA and
ships like the rest of the registry (source + `registry.json` entry + example +
test + rule line + passing gates).

## Gap analysis

Already covered, not rebuilt: `table`, `kanban`, `gantt`, `stat-card`/`metric-stat`,
`price-range-filter`, `status-pill`/`badge`, `detail-header`, `empty-state`,
`event-timeline`, `rating`, `credit-card`, `filter-pill`.

Net-new, ecommerce-flavored (the 8 below).

## The 8 components

All follow house conventions: data-driven typed props, `cn()` + `className`
passthrough, tokens only (tone → token maps), `data-slot` on parts, CVA for
primitive variants, named exports at file bottom, Prettier `semi: false`.
Composites compose existing primitives — never bespoke one-offs.

### Primitives (`registry:ui`)

| Component | Builds on | Core API |
|---|---|---|
| **money-input** | `number-field` + `input-group` | `currency`, `value`, `onValueChange`, `locale`, symbol/code adornment, sizes. Base UI NumberField `format={{ style: "currency" }}` does the formatting; this is the styled currency preset. |
| **bulk-action-bar** | `button`/`button-group`, `checkbox`, `pill` | `selectedCount`, `actions[]` (promoted vs default), `onClearSelection`, sticky positioning. The "3 selected → [actions]" bar over a table/resource list. |

### Composites (`registry:component`)

| Component | Composes | Core API |
|---|---|---|
| **order-summary** | `separator`, thumbnail/avatar, `badge` | `lineItems[]` (title, variant, qty, price, image), `subtotal`, `discounts[]`, `shipping`, `tax`, `total`, `currency`. The signature order/checkout cost-breakdown card. |
| **product-card** | `card`, `badge`/`status-pill`, `status-dot` | `title`, `image`, `status`, `price`, `inventory`, `tone`. Core of the products index. |
| **variant-picker** | `toggle-group`, `label` | `options[]` (name, values[], availability), `value`, `onChange`. Size/color/material option grid with unavailable states. |
| **inventory-bar** | `progress` | `available`, `total`, low/out thresholds → tonal states, `showCount`. Stock-level indicator. |
| **customer-card** | `card`, `avatar`, `metric-stat` | `name`, `email`, `avatar`, `ordersCount`, `totalSpent`, `address`. Customer summary. |
| **fulfillment-tracker** | `status-pill`/`badge`, `verification-progress` | `paymentStatus`, `fulfillmentStatus`, `steps[]`. Net-new model = dual payment + fulfillment status; reuses the step rail rather than redrawing a stepper. |

## Tone / token discipline

- All accent/success color resolves to `--brand`/`--success`/`--warning`/`--destructive`
  tokens via tone maps (mirroring `verification-progress` and `status-pill`).
  `info` → `--brand`, never a literal blue. No raw color, no arbitrary values.
- Money/counts/IDs use `font-mono` / tabular-nums.
- Status semantics: `paid`/`fulfilled` → success; `pending`/`partial` → warning;
  `unfulfilled`/`refunded`/`failed` → neutral/destructive as appropriate.

## Testing posture

Each component gets `tests/components/<slug>.test.tsx` covering: default render,
every variant/size/tone, every state (low/out-of-stock, paid/unfulfilled,
selected/empty), all interactions (variant select, clear selection, money change),
and `axe`. Tests authored alongside source to clear the hard gates:
statements ≥99%, branches ≥96%, functions ≥100%, lines ≥99%.

## Build orchestration

- Isolated worktree off `main` (active concurrent session lives on
  `feat/brand-reskin-hero`; this work is unrelated to it).
- Execution vehicle: the `component-author` agent scaffolds each component
  to-spec, then runs gates.
- **Shared-file guard:** `registry.json` and `registry/rules/byronwade-ui.mdc` are
  hand-maintained and shared. Component source/test/example may be built in
  parallel; edits to those two files are **serialized**. Final pass runs
  `npm run update:registry` + `npm run test:ci` once.

## Done criteria

- All 8 components present with source + registry item + example + test + rule line.
- `npm run validate` green (registry, examples, rule sync, test presence).
- `npm run test:ci` green (suite + coverage thresholds).
- `npm run build` green (typecheck / server-client boundary).
