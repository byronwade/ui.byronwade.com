import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ChapterList, type Chapter } from "@/components/chapter-list"

const chapters: Chapter[] = [
  { title: "Intro", start: 0, thumbnailSrc: "https://example.com/0.jpg" },
  { title: "Setup", start: 95, thumbnailSrc: "https://example.com/1.jpg" },
  { title: "Build", start: 312, thumbnailSrc: "https://example.com/2.jpg" },
  { title: "Outro", start: 3725, thumbnailSrc: "https://example.com/3.jpg" },
]

function items(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('[data-slot="chapter-list-item"]'),
  ) as HTMLElement[]
}

describe("ChapterList", () => {
  it("renders the root and one item per chapter", () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    expect(
      container.querySelector('[data-slot="chapter-list"]'),
    ).toBeInTheDocument()
    expect(items(container)).toHaveLength(chapters.length)
    expect(screen.getByText("Intro")).toBeInTheDocument()
    expect(screen.getByText("Outro")).toBeInTheDocument()
  })

  it("formats sub-hour start times as m:ss", () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    const time = container.querySelectorAll('[data-slot="chapter-list-time"]')
    expect(time[0]).toHaveTextContent("0:00")
    expect(time[1]).toHaveTextContent("1:35")
    expect(time[2]).toHaveTextContent("5:12")
  })

  it("formats start times of an hour or more as h:mm:ss", () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    const time = container.querySelectorAll('[data-slot="chapter-list-time"]')
    expect(time[3]).toHaveTextContent("1:02:05")
  })

  it("renders timestamps in a mono tabular-nums slot", () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    expect(
      container.querySelector('[data-slot="chapter-list-time"]'),
    ).toHaveClass("font-mono", "tabular-nums")
  })

  it("shows the implied duration from the next chapter's start", () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    const durations = container.querySelectorAll(
      '[data-slot="chapter-list-duration"]',
    )
    // One per chapter except the last (no next chapter).
    expect(durations).toHaveLength(chapters.length - 1)
    expect(durations[0]).toHaveTextContent("1:35")
  })

  it("reflects defaultActiveIndex with aria-current on exactly one row", () => {
    const { container } = render(
      <ChapterList chapters={chapters} defaultActiveIndex={1} />,
    )
    const rows = items(container)
    expect(rows[1]).toHaveAttribute("aria-current", "true")
    expect(rows[0]).not.toHaveAttribute("aria-current")
    expect(
      container.querySelectorAll('[aria-current="true"]'),
    ).toHaveLength(1)
  })

  it("tints the active row's title and time with the brand accent", () => {
    const { container } = render(
      <ChapterList chapters={chapters} defaultActiveIndex={2} />,
    )
    const rows = items(container)
    expect(
      rows[2].querySelector('[data-slot="chapter-list-title"]'),
    ).toHaveClass("text-brand")
    expect(
      rows[2].querySelector('[data-slot="chapter-list-time"]'),
    ).toHaveClass("text-brand")
  })

  it("selects on click, fires onSelect(index, chapter), and moves active (uncontrolled)", async () => {
    const onSelect = vi.fn()
    const { container } = render(
      <ChapterList chapters={chapters} onSelect={onSelect} />,
    )
    const rows = items(container)
    await userEvent.click(rows[2])
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith(2, chapters[2])
    expect(rows[2]).toHaveAttribute("aria-current", "true")
  })

  it("clicks without an onSelect handler do not throw", async () => {
    const { container } = render(<ChapterList chapters={chapters} />)
    const rows = items(container)
    await userEvent.click(rows[1])
    expect(rows[1]).toHaveAttribute("aria-current", "true")
  })

  it("respects a controlled activeIndex and does not move on click", async () => {
    const onSelect = vi.fn()
    const { container } = render(
      <ChapterList chapters={chapters} activeIndex={0} onSelect={onSelect} />,
    )
    const rows = items(container)
    await userEvent.click(rows[3])
    expect(onSelect).toHaveBeenCalledWith(3, chapters[3])
    // Controlled: highlight stays on index 0 until the parent updates.
    expect(rows[0]).toHaveAttribute("aria-current", "true")
    expect(rows[3]).not.toHaveAttribute("aria-current")
  })

  it("derives active from currentTime between chapters", () => {
    const { container } = render(
      <ChapterList chapters={chapters} currentTime={200} />,
    )
    const rows = items(container)
    expect(rows[1]).toHaveAttribute("aria-current", "true")
  })

  it("activates the last chapter when currentTime is past every start", () => {
    const { container } = render(
      <ChapterList chapters={chapters} currentTime={9999} />,
    )
    const rows = items(container)
    expect(rows[3]).toHaveAttribute("aria-current", "true")
  })

  it("activates no chapter when currentTime is before the first start", () => {
    const before: Chapter[] = [
      { title: "A", start: 10 },
      { title: "B", start: 20 },
    ]
    const { container } = render(
      <ChapterList chapters={before} currentTime={5} />,
    )
    expect(
      container.querySelectorAll('[aria-current="true"]'),
    ).toHaveLength(0)
  })

  it("renders thumbnails by default and omits them when showThumbnails is false", () => {
    const { container, rerender } = render(
      <ChapterList chapters={chapters} />,
    )
    expect(
      container.querySelectorAll('[data-slot="chapter-list-thumbnail"]'),
    ).toHaveLength(chapters.length)
    rerender(<ChapterList chapters={chapters} showThumbnails={false} />)
    expect(
      container.querySelectorAll('[data-slot="chapter-list-thumbnail"]'),
    ).toHaveLength(0)
  })

  it("merges a custom className on the root", () => {
    const { container } = render(
      <ChapterList chapters={chapters} className="custom" />,
    )
    expect(container.querySelector('[data-slot="chapter-list"]')).toHaveClass(
      "custom",
    )
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <ChapterList chapters={chapters} defaultActiveIndex={1} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
