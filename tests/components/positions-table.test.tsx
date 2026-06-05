import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { PositionsTable } from "@/components/positions-table"
import type { Position } from "@/lib/market"

const positions: Position[] = [
  {
    symbol: "AAPL",
    side: "long",
    size: 10,
    entry: 180,
    mark: 190,
    pnl: 100,
    pnlPercent: 5.5,
  },
  {
    symbol: "TSLA",
    side: "short",
    size: 5,
    entry: 240,
    mark: 250,
    pnl: -50,
    pnlPercent: -4.1,
  },
]

describe("PositionsTable", () => {
  it("renders a row per position", () => {
    const { container } = render(<PositionsTable positions={positions} />)
    expect(container.querySelectorAll('[data-slot="position-row"]')).toHaveLength(2)
  })

  it("applies side badge tones", () => {
    render(<PositionsTable positions={positions} />)
    expect(screen.getByText("long")).toHaveClass("text-success")
    expect(screen.getByText("short")).toHaveClass("text-destructive")
  })

  it("shows aggregate footer by default", () => {
    render(<PositionsTable positions={positions} />)
    expect(screen.getByText("Total unrealized P&L")).toBeInTheDocument()
    expect(screen.getByText("$50.00")).toBeInTheDocument()
  })

  it("hides footer when showFooter is false", () => {
    render(<PositionsTable positions={positions} showFooter={false} />)
    expect(screen.queryByText("Total unrealized P&L")).not.toBeInTheDocument()
  })

  it("calls onSelect with the row symbol", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<PositionsTable positions={positions} onSelect={onSelect} />)
    await user.click(screen.getByText("TSLA"))
    expect(onSelect).toHaveBeenCalledWith("TSLA")
  })

  it("calls onClose without triggering row select", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSelect = vi.fn()
    render(
      <PositionsTable positions={positions} onClose={onClose} onSelect={onSelect} />,
    )
    const closeButtons = screen.getAllByRole("button", { name: "Close" })
    await user.click(closeButtons[0])
    expect(onClose).toHaveBeenCalledWith("AAPL")
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<PositionsTable positions={positions} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
