import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { Lyrics } from "@/components/ui/lyrics"

const LINES = [
  { text: "First line" },
  { text: "Second line" },
  { text: "Third line" },
]

let matchesReduced = false

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchesReduced,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

afterEach(() => {
  matchesReduced = false
  vi.restoreAllMocks()
})

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="lyrics"]') as HTMLElement
const lineEls = (c: HTMLElement) =>
  c.querySelectorAll('[data-slot="lyrics-line"]')

describe("Lyrics", () => {
  it("renders one line per entry", () => {
    const { container } = render(<Lyrics lines={LINES} />)
    expect(lineEls(container)).toHaveLength(3)
  })

  it("marks the active line and leaves the rest inactive", () => {
    const { container } = render(<Lyrics lines={LINES} activeIndex={1} />)
    const els = lineEls(container)
    expect(els[0]).toHaveAttribute("data-active", "false")
    expect(els[1]).toHaveAttribute("data-active", "true")
    expect(screen.getByText("Second line")).toHaveClass("text-foreground")
    expect(screen.getByText("First line")).toHaveClass("text-muted-foreground")
  })

  it("renders plain text (no buttons) when onLineClick is omitted", () => {
    render(<Lyrics lines={LINES} activeIndex={0} />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("renders buttons and fires onLineClick with the index", async () => {
    const onLineClick = vi.fn()
    render(<Lyrics lines={LINES} activeIndex={0} onLineClick={onLineClick} />)
    await userEvent.click(screen.getByRole("button", { name: "Third line" }))
    expect(onLineClick).toHaveBeenCalledWith(2)
  })

  it("scrolls the active line into view when activeIndex changes", () => {
    const { rerender } = render(<Lyrics lines={LINES} activeIndex={0} />)
    const spy = Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>
    spy.mockClear()
    rerender(<Lyrics lines={LINES} activeIndex={2} />)
    expect(spy).toHaveBeenCalledWith({ block: "center", behavior: "smooth" })
  })

  it("uses an instant scroll under reduced motion", () => {
    matchesReduced = true
    render(<Lyrics lines={LINES} activeIndex={1} />)
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "center",
      behavior: "auto",
    })
  })

  it("does not scroll when no line is active", () => {
    render(<Lyrics lines={LINES} />)
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })

  it("merges a custom className", () => {
    const { container } = render(<Lyrics lines={LINES} className="custom" />)
    expect(root(container)).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Lyrics lines={LINES} activeIndex={1} onLineClick={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
