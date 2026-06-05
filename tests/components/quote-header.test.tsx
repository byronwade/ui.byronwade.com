import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { QuoteHeader } from "@/components/quote-header"
import { makeQuote } from "@/lib/market"

const quote = makeQuote({ seed: 4 })

describe("QuoteHeader", () => {
  it("renders symbol, name, and price", () => {
    const { container } = render(<QuoteHeader quote={quote} spark={[]} />)
    expect(screen.getByText(quote.symbol)).toBeInTheDocument()
    expect(screen.getByText(quote.name!)).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="quote-header-price"]'),
    ).toHaveTextContent(/\d/)
  })

  it("shows price change with direction data", () => {
    const { container } = render(<QuoteHeader quote={quote} spark={[]} />)
    const change = container.querySelector('[data-slot="price-change"]')
    expect(change).not.toBeNull()
    expect(change).toHaveAttribute("data-direction")
  })

  it("renders provided stats", () => {
    render(
      <QuoteHeader
        quote={quote}
        spark={[]}
        stats={[
          { label: "Open", value: "100.00" },
          { label: "High", value: "110.00" },
        ]}
      />,
    )
    expect(screen.getByText("Open")).toBeInTheDocument()
    expect(screen.getByText("100.00")).toBeInTheDocument()
    expect(screen.getByText("High")).toBeInTheDocument()
  })

  it("renders a sparkline when spark data is provided", () => {
    const { container } = render(
      <QuoteHeader quote={quote} spark={[1, 2, 3, 4]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeNull()
  })

  it("renders default stats and sparkline when omitted", () => {
    const { container } = render(<QuoteHeader quote={quote} />)
    expect(screen.getByText("Volume")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeNull()
  })

  it("applies the lg size class spacing", () => {
    const { container } = render(<QuoteHeader quote={quote} size="lg" spark={[]} />)
    expect(container.querySelector('[data-slot="quote-header"]')).toHaveClass("gap-5")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<QuoteHeader quote={quote} spark={[1, 2, 3]} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
