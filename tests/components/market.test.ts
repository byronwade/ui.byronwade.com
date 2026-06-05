/**
 * Unit tests for the pure market helpers (lib/market.ts). This lib carries all
 * chart geometry + formatting + deterministic mock generators that every
 * TradingView-style component depends on, kept DOM-free so it is exhaustively
 * testable. Components wire it up. (Coverage-excluded but correctness-critical.)
 */

import {
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
  makeHeatmapCells,
  makeSeries,
  volumeProfileGeometry,
  volumeProfilePocIndex,
  formatTradeTime,
  makeTimeAndSalesRows,
  makeSymbolStats,
} from "@/lib/market"

describe("linearScale", () => {
  it("maps a value across domains", () => {
    expect(linearScale(0, 10, 0, 100)(5)).toBe(50)
  })
  it("returns the range min on a zero-width domain (no NaN)", () => {
    const scale = linearScale(5, 5, 0, 100)
    expect(scale(5)).toBe(0)
    expect(Number.isNaN(scale(5))).toBe(false)
  })
})

describe("formatPrice", () => {
  it("formats with grouping and two decimals", () => {
    expect(formatPrice(1234.5)).toBe("1,234.50")
  })
  it("prefixes a currency symbol when given", () => {
    expect(formatPrice(1234.5, { currency: "USD" })).toBe("$1,234.50")
  })
})

describe("formatPercent", () => {
  it("prefixes a plus for gains", () => {
    expect(formatPercent(1.826)).toBe("+1.83%")
  })
  it("keeps the minus for losses", () => {
    expect(formatPercent(-2.14)).toBe("-2.14%")
  })
  it("gives zero no sign", () => {
    expect(formatPercent(0)).toBe("0.00%")
  })
})

describe("formatChange", () => {
  it("prefixes a plus for gains", () => {
    expect(formatChange(1.82)).toBe("+1.82")
  })
  it("keeps the minus for losses", () => {
    expect(formatChange(-1.82)).toBe("-1.82")
  })
})

describe("formatCompact", () => {
  it("formats thousands", () => {
    expect(formatCompact(1200)).toBe("1.2K")
  })
  it("formats millions", () => {
    expect(formatCompact(3_400_000)).toBe("3.4M")
  })
  it("leaves small numbers whole", () => {
    expect(formatCompact(950)).toBe("950")
  })
})

describe("formatVolume", () => {
  it("formats compactly", () => {
    expect(formatVolume(12_345_678)).toBe("12.3M")
  })
})

describe("seriesToPolyline", () => {
  it("returns one x,y pair per point within bounds", () => {
    const out = seriesToPolyline([1, 2, 3], 100, 40)
    const points = out.split(" ")
    expect(points).toHaveLength(3)
    for (const point of points) {
      const [x, y] = point.split(",").map(Number)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(100)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(40)
    }
  })
})

describe("seriesToAreaPath", () => {
  it("returns a closed fill path", () => {
    const d = seriesToAreaPath([1, 2, 3], 100, 40)
    expect(d.startsWith("M")).toBe(true)
    expect(d.endsWith("Z")).toBe(true)
  })
})

describe("candleGeometry", () => {
  const candles = makeCandles(5, { seed: 1 })

  it("returns one numeric entry per candle", () => {
    const geo = candleGeometry(candles, { width: 200, height: 100 })
    expect(geo).toHaveLength(candles.length)
    for (const g of geo) {
      for (const key of [
        "x",
        "openY",
        "closeY",
        "highY",
        "lowY",
        "bodyTop",
        "bodyHeight",
      ] as const) {
        expect(typeof g[key]).toBe("number")
        expect(Number.isNaN(g[key])).toBe(false)
      }
      expect(typeof g.bullish).toBe("boolean")
    }
  })

  it("gives a flat candle a minimum body height", () => {
    const flat = [{ time: 0, open: 100, high: 101, low: 99, close: 100, volume: 1 }]
    const geo = candleGeometry(flat, { width: 200, height: 100 })
    expect(geo[0].bodyHeight).toBeGreaterThanOrEqual(1)
  })

  it("marks bullish only when close >= open", () => {
    const mixed = [
      { time: 0, open: 100, high: 110, low: 95, close: 105, volume: 1 },
      { time: 1, open: 105, high: 106, low: 90, close: 95, volume: 1 },
    ]
    const geo = candleGeometry(mixed, { width: 200, height: 100 })
    expect(geo[0].bullish).toBe(true)
    expect(geo[1].bullish).toBe(false)
  })
})

describe("cumulativeDepthPath", () => {
  it("returns a non-empty closed path for levels", () => {
    const d = cumulativeDepthPath([{ price: 1, size: 1 }], 100, 40, "bid")
    expect(d.length).toBeGreaterThan(0)
    expect(d.endsWith("Z")).toBe(true)
  })
  it("returns an empty string for no levels", () => {
    expect(cumulativeDepthPath([], 100, 40, "bid")).toBe("")
  })
})

describe("toneForChange", () => {
  it("is success for gains", () => {
    expect(toneForChange(2)).toContain("success")
  })
  it("is destructive for losses", () => {
    expect(toneForChange(-2)).toContain("destructive")
  })
  it("is muted for flat", () => {
    expect(toneForChange(0)).toContain("muted")
  })
})

describe("makeCandles", () => {
  it("is deterministic for the same seed", () => {
    expect(makeCandles(20, { seed: 1 })).toEqual(makeCandles(20, { seed: 1 }))
  })
  it("produces the requested count of well-formed candles", () => {
    const candles = makeCandles(20, { seed: 1 })
    expect(candles).toHaveLength(20)
    for (const c of candles) {
      for (const key of ["time", "open", "high", "low", "close", "volume"] as const) {
        expect(typeof c[key]).toBe("number")
        expect(Number.isNaN(c[key])).toBe(false)
      }
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close))
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close))
    }
  })
})

describe("makeQuote", () => {
  it("is deterministic for the same seed", () => {
    expect(makeQuote({ seed: 1 })).toEqual(makeQuote({ seed: 1 }))
  })
  it("is shaped like a Quote", () => {
    const q = makeQuote({ seed: 1 })
    expect(typeof q.symbol).toBe("string")
    expect(typeof q.price).toBe("number")
    expect(typeof q.change).toBe("number")
    expect(typeof q.changePercent).toBe("number")
  })
})

describe("makeOrderBook", () => {
  it("is deterministic for the same seed", () => {
    expect(makeOrderBook({ seed: 1 })).toEqual(makeOrderBook({ seed: 1 }))
  })
  it("returns bid and ask level arrays", () => {
    const book = makeOrderBook({ seed: 1 })
    expect(Array.isArray(book.bids)).toBe(true)
    expect(Array.isArray(book.asks)).toBe(true)
    for (const level of [...book.bids, ...book.asks]) {
      expect(typeof level.price).toBe("number")
      expect(typeof level.size).toBe("number")
    }
  })
})

describe("makeHeatmapCells", () => {
  it("is deterministic for the same seed", () => {
    expect(makeHeatmapCells(8, { seed: 2 })).toEqual(makeHeatmapCells(8, { seed: 2 }))
  })

  it("returns the requested count of cells with symbol, weight, and change", () => {
    const cells = makeHeatmapCells(6, { seed: 2 })
    expect(cells).toHaveLength(6)
    for (const cell of cells) {
      expect(typeof cell.symbol).toBe("string")
      expect(typeof cell.weight).toBe("number")
      expect(typeof cell.change).toBe("number")
    }
  })
})

describe("makeSeries", () => {
  it("is deterministic for the same seed", () => {
    expect(makeSeries(30, { seed: 1 })).toEqual(makeSeries(30, { seed: 1 }))
  })
  it("returns the requested count of numbers", () => {
    const series = makeSeries(30, { seed: 1 })
    expect(series).toHaveLength(30)
    for (const n of series) {
      expect(typeof n).toBe("number")
      expect(Number.isNaN(n)).toBe(false)
    }
  })
})

describe("formatTradeTime", () => {
  it("formats as HH:mm:ss UTC", () => {
    expect(formatTradeTime(Date.parse("2026-06-04T15:30:45Z"))).toBe("15:30:45")
  })
})

describe("volumeProfileGeometry", () => {
  it("returns one bar per bin with numeric geometry", () => {
    const bars = volumeProfileGeometry(makeCandles(20, { seed: 3 }), {
      width: 100,
      height: 200,
      bins: 8,
    })
    expect(bars).toHaveLength(8)
    for (const bar of bars) {
      expect(typeof bar.price).toBe("number")
      expect(typeof bar.volume).toBe("number")
      expect(typeof bar.width).toBe("number")
      expect(bar.width).toBeGreaterThanOrEqual(0)
      expect(bar.width).toBeLessThanOrEqual(100)
    }
  })

  it("returns an empty array for no candles", () => {
    expect(volumeProfileGeometry([], { width: 100, height: 200 })).toEqual([])
  })
})

describe("volumeProfilePocIndex", () => {
  it("returns the index of the highest-volume bar", () => {
    const bars = volumeProfileGeometry(makeCandles(20, { seed: 4 }), {
      width: 100,
      height: 200,
      bins: 6,
    })
    const index = volumeProfilePocIndex(bars)
    expect(index).toBeGreaterThanOrEqual(0)
    expect(bars[index].volume).toBe(Math.max(...bars.map((b) => b.volume)))
  })

  it("returns -1 for empty bars", () => {
    expect(volumeProfilePocIndex([])).toBe(-1)
  })
})

describe("makeTimeAndSalesRows", () => {
  it("is deterministic for the same seed", () => {
    expect(makeTimeAndSalesRows(10, { seed: 2 })).toEqual(
      makeTimeAndSalesRows(10, { seed: 2 }),
    )
  })

  it("returns rows with side, price, size, and time", () => {
    const rows = makeTimeAndSalesRows(6, { seed: 2 })
    expect(rows).toHaveLength(6)
    for (const row of rows) {
      expect(row.side === "buy" || row.side === "sell").toBe(true)
      expect(typeof row.price).toBe("number")
      expect(typeof row.size).toBe("number")
      expect(typeof row.time).toBe("number")
    }
  })
})

describe("makeSymbolStats", () => {
  it("is deterministic for the same seed", () => {
    expect(makeSymbolStats({ seed: 5 })).toEqual(makeSymbolStats({ seed: 5 }))
  })

  it("returns grouped stat rows for each tab", () => {
    const stats = makeSymbolStats({ seed: 5 })
    expect(stats.overview.length).toBeGreaterThan(0)
    expect(stats.financials.length).toBeGreaterThan(0)
    expect(stats.statistics.length).toBeGreaterThan(0)
    expect(typeof stats.exchange).toBe("string")
    expect(typeof stats.quote.symbol).toBe("string")
  })
})
