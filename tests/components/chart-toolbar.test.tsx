import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ChartToolbar } from "@/components/chart-toolbar"

describe("ChartToolbar", () => {
  it("renders the symbol and active interval", () => {
    render(
      <ChartToolbar symbol="aapl" interval="1D" onIntervalChange={() => {}} />,
    )
    expect(screen.getByRole("button", { name: "AAPL" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "1D" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("calls onIntervalChange when another interval is clicked", async () => {
    const user = userEvent.setup()
    const onIntervalChange = vi.fn()
    render(
      <ChartToolbar
        symbol="NVDA"
        interval="1D"
        onIntervalChange={onIntervalChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "1H" }))
    expect(onIntervalChange).toHaveBeenCalledWith("1H")
  })

  it("calls onChartTypeChange when a chart type toggle is clicked", async () => {
    const user = userEvent.setup()
    const onChartTypeChange = vi.fn()
    render(
      <ChartToolbar
        symbol="NVDA"
        interval="1D"
        chartType="candles"
        onChartTypeChange={onChartTypeChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Line chart" }))
    expect(onChartTypeChange).toHaveBeenCalledWith("line")
  })

  it("calls onSymbolClick from the symbol button", async () => {
    const user = userEvent.setup()
    const onSymbolClick = vi.fn()
    render(
      <ChartToolbar
        symbol="TSLA"
        interval="1D"
        onSymbolClick={onSymbolClick}
      />,
    )
    await user.click(screen.getByRole("button", { name: "TSLA" }))
    expect(onSymbolClick).toHaveBeenCalledTimes(1)
  })

  it("calls onIndicatorsClick from the indicators button", async () => {
    const user = userEvent.setup()
    const onIndicatorsClick = vi.fn()
    render(
      <ChartToolbar
        symbol="TSLA"
        interval="1D"
        onIndicatorsClick={onIndicatorsClick}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Indicators" }))
    expect(onIndicatorsClick).toHaveBeenCalledTimes(1)
  })

  it("renders custom intervals", () => {
    render(
      <ChartToolbar
        symbol="MSFT"
        interval="4H"
        intervals={["1H", "4H", "1D"]}
      />,
    )
    expect(screen.getByRole("button", { name: "4H" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "1H" })).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ChartToolbar symbol="MSFT" interval="1D" onIntervalChange={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
