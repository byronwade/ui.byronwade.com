import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { TickerTape } from "@/components/ticker-tape"
import { makeQuote } from "@/lib/market"

const items = [
  makeQuote({ seed: 1 }),
  makeQuote({ seed: 2 }),
  makeQuote({ seed: 3 }),
]

describe("TickerTape", () => {
  it("renders the root with data-slot ticker-tape", () => {
    const { container } = render(<TickerTape items={items} />)
    expect(container.querySelector('[data-slot="ticker-tape"]')).not.toBeNull()
  })

  it("renders all item symbols in the duplicated track", () => {
    render(<TickerTape items={items} />)
    for (const item of items) {
      expect(screen.getAllByText(item.symbol.toUpperCase()).length).toBeGreaterThan(0)
    }
  })

  it("marks paused state on the root", () => {
    const { container } = render(<TickerTape items={items} paused />)
    expect(container.querySelector('[data-slot="ticker-tape"]')).toHaveAttribute(
      "data-paused",
      "true",
    )
  })

  it("applies motion-reduce safety on the track", () => {
    const { container } = render(<TickerTape items={items} />)
    expect(
      container.querySelector('[data-slot="ticker-tape-track"]'),
    ).toHaveClass("motion-reduce:translate-x-0")
  })

  it("maps slow speed to a longer animation duration", () => {
    const { container } = render(<TickerTape items={items} speed="slow" />)
    const track = container.querySelector(
      '[data-slot="ticker-tape-track"]',
    ) as HTMLElement
    expect(track.style.animation).toContain("60s")
  })

  it("maps fast speed to a shorter animation duration", () => {
    const { container } = render(<TickerTape items={items} speed="fast" />)
    const track = container.querySelector(
      '[data-slot="ticker-tape-track"]',
    ) as HTMLElement
    expect(track.style.animation).toContain("20s")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TickerTape items={items} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
