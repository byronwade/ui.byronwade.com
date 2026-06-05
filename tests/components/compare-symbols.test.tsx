import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { CompareSymbols } from "@/components/compare-symbols"

const symbols = [
  { symbol: "AAPL", change: 1.2, changePercent: 0.8 },
  { symbol: "MSFT", change: -0.5, changePercent: -0.3 },
]

describe("CompareSymbols", () => {
  it("renders a chip per symbol", () => {
    const { container } = render(<CompareSymbols symbols={symbols} />)
    expect(container.querySelectorAll('[data-slot="compare-symbols-chip"]')).toHaveLength(2)
  })

  it("calls onRemove with the symbol", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<CompareSymbols symbols={symbols} onRemove={onRemove} />)
    await user.click(screen.getByRole("button", { name: "Remove MSFT from compare" }))
    expect(onRemove).toHaveBeenCalledWith("MSFT")
  })

  it("shows add button when onAdd is provided and under max", () => {
    render(<CompareSymbols symbols={symbols} max={5} onAdd={vi.fn()} />)
    expect(screen.getByRole("button", { name: /add symbol/i })).toBeInTheDocument()
  })

  it("hides add button when at max symbols", () => {
    render(
      <CompareSymbols
        symbols={symbols}
        max={2}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(screen.queryByRole("button", { name: /add symbol/i })).not.toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<CompareSymbols symbols={symbols} onRemove={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
