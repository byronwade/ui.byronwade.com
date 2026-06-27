/**
 * Tests for <AudioPlayer /> parts (components/ui/audio-player.tsx). media-chrome
 * custom elements register as unknown elements in jsdom (no real playback), so
 * we assert DOM structure, data-slots, the cva variant classes, the token CSS
 * variables on the wrapper, and a11y.
 */

import * as React from "react"
import { render } from "@testing-library/react"
import { axe } from "vitest-axe"

import {
  AudioPlayer,
  AudioPlayerContent,
  AudioPlayerControlBar,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
  audioPlayerVariants,
} from "@/components/ui/audio-player"

beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  HTMLMediaElement.prototype.pause = vi.fn()
})

function FullPlayer(props: React.ComponentProps<typeof AudioPlayer> = {}) {
  return (
    <AudioPlayer {...props}>
      <AudioPlayerContent src="/audio.mp3" />
      <AudioPlayerControlBar>
        <AudioPlayerPlayButton />
        <AudioPlayerSeekBackwardButton />
        <AudioPlayerSeekForwardButton />
        <AudioPlayerTimeRange />
        <AudioPlayerTimeDisplay />
        <AudioPlayerMuteButton />
        <AudioPlayerVolumeRange />
      </AudioPlayerControlBar>
    </AudioPlayer>
  )
}

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="audio-player"]') as HTMLElement

describe("AudioPlayer — structure", () => {
  it("mounts every part with its data-slot", () => {
    const { container } = render(<FullPlayer />)
    const slots = [
      "audio-player",
      "audio-player-content",
      "audio-player-control-bar",
      "audio-player-play-button",
      "audio-player-seek-backward-button",
      "audio-player-seek-forward-button",
      "audio-player-time-range",
      "audio-player-time-display",
      "audio-player-mute-button",
      "audio-player-volume-range",
    ]
    for (const slot of slots) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
        `missing [data-slot="${slot}"]`,
      ).not.toBeNull()
    }
  })

  it("renders an <audio> element for the media slot", () => {
    const { container } = render(<FullPlayer />)
    const media = container.querySelector('[data-slot="audio-player-content"]')
    expect(media?.tagName).toBe("AUDIO")
    expect(media).toHaveAttribute("slot", "media")
  })

  it("maps media-chrome controls to byronwade tokens (no raw color)", () => {
    const { container } = render(<FullPlayer />)
    const style = root(container).getAttribute("style") ?? ""
    expect(style).toContain("--media-primary-color: var(--foreground)")
    expect(style).toContain("--media-background-color: var(--background)")
    expect(style).toContain("--media-range-bar-color: var(--brand)")
    expect(style).not.toMatch(/#[0-9a-f]{3,6}|rgb\(|hsl\(/i)
  })

  it("merges a caller style without dropping the token variables", () => {
    const { container } = render(
      <AudioPlayer style={{ opacity: 0.5 }}>
        <AudioPlayerContent src="/a.mp3" />
      </AudioPlayer>,
    )
    const style = root(container).getAttribute("style") ?? ""
    expect(style).toContain("--media-primary-color")
    expect(style).toContain("opacity: 0.5")
  })

  it("passes className through on the wrapper and parts", () => {
    const { container } = render(
      <AudioPlayer className="ring-test">
        <AudioPlayerContent className="content-test" src="/a.mp3" />
        <AudioPlayerControlBar className="bar-test">
          <AudioPlayerPlayButton className="play-test" />
          <AudioPlayerSeekBackwardButton className="back-test" />
          <AudioPlayerSeekForwardButton className="fwd-test" />
          <AudioPlayerTimeRange className="range-test" />
          <AudioPlayerTimeDisplay className="time-test" />
          <AudioPlayerMuteButton className="mute-test" />
          <AudioPlayerVolumeRange className="vol-test" />
        </AudioPlayerControlBar>
      </AudioPlayer>,
    )
    for (const cls of [
      "ring-test",
      "content-test",
      "bar-test",
      "play-test",
      "back-test",
      "fwd-test",
      "range-test",
      "time-test",
      "mute-test",
      "vol-test",
    ]) {
      expect(
        container.querySelector(`.${cls}`),
        `missing .${cls}`,
      ).not.toBeNull()
    }
  })

  it("time display uses a mono token for data", () => {
    const { container } = render(<FullPlayer />)
    expect(
      container.querySelector('[data-slot="audio-player-time-display"]'),
    ).toHaveClass("font-mono")
  })
})

describe("AudioPlayer — variants", () => {
  it("defaults to the default variant", () => {
    const { container } = render(<FullPlayer />)
    const el = root(container)
    expect(el).toHaveAttribute("data-variant", "default")
    expect(el).toHaveClass("edge", "rounded-lg")
  })

  it.each([
    ["minimal", "rounded-lg"],
    ["card", "rounded-2xl"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    const { container } = render(<FullPlayer variant={variant} />)
    const el = root(container)
    expect(el).toHaveAttribute("data-variant", variant)
    expect(el).toHaveClass(expected)
  })

  it("exposes the cva recipe", () => {
    expect(audioPlayerVariants({ variant: "minimal" })).toContain("rounded-lg")
  })
})

describe("AudioPlayer — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<FullPlayer />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
