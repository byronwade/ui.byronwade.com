import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { EconomicCalendar } from "@/components/economic-calendar"
import type { MarketEvent } from "@/lib/market"

const events: MarketEvent[] = [
  {
    id: "e1",
    country: "US",
    title: "CPI",
    time: Date.parse("2026-06-05T13:30:00Z"),
    impact: "high",
    actual: "3.2%",
    forecast: "3.1%",
    previous: "3.0%",
  },
  {
    id: "e2",
    country: "EU",
    title: "PMI",
    time: Date.parse("2026-06-05T09:00:00Z"),
    impact: "low",
    forecast: "49.5%",
    previous: "49.1%",
  },
]

describe("EconomicCalendar", () => {
  it("renders a row per event", () => {
    const { container } = render(<EconomicCalendar events={events} />)
    expect(container.querySelectorAll('[data-slot="calendar-event"]')).toHaveLength(2)
  })

  it("renders day grouping headers", () => {
    render(<EconomicCalendar events={events} />)
    expect(screen.getByText(/Jun/)).toBeInTheDocument()
  })

  it("applies impact badge tones", () => {
    render(<EconomicCalendar events={events} />)
    expect(screen.getByText("high")).toHaveClass("text-destructive")
    expect(screen.getByText("low")).toHaveClass("text-muted-foreground")
  })

  it("shows actual, forecast, and prior values", () => {
    render(<EconomicCalendar events={events} />)
    expect(screen.getByText("3.2%")).toBeInTheDocument()
    expect(screen.getByText("3.1%")).toBeInTheDocument()
    expect(screen.getByText("3.0%")).toBeInTheDocument()
  })

  it("calls onSelect with the event id", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<EconomicCalendar events={events} onSelect={onSelect} />)
    await user.click(screen.getByText("CPI"))
    expect(onSelect).toHaveBeenCalledWith("e1")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<EconomicCalendar events={events} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
