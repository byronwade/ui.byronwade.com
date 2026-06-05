# Net-new Shopify-admin components — design spec

**Date:** 2026-06-04
**Branch:** `main` (built directly on main, per user)
**Status:** Approved — building

## Goal

Add 6 net-new, comprehensively-built Shopify-admin components to the registry,
filling the highest-value gaps the existing 8 ecommerce components don't cover.
Each ships to-spec against the Design DNA with **multiple variant examples** and
full tests.

## The 6 components

All: tokens-only, `data-slot` on parts, `cn()` + `className` passthrough, CVA for
variants, editorial typography (`font-mono`/tabular-nums for data), full a11y.
Composites compose existing primitives.

### `index-table` — registry:component

Signature Shopify sortable/selectable data table.

- Composes: `table` (Table/TableHeader/TableBody/TableRow/TableCell), `checkbox`,
  `bulk-action-bar` (registry/ui), `badge`/`status-pill`, `skeleton`.
- Comprehensive: typed `columns` (key, header, `sortable`, `align`, render),
  per-row + select-all selection wired to the sticky `bulk-action-bar`,
  click-to-sort with asc/desc indicator, sticky header, **loading** (skeleton
  rows), **empty state**, pagination footer (prev/next + range label), row
  `onClick`/`href`, `comfortable`/`condensed` density.
- API: `columns`, `rows`, `getRowId`, `selectable`, `selectedIds`,
  `onSelectionChange`, `sort`, `onSortChange`, `bulkActions`, `loading`,
  `emptyState`, `pagination`, `density`.

### `resource-list` + `resource-item` — registry:component

List-view counterpart of index-table.

- Composes: `avatar`, `badge`, `checkbox`, `button`.
- `resource-item`: thumbnail/media, title, metadata line, badges, hover
  shortcut-actions, selectable. `resource-list`: header (count + sort +
  select-all), bulk actions, loading/empty.
- Variants: media/no-media, selectable, with-actions, loading, empty.

### `index-filters` — registry:component

- Composes: `input`, `segmented-control`, `filter-pill`, `dropdown-menu`, `button`.
- Saved-view tabs (All/Active/Draft…), search with clear, sort dropdown,
  removable applied-filter pills, "add filter".
- Variants: with/without tabs, with/without search, applied filters.

### `tag-input` — registry:ui

- Composes: `input`, `badge`, optional `popover` for suggestions.
- Type-to-add (Enter/comma), remove (× / Backspace), optional autocomplete,
  max-tags, sizes, disabled, error.
- Variants: plain, with-suggestions, sizes, error, disabled.

### `drop-zone` — registry:ui

Polaris DropZone.

- Drag-over / click-to-browse, `accept` filter, image preview thumbnails,
  rejected-file error, disabled.
- Variants: media-grid vs file-list, single/multi, drag/error/disabled, sizes.

### `banner` — registry:component

Distinct from `alert` — Polaris Banner.

- Tones: info(`--brand`)/success/warning/critical, title + body + actions +
  dismiss; tone→token map (mirrors status-pill).
- Variants: each tone, dismissible, with-actions, inline vs prominent.

## Categories

New components map to: `index-table`, `resource-list`, `index-filters`, `banner`
→ existing categories (Data display / Composites / Feedback as fits); `tag-input`,
`drop-zone` → Forms; or group all under the existing **Commerce** bucket where they
are admin-specific. Final placement decided at wiring time; `ComponentDoc.category`
union + `categories` array kept in sync.

## Testing posture

Each gets `tests/components/<slug>.test.tsx` covering default render, every
variant/size/tone/state (loading, empty, error, selected, drag-over), all
interactions (sort, select-all, add/remove tag, drop files, dismiss), and `axe`.
Clears gates: statements ≥95, branches ≥90, functions ≥99, lines ≥96 (per-file
target 100% functions, ≥96 branches).

## Build orchestration

- Built on `main` in `/Users/byronwade/byronwade-ui`.
- Parallel `component-author` agents author source + **multiple** examples + test
  per component (absolute paths under the main dir). No shared-file edits.
- Serialized wiring: `registry.json` items, rule file, `content/components.ts`
  catalog entries, then **`npm run gen:examples`** (the step missed last batch that
  left the first ecommerce set blank), `npm run update:registry`.
- Gates: `npm run validate` + `npm run test:ci` + `npm run build` all green.

## Done criteria

- 6 components present (source + registry item + multiple examples + test + rule +
  catalog entry + registered in `content/examples/registry.ts`).
- They render in `/docs`, `/catalog`, `/preview`.
- `validate`, `test:ci`, `build` all green on `main`.
