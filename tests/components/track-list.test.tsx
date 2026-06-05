import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { TrackList, TrackRow } from "@/components/ui/track-list"

describe("TrackList", () => {
  it("renders a list containing its rows", () => {
    render(
      <TrackList>
        <TrackRow index={1} title="One" artist="A" duration="3:01" />
        <TrackRow index={2} title="Two" artist="B" duration="2:45" />
      </TrackList>,
    )
    const list = screen.getByRole("list")
    expect(within(list).getAllByRole("listitem")).toHaveLength(2)
  })

  it("merges a custom className on the list", () => {
    const { container } = render(<TrackList className="custom" />)
    expect(container.querySelector('[data-slot="track-list"]')).toHaveClass(
      "custom",
    )
  })
})

describe("TrackRow", () => {
  it("shows index, title, artist and duration", () => {
    render(
      <TrackList>
        <TrackRow index={3} title="Song" artist="Artist" duration="4:12" />
      </TrackList>,
    )
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("Song")).toBeInTheDocument()
    expect(screen.getByText("Artist")).toBeInTheDocument()
    expect(screen.getByText("4:12")).toBeInTheDocument()
  })

  it("joins artist and album with a separator", () => {
    render(<TrackRow index={1} title="S" artist="Art" album="Alb" duration="1:00" />)
    expect(screen.getByText("Art • Alb")).toBeInTheDocument()
  })

  it("renders a plain index (no play button) when onPlay is omitted", () => {
    render(<TrackRow index={1} title="S" artist="A" duration="1:00" />)
    expect(
      screen.queryByRole("button", { name: /play/i }),
    ).not.toBeInTheDocument()
  })

  it("fires onPlay when the row is clicked", async () => {
    const onPlay = vi.fn()
    const { container } = render(
      <TrackRow index={1} title="S" artist="A" duration="1:00" onPlay={onPlay} />,
    )
    await userEvent.click(
      container.querySelector('[data-slot="track-row"]') as HTMLElement,
    )
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it("fires onPlay once from the leading play button (no double-fire)", async () => {
    const onPlay = vi.fn()
    render(
      <TrackRow index={1} title="S" artist="A" duration="1:00" onPlay={onPlay} />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Play S" }))
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it("renders the equalizer (no play button) when active and playing", () => {
    const { container } = render(
      <TrackRow
        index={1}
        title="S"
        artist="A"
        duration="1:00"
        active
        playing
        onPlay={() => {}}
      />,
    )
    expect(
      container.querySelector('[data-slot="equalizer-bars"]'),
    ).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Play S" })).toBeNull()
  })

  it("tints the title with the brand accent when active", () => {
    render(<TrackRow index={1} title="Active" artist="A" duration="1:00" active />)
    expect(screen.getByText("Active")).toHaveClass("text-brand")
  })

  it("renders an explicit marker when explicit", () => {
    render(
      <TrackRow index={1} title="S" artist="A" duration="1:00" explicit />,
    )
    expect(screen.getByLabelText("Explicit")).toBeInTheDocument()
  })

  it("omits the explicit marker by default", () => {
    render(<TrackRow index={1} title="S" artist="A" duration="1:00" />)
    expect(screen.queryByLabelText("Explicit")).toBeNull()
  })

  it("toggles like without triggering onPlay", async () => {
    const onPlay = vi.fn()
    const onLikeToggle = vi.fn()
    render(
      <TrackRow
        index={1}
        title="S"
        artist="A"
        duration="1:00"
        onPlay={onPlay}
        onLikeToggle={onLikeToggle}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Like" }))
    expect(onLikeToggle).toHaveBeenCalledOnce()
    expect(onPlay).not.toHaveBeenCalled()
  })

  it("reflects the liked state on the like button", () => {
    render(
      <TrackRow
        index={1}
        title="S"
        artist="A"
        duration="1:00"
        liked
        onLikeToggle={() => {}}
      />,
    )
    const like = screen.getByRole("button", { name: "Unlike" })
    expect(like).toHaveAttribute("aria-pressed", "true")
    expect(like).toHaveClass("text-brand")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <TrackList>
        <TrackRow
          index={1}
          title="S"
          artist="A"
          duration="1:00"
          explicit
          onPlay={() => {}}
          onLikeToggle={() => {}}
        />
        <TrackRow
          index={2}
          title="Active"
          artist="B"
          duration="2:00"
          active
          playing
          onPlay={() => {}}
        />
      </TrackList>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
