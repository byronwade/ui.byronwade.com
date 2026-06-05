import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { PriceAlert } from "@/components/price-alert"
import type { Alert } from "@/lib/market"

const alerts: Alert[] = [
  {
    id: "a1",
    symbol: "AAPL",
    condition: "above",
    target: 230,
    enabled: true,
    status: "active",
  },
  {
    id: "a2",
    symbol: "TSLA",
    condition: "below",
    target: 180,
    enabled: false,
    status: "triggered",
  },
]

describe("PriceAlert", () => {
  it("renders a row per alert", () => {
    const { container } = render(<PriceAlert alerts={alerts} />)
    expect(container.querySelectorAll('[data-slot="alert-row"]')).toHaveLength(2)
  })

  it("renders the condition text", () => {
    render(<PriceAlert alerts={alerts} />)
    expect(screen.getByText(/Price ≥ \$230\.00/)).toBeInTheDocument()
    expect(screen.getByText(/Price ≤ \$180\.00/)).toBeInTheDocument()
  })

  it("tints triggered alerts", () => {
    const { container } = render(<PriceAlert alerts={alerts} />)
    expect(
      container.querySelector('[data-alert-id="a2"]'),
    ).toHaveAttribute("data-status", "triggered")
  })

  it("calls onToggle with id and next enabled state", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<PriceAlert alerts={alerts} onToggle={onToggle} />)
    await user.click(screen.getByRole("switch", { name: "Toggle alert for AAPL" }))
    expect(onToggle).toHaveBeenCalled()
  })

  it("calls onDelete with the alert id", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<PriceAlert alerts={alerts} onDelete={onDelete} />)
    await user.click(screen.getByRole("button", { name: "Delete alert for AAPL" }))
    expect(onDelete).toHaveBeenCalledWith("a1")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<PriceAlert alerts={alerts} onDelete={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
