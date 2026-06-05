import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { IndicatorLegend } from "@/components/indicator-legend"

const indicators = [
  { id: "ma-20", name: "MA 20", visible: true, tone: "chart-1" as const },
  { id: "rsi", name: "RSI 14", visible: false, tone: "chart-3" as const },
]

describe("IndicatorLegend", () => {
  it("renders a row per indicator", () => {
    const { container } = render(<IndicatorLegend indicators={indicators} />)
    expect(container.querySelectorAll('[data-slot="indicator-legend-row"]')).toHaveLength(2)
  })

  it("marks hidden indicators", () => {
    render(<IndicatorLegend indicators={indicators} />)
    expect(screen.getByText("hidden")).toBeInTheDocument()
  })

  it("calls onToggleVisibility when a switch changes", async () => {
    const user = userEvent.setup()
    const onToggleVisibility = vi.fn()
    render(
      <IndicatorLegend indicators={indicators} onToggleVisibility={onToggleVisibility} />,
    )
    await user.click(screen.getByRole("switch", { name: "Toggle RSI 14 visibility" }))
    expect(onToggleVisibility).toHaveBeenCalledWith("rsi", true)
  })

  it("calls onRemove when delete is clicked", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<IndicatorLegend indicators={indicators} onRemove={onRemove} />)
    await user.click(screen.getByRole("button", { name: "Remove MA 20" }))
    expect(onRemove).toHaveBeenCalledWith("ma-20")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<IndicatorLegend indicators={indicators} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
