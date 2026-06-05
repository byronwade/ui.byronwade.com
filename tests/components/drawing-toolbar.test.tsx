import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { DrawingToolbar } from "@/components/drawing-toolbar"

describe("DrawingToolbar", () => {
  it("renders a toggle item per tool", () => {
    const { container } = render(<DrawingToolbar />)
    expect(container.querySelectorAll('[data-slot="drawing-toolbar-item"]').length).toBeGreaterThan(
      0,
    )
  })

  it("calls onToolChange when a tool is selected", async () => {
    const user = userEvent.setup()
    const onToolChange = vi.fn()
    render(<DrawingToolbar activeTool="cursor" onToolChange={onToolChange} />)
    await user.click(screen.getByRole("button", { name: "Trend line" }))
    expect(onToolChange).toHaveBeenCalledWith("trendline")
  })

  it("supports horizontal orientation", () => {
    const { container } = render(<DrawingToolbar orientation="horizontal" />)
    expect(container.querySelector('[data-slot="drawing-toolbar"]')).toHaveClass("flex-row")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<DrawingToolbar />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
