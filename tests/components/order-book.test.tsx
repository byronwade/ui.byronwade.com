/**
 * Tests for <OrderBook /> (components/ui/order-book.tsx). Covers row counts,
 * bid/ask side attributes, spread row, row-click callback, both layouts, depth
 * limiting, and a11y.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"

import { OrderBook } from "@/components/ui/order-book"
import type { OrderBookLevel } from "@/lib/market"

const bids: OrderBookLevel[] = [
  { price: 99.95, size: 120 },
  { price: 99.9, size: 80 },
  { price: 99.85, size: 200 },
  { price: 99.8, size: 50 },
]

const asks: OrderBookLevel[] = [
  { price: 100.05, size: 140 },
  { price: 100.1, size: 60 },
  { price: 100.15, size: 220 },
  { price: 100.2, size: 90 },
]

describe("OrderBook", () => {
  it("renders the root with data-slot order-book", () => {
    const { container } = render(<OrderBook bids={bids} asks={asks} />)
    expect(container.querySelector('[data-slot="order-book"]')).not.toBeNull()
  })

  it("renders depth rows per side by default", () => {
    const { container } = render(
      <OrderBook bids={bids} asks={asks} depth={3} />,
    )
    expect(container.querySelectorAll('[data-side="bid"]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-side="ask"]')).toHaveLength(3)
  })

  it("marks bid rows with data-side=bid and ask rows with data-side=ask", () => {
    const { container } = render(
      <OrderBook bids={bids.slice(0, 1)} asks={asks.slice(0, 1)} />,
    )
    const bid = container.querySelector('[data-side="bid"]')
    const ask = container.querySelector('[data-side="ask"]')
    expect(bid).not.toBeNull()
    expect(ask).not.toBeNull()
    expect(bid!.querySelector('[data-slot="order-book-depth-bar"]')).toHaveClass(
      "bg-success/10",
    )
    expect(ask!.querySelector('[data-slot="order-book-depth-bar"]')).toHaveClass(
      "bg-destructive/10",
    )
  })

  it("renders the spread row with the computed spread when omitted", () => {
    render(<OrderBook bids={bids} asks={asks} />)
    const spread = screen.getByText("Spread").closest('[data-slot="order-book-spread"]')
    expect(spread).not.toBeNull()
    expect(spread).toHaveTextContent("0.10")
  })

  it("uses the provided spread prop when given", () => {
    render(<OrderBook bids={bids} asks={asks} spread={0.25} />)
    const spread = screen.getByText("Spread").closest('[data-slot="order-book-spread"]')
    expect(spread).toHaveTextContent("0.25")
  })

  it("renders zero spread when one side is empty", () => {
    render(<OrderBook bids={[]} asks={asks.slice(0, 1)} />)
    const spread = screen.getByText("Spread").closest('[data-slot="order-book-spread"]')
    expect(spread).toHaveTextContent("0.00")
  })

  it("handles a zero-size book row without crashing", () => {
    const { container } = render(
      <OrderBook
        bids={[{ price: 99.5, size: 0 }]}
        asks={[{ price: 100.5, size: 0 }]}
      />,
    )
    expect(container.querySelectorAll('[data-slot="order-book-row"]')).toHaveLength(2)
  })

  it("calls onSelectPrice with the clicked row price", async () => {
    const user = userEvent.setup()
    const onSelectPrice = vi.fn()
    render(
      <OrderBook
        bids={bids.slice(0, 1)}
        asks={asks.slice(0, 1)}
        onSelectPrice={onSelectPrice}
      />,
    )
    await user.click(screen.getByLabelText(/bid 99\.95/i))
    expect(onSelectPrice).toHaveBeenCalledWith(99.95)
    await user.click(screen.getByLabelText(/ask 100\.05/i))
    expect(onSelectPrice).toHaveBeenCalledWith(100.05)
  })

  it("supports the split layout", () => {
    const { container } = render(
      <OrderBook bids={bids} asks={asks} layout="split" />,
    )
    const root = container.querySelector('[data-slot="order-book"]')
    expect(root).toHaveAttribute("data-layout", "split")
    expect(root).toHaveClass("flex-row")
  })

  it("supports the vertical layout", () => {
    const { container } = render(
      <OrderBook bids={bids} asks={asks} layout="vertical" />,
    )
    const root = container.querySelector('[data-slot="order-book"]')
    expect(root).toHaveAttribute("data-layout", "vertical")
    expect(root).toHaveClass("flex-col")
  })

  it("limits rows with the depth prop", () => {
    const { container } = render(
      <OrderBook bids={bids} asks={asks} depth={2} />,
    )
    expect(container.querySelectorAll('[data-slot="order-book-row"]')).toHaveLength(
      4,
    )
  })

  it("renders with seeded defaults when no book is provided", () => {
    const { container } = render(<OrderBook depth={4} />)
    expect(container.querySelectorAll('[data-side="bid"]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-side="ask"]')).toHaveLength(4)
  })

  it("has no axe violations", async () => {
    const { container } = render(<OrderBook bids={bids} asks={asks} depth={3} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
