import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { AlertCreateForm } from "@/components/alert-create-form"

describe("AlertCreateForm", () => {
  it("opens the dialog from the trigger", async () => {
    const user = userEvent.setup()
    render(<AlertCreateForm symbol="AAPL" defaultTarget={190} />)
    await user.click(screen.getByRole("button", { name: "Create alert" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByLabelText("Symbol")).toHaveValue("AAPL")
  })

  it("submits alert payload", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<AlertCreateForm symbol="MSFT" defaultTarget={420} onSubmit={onSubmit} />)
    await user.click(screen.getByRole("button", { name: "Create alert" }))
    await user.click(screen.getByRole("button", { name: "Save alert" }))
    expect(onSubmit).toHaveBeenCalledWith({
      symbol: "MSFT",
      condition: "above",
      target: 420,
      notify: true,
    })
  })

  it("toggles condition segment", async () => {
    const user = userEvent.setup()
    render(<AlertCreateForm symbol="TSLA" defaultTarget={250} />)
    await user.click(screen.getByRole("button", { name: "Create alert" }))
    await user.click(screen.getByRole("button", { name: "Below" }))
    expect(screen.getByRole("button", { name: "Below" })).toHaveAttribute("data-active", "true")
  })

  it("supports controlled open state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <AlertCreateForm open={false} onOpenChange={onOpenChange} symbol="AAPL" />,
    )
    expect(screen.queryByRole("dialog")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Create alert" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    rerender(
      <AlertCreateForm open onOpenChange={onOpenChange} symbol="AAPL" />,
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("has no accessibility violations when closed", async () => {
    const { container } = render(<AlertCreateForm symbol="NVDA" defaultTarget={900} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
