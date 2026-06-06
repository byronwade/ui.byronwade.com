/**
 * Tests for the YouTube-grade additions to the video player: the expanded
 * composable parts, the four token-only overlays (ambient, heatmap, chapter
 * markers, end-screen), and the batteries-included `MediaPlayer` preset with
 * its resume / keyboard / gesture wiring. media-chrome custom elements don't
 * upgrade in jsdom, so we assert DOM structure, data-slots, token classes, and
 * the smart wiring against a stubbed media element.
 */

import * as React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { axe } from "vitest-axe"

import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerCaptionsButton,
  VideoPlayerFullscreenButton,
  VideoPlayerPipButton,
  VideoPlayerLoopButton,
  VideoPlayerLiveButton,
  VideoPlayerDurationDisplay,
  VideoPlayerLoadingIndicator,
  VideoPlayerSpacer,
  VideoPlayerGestureReceiver,
  VideoPlayerPreviewThumbnail,
  VideoPlayerPreviewTimeDisplay,
  VideoPlayerPreviewChapterDisplay,
  VideoPlayerSettingsMenu,
  VideoPlayerSettingsMenuButton,
  VideoPlayerSettingsMenuItem,
  VideoPlayerRenditionMenu,
  VideoPlayerRenditionMenuButton,
  VideoPlayerCaptionsMenu,
  VideoPlayerCaptionsMenuButton,
  VideoPlayerPlaybackRateMenu,
  VideoPlayerPlaybackRateMenuButton,
  VideoPlayerAmbient,
  VideoPlayerHeatmap,
  VideoPlayerChapterMarkers,
  VideoPlayerEndScreen,
  MediaPlayer,
} from "@/components/ui/video-player"
import { resumeStorageKey } from "@/lib/video-player-utils"

beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  HTMLMediaElement.prototype.pause = vi.fn()
  if (!(URL as unknown as { createObjectURL?: unknown }).createObjectURL)
    ;(URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(
      () => "blob:chapters",
    )
  if (!(URL as unknown as { revokeObjectURL?: unknown }).revokeObjectURL)
    ;(URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn()
})

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

/** Make a jsdom <video>'s media props readable/writable for assertions. */
function stubVideo(
  video: HTMLVideoElement,
  init: { duration?: number; currentTime?: number } = {},
) {
  let currentTime = init.currentTime ?? 0
  let volume = 1
  let playbackRate = 1
  let muted = false
  Object.defineProperty(video, "currentTime", {
    get: () => currentTime,
    set: (v) => (currentTime = v),
    configurable: true,
  })
  Object.defineProperty(video, "duration", {
    get: () => init.duration ?? Number.NaN,
    configurable: true,
  })
  Object.defineProperty(video, "volume", {
    get: () => volume,
    set: (v) => (volume = v),
    configurable: true,
  })
  Object.defineProperty(video, "playbackRate", {
    get: () => playbackRate,
    set: (v) => (playbackRate = v),
    configurable: true,
  })
  Object.defineProperty(video, "muted", {
    get: () => muted,
    set: (v) => (muted = v),
    configurable: true,
  })
  Object.defineProperty(video, "paused", { value: true, configurable: true })
  return {
    get currentTime() {
      return currentTime
    },
    get volume() {
      return volume
    },
    get playbackRate() {
      return playbackRate
    },
    get muted() {
      return muted
    },
  }
}

describe("VideoPlayer — expanded composable parts", () => {
  it("mounts every new part with its data-slot", () => {
    const { container } = render(
      <VideoPlayer variant="youtube">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerLoadingIndicator />
        <VideoPlayerGestureReceiver />
        <VideoPlayerControlBar>
          <VideoPlayerCaptionsButton />
          <VideoPlayerLoopButton />
          <VideoPlayerLiveButton />
          <VideoPlayerDurationDisplay />
          <VideoPlayerSpacer />
          <VideoPlayerSettingsMenuButton />
          <VideoPlayerPipButton />
          <VideoPlayerFullscreenButton />
        </VideoPlayerControlBar>
        <VideoPlayerControlBar>
          <VideoPlayerPreviewThumbnail slot="preview" />
          <VideoPlayerPreviewChapterDisplay slot="preview" />
          <VideoPlayerPreviewTimeDisplay slot="preview" />
        </VideoPlayerControlBar>
        <VideoPlayerSettingsMenu>
          <VideoPlayerSettingsMenuItem>
            Speed
            <VideoPlayerPlaybackRateMenu slot="submenu" />
            <VideoPlayerPlaybackRateMenuButton />
          </VideoPlayerSettingsMenuItem>
          <VideoPlayerSettingsMenuItem>
            Quality
            <VideoPlayerRenditionMenu slot="submenu" />
            <VideoPlayerRenditionMenuButton />
          </VideoPlayerSettingsMenuItem>
          <VideoPlayerSettingsMenuItem>
            Captions
            <VideoPlayerCaptionsMenu slot="submenu" />
            <VideoPlayerCaptionsMenuButton />
          </VideoPlayerSettingsMenuItem>
        </VideoPlayerSettingsMenu>
      </VideoPlayer>,
    )
    const slots = [
      "video-player-loading-indicator",
      "video-player-gesture-receiver",
      "video-player-captions-button",
      "video-player-loop-button",
      "video-player-live-button",
      "video-player-duration-display",
      "video-player-spacer",
      "video-player-settings-menu-button",
      "video-player-pip-button",
      "video-player-fullscreen-button",
      "video-player-preview-thumbnail",
      "video-player-preview-chapter-display",
      "video-player-preview-time-display",
      "video-player-settings-menu",
      "video-player-settings-menu-item",
      "video-player-playback-rate-menu",
      "video-player-playback-rate-menu-button",
      "video-player-rendition-menu",
      "video-player-rendition-menu-button",
      "video-player-captions-menu",
      "video-player-captions-menu-button",
    ]
    for (const slot of slots) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
        `missing [data-slot="${slot}"]`,
      ).not.toBeNull()
    }
  })

  it("applies the youtube variant class and passes className through", () => {
    const { container } = render(
      <VideoPlayer variant="youtube" className="yt-test">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerDurationDisplay className="dur-test" />
        <VideoPlayerSpacer className="spacer-test" />
      </VideoPlayer>,
    )
    const root = container.querySelector('[data-slot="video-player"]')
    expect(root).toHaveAttribute("data-variant", "youtube")
    expect(container.querySelector(".yt-test")).not.toBeNull()
    expect(container.querySelector(".dur-test")).not.toBeNull()
    expect(container.querySelector(".spacer-test")).not.toBeNull()
  })

  it("duration display uses a mono token", () => {
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerDurationDisplay />
      </VideoPlayer>,
    )
    expect(
      container.querySelector('[data-slot="video-player-duration-display"]'),
    ).toHaveClass("font-mono")
  })
})

describe("VideoPlayerHeatmap", () => {
  it("renders nothing for empty values", () => {
    const { container } = render(<VideoPlayerHeatmap values={[]} />)
    expect(
      container.querySelector('[data-slot="video-player-heatmap"]'),
    ).toBeNull()
  })

  it("renders one brand-toned bar per value", () => {
    const { container } = render(<VideoPlayerHeatmap values={[1, 2, 4]} />)
    const bars = container.querySelectorAll(
      '[data-slot="video-player-heatmap-bar"]',
    )
    expect(bars).toHaveLength(3)
    expect(bars[0]).toHaveClass("bg-brand")
    // tallest bar reaches full height; opacity scales with intensity.
    expect((bars[2] as HTMLElement).style.height).toBe("100%")
  })
})

describe("VideoPlayerChapterMarkers", () => {
  it("renders nothing without a known duration", () => {
    const { container } = render(
      <VideoPlayerChapterMarkers
        chapters={[{ startTime: 0, title: "A" }]}
        duration={0}
      />,
    )
    expect(
      container.querySelector('[data-slot="video-player-chapter-markers"]'),
    ).toBeNull()
  })

  it("positions a marker per chapter by fraction of duration", () => {
    const { container } = render(
      <VideoPlayerChapterMarkers
        chapters={[
          { startTime: 0, title: "A" },
          { startTime: 50, title: "B" },
        ]}
        duration={100}
      />,
    )
    const markers = container.querySelectorAll(
      '[data-slot="video-player-chapter-marker"]',
    )
    expect(markers).toHaveLength(2)
    expect((markers[1] as HTMLElement).style.left).toBe("50%")
  })
})

describe("VideoPlayerAmbient", () => {
  it("renders a muted, aria-hidden mirror that syncs to the primary video", () => {
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerAmbient src="/v.mp4" />
      </VideoPlayer>,
    )
    const ambient = container.querySelector('[data-slot="video-player-ambient"]')
    const mirror = container.querySelector(
      '[data-slot="video-player-ambient-media"]',
    ) as HTMLVideoElement
    expect(ambient).not.toBeNull()
    expect(mirror).toHaveAttribute("aria-hidden")
    expect(mirror.muted).toBe(true)

    // Driving the primary forward resyncs and plays the drifted mirror.
    const primary = container.querySelector(
      'video[data-slot="video-player-content"]',
    ) as HTMLVideoElement
    let primaryTime = 12
    Object.defineProperty(primary, "currentTime", {
      get: () => primaryTime,
      set: (v) => (primaryTime = v),
      configurable: true,
    })
    Object.defineProperty(primary, "paused", {
      value: false,
      configurable: true,
    })
    let mirrorTime = 0
    Object.defineProperty(mirror, "currentTime", {
      get: () => mirrorTime,
      set: (v) => (mirrorTime = v),
      configurable: true,
    })
    const playSpy = vi.spyOn(mirror, "play").mockResolvedValue(undefined)
    const pauseSpy = vi.spyOn(mirror, "pause").mockImplementation(() => {})
    fireEvent(primary, new Event("timeupdate"))
    expect(mirrorTime).toBe(12)
    expect(playSpy).toHaveBeenCalled()

    // A paused primary pauses the mirror.
    Object.defineProperty(primary, "paused", { value: true, configurable: true })
    fireEvent(primary, new Event("pause"))
    expect(pauseSpy).toHaveBeenCalled()
  })
})

describe("VideoPlayerEndScreen", () => {
  it("hides until the media ends, then reveals the next card", () => {
    const onSelect = vi.fn()
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerEndScreen next={{ title: "Next clip", onSelect }} />
      </VideoPlayer>,
    )
    const overlay = container.querySelector(
      '[data-slot="video-player-end-screen"]',
    ) as HTMLElement
    expect(overlay).toHaveAttribute("data-ended", "false")
    expect(overlay).toHaveClass("opacity-0")

    const video = container.querySelector("video") as HTMLVideoElement
    fireEvent(video, new Event("ended"))
    expect(overlay).toHaveAttribute("data-ended", "true")
    const card = screen.getByRole("button", { name: /next clip/i })
    fireEvent.click(card)
    expect(onSelect).toHaveBeenCalled()

    // Replaying hides it again.
    fireEvent(video, new Event("play"))
    expect(overlay).toHaveAttribute("data-ended", "false")
  })

  it("renders the next card as a link when href is provided", () => {
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerEndScreen
          next={{ title: "Linked", href: "/watch/next" }}
        />
      </VideoPlayer>,
    )
    const video = container.querySelector("video") as HTMLVideoElement
    fireEvent(video, new Event("ended"))
    const card = container.querySelector(
      '[data-slot="video-player-end-screen-next"]',
    ) as HTMLAnchorElement
    expect(card.tagName).toBe("A")
    expect(card).toHaveAttribute("href", "/watch/next")
  })

  it("renders a thumbnail and custom children when provided", () => {
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerEndScreen>
          <span>Custom end</span>
        </VideoPlayerEndScreen>
      </VideoPlayer>,
    )
    const video = container.querySelector("video") as HTMLVideoElement
    fireEvent(video, new Event("ended"))
    expect(screen.getByText("Custom end")).toBeInTheDocument()
  })

  it("counts down and auto-advances to next", () => {
    vi.useFakeTimers()
    const onSelect = vi.fn()
    const { container } = render(
      <VideoPlayer>
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerEndScreen
          next={{ title: "Auto", thumbnail: "/t.jpg", onSelect }}
          countdownSeconds={2}
        />
      </VideoPlayer>,
    )
    const video = container.querySelector("video") as HTMLVideoElement
    act(() => {
      video.dispatchEvent(new Event("ended"))
    })
    expect(screen.getByText(/up next in 2s/i)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText(/up next in 1s/i)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1000))
    act(() => vi.advanceTimersByTime(1000))
    expect(onSelect).toHaveBeenCalled()
  })
})

describe("MediaPlayer preset", () => {
  it("renders a minimal player without optional layers", () => {
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    const root = container.querySelector('[data-slot="video-player"]')
    expect(root).toHaveAttribute("data-variant", "youtube")
    expect(
      container.querySelector('[data-slot="video-player-ambient"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-title"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-heatmap"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-end-screen"]'),
    ).toBeNull()
    // Core chrome is always present.
    expect(
      container.querySelector('[data-slot="video-player-control-bar"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-settings-menu"]'),
    ).not.toBeNull()
  })

  it("assembles every optional layer from props", () => {
    const { container } = render(
      <MediaPlayer
        src="/v.mp4"
        poster="/p.jpg"
        title="My video"
        ambient
        heatmap={[1, 2, 3]}
        storyboard="/sb.vtt"
        captions={[
          { src: "/en.vtt", srcLang: "en", label: "English", default: true },
        ]}
        chapters={[
          { startTime: 0, title: "Intro" },
          { startTime: 10, title: "Body" },
        ]}
        next={{ title: "Next", onSelect: vi.fn() }}
        countdownSeconds={3}
      />,
    )
    expect(
      container.querySelector('[data-slot="video-player-ambient"]'),
    ).not.toBeNull()
    expect(screen.getByText("My video")).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="video-player-heatmap"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-end-screen"]'),
    ).not.toBeNull()
    // Caption + chapters tracks are wired onto the <video>.
    expect(container.querySelector('track[kind="subtitles"]')).not.toBeNull()
    expect(container.querySelector('track[kind="chapters"]')).not.toBeNull()
    expect(container.querySelector('track[kind="metadata"]')).not.toBeNull()
  })

  it("shows chapter markers once the duration is known", () => {
    const { container } = render(
      <MediaPlayer
        src="/v.mp4"
        chapters={[
          { startTime: 0, title: "A" },
          { startTime: 30, title: "B" },
        ]}
      />,
    )
    const video = container.querySelector("video") as HTMLVideoElement
    stubVideo(video, { duration: 60 })
    fireEvent(video, new Event("loadedmetadata"))
    const markers = container.querySelectorAll(
      '[data-slot="video-player-chapter-marker"]',
    )
    expect(markers).toHaveLength(2)
  })

  it("seeks with the extra keymap and ignores keys media-chrome owns", () => {
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    const root = container.querySelector('[data-slot="video-player"]') as HTMLElement
    const video = container.querySelector("video") as HTMLVideoElement
    const state = stubVideo(video, { duration: 100, currentTime: 20 })

    fireEvent.keyDown(root, { key: "l" })
    expect(state.currentTime).toBe(30)
    fireEvent.keyDown(root, { key: "j" })
    expect(state.currentTime).toBe(20)
    // 'k' is media-chrome's — our handler is a no-op.
    fireEvent.keyDown(root, { key: "k" })
    expect(state.currentTime).toBe(20)
  })

  it("double-tap zones seek and flash a ripple that fades on its own", () => {
    vi.useFakeTimers()
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    const video = container.querySelector("video") as HTMLVideoElement
    const state = stubVideo(video, { duration: 100, currentTime: 40 })

    const right = container.querySelector(
      '[data-slot="video-player-gesture-right"]',
    ) as HTMLElement
    fireEvent.doubleClick(right)
    expect(state.currentTime).toBe(50)
    const ripple = container.querySelector('[data-slot="video-player-ripple"]')
    expect(ripple).not.toBeNull()
    expect(ripple).toHaveAttribute("data-zone", "right")

    // The ripple clears itself after its animation window.
    act(() => vi.advanceTimersByTime(450))
    expect(
      container.querySelector('[data-slot="video-player-ripple"]'),
    ).toBeNull()

    const left = container.querySelector(
      '[data-slot="video-player-gesture-left"]',
    ) as HTMLElement
    fireEvent.doubleClick(left)
    expect(state.currentTime).toBe(40)
    expect(
      container.querySelector('[data-slot="video-player-ripple"]'),
    ).toHaveAttribute("data-zone", "left")
  })

  it("single-taps toggle play, and a double-tap cancels the pending toggle", () => {
    vi.useFakeTimers()
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    const video = container.querySelector("video") as HTMLVideoElement
    const state = stubVideo(video, { duration: 100, currentTime: 30 })
    const playSpy = vi.spyOn(video, "play").mockResolvedValue(undefined)

    // Drop any pending timers from earlier tests so we measure only ours.
    vi.clearAllTimers()
    playSpy.mockClear()

    // Two quick taps collapse to one toggle (the second resets the debounce).
    const center = container.querySelector(
      '[data-slot="video-player-gesture-center"]',
    ) as HTMLElement
    fireEvent.click(center)
    fireEvent.click(center)
    act(() => vi.advanceTimersByTime(220))
    expect(playSpy).toHaveBeenCalledTimes(1)

    // A pending tap immediately followed by a double-tap seeks instead of toggling.
    const right = container.querySelector(
      '[data-slot="video-player-gesture-right"]',
    ) as HTMLElement
    fireEvent.click(right)
    fireEvent.doubleClick(right)
    expect(state.currentTime).toBe(40)
    act(() => vi.advanceTimersByTime(300))
    // The cancelled tap did not fire a second play.
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it("tap toggle no-ops when the media element is gone", () => {
    vi.useFakeTimers()
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    container.querySelector("video")?.remove()
    fireEvent.click(
      container.querySelector(
        '[data-slot="video-player-gesture-center"]',
      ) as HTMLElement,
    )
    expect(() => act(() => vi.advanceTimersByTime(300))).not.toThrow()
  })

  it("clears a pending tap timer on unmount", () => {
    vi.useFakeTimers()
    const { container, unmount } = render(<MediaPlayer src="/v.mp4" />)
    fireEvent.click(
      container.querySelector(
        '[data-slot="video-player-gesture-center"]',
      ) as HTMLElement,
    )
    // Unmounting with a tap still pending must not throw or fire later.
    expect(() => unmount()).not.toThrow()
    expect(() => act(() => vi.advanceTimersByTime(300))).not.toThrow()
  })

  it("restores saved playback state on load and persists on timeupdate", () => {
    window.localStorage.setItem(
      resumeStorageKey("clip"),
      JSON.stringify({ time: 30, volume: 0.5, rate: 1.5, muted: true }),
    )
    // jsdom resolves localStorage methods off the prototype, so spy there.
    const setItem = vi.spyOn(Storage.prototype, "setItem")
    const { container } = render(<MediaPlayer src="/v.mp4" resumeKey="clip" />)
    const video = container.querySelector("video") as HTMLVideoElement
    const state = stubVideo(video, { duration: 100 })

    fireEvent(video, new Event("loadedmetadata"))
    expect(state.currentTime).toBe(30)
    expect(state.volume).toBe(0.5)
    expect(state.playbackRate).toBe(1.5)
    expect(state.muted).toBe(true)

    setItem.mockClear()
    fireEvent(video, new Event("timeupdate"))
    expect(setItem).toHaveBeenCalledTimes(1)
    // Throttled — an immediate second tick does not write again.
    fireEvent(video, new Event("timeupdate"))
    expect(setItem).toHaveBeenCalledTimes(1)

    // Ending clears the saved state.
    const removeItem = vi.spyOn(Storage.prototype, "removeItem")
    fireEvent(video, new Event("ended"))
    expect(removeItem).toHaveBeenCalledWith(resumeStorageKey("clip"))
    setItem.mockRestore()
    removeItem.mockRestore()
  })

  it("does not resume when the saved position is past the end", () => {
    window.localStorage.setItem(
      resumeStorageKey("done"),
      JSON.stringify({ time: 99 }),
    )
    const { container } = render(<MediaPlayer src="/v.mp4" resumeKey="done" />)
    const video = container.querySelector("video") as HTMLVideoElement
    const state = stubVideo(video, { duration: 100, currentTime: 0 })
    fireEvent(video, new Event("loadedmetadata"))
    expect(state.currentTime).toBe(0)
  })

  it("degrades gracefully when localStorage access throws", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage")
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked")
      },
    })
    const { container } = render(<MediaPlayer src="/v.mp4" resumeKey="x" />)
    const video = container.querySelector("video") as HTMLVideoElement
    stubVideo(video, { duration: 100 })
    expect(() => {
      fireEvent(video, new Event("loadedmetadata"))
      fireEvent(video, new Event("timeupdate"))
    }).not.toThrow()
    if (original) Object.defineProperty(window, "localStorage", original)
  })

  it("no-ops keymap and gestures when no media element is present", () => {
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    const root = container.querySelector('[data-slot="video-player"]') as HTMLElement
    // Drop the <video> so the guard paths run.
    container.querySelector("video")?.remove()
    expect(() => {
      fireEvent.keyDown(root, { key: "l" })
      fireEvent.doubleClick(
        container.querySelector(
          '[data-slot="video-player-gesture-left"]',
        ) as HTMLElement,
      )
    }).not.toThrow()
    // The gesture still flashes a ripple even without media.
    expect(
      container.querySelector('[data-slot="video-player-ripple"]'),
    ).not.toBeNull()
  })

  it("forwards the ended event to onEnded", () => {
    const onEnded = vi.fn()
    const { container } = render(<MediaPlayer src="/v.mp4" onEnded={onEnded} />)
    const video = container.querySelector("video") as HTMLVideoElement
    fireEvent(video, new Event("ended"))
    expect(onEnded).toHaveBeenCalled()
  })

  it("revokes the chapters blob URL on unmount", () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL")
    const { unmount } = render(
      <MediaPlayer src="/v.mp4" chapters={[{ startTime: 0, title: "A" }]} />,
    )
    unmount()
    expect(revoke).toHaveBeenCalled()
    revoke.mockRestore()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <MediaPlayer src="/v.mp4" title="A11y" heatmap={[1, 2]} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  }, 20000)

  it("wraps scrubber + controls in a chrome layer", () => {
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    expect(
      container.querySelector('[data-slot="video-player-chrome"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-scrubber"]'),
    ).not.toBeNull()
  })

  it("renders Next and Theater controls when handlers are provided", () => {
    const { container } = render(
      <MediaPlayer src="/v.mp4" onNext={() => {}} defaultTheater />,
    )
    expect(
      container.querySelector('[data-slot="video-player-next-button"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="video-player-theater-button"]'),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      container.querySelector('[data-slot="video-player-stage"]'),
    ).toHaveAttribute("data-theater", "true")
  })

  it("omits the Next control when onNext is absent", () => {
    const { container } = render(<MediaPlayer src="/v.mp4" />)
    expect(
      container.querySelector('[data-slot="video-player-next-button"]'),
    ).toBeNull()
  })
})
