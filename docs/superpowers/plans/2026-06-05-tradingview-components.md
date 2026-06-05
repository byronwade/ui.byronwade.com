# TradingView Component Set — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 23-component TradingView-style batch (6 primitives + 17 composites) plus a shared `market` lib to the byronwade/ui registry, each fully on-DNA with example + test, all gates green.

**Architecture:** In-house SVG/CSS charts, token-themed. All chart math is pure functions in `registry/lib/market.ts` (coverage-excluded; unit-tested for correctness). Components are presentational, take typed props with deterministic mock defaults, compute geometry from numeric props via the lib (so SVG renders deterministically and coverage comes from rendering — no DOM measurement needed except optional crosshair). Composites compose existing primitives.

**Tech Stack:** React 19, Base UI (`@base-ui/react`), Tailwind v4 tokens, CVA, vitest + testing-library + vitest-axe. No new dependencies.

---

## Spec reference

Design spec: `docs/superpowers/specs/2026-06-05-tradingview-components-design.md`. Read it first.

## Canonical references (read before authoring each kind)

- **Primitive:** `registry/ui/button.tsx` (+ `button-variants.ts`), `registry/ui/ticker.tsx`.
- **Composite:** `registry/components/status-pill.tsx`, `registry/components/metric-stat.tsx`.
- **Lib:** `registry/lib/video-player-utils.ts` + `tests/components/video-player-utils.test.ts`.
- **DNA law:** `AGENTS.md`. **Code conventions:** `docs/CONVENTIONS.md`.
- The `component-author` agent (`.claude/agents/component-author.md`) is the intended executor for
  each component task — it produces source + registry item + example + test + rule line and runs gates.

## Hard constraints (apply to EVERY component — non-negotiable)

- **Tokens only** — no hex/rgb/hsl/named/arbitrary colors. Gains → `text-success`/`bg-success`,
  losses → `text-destructive`/`bg-destructive`, magnitude via opacity (`/10`…`/80`). Heatmap may use
  `--chart-1…5`. Accent resolves to `--brand`. No raw red/green anywhere.
- **Editorial type** — hierarchy from size + tracking; never `font-bold` on display/section headings.
  `font-mono` for ALL prices, percentages, volumes, sizes, counts, IDs, timestamps.
- **Base UI + CVA + `data-slot`** — every rendered part carries `data-slot`. Variants in `cva(...)`.
- **`cn()` + `className` passthrough** — accept and merge `className` via `cn()` from `@/lib/utils`.
- **Imports** consumer paths only: `@/components/ui/…`, `@/components/…`, `@/lib/…`. Never `../`.
- **Named exports at file bottom**, no `export default`. **No semicolons** (Prettier `semi: false`).
- **Determinism** — no `Math.random()` / `Date.now()` at module load or in render. Mock defaults are
  static literals or seeded via the `market` lib.
- **A11y + dark mode free from tokens** — labels, `aria-*`, keyboard, `focus-visible:ring-ring`.

## Per-component procedure (the loop every component task runs)

For component `<slug>` of kind `<ui|component>`:

- [ ] **S1 — Write the failing test** at `tests/components/<slug>.test.tsx`. Must cover: default render
      (mounts, root has `data-slot`), **every** prop variant/size/visual state listed in the task, **every**
      interaction (click/keyboard/callback) listed, and `axe` (`expect(await axe(container)).toHaveNoViolations()`).
- [ ] **S2 — Run it, confirm it fails:** `npm run test:run -- <slug>` → FAIL (module not found).
- [ ] **S3 — Write the source** at `registry/ui/<slug>.tsx` or `registry/components/<slug>.tsx` per the
      task's API + reuse, honoring all hard constraints. Compute any geometry via `@/lib/market`.
- [ ] **S4 — Add the `registry.json` item** (copy a sibling item's shape): `name`, `type`
      (`registry:ui`/`registry:component`), `title`, `description`, `files` (`path`, `type`, `target`),
      `registryDependencies` (`@byronwade/foundation`, `@byronwade/utils`, plus each reused item as
      `@byronwade/<name>`, and `@byronwade/market` for chart users), `dependencies` (npm, e.g. `lucide-react`).
      Never edit the auto-generated `all` item.
- [ ] **S5 — Add the example** `content/examples/<slug>/default.tsx` (a realistic standalone render with a
      definite width wrapper — see memory: centering-flex collapses `w-full` children to 0).
- [ ] **S6 — Add the rule line** — append `<slug>` to the correct list in `registry/rules/byronwade-ui.mdc`.
- [ ] **S7 — Run it, confirm pass:** `npm run test:run -- <slug>` → PASS.

## Per-batch gate (run once after all components in a batch)

- [ ] `npm run update:registry` → no errors (sync + build + validate manifest).
- [ ] `npm run gen:examples` → example index regenerated.
- [ ] `npm run build` → typechecks (test:ci skips types; build catches server/client + `size`-prop traps).
- [ ] `npm run test:ci` → full suite + coverage thresholds green.
- [ ] Commit with explicit paths only (never `git add -A`):
      `git add registry/ registry.json content/examples/<each> tests/components/<each> registry/rules/byronwade-ui.mdc`
      then `git commit -m "feat(tradingview): batch N — <title>"` ending with the Co-Authored-By trailer.

---

# Batch 1 — Foundation: `market` lib + 6 primitives

## Task 1: `market` lib (`registry/lib/market.ts`)

**Files:** Create `registry/lib/market.ts`, `tests/components/market.test.ts`; add `registry.json` item
(`name: "market"`, `type: "registry:lib"`, file target `lib/market.ts`, no registryDependencies).

This lib is coverage-excluded but MUST be unit-tested for correctness (geometry feeds every chart).

- [ ] **Step 1 — Write `tests/components/market.test.ts`** asserting:
  - `linearScale(0, 10, 0, 100)(5) === 50`; clamps/handles zero-range (`min===max` → returns mid or `to0`).
  - `formatPrice(1234.5)` → `"1,234.50"`; `formatPrice(1234.5, { currency: "USD" })` → `"$1,234.50"`.
  - `formatPercent(1.826)` → `"+1.83%"`; negative → `"-2.14%"`; `formatPercent(0)` → `"0.00%"`.
  - `formatCompact(1200)` → `"1.2K"`; `formatCompact(3_400_000)` → `"3.4M"`; `formatCompact(950)` → `"950"`.
  - `formatVolume(12_345_678)` → `"12.3M"`.
  - `seriesToPolyline([1,2,3], 100, 40)` returns a string of `"x,y"` pairs, count === 3, x∈[0,100], y∈[0,40].
  - `seriesToAreaPath([1,2,3], 100, 40)` returns a `d` starting `"M"`, ending with `"Z"`.
  - `candleGeometry(candles, {width,height})` returns one entry per candle with numeric
    `{ x, openY, closeY, highY, lowY, bodyTop, bodyHeight, bullish }`; a flat candle (`open===close`)
    yields `bodyHeight >= 1` (min body) and `bullish === true` only when `close >= open`.
  - `cumulativeDepthPath(levels, ...)` returns a closed path string for non-empty input, `""` for `[]`.
  - `toneForChange(2)` → a success class fragment, `toneForChange(-2)` → destructive, `toneForChange(0)` → muted.
  - `makeCandles(20, { seed: 1 })` is deterministic: two calls with same args produce identical arrays;
    length 20; each has `time, open, high, low, close, volume` with `high >= max(open,close)` and
    `low <= min(open,close)`.
- [ ] **Step 2 — Run, confirm fail:** `npm run test:run -- market` → FAIL.
- [ ] **Step 3 — Implement `registry/lib/market.ts`** exporting (named, bottom of file):
  - **Types:** `Candle = { time: number; open: number; high: number; low: number; close: number; volume: number }`,
    `Quote = { symbol: string; name?: string; price: number; change: number; changePercent: number; ... }`,
    `OrderBookLevel = { price: number; size: number; total?: number }`,
    `Position = { symbol: string; side: "long" | "short"; size: number; entry: number; mark: number; pnl: number; pnlPercent: number }`,
    `Trade = { id: string; time: number; symbol: string; side: "buy" | "sell"; price: number; size: number }`,
    `MarketEvent`, `NewsItem`, `Alert`, `ScreenerRow`, `MoverRow`, `HeatmapCell = { symbol: string; weight: number; change: number }`,
    `CandleGeometry`.
  - **Pure fns:** `linearScale`, `formatPrice`, `formatPercent`, `formatChange`, `formatCompact`,
    `formatVolume`, `seriesToPolyline`, `seriesToAreaPath`, `candleGeometry`, `cumulativeDepthPath`,
    `toneForChange`, and seeded generators `makeCandles`, `makeQuote`, `makeOrderBook`, `makeSeries`
    (all take an optional `seed`; use a small deterministic PRNG, e.g. mulberry32, NOT `Math.random`).
- [ ] **Step 4 — Run, confirm pass:** `npm run test:run -- market` → PASS.
- [ ] **Step 5 — Add `registry.json` item** for `market` (shape like the `video-player-utils` lib item).

### Task 2: `sparkline` (primitive)

**Reuse:** `@/lib/market` (`seriesToPolyline`/`seriesToAreaPath`, `toneForChange`).
**API:** `data: number[]`, `variant?: "line" | "area"` (cva, default `line`), `tone?: "auto" | "success" | "destructive" | "muted" | "brand"` (default `auto` — derived from first vs last value), `width?`/`height?` (default 96×32), `strokeWidth?`, `className`. Renders one `<svg data-slot="sparkline">` with a `<title>` (unique `useId`) for a11y.
**Tests must cover:** default render; `variant="area"` (path has fill); each `tone`; `auto` tone resolves up→success / down→destructive; empty `data` renders an empty svg without crashing; custom width/height applied; axe.

### Task 3: `price-change` (primitive)

**Reuse:** `@/lib/market` (`formatPrice`/`formatPercent`/`toneForChange`), `lucide-react` (caret icons).
**API:** `value: number`, `percent?: number`, `format?: "absolute" | "percent" | "both"` (default `both`),
`size?: "sm" | "default" | "lg"` (cva), `variant?: "text" | "chip"` (cva — chip = tinted `bg-success/10`/`bg-destructive/10` pill), `showIcon?` (default true), `neutralThreshold?` (default 0 → values within → muted, no icon), `className`. Caret up/down/flat from sign; `font-mono`. Root `data-slot="price-change"`, `aria-label` describing direction + value.
**Tests must cover:** positive→success + up caret; negative→destructive + down caret; zero/within-threshold→muted + no caret; each `format` (absolute/percent/both); each `size`; `variant="chip"` tint; `showIcon={false}`; axe.

### Task 4: `candlestick-chart` (primitive)

**Reuse:** `@/lib/market` (`candleGeometry`, `linearScale`, `formatPrice`).
**API:** `data: Candle[]` (default seeded `makeCandles`), `width?`/`height?` (default 480×280),
`showVolume?` (default true — volume bars in a bottom band), `showGrid?` (default true),
`showCrosshair?` (default false — optional; mouse-driven readout, kept minimal),
`upTone`/`downTone` fixed to success/destructive, `className`. Bullish candles `text-success`/`fill-success`,
bearish `text-destructive`. Each candle group `data-slot="candle"`; root svg `data-slot="candlestick-chart"`
with `role="img"` + `aria-label`. Geometry from `candleGeometry` (numeric props → deterministic).
**Tests must cover:** default render (N candle groups === data length); bullish vs bearish tone classes present;
`showVolume={false}` hides volume band; `showGrid={false}` hides grid lines; empty data → no crash;
custom width/height; axe. (Crosshair: if implemented, gate it behind `showCrosshair` and test the toggle
renders/omits the crosshair layer — do NOT depend on getBoundingClientRect values.)

### Task 5: `depth-chart` (primitive)

**Reuse:** `@/lib/market` (`cumulativeDepthPath`, `linearScale`, `formatPrice`/`formatCompact`).
**API:** `bids: OrderBookLevel[]`, `asks: OrderBookLevel[]` (defaults via `makeOrderBook`), `width?`/`height?`
(default 480×200), `showMidline?` (default true), `className`. Bid area `fill-success/15` + `stroke-success`,
ask area `fill-destructive/15` + `stroke-destructive`. Root `data-slot="depth-chart"`, `role="img"` + aria-label.
**Tests must cover:** default render (bid path + ask path present); empty bids or asks → that side omitted, no crash;
`showMidline={false}` hides midline; custom dims; axe.

### Task 6: `order-book` (primitive)

**Reuse:** `@/lib/market` (`formatPrice`/`formatCompact`), `@/lib/utils`.
**API:** `bids: OrderBookLevel[]`, `asks: OrderBookLevel[]` (defaults via `makeOrderBook`),
`depth?` (rows per side, default 8), `layout?: "split" | "vertical"` (cva — split = asks left/bids right;
vertical = asks stacked above bids with spread row between), `spread?: number` (computed if omitted),
`onSelectPrice?: (price: number) => void` (row click), `className`. Each row has a proportional depth bar
(`bg-success/10` bid, `bg-destructive/10` ask) sized by `size/maxSize` (width %); `font-mono` numerals.
Rows `data-slot="order-book-row"` with `data-side`; spread row `data-slot="order-book-spread"`.
**Tests must cover:** renders `depth` rows per side; bid vs ask side classes/`data-side`; spread row value;
clicking a row calls `onSelectPrice` with that price; both layouts; `depth` prop limits rows; axe.

**→ Run the Per-batch gate. Commit: `feat(tradingview): batch 1 — market lib & charting primitives`.**

---

# Batch 2 — Chart & watch

### Task 7: `heatmap-grid` (primitive)

**Reuse:** `@/lib/market` (`toneForChange`, `formatPercent`), `@/lib/utils`.
**API:** `cells: HeatmapCell[]` (default seeded), `metric?: "change"` , `columns?` (default auto from count),
`scale?: "tone" | "chart"` (cva — `tone` = success/destructive opacity by magnitude; `chart` = `--chart-1…5`),
`onSelect?: (symbol: string) => void`, `className`. Cell area sized by `weight` (flex-basis %), color tone by
`change` magnitude (opacity bucket). Cell `data-slot="heatmap-cell"` with `data-symbol`; `font-mono` for %.
**Tests must cover:** renders one cell per entry; positive cell success tint, negative destructive tint;
`scale="chart"` uses chart classes; clicking a cell calls `onSelect` with symbol; magnitude→opacity bucket
differs between small and large change; axe.

### Task 8: `ticker-tape` (composite)

**Reuse:** existing `ticker` (`@byronwade/ticker`), `@/lib/market`.
**API:** `items: Quote[]` (default seeded), `speed?: "slow" | "default" | "fast"` (cva → animation-duration via
inline style or class), `paused?` (default false), `className`. A horizontally scrolling marquee (CSS keyframes
duplicated track for seamless loop, `motion-reduce:animate-none`). Each item composes `Ticker`/`TickerSymbol`/
`TickerPrice`/`TickerPriceChange`. Root `data-slot="ticker-tape"`, `aria-label="Market ticker tape"`.
**Tests must cover:** renders all items (symbols present); `paused` adds the paused class/`data-paused`;
each speed maps to its duration class; `motion-reduce` class present; axe.

### Task 9: `quote-header` (composite)

**Reuse:** `price-change`, `sparkline`, `metric-stat`, `@/lib/market`.
**API:** `quote: Quote` (default seeded), `stats?: { label: string; value: string }[]` (open/high/low/vol/mktcap),
`spark?: number[]`, `size?: "default" | "lg"` (cva), `className`. Big `font-mono` price, `price-change` for
change+percent, optional `sparkline`, a `metric-stat` row (or grid) for stats. Root `data-slot="quote-header"`.
**Tests must cover:** symbol + name + price render; change shown via price-change tone; stats render when given;
sparkline shown when `spark` given / omitted otherwise; each size; axe.

### Task 10: `chart-toolbar` (composite)

**Reuse:** `segmented-control`, `toggle-group`, `button`, `lucide-react`.
**API:** `symbol: string`, `interval: string`, `intervals?: string[]` (default `["1m","5m","15m","1H","1D","1W"]`),
`onIntervalChange?: (i: string) => void`, `chartType?: "candles" | "line" | "area"`,
`onChartTypeChange?`, `onSymbolClick?`, `onIndicatorsClick?`, `className`. A toolbar row: symbol button (left),
interval `segmented-control`, chart-type `toggle-group`, indicators/settings buttons. Root `data-slot="chart-toolbar"`.
**Tests must cover:** active interval reflects `interval`; clicking another interval calls `onIntervalChange` with it;
chart-type toggle calls `onChartTypeChange`; symbol button calls `onSymbolClick`; indicators button calls handler;
custom `intervals` render; axe.

### Task 11: `chart-panel` (composite)

**Reuse:** `chart-toolbar`, `candlestick-chart`, `@/lib/market`.
**API:** `symbol`, `quote?: Quote`, `data?: Candle[]` (default seeded), `interval?` (default `"1D"`),
controlled-or-uncontrolled interval (internal `useState` fallback when `onIntervalChange` absent),
`onIntervalChange?`, `className`. Composes toolbar atop the candlestick chart; passes a `line`/`area` mode to a
`sparkline`-style fallback when chartType !== candles (or just keep candles for v1 + line via sparkline area).
Root `data-slot="chart-panel"`.
**Tests must cover:** renders toolbar + chart; default interval `1D` active; changing interval (uncontrolled)
updates the active button; controlled `interval`+`onIntervalChange` calls handler and reflects prop; axe.

### Task 12: `watchlist` (composite)

**Reuse:** `table`, `price-change`, `sparkline`, `@/lib/market`.
**API:** `items: Quote[]` (default seeded), `columns?: ("price" | "change" | "spark" | "volume")[]`
(default all), `onSelect?: (symbol: string) => void`, `selectedSymbol?`, `dense?` (cva), `className`.
A `table` of rows: symbol/name, last (`font-mono`), `price-change`, `sparkline`, volume. Selected row tinted
`bg-accent`. Root `data-slot="watchlist"`; rows `data-slot="watchlist-row"` `data-symbol`.
**Tests must cover:** renders a row per item; clicking a row calls `onSelect` with symbol; `selectedSymbol`
highlights that row; column subset hides others; `dense` class; change tone via price-change; axe.

### Task 13: `market-depth` (composite)

**Reuse:** `order-book`, `depth-chart`, `@/lib/market`.
**API:** `bids`, `asks` (defaults via `makeOrderBook`), `view?: "both" | "book" | "chart"` (cva, default both),
`depth?`, `onSelectPrice?`, `className`. Stacks `depth-chart` over `order-book` (or shows only one per `view`).
Root `data-slot="market-depth"`.
**Tests must cover:** `view="both"` renders both children; `view="book"`/`"chart"` render only that one;
`onSelectPrice` passes through from the book; `depth` passes through; axe.

**→ Run the Per-batch gate. Commit: `feat(tradingview): batch 2 — chart & watchlist composites`.**

---

# Batch 3 — Trading

### Task 14: `order-entry` (composite)

**Reuse:** `tabs`, `segmented-control`, `money-input`, `input`, `button`, `label`, `@/lib/market`.
**API:** `symbol: string`, `lastPrice?: number`, `defaultSide?: "buy" | "sell"`,
`onSubmit?: (order: { side; type; qty; price?; total }) => void`, `className`. Buy/Sell `tabs` (buy tab
submit btn `bg-success`, sell `bg-destructive`), order-type `segmented-control` (Market/Limit/Stop),
qty `input` + price `money-input` (price disabled for Market), computed total (`font-mono`), submit `button`.
Root `data-slot="order-entry"`. Controlled-or-uncontrolled side.
**Tests must cover:** switching Buy/Sell tab updates submit button label/tone; selecting Limit enables the price
field (Market disables it); typing qty/price updates the computed total; submit calls `onSubmit` with the
assembled order object (assert side, type, qty, total); axe.

### Task 15: `position-card` (composite)

**Reuse:** `price-change`, `badge`, `status-dot` (or `badge`), `@/lib/market`.
**API:** `position: Position` (default seeded), `onClose?: (symbol: string) => void`, `className`.
Card: symbol + side badge (`long`→success tint, `short`→destructive tint), size/entry/mark (`font-mono`),
unrealized P&L via `price-change`, optional close button. Root `data-slot="position-card"`.
**Tests must cover:** renders symbol/side/size/entry/mark; long vs short badge tone; profit→success
P&L, loss→destructive; close button calls `onClose` with symbol (and is absent without handler); axe.

### Task 16: `positions-table` (composite)

**Reuse:** `table`, `price-change`, `badge`, `@/lib/market`.
**API:** `positions: Position[]` (default seeded), `onSelect?`, `onClose?`, `showFooter?` (default true —
aggregate P&L row), `className`. Table: symbol, side badge, size, entry, mark, P&L (`price-change`), close.
Footer totals via `font-mono`. Root `data-slot="positions-table"`; rows `data-slot="position-row"`.
**Tests must cover:** a row per position; side badge tones; P&L tone per row; footer aggregate present
when `showFooter` (absent when false); row click → `onSelect`; close click → `onClose`; axe.

### Task 17: `portfolio-summary` (composite)

**Reuse:** `metric-stat`, `stat-card`, `sparkline`, `price-change`, `@/lib/market`.
**API:** `totalValue: number`, `dayChange: number`, `dayChangePercent: number`, `spark?: number[]`,
`allocations?: { label: string; percent: number }[]`, `className`. Big total (`font-mono`), day `price-change`,
equity-curve `sparkline`, allocation bars (token-tinted, brand for primary). Root `data-slot="portfolio-summary"`.
**Tests must cover:** total + day change render (tone via price-change); sparkline shown when `spark` given;
allocation bars render one per entry with width from percent; axe.

### Task 18: `trade-history` (composite)

**Reuse:** `table`, `price-change`, `badge`, `relative-time`, `@/lib/market`.
**API:** `trades: Trade[]` (default seeded), `onSelect?`, `className`. Table: time (`relative-time`),
symbol, side badge (buy→success / sell→destructive tint), price, size, value (`font-mono`).
Root `data-slot="trade-history"`; rows `data-slot="trade-row"`.
**Tests must cover:** a row per trade; buy vs sell badge tone; value computed (price×size) shown;
row click → `onSelect` with trade id; relative-time rendered; axe.

**→ Run the Per-batch gate. Commit: `feat(tradingview): batch 3 — trading composites`.**

---

# Batch 4 — Discovery

### Task 19: `market-movers` (composite)

**Reuse:** `tabs`, `sparkline`, `price-change`, `@/lib/market`.
**API:** `gainers: MoverRow[]`, `losers: MoverRow[]`, `active: MoverRow[]` (defaults seeded),
`onSelect?: (symbol) => void`, `className`. `tabs` for Gainers/Losers/Active; each tab a list of rows
(symbol, last `font-mono`, `price-change`, `sparkline`). Root `data-slot="market-movers"`.
**Tests must cover:** default tab (gainers) shows gainer rows; switching to Losers shows loser rows;
switching to Active shows active rows; row click → `onSelect`; price-change tone per row; axe.

### Task 20: `screener-table` (composite)

**Reuse:** existing `index-filters` + `index-table` (read them first), `price-change`, `sparkline`, `@/lib/market`.
**API:** `rows: ScreenerRow[]` (default seeded), `filters?` (sector/market-cap pills via `index-filters`),
`onSelect?`, `sortBy?`/`onSortChange?`, `className`. Columns: symbol, price, change (`price-change`),
volume, mkt cap, sparkline. Root `data-slot="screener-table"`.
**Tests must cover:** renders a row per ScreenerRow; selecting a filter narrows visible rows (or calls handler);
clicking a sortable header calls `onSortChange` / reorders; row click → `onSelect`; change tone; axe.

### Task 21: `economic-calendar` (composite)

**Reuse:** `badge`, `relative-time`, `status-dot`, `@/lib/market` (`MarketEvent`).
**API:** `events: MarketEvent[]` (default seeded), `onSelect?`, `className`. List grouped by day; each row:
time, country (text/code), event name, impact badge (low/med/high → muted/`bg-warning/15`/`bg-destructive/15`),
actual/forecast/prior (`font-mono`). Root `data-slot="economic-calendar"`; rows `data-slot="calendar-event"`.
**Tests must cover:** a row per event; impact badge tone per level (low/med/high); actual/forecast/prior shown;
row click → `onSelect`; day grouping headers render; axe.

### Task 22: `market-news` (composite)

**Reuse:** `avatar`, `relative-time`, `badge`, `price-change`, `@/lib/market` (`NewsItem`).
**API:** `items: NewsItem[]` (default seeded), `onSelect?`, `compact?` (cva), `className`. List rows: source
avatar, headline, relative-time, related-symbol chips with `price-change`, optional sentiment badge
(positive→success / negative→destructive / neutral→muted tint). Root `data-slot="market-news"`;
rows `data-slot="news-item"`.
**Tests must cover:** a row per item; headline + source + relative-time render; sentiment badge tone per value;
related symbol chip change tone; `compact` class; row click → `onSelect`; axe.

### Task 23: `price-alert` (composite)

**Reuse:** `switch`, `badge`, `price-change`, `status-dot`, `@/lib/market` (`Alert`).
**API:** `alerts: Alert[]` (default seeded), `onToggle?: (id, enabled) => void`, `onDelete?: (id) => void`,
`className`. List rows: symbol, condition (e.g. "Price ≥ 230.00", `font-mono`), status `status-dot`
(active/triggered), enable `switch`, delete button. Triggered alerts tinted. Root `data-slot="price-alert"`;
rows `data-slot="alert-row"`.
**Tests must cover:** a row per alert; toggling the switch calls `onToggle` with (id, nextEnabled);
delete button calls `onDelete` with id; triggered vs active status-dot/state class; condition text rendered;
axe.

### Task 24: `symbol-search` (composite)

**Reuse:** `command` (cmdk, read `registry/ui/command.tsx`), `price-change`, `kbd`, `avatar`, `@/lib/market`.
**API:** `symbols: Quote[]` (default seeded), `onSelect?: (symbol) => void`, `placeholder?`,
`groups?` (e.g. Stocks/Crypto/Forex), `className`. A `command` palette: search input, grouped results
(symbol + name + `price-change`), `kbd` hint. Filtering by query. Root `data-slot="symbol-search"`.
**Tests must cover:** renders results; typing filters the list (matching symbol/name remain, others gone);
selecting a result calls `onSelect` with symbol; keyboard nav highlights items (cmdk `data-[selected=true]`);
groups render; empty-query/empty-result state; axe. (Heed memory: cmdk uses `data-[selected=true]:`, not bare
`data-selected:`.)

**→ Run the Per-batch gate. Commit: `feat(tradingview): batch 4 — discovery composites`.**

---

## Final verification (after Batch 4)

- [x] `npm run validate` — registry + examples + rule sync + test-file presence all green.
- [x] `npm run build` — full typecheck passes.
- [x] `npm run test:ci` — suite + coverage thresholds green.
- [x] `git log --oneline main..HEAD` shows the spec commit + 4 batch commits.
- [x] Docs catalog — 24 `Market` entries in `content/components.ts`; `npm run gen:llms` + `npm run gen:mcp-data`.
- [x] Phase 2 audit — `docs/superpowers/specs/2026-06-05-tradingview-phase2-audit.md`.
- [ ] Open PR → `main`; follow `superpowers:finishing-a-development-branch` after review.

## Phase 2

See `docs/superpowers/specs/2026-06-05-tradingview-phase2-audit.md` for prioritized gaps
(`time-and-sales`, `volume-profile`, `symbol-details`, …).

## Self-review notes (done by author)

- **Spec coverage:** all 23 components + the `market` lib have a task; 4 batches match the spec's delivery plan.
- **Type consistency:** component prop types reference `market` lib types (`Quote`, `Candle`, `Position`,
  `OrderBookLevel`, `Trade`, `MarketEvent`, `NewsItem`, `Alert`, `ScreenerRow`, `MoverRow`, `HeatmapCell`)
  defined once in Task 1; reused names are consistent across tasks.
- **No placeholders:** each task carries its concrete API, reuse list, and explicit test-must-cover items.
- **Coverage strategy:** chart math in `market` lib (coverage-excluded but unit-tested); components compute
  geometry from numeric props so SVG renders deterministically and is covered by rendering; every callback has
  an explicit interaction test.
