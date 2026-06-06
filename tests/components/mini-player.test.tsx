import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { MiniPlayer } from "@/components/mini-player"

const base = {
  title: "Building a design system from scratch",
} as const

describe("MiniPlayer – smoke", () => {
  it("renders without crashing with the mini-player data-slot", () => {
    const { container } = render(<MiniPlayer {...base} />)
    expect(
      container.querySelector("[data-slot='mini-player']"),
    ).toBeInTheDocument()
  })

  it("renders the media, body, title, and subtitle slots", () => {
    const { container } = render(<MiniPlayer {...base} />)
    for (const slot of [
      "mini-player-media",
      "mini-player-body",
      "mini-player-title",
      "mini-player-subtitle",
    ]) {
      expect(
        container.querySelector(`[data-slot='${slot}']`),
      ).toBeInTheDocument()
    }
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <MiniPlayer {...base} className="custom-class" />,
    )
    const root = container.querySelector("[data-slot='mini-player']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("bg-card")
  })
})

describe("MiniPlayer – title and subtitle", () => {
  it("renders the title", () => {
    render(<MiniPlayer {...base} />)
    expect(screen.getByText(base.title)).toBeInTheDocument()
  })

  it("defaults the subtitle to 'Continue watching'", () => {
    render(<MiniPlayer {...base} />)
    expect(screen.getByText("Continue watching")).toBeInTheDocument()
  })

  it("renders a custom subtitle when provided", () => {
    render(<MiniPlayer {...base} subtitle="Up next · byronwade" />)
    expect(screen.getByText("Up next · byronwade")).toBeInTheDocument()
    expect(screen.queryByText("Continue watching")).not.toBeInTheDocument()
  })
})

describe("MiniPlayer – poster forwarding", () => {
  it("forwards posterSrc to the Thumbnail as an image", () => {
    render(<MiniPlayer {...base} posterSrc="/poster.jpg" />)
    const img = screen.getByRole("img", { name: base.title })
    expect(img).toHaveAttribute("src", "/poster.jpg")
  })

  it("renders the Thumbnail placeholder when posterSrc is omitted", () => {
    const { container } = render(<MiniPlayer {...base} />)
    expect(
      container.querySelector("[data-slot='thumbnail-placeholder']"),
    ).toBeInTheDocument()
  })

  it("forwards a progress of 0 to the thumbnail (0 is not absent)", () => {
    const { container } = render(<MiniPlayer {...base} progress={0} />)
    expect(
      container.querySelector("[data-slot='thumbnail-progress']"),
    ).toBeInTheDocument()
  })

  it("forwards a nonzero progress to the thumbnail", () => {
    const { container } = render(<MiniPlayer {...base} progress={42} />)
    expect(
      container.querySelector("[data-slot='thumbnail-progress']"),
    ).toBeInTheDocument()
  })

  it("omits the progress bar when progress is undefined", () => {
    const { container } = render(<MiniPlayer {...base} />)
    expect(
      container.querySelector("[data-slot='thumbnail-progress']"),
    ).not.toBeInTheDocument()
  })

  it("forwards live to the thumbnail", () => {
    const { container } = render(<MiniPlayer {...base} live />)
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).toBeInTheDocument()
  })

  it("omits the live chip by default", () => {
    const { container } = render(<MiniPlayer {...base} />)
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).not.toBeInTheDocument()
  })
})

describe("MiniPlayer – inline video", () => {
  it("renders a video element when src is set and playing", () => {
    const { container } = render(
      <MiniPlayer {...base} src="/clip.mp4" defaultPlaying />,
    )
    expect(
      container.querySelector("[data-slot='mini-player-video']"),
    ).toBeInTheDocument()
  })

  it("swallows rejected inline video playback attempts", () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockReturnValue({
        catch: (callback: () => void) => {
          callback()
        },
      } as unknown as Promise<void>)

    render(<MiniPlayer {...base} src="/clip.mp4" defaultPlaying />)

    expect(play).toHaveBeenCalledTimes(1)
    play.mockRestore()
  })

  it("shows the thumbnail poster when paused even with src", () => {
    const { container } = render(
      <MiniPlayer {...base} src="/clip.mp4" posterSrc="/poster.jpg" />,
    )
    expect(
      container.querySelector("[data-slot='mini-player-video']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='thumbnail-image']"),
    ).toBeInTheDocument()
  })
})

describe("MiniPlayer – versatile API", () => {
  it("renders variant, size, and state attributes", () => {
    const { container, rerender } = render(
      <MiniPlayer {...base} variant="dock" size="sm" state="collapsed" />,
    )
    const root = container.querySelector("[data-slot='mini-player']")
    expect(root).toHaveAttribute("data-variant", "dock")
    expect(root).toHaveAttribute("data-size", "sm")
    expect(root).toHaveAttribute("data-state", "collapsed")

    rerender(<MiniPlayer {...base} variant="inline" size="lg" state="expanded" />)
    expect(root).toHaveAttribute("data-variant", "inline")
    expect(root).toHaveAttribute("data-size", "lg")
    expect(root).toHaveAttribute("data-state", "expanded")
  })

  it("renders queue label, metadata, and actions outside collapsed state", () => {
    const { container } = render(
      <MiniPlayer
        {...base}
        queueLabel="Up next"
        metadata="Channel · 42% watched"
        actions={<button type="button">Queue</button>}
      />,
    )
    expect(
      container.querySelector("[data-slot='mini-player-queue-label']"),
    ).toHaveTextContent("Up next")
    expect(
      container.querySelector("[data-slot='mini-player-metadata']"),
    ).toHaveTextContent("Channel")
    expect(
      container.querySelector("[data-slot='mini-player-actions']"),
    ).toHaveTextContent("Queue")
  })

  it("hides secondary content in collapsed state", () => {
    const { container } = render(
      <MiniPlayer
        {...base}
        state="collapsed"
        queueLabel="Up next"
        metadata="Channel"
        actions={<button type="button">Queue</button>}
      />,
    )
    expect(
      container.querySelector("[data-slot='mini-player-queue-label']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='mini-player-metadata']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='mini-player-actions']"),
    ).toBeNull()
  })

  it("uses playbackLabel in the accessible play and pause labels", () => {
    const { rerender } = render(
      <MiniPlayer {...base} playbackLabel="lesson preview" />,
    )
    expect(
      screen.getByRole("button", { name: "Play lesson preview" }),
    ).toBeInTheDocument()

    rerender(
      <MiniPlayer {...base} playbackLabel="lesson preview" playing />,
    )
    expect(
      screen.getByRole("button", { name: "Pause lesson preview" }),
    ).toBeInTheDocument()
  })

  it("can show a disabled close affordance only when showClose is true", () => {
    const { rerender } = render(
      <MiniPlayer {...base} showClose onClose={undefined} />,
    )
    expect(screen.getByRole("button", { name: "Close" })).toBeDisabled()

    rerender(<MiniPlayer {...base} showClose={false} />)
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument()
  })

  it("suppresses playback, close, and expand callbacks while disabled", () => {
    const onPlayingChange = vi.fn()
    const onClose = vi.fn()
    const onExpand = vi.fn()
    const { container } = render(
      <MiniPlayer
        {...base}
        disabled
        onPlayingChange={onPlayingChange}
        onClose={onClose}
        onExpand={onExpand}
      />,
    )
    expect(container.querySelector("[data-slot='mini-player']")).toHaveAttribute(
      "data-disabled",
      "true",
    )
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    fireEvent.click(screen.getByRole("button", { name: "Expand" }))
    expect(onPlayingChange).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    expect(onExpand).not.toHaveBeenCalled()
  })
})

describe("MiniPlayer – play overlay", () => {
  it("renders a Play control by default (uncontrolled)", () => {
    render(<MiniPlayer {...base} />)
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Pause" }),
    ).not.toBeInTheDocument()
  })

  it("renders a Pause control when defaultPlaying is true", () => {
    render(<MiniPlayer {...base} defaultPlaying />)
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
  })

  it("toggles Play→Pause and fires onPlayingChange when uncontrolled", () => {
    const onPlayingChange = vi.fn()
    render(<MiniPlayer {...base} onPlayingChange={onPlayingChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(onPlayingChange).toHaveBeenCalledTimes(1)
    expect(onPlayingChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
  })

  it("toggles without crashing when onPlayingChange is absent (uncontrolled)", () => {
    render(<MiniPlayer {...base} />)
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
  })

  it("does not flip its own icon when controlled, but still fires onPlayingChange", () => {
    const onPlayingChange = vi.fn()
    render(
      <MiniPlayer {...base} playing={false} onPlayingChange={onPlayingChange} />,
    )
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(onPlayingChange).toHaveBeenCalledTimes(1)
    expect(onPlayingChange).toHaveBeenCalledWith(true)
    // Controlled: the icon stays Play until the parent updates `playing`.
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
  })

  it("respects a controlled playing=true state", () => {
    const onPlayingChange = vi.fn()
    render(
      <MiniPlayer {...base} playing onPlayingChange={onPlayingChange} />,
    )
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Pause" }))
    expect(onPlayingChange).toHaveBeenCalledWith(false)
  })
})

describe("MiniPlayer – close control", () => {
  it("renders a Close button and fires onClose when provided", () => {
    const onClose = vi.fn()
    render(<MiniPlayer {...base} onClose={onClose} />)
    const close = screen.getByRole("button", { name: "Close" })
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("omits the Close button when onClose is not provided", () => {
    render(<MiniPlayer {...base} />)
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument()
  })
})

describe("MiniPlayer – expand control", () => {
  it("renders the expand control as a navigating anchor when href is provided", () => {
    render(<MiniPlayer {...base} href="/watch/abc" />)
    // Base UI's Button keeps role="button" even when rendered as an <a>, so query
    // by the button role and assert it is an anchor carrying the href.
    const expand = screen.getByRole("button", { name: "Expand" })
    expect(expand.tagName).toBe("A")
    expect(expand).toHaveAttribute("href", "/watch/abc")
  })

  it("renders the expand control as a button and fires onExpand", () => {
    const onExpand = vi.fn()
    render(<MiniPlayer {...base} onExpand={onExpand} />)
    const expand = screen.getByRole("button", { name: "Expand" })
    fireEvent.click(expand)
    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it("renders an expand button even when onExpand is absent", () => {
    render(<MiniPlayer {...base} />)
    const expand = screen.getByRole("button", { name: "Expand" })
    expect(expand).toBeInTheDocument()
    fireEvent.click(expand)
    expect(expand).toBeInTheDocument()
  })
})

describe("MiniPlayer – accessibility", () => {
  it("has no axe violations (rich render: poster, progress, close, link)", async () => {
    const { container } = render(
      <MiniPlayer
        {...base}
        subtitle="Continue watching · byronwade"
        posterSrc="/poster.jpg"
        progress={42}
        live
        href="/watch/abc"
        onClose={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (minimal render with onExpand button)", async () => {
    const { container } = render(
      <MiniPlayer {...base} onExpand={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
