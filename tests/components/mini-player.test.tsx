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
