/**
 * Pure, DOM-free market helpers for the byronwade/ui TradingView-style set.
 * All chart geometry, number formatting, and the deterministic mock generators
 * every chart/table component depends on live here as plain functions so the
 * component files stay thin presentational wiring and this logic is exhaustively
 * testable. Nothing here touches the DOM or React, and nothing is random:
 * generators use a seeded PRNG (mulberry32) so identical args → identical output.
 */

type Candle = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type Quote = {
  symbol: string
  name?: string
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: number
}

type OrderBookLevel = {
  price: number
  size: number
  total?: number
}

type Position = {
  symbol: string
  side: "long" | "short"
  size: number
  entry: number
  mark: number
  pnl: number
  pnlPercent: number
}

type Trade = {
  id: string
  symbol: string
  time: number
  side: "buy" | "sell"
  price: number
  size: number
}

type MarketEvent = {
  id: string
  country: string
  title: string
  time: number
  impact: "low" | "medium" | "high"
  actual?: string
  forecast?: string
  previous?: string
}

type NewsItem = {
  id: string
  source: string
  headline: string
  time: number
  symbols?: string[]
  sentiment?: "positive" | "negative" | "neutral"
}

type Alert = {
  id: string
  symbol: string
  condition: "above" | "below"
  target: number
  enabled: boolean
  status: "active" | "triggered"
}

type ScreenerRow = {
  symbol: string
  name?: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  spark?: number[]
}

type MoverRow = {
  symbol: string
  name?: string
  price: number
  changePercent: number
  spark?: number[]
}

type HeatmapCell = {
  symbol: string
  weight: number
  change: number
}

type TimeAndSale = {
  id: string
  time: number
  price: number
  size: number
  side: "buy" | "sell"
}

type VolumeProfileBar = {
  price: number
  volume: number
  y: number
  height: number
  width: number
}

type SymbolStatRow = {
  label: string
  value: string
}

type SymbolStats = {
  quote: Quote
  exchange: string
  sector: string
  industry: string
  overview: SymbolStatRow[]
  financials: SymbolStatRow[]
  statistics: SymbolStatRow[]
}

type CandleGeometry = {
  x: number
  openY: number
  closeY: number
  highY: number
  lowY: number
  bodyTop: number
  bodyHeight: number
  bullish: boolean
}

const LOCALE = "en-US"
const MIN_BODY_HEIGHT = 1
const DEFAULT_SEED = 0x9e3779b9
const BASE_TIME = 1_700_000_000_000
const MINUTE = 60_000

/** Map a value from a source domain to a target range; zero-width domain → rangeMin. */
const linearScale = (
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): ((value: number) => number) => {
  const span = domainMax - domainMin
  if (span === 0) return () => rangeMin
  const factor = (rangeMax - rangeMin) / span
  return (value: number) => rangeMin + (value - domainMin) * factor
}

const priceFormat = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormat = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
})

const sign = (value: number): string => (value > 0 ? "+" : "")

/** Format a price with grouped thousands, two decimals, and an optional currency symbol. */
const formatPrice = (
  value: number,
  opts: { currency?: string } = {},
): string => {
  if (!opts.currency) return priceFormat.format(value)
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: opts.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Format a percentage already in percent units (`1.83` → `"+1.83%"`); zero gets no sign. */
const formatPercent = (value: number): string =>
  `${sign(value)}${value.toFixed(2)}%`

/** Format a signed change with two decimals; gains get a leading `+`, zero none. */
const formatChange = (value: number): string =>
  `${sign(value)}${value.toFixed(2)}`

/** Format a number compactly (`1.2K`, `3.4M`); small values stay whole. */
const formatCompact = (value: number): string => compactFormat.format(value)

/** Format a trading volume compactly (alias of {@link formatCompact}). */
const formatVolume = (value: number): string => compactFormat.format(value)

type SeriesOpts = { padding?: number }

const seriesPoints = (
  data: number[],
  width: number,
  height: number,
  opts: SeriesOpts = {},
): Array<[number, number]> => {
  if (data.length === 0) return []
  const pad = opts.padding ?? 0
  const min = Math.min(...data)
  const max = Math.max(...data)
  const x = linearScale(0, Math.max(1, data.length - 1), 0, width)
  // Invert Y so larger values sit higher (smaller y); flat series sits centered.
  const y = linearScale(min, max, height - pad, pad)
  return data.map((value, index) => [x(index), y(value)])
}

/** Build an SVG polyline `points` string (`"x,y x,y …"`) from a numeric series. */
const seriesToPolyline = (
  data: number[],
  width: number,
  height: number,
  opts: SeriesOpts = {},
): string =>
  seriesPoints(data, width, height, opts)
    .map(([x, y]) => `${x},${y}`)
    .join(" ")

/** Build a closed SVG area `d` (line across the top, baseline back, `Z`) from a series. */
const seriesToAreaPath = (
  data: number[],
  width: number,
  height: number,
  opts: SeriesOpts = {},
): string => {
  const points = seriesPoints(data, width, height, opts)
  if (points.length === 0) return ""
  const [first, ...rest] = points
  const line = `M${first[0]},${first[1]}${rest
    .map(([x, y]) => `L${x},${y}`)
    .join("")}`
  const last = points[points.length - 1]
  return `${line}L${last[0]},${height}L${first[0]},${height}Z`
}

/** Compute per-candle SVG geometry (Y inverted, min body height) for a candlestick chart. */
const candleGeometry = (
  candles: Candle[],
  opts: { width: number; height: number; volumeRatio?: number },
): CandleGeometry[] => {
  if (candles.length === 0) return []
  const { width, height } = opts
  const volumeRatio = opts.volumeRatio ?? 0
  const priceHeight = height * (1 - volumeRatio)
  const lows = candles.map((c) => c.low)
  const highs = candles.map((c) => c.high)
  const min = Math.min(...lows)
  const max = Math.max(...highs)
  const x = linearScale(0, Math.max(1, candles.length - 1), 0, width)
  // Higher price → smaller y (SVG origin is top-left).
  const y = linearScale(min, max, priceHeight, 0)
  return candles.map((candle, index) => {
    const openY = y(candle.open)
    const closeY = y(candle.close)
    const bullish = candle.close >= candle.open
    const bodyTop = Math.min(openY, closeY)
    const bodyHeight = Math.max(MIN_BODY_HEIGHT, Math.abs(openY - closeY))
    return {
      x: x(index),
      openY,
      closeY,
      highY: y(candle.high),
      lowY: y(candle.low),
      bodyTop,
      bodyHeight,
      bullish,
    }
  })
}

/** Build a stepped cumulative-depth area path for one book side; `""` for empty input. */
const cumulativeDepthPath = (
  levels: OrderBookLevel[],
  width: number,
  height: number,
  side: "bid" | "ask",
): string => {
  if (levels.length === 0) return ""
  const sorted = [...levels].sort((a, b) =>
    side === "bid" ? b.price - a.price : a.price - b.price,
  )
  let cumulative = 0
  const cumulated = sorted.map((level) => {
    cumulative += level.size
    return { price: level.price, total: cumulative }
  })
  const prices = cumulated.map((l) => l.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const maxTotal = cumulated[cumulated.length - 1].total
  const x = linearScale(minPrice, maxPrice, 0, width)
  const y = linearScale(0, maxTotal, height, 0)
  // Stepped (horizontal then vertical) cumulative line.
  let d = `M${x(cumulated[0].price)},${height}`
  let prevY = height
  for (const level of cumulated) {
    const px = x(level.price)
    const py = y(level.total)
    d += `L${px},${prevY}L${px},${py}`
    prevY = py
  }
  const lastX = x(cumulated[cumulated.length - 1].price)
  d += `L${lastX},${height}Z`
  return d
}

/** Format an ISO trade timestamp as `HH:mm:ss` (UTC, deterministic). */
const formatTradeTime = (time: number): string =>
  new Date(time).toISOString().slice(11, 19)

/** Bucket session volume by price into horizontal profile bars (geometry only). */
const volumeProfileGeometry = (
  candles: Candle[],
  opts: { width: number; height: number; bins?: number },
): VolumeProfileBar[] => {
  if (candles.length === 0) return []
  const bins = opts.bins ?? 24
  const lows = candles.map((c) => c.low)
  const highs = candles.map((c) => c.high)
  const minPrice = Math.min(...lows)
  const maxPrice = Math.max(...highs)
  const span = maxPrice - minPrice || 1
  const binSize = span / bins
  const volumes = Array.from({ length: bins }, () => 0)
  for (const candle of candles) {
    const mid = (candle.high + candle.low) / 2
    const index = Math.min(
      bins - 1,
      Math.max(0, Math.floor((mid - minPrice) / binSize)),
    )
    volumes[index] += candle.volume
  }
  const maxVolume = Math.max(...volumes, 1)
  const barHeight = opts.height / bins
  const yScale = linearScale(minPrice, minPrice + span, opts.height, 0)
  return volumes.map((volume, index) => {
    const priceTop = minPrice + index * binSize
    return {
      price: priceTop + binSize / 2,
      volume,
      y: yScale(priceTop + binSize) - barHeight,
      height: barHeight,
      width: (volume / maxVolume) * opts.width,
    }
  })
}

/** Index of the highest-volume price bin in a volume profile. */
const volumeProfilePocIndex = (bars: VolumeProfileBar[]): number => {
  if (bars.length === 0) return -1
  let best = 0
  for (let i = 1; i < bars.length; i += 1) {
    if (bars[i].volume > bars[best].volume) best = i
  }
  return best
}

/** Map a signed change to a Tailwind text-token class fragment (success / destructive / muted). */
const toneForChange = (value: number): string => {
  if (value > 0) return "text-success"
  if (value < 0) return "text-destructive"
  return "text-muted-foreground"
}

/** Seeded, deterministic PRNG (mulberry32). Same seed → same stream, always. */
const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type SeedOpts = { seed?: number }

const SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "AMZN",
  "GOOGL",
  "META",
  "NFLX",
] as const

/** Generate a deterministic candle series (OHLCV) seeded by `opts.seed`. */
const makeCandles = (count: number, opts: SeedOpts = {}): Candle[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const candles: Candle[] = []
  let prevClose = 100
  for (let i = 0; i < count; i += 1) {
    const open = prevClose
    const drift = (rand() - 0.48) * 4
    const close = Math.max(1, open + drift)
    const wick = rand() * 2 + 0.5
    const high = Math.max(open, close) + wick * rand()
    const low = Math.min(open, close) - wick * rand()
    const volume = Math.round(1_000_000 + rand() * 4_000_000)
    candles.push({
      time: BASE_TIME + i * MINUTE,
      open,
      high,
      low,
      close,
      volume,
    })
    prevClose = close
  }
  return candles
}

/** Generate a deterministic quote seeded by `opts.seed`. */
const makeQuote = (opts: SeedOpts = {}): Quote => {
  const seed = opts.seed ?? DEFAULT_SEED
  const rand = mulberry32(seed)
  const symbol = SYMBOLS[Math.floor(rand() * SYMBOLS.length)]
  const price = 50 + rand() * 450
  const changePercent = (rand() - 0.45) * 6
  const change = (price * changePercent) / 100
  return {
    symbol,
    name: `${symbol} Inc.`,
    price,
    change,
    changePercent,
    volume: Math.round(1_000_000 + rand() * 90_000_000),
    marketCap: Math.round(price * (1_000_000_000 + rand() * 2_000_000_000_000)),
  }
}

/** Generate a deterministic order book (bids + asks) around a mid price, seeded by `opts.seed`. */
const makeOrderBook = (
  opts: SeedOpts & { depth?: number; mid?: number } = {},
): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const depth = opts.depth ?? 12
  const mid = opts.mid ?? 100
  const tick = 0.05
  const bids: OrderBookLevel[] = []
  const asks: OrderBookLevel[] = []
  let bidTotal = 0
  let askTotal = 0
  for (let i = 0; i < depth; i += 1) {
    const size = Math.round(10 + rand() * 990)
    bidTotal += size
    bids.push({ price: mid - (i + 1) * tick, size, total: bidTotal })
    const askSize = Math.round(10 + rand() * 990)
    askTotal += askSize
    asks.push({ price: mid + (i + 1) * tick, size: askSize, total: askTotal })
  }
  return { bids, asks }
}

/** Generate a deterministic heatmap cell set seeded by `opts.seed`. */
const makeHeatmapCells = (
  count: number,
  opts: SeedOpts = {},
): HeatmapCell[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const cells: HeatmapCell[] = []
  for (let i = 0; i < count; i += 1) {
    cells.push({
      symbol: SYMBOLS[i % SYMBOLS.length],
      weight: 0.5 + rand() * 2.5,
      change: (rand() - 0.5) * 8,
    })
  }
  return cells
}

/** Generate a deterministic numeric series (random walk), seeded by `opts.seed`. */
const makeSeries = (count: number, opts: SeedOpts = {}): number[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const series: number[] = []
  let value = 100
  for (let i = 0; i < count; i += 1) {
    value = Math.max(1, value + (rand() - 0.48) * 5)
    series.push(value)
  }
  return series
}

/** Generate a deterministic open position seeded by `opts.seed`. */
const makePosition = (opts: SeedOpts = {}): Position => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const symbol = SYMBOLS[Math.floor(rand() * SYMBOLS.length)]
  const side: Position["side"] = rand() > 0.5 ? "long" : "short"
  const size = Math.round(1 + rand() * 500)
  const entry = 50 + rand() * 200
  const mark = entry * (1 + (rand() - 0.45) * 0.12)
  const pnl = side === "long" ? (mark - entry) * size : (entry - mark) * size
  const pnlPercent = entry * size === 0 ? 0 : (pnl / (entry * size)) * 100
  return { symbol, side, size, entry, mark, pnl, pnlPercent }
}

const makePositions = (count: number, opts: SeedOpts = {}): Position[] =>
  Array.from({ length: count }, (_, index) =>
    makePosition({ seed: (opts.seed ?? DEFAULT_SEED) + index + 1 }),
  )

/** Generate a deterministic trade fill seeded by `opts.seed`. */
const makeTrade = (opts: SeedOpts = {}): Trade => {
  const seed = opts.seed ?? DEFAULT_SEED
  const rand = mulberry32(seed)
  return {
    id: `trade-${seed}`,
    symbol: SYMBOLS[Math.floor(rand() * SYMBOLS.length)],
    time: BASE_TIME - Math.floor(rand() * 86_400_000),
    side: rand() > 0.5 ? "buy" : "sell",
    price: 50 + rand() * 200,
    size: Math.round(1 + rand() * 100),
  }
}

const makeTrades = (count: number, opts: SeedOpts = {}): Trade[] =>
  Array.from({ length: count }, (_, index) =>
    makeTrade({ seed: (opts.seed ?? DEFAULT_SEED) + index + 1 }),
  )

/** Generate deterministic time-and-sales tape rows (newest first). */
const makeTimeAndSalesRows = (
  count: number,
  opts: SeedOpts & { mid?: number } = {},
): TimeAndSale[] => {
  const seed = opts.seed ?? DEFAULT_SEED
  const rand = mulberry32(seed)
  const mid = opts.mid ?? 100
  let price = mid
  return Array.from({ length: count }, (_, index) => {
    const side: TimeAndSale["side"] = rand() > 0.5 ? "buy" : "sell"
    price = Math.max(0.01, price + (rand() - 0.5) * 0.25)
    return {
      id: `ts-${seed}-${index}`,
      time: BASE_TIME - index * 850,
      price,
      size: Math.round(1 + rand() * 750),
      side,
    }
  })
}

/** Generate deterministic symbol fundamentals grouped for details tabs. */
const makeSymbolStats = (opts: SeedOpts = {}): SymbolStats => {
  const seed = opts.seed ?? DEFAULT_SEED
  const quote = makeQuote({ seed })
  const rand = mulberry32(seed + 100)
  const pe = 8 + rand() * 40
  const eps = 1 + rand() * 12
  const dividend = rand() * 4
  const beta = 0.5 + rand() * 1.8
  const revenue = (quote.marketCap ?? quote.price * 1e9) * (0.2 + rand() * 0.5)
  return {
    quote,
    exchange: ["NASDAQ", "NYSE", "AMEX"][Math.floor(rand() * 3)],
    sector: ["Technology", "Healthcare", "Energy", "Financials"][
      Math.floor(rand() * 4)
    ],
    industry: "Software—Application",
    overview: [
      {
        label: "Market cap",
        value: formatCompact(quote.marketCap ?? quote.price * 1_000_000_000),
      },
      { label: "Volume", value: formatVolume(quote.volume ?? 0) },
      { label: "Avg volume", value: formatVolume((quote.volume ?? 0) * 0.85) },
      { label: "Beta", value: beta.toFixed(2) },
    ],
    financials: [
      { label: "Revenue (TTM)", value: formatCompact(revenue) },
      { label: "Profit margin", value: `${(rand() * 28 + 4).toFixed(1)}%` },
      { label: "EPS (TTM)", value: eps.toFixed(2) },
      { label: "P/E ratio", value: pe.toFixed(1) },
    ],
    statistics: [
      { label: "Dividend yield", value: `${dividend.toFixed(2)}%` },
      { label: "Shares out", value: formatCompact(revenue / quote.price) },
      {
        label: "52W high",
        value: formatPrice(quote.price * (1.05 + rand() * 0.35)),
      },
      {
        label: "52W low",
        value: formatPrice(quote.price * (0.55 + rand() * 0.25)),
      },
    ],
  }
}

const makeMoverRows = (count: number, opts: SeedOpts = {}): MoverRow[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  return Array.from({ length: count }, (_, index) => {
    const quote = makeQuote({ seed: (opts.seed ?? DEFAULT_SEED) + index + 20 })
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      changePercent: quote.changePercent,
      spark: makeSeries(16, { seed: index + 30 }),
    }
  }).sort((a, b) => b.changePercent - a.changePercent)
}

const makeScreenerRows = (count: number, opts: SeedOpts = {}): ScreenerRow[] =>
  Array.from({ length: count }, (_, index) => {
    const quote = makeQuote({ seed: (opts.seed ?? DEFAULT_SEED) + index + 40 })
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: quote.volume ?? 0,
      marketCap: quote.marketCap ?? 0,
      spark: makeSeries(16, { seed: index + 50 }),
    }
  })

const makeMarketEvents = (
  count: number,
  opts: SeedOpts = {},
): MarketEvent[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  const impacts: MarketEvent["impact"][] = ["low", "medium", "high"]
  return Array.from({ length: count }, (_, index) => ({
    id: `event-${index + 1}`,
    country: ["US", "EU", "JP", "UK"][index % 4],
    title: `Economic release ${index + 1}`,
    time: BASE_TIME + index * 3_600_000,
    impact: impacts[Math.floor(rand() * impacts.length)],
    actual: rand() > 0.5 ? `${(rand() * 5).toFixed(1)}%` : undefined,
    forecast: `${(rand() * 4).toFixed(1)}%`,
    previous: `${(rand() * 3).toFixed(1)}%`,
  }))
}

const makeNewsItems = (count: number, opts: SeedOpts = {}): NewsItem[] => {
  const sentiments: NonNullable<NewsItem["sentiment"]>[] = [
    "positive",
    "negative",
    "neutral",
  ]
  return Array.from({ length: count }, (_, index) => {
    const quote = makeQuote({ seed: (opts.seed ?? DEFAULT_SEED) + index + 60 })
    const rand = mulberry32((opts.seed ?? DEFAULT_SEED) + index + 70)
    return {
      id: `news-${index + 1}`,
      source: ["Reuters", "Bloomberg", "CNBC", "WSJ"][index % 4],
      headline: `${quote.symbol} ${index % 2 === 0 ? "rallies on earnings beat" : "slides after guidance cut"}`,
      time: BASE_TIME - index * 1_800_000,
      symbols: [quote.symbol],
      sentiment: sentiments[Math.floor(rand() * sentiments.length)],
    }
  })
}

const makeAlerts = (count: number, opts: SeedOpts = {}): Alert[] => {
  const rand = mulberry32(opts.seed ?? DEFAULT_SEED)
  return Array.from({ length: count }, (_, index) => {
    const quote = makeQuote({ seed: (opts.seed ?? DEFAULT_SEED) + index + 80 })
    return {
      id: `alert-${index + 1}`,
      symbol: quote.symbol,
      condition: rand() > 0.5 ? "above" : "below",
      target: quote.price,
      enabled: rand() > 0.25,
      status: rand() > 0.8 ? "triggered" : "active",
    }
  })
}

const makeQuotes = (count: number, opts: SeedOpts = {}): Quote[] =>
  Array.from({ length: count }, (_, index) =>
    makeQuote({ seed: (opts.seed ?? DEFAULT_SEED) + index + 1 }),
  )

const makeMarketMovers = (
  count: number,
  opts: SeedOpts = {},
): { gainers: MoverRow[]; losers: MoverRow[]; active: MoverRow[] } => {
  const gainers = makeMoverRows(count, {
    seed: (opts.seed ?? DEFAULT_SEED) + 1,
  }).map((row) => ({
    ...row,
    changePercent: Math.abs(row.changePercent) + 0.5,
  }))
  const losers = makeMoverRows(count, {
    seed: (opts.seed ?? DEFAULT_SEED) + 2,
  }).map((row) => ({
    ...row,
    changePercent: -Math.abs(row.changePercent) - 0.5,
  }))
  const active = makeMoverRows(count, {
    seed: (opts.seed ?? DEFAULT_SEED) + 3,
  }).map((row) => ({ ...row, changePercent: row.changePercent * 0.4 }))
  return { gainers, losers, active }
}

export {
  linearScale,
  formatPrice,
  formatPercent,
  formatChange,
  formatCompact,
  formatVolume,
  formatTradeTime,
  seriesToPolyline,
  seriesToAreaPath,
  candleGeometry,
  cumulativeDepthPath,
  volumeProfileGeometry,
  volumeProfilePocIndex,
  toneForChange,
  makeCandles,
  makeQuote,
  makeOrderBook,
  makeHeatmapCells,
  makeSeries,
  makePosition,
  makePositions,
  makeTrade,
  makeTrades,
  makeTimeAndSalesRows,
  makeSymbolStats,
  makeMoverRows,
  makeScreenerRows,
  makeMarketEvents,
  makeNewsItems,
  makeAlerts,
  makeQuotes,
  makeMarketMovers,
}

export type {
  Candle,
  Quote,
  OrderBookLevel,
  Position,
  Trade,
  TimeAndSale,
  VolumeProfileBar,
  SymbolStatRow,
  SymbolStats,
  MarketEvent,
  NewsItem,
  Alert,
  ScreenerRow,
  MoverRow,
  HeatmapCell,
  CandleGeometry,
}
