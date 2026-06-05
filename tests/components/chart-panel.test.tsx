import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ChartPanel } from "@/components/chart-panel"
import { makeCandles } from "@/lib/market"

describe("ChartPanel", () => {
  it("renders the toolbar and candlestick chart by default", () => {
    const { container } = render(
      <ChartPanel symbol="AAPL" data={makeCandles(12, { seed: 2 })} />,
    )
    expect(container.querySelector('[data-slot="chart-toolbar"]')).not.toBeNull()
    expect(
      container.querySelector('[data-slot="candlestick-chart"]'),
    ).not.toBeNull()
  })

  it("activates the default 1D interval in uncontrolled mode", () => {
    render(<ChartPanel symbol="AAPL" data={makeCandles(8, { seed: 2 })} />)
    expect(screen.getByRole("button", { name: "1D" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("updates the active interval in uncontrolled mode", async () => {
    const user = userEvent.setup()
    render(<ChartPanel symbol="AAPL" data={makeCandles(8, { seed: 2 })} />)
    await user.click(screen.getByRole("button", { name: "1H" }))
    expect(screen.getByRole("button", { name: "1H" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("calls onIntervalChange in controlled mode and reflects the prop", async () => {
    const user = userEvent.setup()
    const onIntervalChange = vi.fn()
    render(
      <ChartPanel
        symbol="AAPL"
        interval="5m"
        onIntervalChange={onIntervalChange}
        data={makeCandles(8, { seed: 2 })}
      />,
    )
    expect(screen.getByRole("button", { name: "5m" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    await user.click(screen.getByRole("button", { name: "1D" }))
    expect(onIntervalChange).toHaveBeenCalledWith("1D")
  })

  it("switches to sparkline when chart type is line", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ChartPanel symbol="AAPL" data={makeCandles(8, { seed: 2 })} />,
    )
    await user.click(screen.getByRole("button", { name: "Line chart" }))
    expect(
      container.querySelector('[data-slot="candlestick-chart"]'),
    ).toBeNull()
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeNull()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ChartPanel symbol="AAPL" data={makeCandles(8, { seed: 2 })} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
