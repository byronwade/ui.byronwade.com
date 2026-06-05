import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { ChartLayoutGrid } from "@/components/chart-layout-grid"
import { ChartPanel } from "@/components/chart-panel"

describe("ChartLayoutGrid", () => {
  it("renders panel slots for a 1x2 layout", () => {
    const { container } = render(
      <ChartLayoutGrid layout="1x2">
        <ChartPanel symbol="AAPL" />
        <ChartPanel symbol="MSFT" />
        <ChartPanel symbol="NVDA" />
      </ChartLayoutGrid>,
    )
    expect(container.querySelectorAll('[data-slot="chart-layout-grid-panel"]')).toHaveLength(2)
    expect(container.querySelector('[data-layout="1x2"]')).toBeInTheDocument()
  })

  it("renders up to four panels for a 2x2 layout", () => {
    const { container } = render(
      <ChartLayoutGrid layout="2x2">
        <ChartPanel symbol="AAPL" />
        <ChartPanel symbol="MSFT" />
        <ChartPanel symbol="NVDA" />
        <ChartPanel symbol="TSLA" />
        <ChartPanel symbol="AMZN" />
      </ChartLayoutGrid>,
    )
    expect(container.querySelectorAll('[data-slot="chart-layout-grid-panel"]')).toHaveLength(4)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ChartLayoutGrid>
        <ChartPanel symbol="AAPL" />
        <ChartPanel symbol="MSFT" />
      </ChartLayoutGrid>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
