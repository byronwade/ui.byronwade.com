/**
 * Tests for <LightweightChart /> (components/ui/lightweight-chart.tsx).
 * Lightweight Charts is canvas-based — we mock createChart and assert mount,
 * props wiring, chart types, fill mode shell, and a11y on the wrapper.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LightweightChart } from "@/components/ui/lightweight-chart"
import type { Candle } from "@/lib/market"

const mocks = vi.hoisted(() => {
  const setData = vi.fn()
  const applyOptions = vi.fn()
  const fitContent = vi.fn()
  const remove = vi.fn()
  const addSeries = vi.fn(() => ({ setData, applyOptions }))
  const createChart = vi.fn(() => ({
    addSeries,
    applyOptions,
    remove,
    priceScale: vi.fn(() => ({ applyOptions: vi.fn() })),
    timeScale: vi.fn(() => ({ fitContent })),
  }))

  return { setData, applyOptions, fitContent, remove, addSeries, createChart }
})

vi.mock("lightweight-charts", () => ({
  createChart: mocks.createChart,
  CandlestickSeries: "CandlestickSeries",
  LineSeries: "LineSeries",
  AreaSeries: "AreaSeries",
  HistogramSeries: "HistogramSeries",
  ColorType: { Solid: "solid" },
  CrosshairMode: { Normal: 0 },
}))

const { setData, applyOptions, fitContent, remove, addSeries, createChart } = mocks

const candle = (over: Partial<Candle>): Candle => ({
  time: 1_700_000_000_000,
  open: 100,
  high: 110,
  low: 90,
  close: 105,
  volume: 1_000_000,
  ...over,
})

const twoCandles: Candle[] = [
  candle({ time: 1_700_000_000_000, open: 100, close: 110, high: 112, low: 98 }),
  candle({
    time: 1_700_000_060_000,
    open: 110,
    close: 100,
    high: 112,
    low: 98,
  }),
]

describe("LightweightChart", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 480,
      height: 280,
      top: 0,
      left: 0,
      right: 480,
      bottom: 280,
      toJSON: () => ({}),
    } as DOMRect)
  })

  it("renders the lightweight-chart root with role=img", () => {
    const { container } = render(<LightweightChart data={twoCandles} />)
    const root = container.querySelector('[data-slot="lightweight-chart"]')
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("role", "img")
  })

  it("creates a chart on mount", () => {
    render(<LightweightChart data={twoCandles} />)
    expect(createChart).toHaveBeenCalledTimes(1)
    expect(addSeries).toHaveBeenCalled()
    expect(setData).toHaveBeenCalled()
    expect(fitContent).toHaveBeenCalled()
  })

  it("adds a candlestick series by default", () => {
    render(<LightweightChart data={twoCandles} chartType="candles" />)
    expect(addSeries).toHaveBeenCalledWith(
      "CandlestickSeries",
      expect.objectContaining({
        upColor: expect.any(String),
        downColor: expect.any(String),
      }),
    )
  })

  it("adds a line series for chartType=line", () => {
    render(<LightweightChart data={twoCandles} chartType="line" />)
    expect(addSeries).toHaveBeenCalledWith(
      "LineSeries",
      expect.objectContaining({ color: expect.any(String) }),
    )
  })

  it("adds an area series for chartType=area", () => {
    render(<LightweightChart data={twoCandles} chartType="area" />)
    expect(addSeries).toHaveBeenCalledWith(
      "AreaSeries",
      expect.objectContaining({
        lineColor: expect.any(String),
        topColor: expect.any(String),
        bottomColor: expect.any(String),
      }),
    )
  })

  it("adds a volume histogram when showVolume is true on candles", () => {
    render(
      <LightweightChart data={twoCandles} chartType="candles" showVolume />,
    )
    expect(addSeries).toHaveBeenCalledWith(
      "HistogramSeries",
      expect.objectContaining({ priceScaleId: "" }),
    )
  })

  it("omits volume histogram when showVolume is false", () => {
    render(
      <LightweightChart
        data={twoCandles}
        chartType="candles"
        showVolume={false}
      />,
    )
    expect(addSeries).not.toHaveBeenCalledWith(
      "HistogramSeries",
      expect.anything(),
    )
  })

  it("uses fill classes when fill is true", () => {
    const { container } = render(
      <LightweightChart data={twoCandles} fill aria-label="Fill chart" />,
    )
    const root = container.querySelector('[data-slot="lightweight-chart"]')
    expect(root).toHaveClass("h-full")
    expect(root).toHaveClass("min-h-60")
    expect(createChart).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ autoSize: true }),
    )
  })

  it("passes explicit width and height when fill is false", () => {
    render(
      <LightweightChart data={twoCandles} width={640} height={360} fill={false} />,
    )
    expect(createChart).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ width: 640, height: 360, autoSize: false }),
    )
  })

  it("cleans up the chart on unmount", () => {
    const { unmount } = render(<LightweightChart data={twoCandles} />)
    unmount()
    expect(remove).toHaveBeenCalledTimes(1)
  })

  it("uses the provided aria-label", () => {
    render(
      <LightweightChart data={twoCandles} aria-label="NVDA pro chart" />,
    )
    expect(screen.getByLabelText("NVDA pro chart")).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <LightweightChart data={twoCandles} aria-label="Market chart" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
