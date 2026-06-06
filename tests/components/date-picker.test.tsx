import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import { DatePicker } from "@/components/ui/date-picker"

const JUNE_15 = new Date(2026, 5, 15)

function dayButton(label: string) {
  return screen
    .getAllByRole("button")
    .find((b) => b.textContent?.trim() === label) as HTMLElement
}

describe("DatePicker", () => {
  it("renders placeholder text when empty", () => {
    render(<DatePicker placeholder="Select a date" />)
    expect(screen.getByRole("button", { name: /select a date/i })).toHaveAttribute(
      "data-slot",
      "date-picker-trigger",
    )
  })

  it("opens a calendar and selects a date", async () => {
    const user = userEvent.setup()
    const onDateChange = vi.fn()
    render(
      <DatePicker
        defaultDate={JUNE_15}
        onDateChange={onDateChange}
        placeholder="Select a date"
      />,
    )

    await user.click(screen.getByRole("button"))
    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument()
    })
    await user.click(dayButton("20"))
    expect(onDateChange).toHaveBeenCalled()
  })

  it("has no axe violations", async () => {
    const { container } = render(<DatePicker defaultDate={JUNE_15} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
