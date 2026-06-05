import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

// useReducedMotion is mocked via a vi.fn so each test can flip the branch.
const reducedMotion = vi.fn(() => false)
vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react")
  return { ...actual, useReducedMotion: () => reducedMotion() }
})

import { EqualizerBars } from "@/components/ui/equalizer-bars"

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="equalizer-bars"]') as HTMLElement
const bars = (c: HTMLElement) =>
  c.querySelectorAll('[data-slot="equalizer-bars-bar"]')

beforeEach(() => reducedMotion.mockReturnValue(false))
afterEach(() => vi.clearAllMocks())

describe("EqualizerBars", () => {
  it("renders the default number of bars (4)", () => {
    const { container } = render(<EqualizerBars />)
    expect(bars(container)).toHaveLength(4)
  })

  it("honors a custom bar count", () => {
    const { container } = render(<EqualizerBars bars={6} />)
    expect(bars(container)).toHaveLength(6)
  })

  it("reflects the playing prop in data-playing", () => {
    const { container, rerender } = render(<EqualizerBars playing />)
    expect(root(container)).toHaveAttribute("data-playing", "true")
    rerender(<EqualizerBars playing={false} />)
    expect(root(container)).toHaveAttribute("data-playing", "false")
  })

  it.each([
    ["sm", "h-3"],
    ["md", "h-4"],
    ["lg", "h-5"],
  ] as const)("applies the %s size class", (size, cls) => {
    const { container } = render(<EqualizerBars size={size} />)
    expect(root(container)).toHaveClass(cls)
  })

  it("is decorative (aria-hidden) by default", () => {
    const { container } = render(<EqualizerBars />)
    expect(root(container)).toHaveAttribute("aria-hidden", "true")
    expect(root(container)).not.toHaveAttribute("role")
  })

  it("becomes an img with a label when aria-label is given", () => {
    const { container } = render(<EqualizerBars aria-label="Now playing" />)
    expect(root(container)).toHaveAttribute("role", "img")
    expect(root(container)).toHaveAttribute("aria-label", "Now playing")
    expect(root(container)).not.toHaveAttribute("aria-hidden")
  })

  it("merges a custom className", () => {
    const { container } = render(<EqualizerBars className="custom" />)
    expect(root(container)).toHaveClass("custom")
  })

  it("holds a static state under reduced motion", () => {
    reducedMotion.mockReturnValue(true)
    const { container } = render(<EqualizerBars playing />)
    expect(root(container)).toHaveAttribute("data-reduced-motion", "true")
    expect(bars(container)).toHaveLength(4)
  })

  it("marks reduced-motion false when motion is allowed", () => {
    const { container } = render(<EqualizerBars />)
    expect(root(container)).toHaveAttribute("data-reduced-motion", "false")
  })

  it("renders a static low state when not playing", () => {
    const { container } = render(<EqualizerBars playing={false} />)
    expect(root(container)).toHaveAttribute("data-playing", "false")
  })

  it("has no axe violations", async () => {
    const { container } = render(<EqualizerBars aria-label="Now playing" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
