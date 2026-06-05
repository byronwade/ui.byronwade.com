import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ArtistHeader } from "@/components/artist-header"

const IMG = "https://example.com/artist.jpg"

describe("ArtistHeader", () => {
  it("renders the name and artwork", () => {
    render(<ArtistHeader name="Aurora Skies" image={IMG} />)
    expect(screen.getByText("Aurora Skies")).toBeInTheDocument()
    expect(screen.getByAltText("Aurora Skies")).toBeInTheDocument()
  })

  it("shows a verified badge only when verified", () => {
    const { rerender } = render(<ArtistHeader name="A" image={IMG} />)
    expect(screen.queryByText("Verified Artist")).toBeNull()
    rerender(<ArtistHeader name="A" image={IMG} verified />)
    expect(screen.getByText("Verified Artist")).toBeInTheDocument()
  })

  it("formats monthly listeners with separators", () => {
    render(<ArtistHeader name="A" image={IMG} monthlyListeners={1234567} />)
    expect(
      screen.getByText("1,234,567 monthly listeners"),
    ).toBeInTheDocument()
  })

  it("omits the listener line when count is absent", () => {
    render(<ArtistHeader name="A" image={IMG} />)
    expect(screen.queryByText(/monthly listeners/)).toBeNull()
  })

  it("fires onPlay and reflects the playing state", async () => {
    const onPlay = vi.fn()
    const { rerender } = render(
      <ArtistHeader name="A" image={IMG} onPlay={onPlay} />,
    )
    const play = screen.getByRole("button", { name: "Play" })
    expect(play).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(play)
    expect(onPlay).toHaveBeenCalledOnce()
    rerender(<ArtistHeader name="A" image={IMG} isPlaying onPlay={onPlay} />)
    expect(screen.getByRole("button", { name: "Pause" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("toggles follow and reflects the following state", async () => {
    const onFollowToggle = vi.fn()
    const { rerender } = render(
      <ArtistHeader name="A" image={IMG} onFollowToggle={onFollowToggle} />,
    )
    const follow = screen.getByRole("button", { name: "Follow" })
    expect(follow).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(follow)
    expect(onFollowToggle).toHaveBeenCalledOnce()
    rerender(
      <ArtistHeader
        name="A"
        image={IMG}
        isFollowing
        onFollowToggle={onFollowToggle}
      />,
    )
    expect(screen.getByRole("button", { name: "Following" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("merges a custom className", () => {
    const { container } = render(
      <ArtistHeader name="A" image={IMG} className="custom" />,
    )
    expect(container.querySelector('[data-slot="artist-header"]')).toHaveClass(
      "custom",
    )
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <ArtistHeader
        name="Aurora Skies"
        image={IMG}
        verified
        monthlyListeners={982341}
        onPlay={() => {}}
        onFollowToggle={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
