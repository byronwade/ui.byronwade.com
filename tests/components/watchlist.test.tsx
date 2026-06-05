import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { Watchlist } from "@/components/watchlist"
import { makeQuote } from "@/lib/market"

const items = [
  makeQuote({ seed: 11 }),
  makeQuote({ seed: 12 }),
  makeQuote({ seed: 13 }),
]

describe("Watchlist", () => {
  it("renders a row per item", () => {
    const { container } = render(<Watchlist items={items} />)
    expect(container.querySelectorAll('[data-slot="watchlist-row"]')).toHaveLength(
      items.length,
    )
  })

  it("calls onSelect with the row symbol when clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Watchlist items={items} onSelect={onSelect} />)
    await user.click(screen.getByText(items[1].symbol))
    expect(onSelect).toHaveBeenCalledWith(items[1].symbol)
  })

  it("highlights the selected symbol row", () => {
    const { container } = render(
      <Watchlist items={items} selectedSymbol={items[0].symbol} />,
    )
    const row = container.querySelector(
      `[data-symbol="${items[0].symbol}"]`,
    )
    expect(row).toHaveAttribute("data-selected", "true")
    expect(row).toHaveClass("bg-accent")
  })

  it("hides columns not included in the subset", () => {
    render(<Watchlist items={items} columns={["price"]} />)
    expect(screen.queryByText("Change")).not.toBeInTheDocument()
    expect(screen.queryByText("Volume")).not.toBeInTheDocument()
    expect(screen.getByText("Last")).toBeInTheDocument()
  })

  it("applies dense styling via the dense prop", () => {
    const { container } = render(<Watchlist items={items} dense />)
    expect(container.querySelector('[data-slot="watchlist"]')).toHaveClass(
      "[&_[data-slot=watchlist-row]]:h-8",
    )
  })

  it("shows change tone via price-change", () => {
    const { container } = render(<Watchlist items={items} columns={["change"]} />)
    expect(container.querySelector('[data-slot="price-change"]')).not.toBeNull()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Watchlist items={items} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
