# TradingView Phase 2 — component audit

**Date:** 2026-06-05  
**Branch:** `feat/tradingview-components` (Phase 1 merged or in review)  
**Goal:** Audit TradingView’s product surfaces against the 23-component Phase 1 set and prioritize
Phase 2 additions that fit the byronwade/ui registry (presentational, token-themed, deterministic mocks).

## Method

1. Walk TradingView’s primary UI: chart workspace, watchlist, order/DOM panels, discovery (screener,
   calendar, news, alerts), symbol details, and derivatives.
2. Map each surface to an existing registry item or a gap.
3. Score gaps by **reuse potential**, **coverage risk**, and **design-system fit** (no live data, no
   broker OAuth, no Pine editor).

## Phase 1 coverage (shipped)

| TradingView surface            | Registry item(s)                                        |
| ------------------------------ | ------------------------------------------------------- |
| Ticker / marquee               | `ticker-tape` (+ `ticker`)                              |
| Symbol header / last price     | `quote-header`, `price-change`, `sparkline`             |
| Chart + interval/type toolbar  | `chart-toolbar`, `chart-panel`, `candlestick-chart`     |
| Watchlist                      | `watchlist`                                             |
| DOM / order book + depth chart | `order-book`, `depth-chart`, `market-depth`             |
| Heatmap / sector performance   | `heatmap-grid`, `market-movers`                         |
| Order ticket                   | `order-entry`                                           |
| Positions / portfolio          | `position-card`, `positions-table`, `portfolio-summary` |
| Trade log                      | `trade-history`                                         |
| Screener                       | `screener-table`                                        |
| Economic calendar              | `economic-calendar`                                     |
| News feed                      | `market-news`                                           |
| Price alerts list              | `price-alert`                                           |
| Symbol search / cmd palette    | `symbol-search`                                         |
| Shared math / mocks            | `market` lib                                            |

## Gaps — prioritized candidates

### P1 — high value, good DNA fit

| Slug             | Kind      | TradingView analog      | Reuses                                             | Notes                                                                                                                   |
| ---------------- | --------- | ----------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `time-and-sales` | composite | Time & Sales tape       | `table`, `price-change`, `relative-time`, `market` | Streaming-style trade rows (price, size, time, side tone). Mock via `makeTrades` with `side` + aggressor. No websocket. |
| `volume-profile` | primitive | Session volume profile  | `market` (new `volumeProfileGeometry`)             | Horizontal histogram beside candles; pure SVG from OHLCV. High coverage value if geometry stays in `market.ts`.         |
| `symbol-details` | composite | Symbol info / Stats tab | `metric-stat`, `quote-header`, `tabs`, `market`    | Fundamentals grid (P/E, EPS, sector, exchange). Static props + seeded defaults.                                         |

### P2 — medium value, moderate complexity

| Slug                | Kind      | TradingView analog      | Reuses                              | Notes                                                                                  |
| ------------------- | --------- | ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `volume-footprint`  | primitive | Footprint / order flow  | `market` (footprint cell geometry)  | Bid×ask volume cells per price level. Complex SVG; defer until `volume-profile` lands. |
| `chart-layout-grid` | composite | Multi-chart layout      | `chart-panel`, CSS grid             | 1×2 / 2×2 layouts with slot props; presentation only.                                  |
| `indicator-legend`  | composite | Active indicators list  | `badge`, `button`, list             | Named indicators with visibility toggle + remove callback.                             |
| `drawing-toolbar`   | composite | Left drawing tools rail | `toggle-group`, `button`, `tooltip` | Icon rail for trendline/fib/text — toggles only, no canvas interaction.                |
| `compare-symbols`   | composite | Compare overlay header  | `badge`, `price-change`, `button`   | Chips for overlaid symbols + add/remove. Pairs with `chart-panel`.                     |
| `session-stats-bar` | composite | OHLCV status bar        | `metric-stat`, `font-mono`          | Single row: O/H/L/C/V for hovered bar or last candle.                                  |

### P3 — niche or heavier tables

| Slug                | Kind      | TradingView analog      | Reuses                                  | Notes                                                                           |
| ------------------- | --------- | ----------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `options-chain`     | composite | Options chain table     | `table`, `price-change`, `tabs`         | Calls/puts columns, strike midline. Large prop surface; good for fintech demos. |
| `alert-create-form` | composite | Create alert dialog     | `price-alert`, `money-input`, `dialog`  | Extends alerts with creation UX (condition, price, notify).                     |
| `replay-controls`   | composite | Bar replay transport    | `button`, `slider`, `segmented-control` | Play/pause/scrub — callbacks only, no actual replay engine.                     |
| `sector-rotation`   | primitive | Sector performance ring | `market`, SVG arc segments              | Donut/ring by sector change; alternative to `heatmap-grid`.                     |

## Explicitly out of scope (registry)

| Surface                           | Why skip                                              |
| --------------------------------- | ----------------------------------------------------- |
| Pine Script editor                | Code editor + runtime — not a design-system primitive |
| Broker connect / OAuth            | Live integration, not presentational                  |
| Live websockets / Level 3         | Data layer; consumers wire their own feeds            |
| Full drawing canvas / hit-testing | Requires layout engine beyond token SVG primitives    |
| Strategy tester / backtest UI     | Domain-specific app logic                             |

## Recommended Phase 2 delivery

**Batch A (3 items):** `time-and-sales`, `volume-profile`, `symbol-details` — **shipped** on `feat/tradingview-phase2-batch-a`.  
Extend `market.ts` with `makeTimeAndSalesRows`, `volumeProfileGeometry`, `makeSymbolStats`.

**Batch B (4 items):** `chart-layout-grid`, `indicator-legend`, `drawing-toolbar`, `compare-symbols` — **shipped** on `feat/tradingview-phase2-batch-a`.  
Mostly composition; minimal new lib surface.

**Batch C (optional):** `volume-footprint`, `options-chain`, `alert-create-form` — **shipped** on `feat/tradingview-phase2-batch-c`.  
Ship only if Phase 2A/B review asks for depth.

## Docs catalog

Phase 1 items belong in `content/components.ts` under category **`Market`** (sidebar after **Charts**).
Regenerate: `npm run gen:llms` and `npm run gen:mcp-data` after catalog edits.

## Success criteria (Phase 2)

Same gates as Phase 1: example + test per item, rule line, `npm run validate`, `npm run test:ci`,
`npm run build`. Chart geometry stays in `market.ts` with direct unit tests.
