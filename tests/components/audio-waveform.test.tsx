import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { AudioWaveform } from "@/components/ui/audio-waveform"

const PEAKS = [0.2, 0.5, 0.8, 1, 0.6, 0.3]

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="audio-waveform"]') as HTMLElement
const barEls = (c: HTMLElement) =>
  c.querySelectorAll('[data-slot="audio-waveform-bar"]')

function mockRect(el: HTMLElement, left: number, width: number) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    left,
    width,
    top: 0,
    right: left + width,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON() {},
  } as DOMRect)
}

describe("AudioWaveform", () => {
  it("renders one bar per peak", () => {
    const { container } = render(<AudioWaveform peaks={PEAKS} />)
    expect(barEls(container)).toHaveLength(PEAKS.length)
  })

  it("colors played bars with bg-brand and the rest muted", () => {
    const { container } = render(<AudioWaveform peaks={PEAKS} progress={0.5} />)
    const list = barEls(container)
    // First bar (index 0) is played at progress 0.5.
    expect(list[0]).toHaveClass("bg-brand")
    // Last bar is not yet played.
    expect(list[list.length - 1]).toHaveClass("bg-muted-foreground/30")
  })

  it("exposes slider semantics with the current value", () => {
    const { container } = render(<AudioWaveform peaks={PEAKS} progress={0.5} />)
    const el = root(container)
    expect(el).toHaveAttribute("role", "slider")
    expect(el).toHaveAttribute("aria-valuemin", "0")
    expect(el).toHaveAttribute("aria-valuemax", "100")
    expect(el).toHaveAttribute("aria-valuenow", "50")
  })

  it("is not focusable or interactive without onSeek", () => {
    const { container } = render(<AudioWaveform peaks={PEAKS} progress={0.5} />)
    const el = root(container)
    expect(el).not.toHaveAttribute("tabindex")
    // Clicking is a no-op (no throw, no handler).
    fireEvent.click(el, { clientX: 10 })
    expect(el).not.toHaveClass("cursor-pointer")
  })

  it("ignores key presses without onSeek", async () => {
    const { container } = render(<AudioWaveform peaks={PEAKS} progress={0.5} />)
    const el = root(container)
    el.focus()
    // No onSeek → handler returns early; just assert no throw.
    fireEvent.keyDown(el, { key: "ArrowRight" })
    expect(el).toHaveAttribute("aria-valuenow", "50")
  })

  it("seeks to a clicked position using pointer geometry", () => {
    const onSeek = vi.fn()
    const { container } = render(
      <AudioWaveform peaks={PEAKS} progress={0} onSeek={onSeek} />,
    )
    const el = root(container)
    mockRect(el, 0, 100)
    fireEvent.click(el, { clientX: 25 })
    expect(onSeek).toHaveBeenCalledWith(0.25)
  })

  it("clamps a click beyond the right edge to 1", () => {
    const onSeek = vi.fn()
    const { container } = render(
      <AudioWaveform peaks={PEAKS} progress={0} onSeek={onSeek} />,
    )
    const el = root(container)
    mockRect(el, 0, 100)
    fireEvent.click(el, { clientX: 250 })
    expect(onSeek).toHaveBeenCalledWith(1)
  })

  it("seeks forward and back with arrow keys", async () => {
    const onSeek = vi.fn()
    render(<AudioWaveform peaks={PEAKS} progress={0.5} onSeek={onSeek} />)
    const el = screen.getByRole("slider")
    el.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onSeek).toHaveBeenLastCalledWith(0.55)
    await userEvent.keyboard("{ArrowLeft}")
    expect(onSeek).toHaveBeenLastCalledWith(0.45)
  })

  it("jumps to start and end with Home/End", async () => {
    const onSeek = vi.fn()
    render(<AudioWaveform peaks={PEAKS} progress={0.5} onSeek={onSeek} />)
    const el = screen.getByRole("slider")
    el.focus()
    await userEvent.keyboard("{Home}")
    expect(onSeek).toHaveBeenLastCalledWith(0)
    await userEvent.keyboard("{End}")
    expect(onSeek).toHaveBeenLastCalledWith(1)
  })

  it("clamps arrow seeking at the bounds", async () => {
    const onSeek = vi.fn()
    const { rerender } = render(
      <AudioWaveform peaks={PEAKS} progress={1} onSeek={onSeek} />,
    )
    screen.getByRole("slider").focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onSeek).toHaveBeenLastCalledWith(1)
    rerender(<AudioWaveform peaks={PEAKS} progress={0} onSeek={onSeek} />)
    await userEvent.keyboard("{ArrowLeft}")
    expect(onSeek).toHaveBeenLastCalledWith(0)
  })

  it("ignores unrelated keys", async () => {
    const onSeek = vi.fn()
    render(<AudioWaveform peaks={PEAKS} progress={0.5} onSeek={onSeek} />)
    screen.getByRole("slider").focus()
    await userEvent.keyboard("{Escape}")
    expect(onSeek).not.toHaveBeenCalled()
  })

  it("renders nothing-colored bars for an empty peaks array", () => {
    const { container } = render(<AudioWaveform peaks={[]} progress={0.5} />)
    expect(barEls(container)).toHaveLength(0)
  })

  it("merges a custom className", () => {
    const { container } = render(
      <AudioWaveform peaks={PEAKS} className="custom" />,
    )
    expect(root(container)).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <AudioWaveform peaks={PEAKS} progress={0.4} onSeek={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
