import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { TimeAndSales } from "@/components/time-and-sales"
import type { TimeAndSale } from "@/lib/market"

const rows: TimeAndSale[] = [
  { id: "r-1", time: Date.parse("2026-06-04T15:30:45Z"), price: 100.5, size: 250, side: "buy" },
  { id: "r-2", time: Date.parse("2026-06-04T15:30:44Z"), price: 100.25, size: 80, side: "sell" },
]

describe("TimeAndSales", () => {
  it("renders a row per trade", () => {
    const { container } = render(<TimeAndSales rows={rows} />)
    expect(container.querySelectorAll('[data-slot="time-and-sales-row"]')).toHaveLength(2)
  })

  it("colors buy and sell prices with success and destructive tones", () => {
    const { container } = render(<TimeAndSales rows={rows} />)
    expect(
      container.querySelector('[data-row-id="r-1"] [data-slot="time-and-sales-price"]'),
    ).toHaveClass("text-success")
    expect(
      container.querySelector('[data-row-id="r-2"] [data-slot="time-and-sales-price"]'),
    ).toHaveClass("text-destructive")
  })

  it("shows formatted trade time by default", () => {
    render(<TimeAndSales rows={rows} />)
    expect(screen.getByText("15:30:45")).toBeInTheDocument()
  })

  it("limits visible rows with maxRows", () => {
    const { container } = render(<TimeAndSales rows={rows} maxRows={1} />)
    expect(container.querySelectorAll('[data-slot="time-and-sales-row"]')).toHaveLength(1)
  })

  it("uses relative time when showRelativeTime is true", () => {
    const { container } = render(<TimeAndSales rows={rows} showRelativeTime />)
    expect(
      container.querySelectorAll('[data-slot="relative-time-zone-display"]'),
    ).toHaveLength(2)
  })

  it("applies compact density class", () => {
    const { container } = render(<TimeAndSales rows={rows} density="compact" />)
    expect(container.querySelector('[data-slot="time-and-sales"]')).toHaveClass("text-xs")
  })

  it("calls onSelect with the row id", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TimeAndSales rows={rows} onSelect={onSelect} />)
    await user.click(screen.getByText("80"))
    expect(onSelect).toHaveBeenCalledWith("r-2")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TimeAndSales rows={rows} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
