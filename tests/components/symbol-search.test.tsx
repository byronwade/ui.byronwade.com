import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { SymbolSearch } from "@/components/symbol-search"
import type { Quote } from "@/lib/market"

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub)
  Element.prototype.scrollIntoView = vi.fn()
})

afterAll(() => {
  vi.unstubAllGlobals()
})

const symbols: Quote[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 200,
    change: 2,
    changePercent: 1,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 180,
    change: -3,
    changePercent: -1.5,
  },
]

describe("SymbolSearch", () => {
  it("renders grouped results", () => {
    render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
      />,
    )
    expect(screen.getByText("Stocks")).toBeInTheDocument()
    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0)
    expect(screen.getAllByText("TSLA").length).toBeGreaterThan(0)
  })

  it("filters results when typing in the search input", async () => {
    const user = userEvent.setup()
    render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
      />,
    )
    await user.type(screen.getByPlaceholderText("Search symbols…"), "AAPL")
    await waitFor(() => {
      expect(screen.queryByText("TSLA")).not.toBeInTheDocument()
    })
    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0)
  })

  it("shows empty state for no matches", async () => {
    const user = userEvent.setup()
    render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
      />,
    )
    await user.type(screen.getByPlaceholderText("Search symbols…"), "zzzz")
    expect(await screen.findByText("No symbols found.")).toBeInTheDocument()
  })

  it("calls onSelect with the symbol", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
        onSelect={onSelect}
      />,
    )
    await user.click(screen.getByRole("option", { name: /Apple Inc\./i }))
    expect(onSelect).toHaveBeenCalledWith("AAPL")
  })

  it("uses cmdk selected styling on command items", () => {
    const { container } = render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
      />,
    )
    const item = container.querySelector("[data-slot='command-item']")
    expect(item?.className).toContain("data-[selected=true]:bg-muted")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SymbolSearch
        symbols={symbols}
        groups={[{ label: "Stocks", symbols }]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
