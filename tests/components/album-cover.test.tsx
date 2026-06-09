import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { AlbumCover } from "@/components/ui/album-cover"

const SRC = "https://example.com/a.jpg"

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="album-cover"]') as HTMLElement

describe("AlbumCover", () => {
  it("renders the cover image with src and alt", () => {
    render(<AlbumCover src={SRC} alt="Album X" />)
    const img = screen.getByAltText("Album X")
    expect(img).toHaveAttribute("src", SRC)
    expect(img).toHaveAttribute("data-slot", "album-cover-image")
  })

  it("renders no play button when onPlay is omitted", () => {
    render(<AlbumCover src={SRC} alt="Album X" />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("renders a play button labeled from alt and fires onPlay on click", async () => {
    const onPlay = vi.fn()
    render(<AlbumCover src={SRC} alt="Album X" onPlay={onPlay} />)
    const button = screen.getByRole("button", { name: "Play Album X" })
    await userEvent.click(button)
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it("fires onPlay on keyboard activation (native button)", async () => {
    const onPlay = vi.fn()
    render(<AlbumCover src={SRC} alt="Album X" onPlay={onPlay} />)
    screen.getByRole("button", { name: "Play Album X" }).focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    expect(onPlay).toHaveBeenCalledTimes(2)
  })

  it("shows the equalizer overlay and a pause label while playing", () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="Album X" playing onPlay={() => {}} />,
    )
    expect(
      container.querySelector('[data-slot="album-cover-equalizer"]'),
    ).toBeInTheDocument()
    expect(root(container)).toHaveAttribute("data-playing", "true")
    expect(
      screen.getByRole("button", { name: "Pause Album X" }),
    ).toBeInTheDocument()
  })

  it("renders the equalizer overlay even without a play button", () => {
    const { container } = render(<AlbumCover src={SRC} alt="X" playing />)
    expect(
      container.querySelector('[data-slot="album-cover-equalizer"]'),
    ).toBeInTheDocument()
    expect(screen.queryByRole("button")).toBeNull()
  })

  it.each([
    ["sm", "max-w-12"],
    ["md", "max-w-40"],
    ["lg", "max-w-56"],
    ["xl", "max-w-72"],
  ] as const)("applies the %s size class", (size, cls) => {
    const { container } = render(<AlbumCover src={SRC} alt="X" size={size} />)
    expect(root(container)).toHaveClass(cls)
  })

  it.each([
    ["md", "rounded-md"],
    ["lg", "rounded-lg"],
    ["full", "rounded-full"],
  ] as const)("applies the %s rounded class", (rounded, cls) => {
    const { container } = render(
      <AlbumCover src={SRC} alt="X" rounded={rounded} />,
    )
    expect(root(container)).toHaveClass(cls)
  })

  it("applies the edge class when shadow is set", () => {
    const { container } = render(<AlbumCover src={SRC} alt="X" shadow />)
    expect(root(container)).toHaveClass("edge")
  })

  it("merges a custom className", () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="X" className="custom" />,
    )
    expect(root(container)).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="Album X" onPlay={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations while playing", async () => {
    const { container } = render(
      <AlbumCover src={SRC} alt="Album X" playing onPlay={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
