import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { OptionsChain } from "@/components/options-chain"
import type { OptionsChainRow } from "@/lib/market"

const rows: OptionsChainRow[] = [
  {
    strike: 95,
    callBid: 6,
    callAsk: 6.2,
    callLast: 6.1,
    callChange: 1.2,
    putBid: 0.4,
    putAsk: 0.5,
    putLast: 0.45,
    putChange: -0.8,
  },
  {
    strike: 100,
    callBid: 2.1,
    callAsk: 2.3,
    callLast: 2.2,
    callChange: -0.5,
    putBid: 2,
    putAsk: 2.2,
    putLast: 2.1,
    putChange: 0.6,
  },
]

describe("OptionsChain", () => {
  it("renders spot header and chain rows", () => {
    render(<OptionsChain rows={rows} spot={100} />)
    expect(screen.getByText("$100.00")).toBeInTheDocument()
    expect(screen.getAllByText("100").length).toBeGreaterThan(0)
  })

  it("switches to puts tab", async () => {
    const user = userEvent.setup()
    render(<OptionsChain rows={rows} spot={100} />)
    await user.click(screen.getByRole("tab", { name: "Puts" }))
    expect(screen.getAllByText("$2.10").length).toBeGreaterThan(0)
  })

  it("calls onSelectStrike when a row is clicked", async () => {
    const user = userEvent.setup()
    const onSelectStrike = vi.fn()
    render(<OptionsChain rows={rows} spot={100} onSelectStrike={onSelectStrike} />)
    await user.click(screen.getAllByText("100")[0])
    expect(onSelectStrike).toHaveBeenCalledWith(100)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<OptionsChain rows={rows} spot={100} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
