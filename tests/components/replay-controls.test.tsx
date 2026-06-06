import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ReplayControls } from "@/components/replay-controls"

describe("ReplayControls", () => {
  it("renders transport controls", () => {
    render(<ReplayControls />)
    expect(screen.getByRole("button", { name: /play replay/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /step back/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /step forward/i })).toBeInTheDocument()
  })

  it("calls onPlayingChange when toggling", async () => {
    const user = userEvent.setup()
    const onPlayingChange = vi.fn()
    render(
      <ReplayControls defaultPlaying={false} onPlayingChange={onPlayingChange} />,
    )
    await user.click(screen.getByRole("button", { name: /play replay/i }))
    expect(onPlayingChange).toHaveBeenCalledWith(true)
    await user.click(screen.getByRole("button", { name: /pause replay/i }))
    expect(onPlayingChange).toHaveBeenCalledWith(false)
  })

  it("calls onPlay and onPause when toggling", async () => {
    const user = userEvent.setup()
    const onPlay = vi.fn()
    const onPause = vi.fn()
    const { rerender } = render(
      <ReplayControls playing={false} onPlay={onPlay} onPause={onPause} />,
    )
    await user.click(screen.getByRole("button", { name: /play replay/i }))
    expect(onPlay).toHaveBeenCalled()
    rerender(<ReplayControls playing onPlay={onPlay} onPause={onPause} />)
    await user.click(screen.getByRole("button", { name: /pause replay/i }))
    expect(onPause).toHaveBeenCalled()
  })

  it("changes speed via segmented control", async () => {
    const user = userEvent.setup()
    const onSpeedChange = vi.fn()
    render(<ReplayControls speed="1x" onSpeedChange={onSpeedChange} />)
    await user.click(screen.getByRole("button", { name: "2×" }))
    expect(onSpeedChange).toHaveBeenCalledWith("2x")
  })

  it("calls onSeek when the slider value changes", () => {
    const onSeek = vi.fn()
    render(<ReplayControls duration={100} onSeek={onSeek} />)
    fireEvent.change(screen.getByRole("slider", { name: /replay position/i }), {
      target: { value: "40" },
    })
    expect(onSeek).toHaveBeenCalledWith(40)
  })

  it("calls step callbacks", async () => {
    const user = userEvent.setup()
    const onStepBack = vi.fn()
    const onStepForward = vi.fn()
    render(<ReplayControls onStepBack={onStepBack} onStepForward={onStepForward} />)
    await user.click(screen.getByRole("button", { name: /step back/i }))
    await user.click(screen.getByRole("button", { name: /step forward/i }))
    expect(onStepBack).toHaveBeenCalled()
    expect(onStepForward).toHaveBeenCalled()
  })

  it("toggles and seeks in uncontrolled mode", async () => {
    const user = userEvent.setup()
    render(<ReplayControls duration={100} />)
    await user.click(screen.getByRole("button", { name: /play replay/i }))
    expect(screen.getByRole("button", { name: /pause replay/i })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /pause replay/i }))
    expect(screen.getByRole("button", { name: /play replay/i })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "4×" }))
    expect(screen.getByRole("button", { name: "4×" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("renders bar variant inline without slider", () => {
    const { container } = render(
      <ReplayControls variant="bar" showSlider={false} position={12} duration={71} />,
    )
    expect(container.querySelector('[data-slot="replay-controls"]')).toHaveAttribute(
      "data-variant",
      "bar",
    )
    expect(
      screen.queryByRole("slider", { name: /replay position/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText("12/71")).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ReplayControls position={25} duration={100} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
