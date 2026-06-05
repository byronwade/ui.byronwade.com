import * as React from "react"
import { render } from "@testing-library/react"
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

  it("has no accessibility violations", async () => {
    const { container } = render(<MarketDepth bids={bids} asks={asks} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
