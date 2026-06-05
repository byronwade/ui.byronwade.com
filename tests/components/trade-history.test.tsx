import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { TradeHistory } from "@/components/trade-history"
import type { Trade } from "@/lib/market"

const trades: Trade[] = [
  {
    id: "t-1",
    symbol: "AAPL",
    time: Date.parse("2026-06-04T15:30:45Z"),
    side: "buy",
    price: 100,
    size: 2,
  },
  {
    id: "t-2",
    symbol: "TSLA",
    time: Date.parse("2026-06-04T14:00:00Z"),
    side: "sell",
    price: 200,
    size: 1,
  },
]

describe("TradeHistory", () => {
  it("renders a row per trade", () => {
    const { container } = render(<TradeHistory trades={trades} />)
    expect(container.querySelectorAll('[data-slot="trade-row"]')).toHaveLength(2)
  })

  it("applies buy and sell badge tones", () => {
    render(<TradeHistory trades={trades} />)
    expect(screen.getByText("buy")).toHaveClass("text-success")
    expect(screen.getByText("sell")).toHaveClass("text-destructive")
  })

  it("shows computed trade value", () => {
    render(<TradeHistory trades={trades} />)
    expect(screen.getAllByText("$200.00").length).toBeGreaterThan(0)
    expect(screen.getByText("$100.00")).toBeInTheDocument()
  })

  it("renders relative-time display for each trade", () => {
    const { container } = render(<TradeHistory trades={trades} />)
    expect(
      container.querySelectorAll('[data-slot="relative-time-zone-display"]'),
    ).toHaveLength(2)
  })

  it("calls onSelect with the trade id", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TradeHistory trades={trades} onSelect={onSelect} />)
    await user.click(screen.getByText("TSLA"))
    expect(onSelect).toHaveBeenCalledWith("t-2")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TradeHistory trades={trades} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
