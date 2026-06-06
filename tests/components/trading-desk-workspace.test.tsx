import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TradingDeskWorkspace } from "@/app/layouts/_components/trading-desk-workspace"

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

  return { createChart }
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

describe("TradingDeskWorkspace", () => {
  beforeEach(() => {
    class ResizeObserverMock {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }

    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: ResizeObserverMock,
    })

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it("uses one integrated top header for chart controls and market status", () => {
    const { container } = render(<TradingDeskWorkspace />)

    const headers = container.querySelectorAll(
      '[data-slot="trading-desk-header"]',
    )
    expect(headers).toHaveLength(1)

    const header = headers[0] as HTMLElement
    expect(within(header).getByRole("button", { name: "AAPL" })).toBeVisible()
    expect(within(header).getByText("Unnamed")).toBeVisible()

    expect(
      container.querySelector('[data-slot="trading-desk-market-strip"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="trading-desk-header-status"]'),
    ).toBeNull()
    expect(screen.getByText("SMART route")).toBeVisible()
    expect(screen.getByText(/Spread/)).toBeVisible()
    expect(screen.getByLabelText("AAPL candles chart")).toBeVisible()
  })

  it("uses a dedicated chart rail and keeps the footer focused on timeline controls", () => {
    const { container } = render(<TradingDeskWorkspace />)

    const leftRail = container.querySelector(
      '[data-slot="trading-desk-left-rail"]',
    )
    const footer = container.querySelector('[data-slot="trading-desk-footer"]')

    expect(leftRail).toBeInstanceOf(HTMLElement)
    expect(leftRail).toHaveClass("bg-card")
    expect(leftRail).toHaveClass("w-12")
    expect(within(leftRail as HTMLElement).getByLabelText("Crosshair")).toBeVisible()
    expect(
      within(leftRail as HTMLElement).getByLabelText("Drawing tools"),
    ).toBeVisible()

    expect(footer).toBeInstanceOf(HTMLElement)
    expect(footer).toHaveClass("h-9")
    expect(footer).toHaveClass("bg-card/80")
    expect(footer).toHaveClass("overflow-x-auto")
    expect(
      within(footer as HTMLElement).queryByText("Compare"),
    ).not.toBeInTheDocument()
    expect(within(footer as HTMLElement).getByText("UTC")).toBeVisible()

    const replay = within(footer as HTMLElement)
      .getByLabelText("Play replay")
      .closest('[data-slot="replay-controls"]')
    expect(replay).toHaveClass("rounded-none")
    expect(replay).toHaveClass("border-0")
    expect(replay).toHaveClass("bg-transparent")
  })
})
