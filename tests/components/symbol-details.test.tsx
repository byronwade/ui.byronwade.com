import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { SymbolDetails } from "@/components/symbol-details"
import { makeSymbolStats } from "@/lib/market"

const stats = makeSymbolStats({ seed: 1 })

describe("SymbolDetails", () => {
  it("renders quote header and exchange metadata", () => {
    render(<SymbolDetails stats={stats} />)
    expect(screen.getByText(stats.quote.symbol)).toBeInTheDocument()
    expect(screen.getByText(stats.exchange)).toBeInTheDocument()
    expect(screen.getByText(stats.sector)).toBeInTheDocument()
  })

  it("shows overview metrics by default", () => {
    render(<SymbolDetails stats={stats} />)
    expect(screen.getByText("Market cap")).toBeInTheDocument()
    expect(screen.getByText("Beta")).toBeInTheDocument()
  })

  it("switches to financials tab", async () => {
    const user = userEvent.setup()
    render(<SymbolDetails stats={stats} />)
    await user.click(screen.getByRole("tab", { name: "Financials" }))
    expect(screen.getByText("Revenue (TTM)")).toBeInTheDocument()
    expect(screen.getByText("P/E ratio")).toBeInTheDocument()
  })

  it("switches to statistics tab", async () => {
    const user = userEvent.setup()
    render(<SymbolDetails stats={stats} />)
    await user.click(screen.getByRole("tab", { name: "Statistics" }))
    expect(screen.getByText("Dividend yield")).toBeInTheDocument()
    expect(screen.getByText("52W high")).toBeInTheDocument()
  })

  it("respects defaultTab", () => {
    render(<SymbolDetails stats={stats} defaultTab="financials" />)
    expect(screen.getByText("EPS (TTM)")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SymbolDetails stats={stats} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
