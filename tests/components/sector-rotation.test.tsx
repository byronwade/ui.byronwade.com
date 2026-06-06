import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { SectorRotation } from "@/components/ui/sector-rotation"

const segments = [
  { label: "Technology", change: 2.4, weight: 2 },
  { label: "Energy", change: -1.2, weight: 1.5 },
]

describe("SectorRotation", () => {
  it("renders legend items for each segment", () => {
    render(<SectorRotation segments={segments} />)
    expect(screen.getByText("Technology")).toBeInTheDocument()
    expect(screen.getByText("Energy")).toBeInTheDocument()
  })

  it("shows focus label on legend hover", () => {
    render(<SectorRotation segments={segments} />)
    fireEvent.mouseEnter(screen.getByRole("button", { name: /Technology/i }))
    expect(screen.getAllByText("Technology").length).toBeGreaterThan(1)
  })

  it("calls onSelect from an arc button", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SectorRotation segments={segments} onSelect={onSelect} />)
    const arc = screen.getByRole("button", { name: /Energy/i })
    await user.click(arc)
    expect(onSelect).toHaveBeenCalledWith("Energy")
  })

  it("handles arc focus and pointer events", () => {
    const onSelect = vi.fn()
    const { container } = render(
      <SectorRotation segments={segments} onSelect={onSelect} />,
    )
    const arc = container.querySelector('circle[role="button"]') as SVGCircleElement
    fireEvent.mouseEnter(arc)
    fireEvent.focus(arc)
    fireEvent.blur(arc)
    fireEvent.mouseLeave(arc)
    fireEvent.click(arc)
    expect(onSelect).toHaveBeenCalled()
  })

  it("clears focus when legend hover ends", () => {
    render(<SectorRotation segments={segments} />)
    const item = screen.getByRole("button", { name: /Energy/i })
    fireEvent.mouseEnter(item)
    fireEvent.mouseLeave(item)
    expect(screen.getByText("Sectors")).toBeInTheDocument()
  })

  it("calls onSelect when a legend item is clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SectorRotation segments={segments} onSelect={onSelect} />)
    await user.click(screen.getByRole("button", { name: /Technology/i }))
    expect(onSelect).toHaveBeenCalledWith("Technology")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SectorRotation segments={segments} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
