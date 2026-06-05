import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { MarketNews } from "@/components/market-news"
import type { NewsItem } from "@/lib/market"

const items: NewsItem[] = [
  {
    id: "n1",
    source: "Reuters",
    headline: "Markets rally on strong jobs data",
    time: Date.parse("2026-06-05T12:00:00Z"),
    symbols: ["AAPL"],
    sentiment: "positive",
  },
  {
    id: "n2",
    source: "Bloomberg",
    headline: "Tech shares retreat after guidance",
    time: Date.parse("2026-06-05T11:00:00Z"),
    symbols: ["TSLA"],
    sentiment: "negative",
  },
]

describe("MarketNews", () => {
  it("renders a row per news item", () => {
    const { container } = render(<MarketNews items={items} />)
    expect(container.querySelectorAll('[data-slot="news-item"]')).toHaveLength(2)
  })

  it("renders headline, source, and relative-time display", () => {
    const { container } = render(<MarketNews items={items} />)
    expect(screen.getByText("Markets rally on strong jobs data")).toBeInTheDocument()
    expect(screen.getByText("Reuters")).toBeInTheDocument()
    expect(
      container.querySelectorAll('[data-slot="relative-time-zone-display"]').length,
    ).toBeGreaterThan(0)
  })

  it("applies sentiment badge tones", () => {
    render(<MarketNews items={items} />)
    expect(screen.getByText("positive")).toHaveClass("text-success")
    expect(screen.getByText("negative")).toHaveClass("text-destructive")
  })

  it("shows related symbol chips with price-change", () => {
    const { container } = render(<MarketNews items={items} />)
    expect(screen.getByText("AAPL")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="price-change"]')).not.toBeNull()
  })

  it("applies compact styling", () => {
    const { container } = render(<MarketNews items={items} compact />)
    expect(container.querySelector('[data-slot="market-news"]')).toHaveClass(
      "[&_[data-slot=news-item]]:py-2",
    )
  })

  it("calls onSelect with the item id", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<MarketNews items={items} onSelect={onSelect} />)
    await user.click(screen.getByText("Markets rally on strong jobs data"))
    expect(onSelect).toHaveBeenCalledWith("n1")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<MarketNews items={items} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
