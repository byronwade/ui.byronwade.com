import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { MarketDepth } from "@/components/market-depth"
import type { OrderBookLevel } from "@/lib/market"

const bids: OrderBookLevel[] = [{ price: 99.95, size: 100 }]
const asks: OrderBookLevel[] = [{ price: 100.05, size: 120 }]

describe("MarketDepth", () => {
  it("renders both depth chart and order book by default", () => {
    const { container } = render(<MarketDepth bids={bids} asks={asks} />)
    expect(container.querySelector('[data-slot="depth-chart"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="order-book"]')).not.toBeNull()
  })

  it('renders only the order book when view="book"', () => {
    const { container } = render(
      <MarketDepth bids={bids} asks={asks} view="book" />,
    )
    expect(container.querySelector('[data-slot="depth-chart"]')).toBeNull()
    expect(container.querySelector('[data-slot="order-book"]')).not.toBeNull()
  })

  it('renders only the depth chart when view="chart"', () => {
    const { container } = render(
      <MarketDepth bids={bids} asks={asks} view="chart" />,
    )
    expect(container.querySelector('[data-slot="depth-chart"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="order-book"]')).toBeNull()
  })

  it("passes onSelectPrice through to the order book", async () => {
    const user = userEvent.setup()
    const onSelectPrice = vi.fn()
    const { container } = render(
      <MarketDepth bids={bids} asks={asks} onSelectPrice={onSelectPrice} />,
    )
    const row = container.querySelector('[data-side="bid"]') as HTMLElement
    await user.click(row)
    expect(onSelectPrice).toHaveBeenCalledWith(99.95)
  })

  it("passes depth through to the order book", () => {
    const manyBids = Array.from({ length: 6 }, (_, index) => ({
      price: 99.9 - index * 0.05,
      size: 50,
    }))
    const manyAsks = Array.from({ length: 6 }, (_, index) => ({
      price: 100.1 + index * 0.05,
      size: 50,
    }))
    const { container } = render(
      <MarketDepth bids={manyBids} asks={manyAsks} depth={2} />,
    )
    expect(container.querySelectorAll('[data-side="bid"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-side="ask"]')).toHaveLength(2)
  })

  it("renders a panel header, summary metrics, and footer content", () => {
    render(
      <MarketDepth
        bids={bids}
        asks={asks}
        title="Level 2"
        symbol="AAPL"
        description="Nasdaq full book"
        metrics={[
          { label: "Bid size", value: "100", tone: "positive" },
          { label: "Ask size", value: "120", tone: "negative" },
        ]}
        footer={<span>Live feed</span>}
      />,
    )

    expect(screen.getByText("Level 2")).toBeInTheDocument()
    expect(screen.getByText("AAPL")).toBeInTheDocument()
    expect(screen.getByText("Nasdaq full book")).toBeInTheDocument()
    expect(screen.getByText("Bid size")).toBeInTheDocument()
    expect(screen.getByText("Ask size")).toBeInTheDocument()
    expect(screen.getByText("Live feed")).toBeInTheDocument()
  })

  it("supports split layout, size, density, and chart height variants", () => {
    const { container } = render(
      <MarketDepth
        bids={bids}
        asks={asks}
        layout="split"
        size="lg"
        density="compact"
        chartHeight={140}
        bookLayout="split"
      />,
    )

    const root = container.querySelector('[data-slot="market-depth"]')
    const chart = container.querySelector('[data-slot="depth-chart"]')
    const book = container.querySelector('[data-slot="order-book"]')

    expect(root).toHaveAttribute("data-layout", "split")
    expect(root).toHaveAttribute("data-size", "lg")
    expect(root).toHaveAttribute("data-density", "compact")
    expect(chart).toHaveAttribute("height", "140")
    expect(book).toHaveAttribute("data-layout", "split")
  })

  it("renders an empty state when both sides are empty", () => {
    render(<MarketDepth bids={[]} asks={[]} empty="No depth available" />)
    expect(screen.getByText("No depth available")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<MarketDepth bids={bids} asks={asks} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
