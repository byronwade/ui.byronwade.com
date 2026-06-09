import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ScreenerTable } from "@/components/screener-table"
import type { ScreenerRow } from "@/lib/market"

const rows: ScreenerRow[] = [
  {
    symbol: "AAPL",
    price: 200,
    change: 2,
    changePercent: 1,
    volume: 1000,
    marketCap: 2_000_000,
    spark: [1, 2, 3],
  },
  {
    symbol: "TSLA",
    price: 180,
    change: -4,
    changePercent: -2,
    volume: 2000,
    marketCap: 800_000,
    spark: [3, 2, 1],
  },
]

describe("ScreenerTable", () => {
  it("renders a row per screener entry", () => {
    const { container } = render(<ScreenerTable rows={rows} />)
    expect(container.querySelectorAll("[data-slot='index-table-row']")).toHaveLength(2)
  })

  it("narrows rows when the Gainers filter is selected", async () => {
    const user = userEvent.setup()
    render(<ScreenerTable rows={rows} />)
    await user.click(screen.getByRole("tab", { name: "Gainers" }))
    expect(screen.getByText("AAPL")).toBeInTheDocument()
    expect(screen.queryByText("TSLA")).not.toBeInTheDocument()
  })

  it("narrows rows when the Losers filter is selected", async () => {
    const user = userEvent.setup()
    render(<ScreenerTable rows={rows} />)
    await user.click(screen.getByRole("tab", { name: "Losers" }))
    expect(screen.getByText("TSLA")).toBeInTheDocument()
    expect(screen.queryByText("AAPL")).not.toBeInTheDocument()
  })

  it("calls onViewChange when a filter view is selected", async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    render(<ScreenerTable rows={rows} onViewChange={onViewChange} />)
    await user.click(screen.getByRole("tab", { name: "Losers" }))
    expect(onViewChange).toHaveBeenCalledWith("losers")
  })

  it("calls onSortChange when a sortable header is clicked", async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(<ScreenerTable rows={rows} onSortChange={onSortChange} />)
    await user.click(screen.getByRole("button", { name: "Sort by price" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "price", direction: "asc" })
  })

  it("calls onSelect when a row is clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ScreenerTable rows={rows} onSelect={onSelect} />)
    await user.click(screen.getByText("TSLA"))
    expect(onSelect).toHaveBeenCalledWith("TSLA")
  })

  it("shows change tone via price-change", () => {
    const { container } = render(<ScreenerTable rows={rows} />)
    expect(container.querySelector('[data-direction="down"]')).not.toBeNull()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ScreenerTable rows={rows} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
