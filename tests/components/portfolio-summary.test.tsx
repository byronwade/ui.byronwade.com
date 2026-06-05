import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { PortfolioSummary } from "@/components/portfolio-summary"

describe("PortfolioSummary", () => {
  it("renders total value and day change", () => {
    render(
      <PortfolioSummary
        totalValue={100000}
        dayChange={500}
        dayChangePercent={0.5}
        spark={[1, 2, 3]}
      />,
    )
    expect(screen.getByText("Portfolio value")).toBeInTheDocument()
    expect(screen.getByText("$100,000.00")).toBeInTheDocument()
    expect(screen.getByText(/500/)).toBeInTheDocument()
  })

  it("renders the sparkline when spark data is provided", () => {
    const { container } = render(
      <PortfolioSummary spark={[1, 2, 3, 4]} allocations={[]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeNull()
  })

  it("renders one allocation bar per entry", () => {
    const { container } = render(
      <PortfolioSummary
        spark={[1, 2, 3]}
        allocations={[
          { label: "Equities", percent: 60 },
          { label: "Cash", percent: 40 },
        ]}
      />,
    )
    expect(
      container.querySelectorAll('[data-slot="portfolio-summary-allocation-bar"]'),
    ).toHaveLength(2)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PortfolioSummary spark={[1, 2, 3]} allocations={[]} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
