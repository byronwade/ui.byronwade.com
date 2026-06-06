import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { SessionStatsBar } from "@/components/session-stats-bar"

const candle = {
  time: 0,
  open: 100,
  high: 105,
  low: 98,
  close: 103,
  volume: 1_250_000,
}

describe("SessionStatsBar", () => {
  it("renders OHLCV stats", () => {
    render(<SessionStatsBar candle={candle} />)
    expect(screen.getByText("O")).toBeInTheDocument()
    expect(screen.getByText("H")).toBeInTheDocument()
    expect(screen.getByText("L")).toBeInTheDocument()
    expect(screen.getByText("C")).toBeInTheDocument()
    expect(screen.getByText("V")).toBeInTheDocument()
  })

  it("renders optional symbol label", () => {
    render(<SessionStatsBar candle={candle} symbol="AAPL" />)
    expect(screen.getByText("AAPL")).toBeInTheDocument()
  })

  it("tones close up when close >= open", () => {
    const { container } = render(<SessionStatsBar candle={candle} />)
    const close = container.querySelector('[data-label="C"] span:last-child')
    expect(close).toHaveClass("text-success")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SessionStatsBar candle={candle} symbol="AAPL" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
