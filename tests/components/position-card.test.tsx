import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { PositionCard } from "@/components/position-card"
import type { Position } from "@/lib/market"

const position: Position = {
  symbol: "NVDA",
  side: "long",
  size: 25,
  entry: 120,
  mark: 132,
  pnl: 300,
  pnlPercent: 10,
}

describe("PositionCard", () => {
  it("renders symbol, side, size, entry, and mark", () => {
    render(<PositionCard position={position} />)
    expect(screen.getByText("NVDA")).toBeInTheDocument()
    expect(screen.getByText("long")).toBeInTheDocument()
    expect(screen.getByText("25")).toBeInTheDocument()
    expect(screen.getByText("$120.00")).toBeInTheDocument()
    expect(screen.getByText("$132.00")).toBeInTheDocument()
  })

  it("uses success tone for long side badge", () => {
    render(<PositionCard position={position} />)
    expect(screen.getByText("long")).toHaveClass("text-success")
  })

  it("uses destructive tone for short side badge", () => {
    render(
      <PositionCard position={{ ...position, side: "short" }} />,
    )
    expect(screen.getByText("short")).toHaveClass("text-destructive")
  })

  it("shows profit via price-change success tone", () => {
    const { container } = render(<PositionCard position={position} />)
    expect(container.querySelector('[data-slot="price-change"]')).toHaveAttribute(
      "data-direction",
      "up",
    )
  })

  it("calls onClose with the symbol", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<PositionCard position={position} onClose={onClose} />)
    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(onClose).toHaveBeenCalledWith("NVDA")
  })

  it("omits the close button without onClose", () => {
    render(<PositionCard position={position} />)
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<PositionCard position={position} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
