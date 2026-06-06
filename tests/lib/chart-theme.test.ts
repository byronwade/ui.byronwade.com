/**
 * Tests for chart-theme lib — token bridge + candle series mappers.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import {
  buildLightweightChartTheme,
  candlesToBarData,
  candlesToLineData,
  candlesToVolumeData,
  seriesToLineData,
  withAlpha,
} from "@/lib/chart-theme"
import type { Candle } from "@/lib/market"

const candle = (over: Partial<Candle>): Candle => ({
  time: 1_700_000_000_000,
  open: 100,
  high: 110,
  low: 90,
  close: 105,
  volume: 1_000_000,
  ...over,
})

describe("chart-theme", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () =>
        ({
          fillStyle: "",
          clearRect: vi.fn(),
          fillRect: vi.fn(),
          getImageData: () => ({
            data: Uint8ClampedArray.from([100, 100, 100, 255]),
          }),
        }) as unknown as CanvasRenderingContext2D,
    )

    vi.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        ({
          backgroundColor: "lab(44.338 1.08641 4.47381)",
          getPropertyValue: () => "",
        }) as CSSStyleDeclaration,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("maps candles to UTCTimestamp bar data", () => {
    const data = candlesToBarData([
      candle({ time: 1_700_000_060_000, open: 100, close: 110 }),
    ])
    expect(data[0].time).toBe(1_700_000_060)
    expect(data[0].open).toBe(100)
    expect(data[0].close).toBe(110)
  })

  it("maps candles to line data from close", () => {
    const data = candlesToLineData([candle({ close: 123.45 })])
    expect(data[0].value).toBe(123.45)
  })

  it("maps numeric series to line data with stepped times", () => {
    const data = seriesToLineData([1, 2, 3])
    expect(data).toHaveLength(3)
    expect(data[1].time).toBeGreaterThan(data[0].time)
  })

  it("tones volume bars from theme colors", () => {
    const theme = {
      volumeUpColor: "rgba(0,128,0,0.3)",
      volumeDownColor: "rgba(255,0,0,0.3)",
    }
    const up = candlesToVolumeData([candle({ close: 110, open: 100 })], theme)
    const down = candlesToVolumeData([candle({ close: 90, open: 100 })], theme)
    expect(up[0].color).toBe(theme.volumeUpColor)
    expect(down[0].color).toBe(theme.volumeDownColor)
  })

  it("adds alpha to rgb strings", () => {
    expect(withAlpha("rgb(10, 20, 30)", 0.5)).toBe("rgba(10, 20, 30, 0.5)")
  })

  it("normalizes lab() colors before applying alpha", () => {
    expect(withAlpha("lab(44.338 1.08641 4.47381)", 0.35)).toBe(
      "rgba(100, 100, 100, 0.35)",
    )
  })

  it("builds chart options from resolved tokens", () => {
    const root = document.createElement("div")
    document.body.appendChild(root)
    const theme = buildLightweightChartTheme(root)
    root.remove()
    expect(theme.upColor).toMatch(/^rgb/)
    expect(theme.upColor).not.toMatch(/^lab\(/)
    expect(theme.chartOptions.layout?.background).toBeDefined()
    expect(theme.chartOptions.layout?.attributionLogo).toBe(false)
  })

  it("parses lab() without canvas via the math fallback", () => {
    vi.restoreAllMocks()
    expect(withAlpha("lab(44.338 1.08641 4.47381)", 0.35)).toMatch(
      /^rgba\(\d+, \d+, \d+, 0\.35\)$/,
    )
  })
})
