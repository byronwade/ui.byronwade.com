/**
 * Tests for <HeatmapGrid /> (components/ui/heatmap-grid.tsx). Covers cell count,
 * success/destructive tone buckets by change sign and magnitude, chart scale classes,
 * cell selection callback, and a11y.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"

import { HeatmapGrid } from "@/components/ui/heatmap-grid"
import type { HeatmapCell } from "@/lib/market"

const cells: HeatmapCell[] = [
  { symbol: "AAPL", weight: 2, change: 0.4 },
  { symbol: "MSFT", weight: 1.5, change: -0.6 },
  { symbol: "NVDA", weight: 3, change: 4.2 },
  { symbol: "TSLA", weight: 1, change: -5.1 },
]

describe("HeatmapGrid", () => {
  it("renders one cell per entry", () => {
    const { container } = render(<HeatmapGrid cells={cells} />)
    expect(container.querySelectorAll('[data-slot="heatmap-cell"]')).toHaveLength(
      cells.length,
    )
  })

  it("tones positive cells with success and negative cells with destructive", () => {
    const { container } = render(<HeatmapGrid cells={cells} scale="tone" />)
    const aapl = container.querySelector('[data-symbol="AAPL"]')
    const msft = container.querySelector('[data-symbol="MSFT"]')
    expect(aapl).toHaveClass("text-success")
    expect(msft).toHaveClass("text-destructive")
  })

  it("uses lighter opacity for small changes and stronger opacity for large changes", () => {
    const { container } = render(<HeatmapGrid cells={cells} scale="tone" />)
    const small = container.querySelector('[data-symbol="AAPL"]')
    const large = container.querySelector('[data-symbol="NVDA"]')
    expect(small!.className).toMatch(/success\/10/)
    expect(large!.className).toMatch(/success\/30/)
  })

  it('uses chart ramp classes when scale is "chart"', () => {
    const { container } = render(<HeatmapGrid cells={cells} scale="chart" />)
    const nvda = container.querySelector('[data-symbol="NVDA"]')
    expect(nvda!.className).toMatch(/bg-chart-/)
  })

  it("tones flat cells with muted when change is zero", () => {
    const { container } = render(
      <HeatmapGrid
        cells={[{ symbol: "META", weight: 1, change: 0 }]}
        scale="tone"
      />,
    )
    expect(container.querySelector('[data-symbol="META"]')).toHaveClass(
      "text-muted-foreground",
    )
  })

  it("calls onSelect with the cell symbol when clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<HeatmapGrid cells={cells.slice(0, 1)} onSelect={onSelect} />)
    await user.click(screen.getByLabelText(/AAPL/i))
    expect(onSelect).toHaveBeenCalledWith("AAPL")
  })

  it("renders with seeded defaults when no cells are provided", () => {
    const { container } = render(<HeatmapGrid />)
    expect(container.querySelectorAll('[data-slot="heatmap-cell"]').length).toBeGreaterThan(
      0,
    )
  })

  it("has no axe violations", async () => {
    const { container } = render(<HeatmapGrid cells={cells} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
