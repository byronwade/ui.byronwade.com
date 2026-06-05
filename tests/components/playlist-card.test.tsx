import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { PlaylistCard } from "@/components/playlist-card"

const SRC = "https://example.com/a.jpg"

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="playlist-card"]') as HTMLElement

describe("PlaylistCard", () => {
  it("renders the cover, title and description", () => {
    render(
      <PlaylistCard
        src={SRC}
        title="Evening Acoustic"
        description="Wind down with mellow guitar"
      />,
    )
    expect(screen.getByAltText("Evening Acoustic")).toBeInTheDocument()
    expect(screen.getByText("Evening Acoustic")).toHaveClass("font-medium")
    expect(
      screen.getByText("Wind down with mellow guitar"),
    ).toBeInTheDocument()
  })

  it("omits the description when not provided", () => {
    const { container } = render(<PlaylistCard src={SRC} title="Focus" />)
    expect(
      container.querySelector('[data-slot="playlist-card-body"]')?.children,
    ).toHaveLength(1)
  })

  it("renders no play button without onPlay", () => {
    render(<PlaylistCard src={SRC} title="Focus" />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("fires onPlay from the cover play button", async () => {
    const onPlay = vi.fn()
    render(<PlaylistCard src={SRC} title="Focus" onPlay={onPlay} />)
    await userEvent.click(screen.getByRole("button", { name: "Play Focus" }))
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it("shows the playing state through the cover", () => {
    const { container } = render(
      <PlaylistCard src={SRC} title="Focus" playing onPlay={() => {}} />,
    )
    expect(
      container.querySelector('[data-slot="album-cover-equalizer"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Pause Focus" }),
    ).toBeInTheDocument()
  })

  it("merges a custom className", () => {
    const { container } = render(
      <PlaylistCard src={SRC} title="Focus" className="custom" />,
    )
    expect(root(container)).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <PlaylistCard
        src={SRC}
        title="Evening Acoustic"
        description="Wind down with mellow guitar"
        onPlay={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
