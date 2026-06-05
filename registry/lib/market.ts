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

export {
  linearScale,
  formatPrice,
  formatPercent,
  formatChange,
  formatCompact,
  formatVolume,
  seriesToPolyline,
  seriesToAreaPath,
  candleGeometry,
  cumulativeDepthPath,
  toneForChange,
  makeCandles,
  makeQuote,
  makeOrderBook,
  makeSeries,
}

export type {
  Candle,
  Quote,
  OrderBookLevel,
  Position,
  Trade,
  MarketEvent,
  NewsItem,
  Alert,
  ScreenerRow,
  MoverRow,
  HeatmapCell,
  CandleGeometry,
}
