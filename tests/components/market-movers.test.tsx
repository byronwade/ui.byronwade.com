import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { MarketMovers } from "@/components/market-movers"
import type { MoverRow } from "@/lib/market"

const gainers: MoverRow[] = [
  { symbol: "NVDA", price: 120, changePercent: 4.2, spark: [1, 2, 3] },
  { symbol: "AAPL", price: 200, changePercent: 2.1, spark: [2, 3, 4] },
]

const losers: MoverRow[] = [
  { symbol: "TSLA", price: 180, changePercent: -3.4, spark: [4, 3, 2] },
]

const active: MoverRow[] = [
  { symbol: "META", price: 500, changePercent: 0.8, spark: [1, 3, 2] },
]

describe("MarketMovers", () => {
  it("shows gainer rows on the default tab", () => {
    render(<MarketMovers gainers={gainers} losers={losers} active={active} />)
    expect(screen.getAllByText("NVDA").length).toBeGreaterThan(0)
    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0)
  })

  it("shows loser rows when the Losers tab is selected", async () => {
    const user = userEvent.setup()
    render(<MarketMovers gainers={gainers} losers={losers} active={active} />)
    await user.click(screen.getByRole("tab", { name: "Losers" }))
    expect(screen.getAllByText("TSLA").length).toBeGreaterThan(0)
  })

  it("shows active rows when the Active tab is selected", async () => {
    const user = userEvent.setup()
    render(<MarketMovers gainers={gainers} losers={losers} active={active} />)
    await user.click(screen.getByRole("tab", { name: "Active" }))
    expect(screen.getAllByText("META").length).toBeGreaterThan(0)
  })

  it("calls onSelect with the row symbol", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <MarketMovers gainers={gainers} losers={losers} active={active} onSelect={onSelect} />,
    )
    await user.click(screen.getAllByText("NVDA")[0])
    expect(onSelect).toHaveBeenCalledWith("NVDA")
  })

  it("renders price-change tone per row", () => {
    const { container } = render(
      <MarketMovers gainers={gainers} losers={losers} active={active} />,
    )
    expect(container.querySelector('[data-direction="up"]')).not.toBeNull()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <MarketMovers gainers={gainers} losers={losers} active={active} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
