# TradingView component set — design

**Date:** 2026-06-05
**Branch:** `feat/tradingview-components` (off `main`)
**Goal:** Add a cohesive 23-component "TradingView-style" batch to the byronwade/ui
registry — financial charting, order flow, watchlist, trading, and discovery surfaces —
authored fully to the Design DNA and code conventions, with examples + tests for every item.

## Decisions (confirmed)

| Decision     | Choice                                       | Why                                                                                            |
| ------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Chart engine | **In-house SVG + CSS, token-themed**         | Dark mode + `--brand` re-skin come free; zero new deps; matches the registry's token-only DNA. |
| Data model   | **Props + deterministic mock defaults**      | Pure presentational, like the rest of the registry. No streaming/network.                      |
| Scope        | **Full set (23 components)**                 | One cohesive themed batch, the established pattern (YouTube / music / ecommerce).              |
| Branch       | **`feat/tradingview-components` off `main`** | Isolated from `feat/youtube-components`.                                                       |

## Architecture

- **Charts** are authored as SVG + CSS using semantic tokens only. No canvas, no charting lib.
- **Color/DNA:** gains → `success`, losses → `destructive`, magnitude via opacity. Heatmap may
  use the `--chart-1…5` ramp for a diverging magnitude scale. **No raw red/green.** Accent stays
  derived from `--brand`.
- **Determinism:** no `Math.random()` / `Date.now()` at module load or render. All mock data is
  seeded/static so Next SSG examples don't hydrate-mismatch and tests stay stable.

### Shared infra — `registry/lib/market.ts` (not one of the 23)

This is where test coverage is won. The repo ratchets coverage hard (functions ≥99%,
statements ≥95%, branches ≥90%, lines ≥96%). SVG in jsdom has no layout (`getBBox` /
`getBoundingClientRect` return zeros), so chart geometry cannot be covered by rendering. Therefore
**all chart math lives here as pure, directly unit-tested functions**, not inside components:

- **Types:** `Candle` (OHLC + volume + time), `Quote`, `OrderBookLevel`, `Position`, `Trade`,
  `MarketEvent`, `NewsItem`, `Alert`, `ScreenerRow`, `MoverRow`, `HeatmapCell`.
- **Scales / geometry:** linear scale, OHLC → candle rect/wick geometry, series → SVG polyline
  points, series → area path `d`, cumulative depth → path, value → grid cell tone.
- **Formatters:** `formatPrice`, `formatPercent`, `formatChange`, `formatCompact` (1.2K / 3.4M),
  `formatVolume`.
- **Seeded mock generators:** deterministic candle series, quote, order book, etc. (seed param).

## The set — 6 primitives + 17 composites = 23

### Primitives (`registry/ui/`)

1. `sparkline` — micro line/area trend SVG.
2. `candlestick-chart` — OHLC candles + volume bars (+ optional crosshair readout).
3. `depth-chart` — cumulative bid/ask depth area.
4. `price-change` — up/down delta chip (caret + value + %, success/destructive tokens).
5. `order-book` — DOM ladder: bid/ask rows, depth bars, spread row.
6. `heatmap-grid` — performance grid, cells toned by metric.

### Composites (`registry/components/`) — bound to what they reuse

| #   | Component           | Reuses                                                  |
| --- | ------------------- | ------------------------------------------------------- |
| 7   | `ticker-tape`       | existing `ticker` (scrolling marquee)                   |
| 8   | `quote-header`      | `price-change`, `sparkline`, `metric-stat`              |
| 9   | `chart-toolbar`     | `segmented-control`, `toggle-group`, `button`           |
| 10  | `chart-panel`       | `chart-toolbar`, `candlestick-chart`                    |
| 11  | `watchlist`         | `table`, `price-change`, `sparkline`                    |
| 12  | `market-depth`      | `order-book`, `depth-chart`                             |
| 13  | `order-entry`       | `tabs`, `segmented-control`, `money-input`, `button`    |
| 14  | `position-card`     | `price-change`, `badge`/`status-dot`                    |
| 15  | `positions-table`   | `table`, `price-change`                                 |
| 16  | `portfolio-summary` | `metric-stat`, `stat-card`, `sparkline`                 |
| 17  | `market-movers`     | `tabs`, `sparkline`, `price-change`                     |
| 18  | `screener-table`    | existing `index-filters`, `index-table`, `price-change` |
| 19  | `economic-calendar` | list, `badge`, `relative-time`                          |
| 20  | `market-news`       | list, `avatar`, `relative-time`, `price-change`         |
| 21  | `price-alert`       | `switch`, `badge`, `price-change`                       |
| 22  | `trade-history`     | `table`, `price-change`, `relative-time`                |
| 23  | `symbol-search`     | `command` (cmdk), `price-change`, `kbd`                 |

**Dropped** (no behavior over an existing primitive): `interval-tabs` (use `segmented-control`
inline), `symbol-tag` (use `badge`/`avatar` inline).

## Delivery — 4 incremental batches

Each batch is fully green before commit. For every item: source under
`registry/ui|components/`, a `registry.json` item (type, files, deps, registryDependencies),
the component name added to `registry/rules/byronwade-ui.mdc`, an
`content/examples/<slug>/default.tsx`, and a `tests/components/<slug>.test.tsx` covering
default render, every variant/size/state, every interaction (clicks/keyboard/callbacks), and
`axe`. Run `npm run update:registry` then `npm run test:ci` — green before committing.

1. **Batch 1 — foundation:** `lib/market.ts` + the 6 primitives.
2. **Batch 2 — chart & watch:** ticker-tape, quote-header, chart-toolbar, chart-panel,
   watchlist, market-depth.
3. **Batch 3 — trading:** order-entry, position-card, positions-table, portfolio-summary,
   trade-history.
4. **Batch 4 — discovery:** market-movers, screener-table, economic-calendar, market-news,
   price-alert, symbol-search.

## Constraints / risks

- **Coverage is the #1 risk**, not chart math. Mitigation: pure math in `market.ts` unit-tested
  directly; keep DOM-measurement-dependent interactivity (crosshair) minimal/optional; every
  callback (buy/sell submit, interval change, symbol select, alert toggle) gets an explicit test.
- **Determinism:** seed all mock data; no time/random at load.
- **Branch hygiene:** stage explicit paths only; never `git add -A`. The untracked youtube row
  files are not part of this work.
- **DNA:** tokens only, `data-slot` on every part, `cn()` + `className` passthrough, CVA for
  variants, editorial typography (`font-mono` for prices/stats/IDs), Base UI primitives.

## Out of scope (Phase 1)

- Live data, websockets, broker integration, Pine Script, drawing tools, multi-chart layouts.
- New third-party dependencies.

## Phase 2

Phase 1 deliberately stopped at 23 components. A TradingView UI audit for follow-on work lives in
`docs/superpowers/specs/2026-06-05-tradingview-phase2-audit.md` (prioritized: time & sales, volume
profile, symbol details, chart layout grid, indicator legend, drawing toolbar, options chain, …).
