import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  NowPlayingBar,
  NowPlayingBarControls,
  NowPlayingBarExtras,
  NowPlayingBarProgress,
  NowPlayingBarTrack,
} from "@/components/ui/now-playing-bar"

const SRC = "https://example.com/a.jpg"

describe("NowPlayingBar", () => {
  it("renders a labeled region", () => {
    render(<NowPlayingBar>content</NowPlayingBar>)
    expect(
      screen.getByRole("region", { name: "Now playing" }),
    ).toBeInTheDocument()
  })

  it("merges a custom className", () => {
    const { container } = render(<NowPlayingBar className="custom" />)
    expect(container.querySelector('[data-slot="now-playing-bar"]')).toHaveClass(
      "custom",
    )
  })
})

describe("NowPlayingBarTrack", () => {
  it("shows the cover, title and artist", () => {
    render(<NowPlayingBarTrack src={SRC} title="Song" artist="Artist" />)
    expect(screen.getByAltText("Song")).toBeInTheDocument()
    expect(screen.getByText("Song")).toBeInTheDocument()
    expect(screen.getByText("Artist")).toBeInTheDocument()
  })

  it("renders no like button without onLikeToggle", () => {
    render(<NowPlayingBarTrack src={SRC} title="Song" />)
    expect(screen.queryByRole("button", { name: /like/i })).toBeNull()
  })

  it("toggles like and reflects the liked state", async () => {
    const onLikeToggle = vi.fn()
    render(
      <NowPlayingBarTrack
        src={SRC}
        title="Song"
        liked
        onLikeToggle={onLikeToggle}
      />,
    )
    const like = screen.getByRole("button", { name: "Unlike" })
    expect(like).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(like)
    expect(onLikeToggle).toHaveBeenCalledOnce()
  })
})

describe("NowPlayingBarControls", () => {
  it("reflects the playing state on the play/pause button", () => {
    const { rerender } = render(<NowPlayingBarControls isPlaying={false} />)
    expect(screen.getByRole("button", { name: "Play" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
    rerender(<NowPlayingBarControls isPlaying />)
    expect(screen.getByRole("button", { name: "Pause" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("fires the transport callbacks", async () => {
    const onPlayPause = vi.fn()
    const onPrev = vi.fn()
    const onNext = vi.fn()
    render(
      <NowPlayingBarControls
        onPlayPause={onPlayPause}
        onPrev={onPrev}
        onNext={onNext}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Play" }))
    await userEvent.click(screen.getByRole("button", { name: "Previous" }))
    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(onPlayPause).toHaveBeenCalledOnce()
    expect(onPrev).toHaveBeenCalledOnce()
    expect(onNext).toHaveBeenCalledOnce()
  })

  it("toggles shuffle and repeat with pressed state", async () => {
    const onShuffleToggle = vi.fn()
    const onRepeatToggle = vi.fn()
    render(
      <NowPlayingBarControls
        shuffle
        repeat
        onShuffleToggle={onShuffleToggle}
        onRepeatToggle={onRepeatToggle}
      />,
    )
    const shuffle = screen.getByRole("button", { name: "Shuffle" })
    const repeat = screen.getByRole("button", { name: "Repeat" })
    expect(shuffle).toHaveAttribute("aria-pressed", "true")
    expect(repeat).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(shuffle)
    await userEvent.click(repeat)
    expect(onShuffleToggle).toHaveBeenCalledOnce()
    expect(onRepeatToggle).toHaveBeenCalledOnce()
  })
})

describe("NowPlayingBarProgress", () => {
  it("formats elapsed and total time", () => {
    render(<NowPlayingBarProgress progress={75} duration={210} />)
    expect(screen.getByText("1:15")).toBeInTheDocument()
    expect(screen.getByText("3:30")).toBeInTheDocument()
  })

  it("clamps non-finite/negative time to 0:00", () => {
    render(<NowPlayingBarProgress progress={-5} duration={Number.NaN} />)
    expect(screen.getAllByText("0:00").length).toBeGreaterThanOrEqual(2)
  })

  it("seeks via the slider thumb", async () => {
    const onSeek = vi.fn()
    render(<NowPlayingBarProgress progress={30} duration={100} onSeek={onSeek} />)
    const thumb = screen.getByRole("slider")
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onSeek).toHaveBeenCalled()
    expect(typeof onSeek.mock.calls.at(-1)?.[0]).toBe("number")
  })
})

describe("NowPlayingBarExtras", () => {
  it("changes volume via the slider", async () => {
    const onVolumeChange = vi.fn()
    render(<NowPlayingBarExtras volume={50} onVolumeChange={onVolumeChange} />)
    const thumb = screen.getByRole("slider", { name: "Volume" })
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onVolumeChange).toHaveBeenCalled()
    expect(typeof onVolumeChange.mock.calls.at(-1)?.[0]).toBe("number")
  })

  it("renders extra children (e.g. a queue button)", () => {
    render(
      <NowPlayingBarExtras>
        <button type="button">Queue</button>
      </NowPlayingBarExtras>,
    )
    expect(screen.getByRole("button", { name: "Queue" })).toBeInTheDocument()
  })
})

describe("NowPlayingBar — composed", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <NowPlayingBar>
        <NowPlayingBarTrack
          src={SRC}
          title="Song"
          artist="Artist"
          onLikeToggle={() => {}}
        />
        <NowPlayingBarControls isPlaying onPlayPause={() => {}} />
        <NowPlayingBarProgress progress={30} duration={100} onSeek={() => {}} />
        <NowPlayingBarExtras volume={60} onVolumeChange={() => {}} />
      </NowPlayingBar>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
