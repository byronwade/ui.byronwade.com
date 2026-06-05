import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { OrderEntry } from "@/components/order-entry"

describe("OrderEntry", () => {
  it("renders buy submit with success tone by default", () => {
    render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    const submit = screen.getByRole("button", { name: "Buy AAPL" })
    expect(submit).toHaveClass("bg-success")
  })

  it("switches to sell submit tone when the sell tab is selected", async () => {
    const user = userEvent.setup()
    render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    await user.click(screen.getByRole("tab", { name: "Sell" }))
    const submit = screen.getByRole("button", { name: "Sell AAPL" })
    expect(submit).toHaveClass("bg-destructive")
  })

  it("disables the price field for market orders", () => {
    render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    expect(screen.getByLabelText("Price")).toBeDisabled()
  })

  it("enables the price field for limit orders", async () => {
    const user = userEvent.setup()
    render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    await user.click(screen.getByRole("button", { name: "Limit" }))
    expect(screen.getByLabelText("Price")).not.toBeDisabled()
  })

  it("updates the computed total when qty changes", async () => {
    const user = userEvent.setup()
    render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    const qty = screen.getByLabelText("Quantity")
    await user.clear(qty)
    await user.type(qty, "3")
    expect(screen.getByText("$300.00")).toBeInTheDocument()
  })

  it("calls onSubmit with the assembled order", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OrderEntry symbol="AAPL" lastPrice={100} onSubmit={onSubmit} />)
    await user.click(screen.getByRole("button", { name: "Buy AAPL" }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        side: "buy",
        type: "Market",
        qty: 1,
        total: 100,
      }),
    )
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<OrderEntry symbol="AAPL" lastPrice={100} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
