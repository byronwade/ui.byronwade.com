/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system (token-mapped media-chrome,
 * data-slot) and grown into a YouTube-grade player: a settings/quality/captions
 * menu system, fullscreen/PiP, scrub previews, chapters, a most-replayed
 * heatmap, an ambient glow, an end-screen, plus a batteries-included
 * `MediaPlayer` preset with resume + keyboard/gesture smarts.
 *
 * Everything is token-only (no raw color): the heatmap is `bg-brand` toned by
 * opacity, and the ambient layer is a blurred mirror of the video's *own*
 * pixels — never sampled/authored color — so a consumer overriding `--brand`
 * re-skins the whole player. Smart logic lives in `@/lib/video-player-utils`.
 */
"use client"

import {
  MediaCaptionsButton,
  MediaControlBar,
  MediaController,
  MediaDurationDisplay,
  MediaFullscreenButton,
  MediaGestureReceiver,
  MediaLiveButton,
  MediaLoadingIndicator,
  MediaLoopButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaPreviewChapterDisplay,
  MediaPreviewThumbnail,
  MediaPreviewTimeDisplay,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react"
import {
  MediaCaptionsMenu,
  MediaCaptionsMenuButton,
  MediaPlaybackRateMenu,
  MediaPlaybackRateMenuButton,
  MediaRenditionMenu,
  MediaRenditionMenuButton,
  MediaSettingsMenu,
  MediaSettingsMenuButton,
  MediaSettingsMenuItem,
} from "media-chrome/react/menu"
import { cva, type VariantProps } from "class-variance-authority"
import { Rectangle, SkipForward } from "@/lib/icons"
import * as React from "react"
import type { ComponentProps, CSSProperties } from "react"

import { cn } from "@/lib/utils"
import {
  applyMediaAction,
  chaptersToVtt,
  clearPlaybackState,
  type Chapter,
  normalizeHeatmap,
  PLAYBACK_RATES,
  readPlaybackState,
  resolveGesture,
  resolveMediaKey,
  resumeStorageKey,
  shouldResume,
  shouldSyncAmbient,
  writePlaybackState,
} from "@/lib/video-player-utils"

/**
 * media-chrome controls are themed entirely through CSS variables. We map every
 * one of them to a byronwade semantic token so the player re-skins for free with
 * the rest of the system (and inherits dark mode). The accent (range progress,
 * focus) resolves to `--brand`; nothing is pinned to a literal color.
 */
const mediaVariables = {
  "--media-primary-color": "var(--foreground)",
  "--media-secondary-color": "var(--muted)",
  "--media-text-color": "var(--foreground)",
  "--media-background-color": "var(--background)",
  "--media-control-background": "transparent",
  "--media-control-hover-background": "var(--accent)",
  "--media-font-family": "var(--font-sans)",
  "--media-font-weight": "400",
  "--media-live-button-icon-color": "var(--muted-foreground)",
  "--media-live-button-indicator-color": "var(--brand)",
  "--media-range-track-background": "var(--border)",
  "--media-range-bar-color": "var(--brand)",
  "--media-range-thumb-background": "var(--brand)",
  "--media-time-range-buffered-color": "var(--muted-foreground)",
  "--media-menu-background": "var(--popover)",
  "--media-menu-item-checked-indicator-color": "var(--brand)",
  "--media-tooltip-background": "var(--popover)",
  "--media-preview-background": "var(--popover)",
  "--media-preview-border-radius": "var(--radius)",
} as CSSProperties

const videoPlayerVariants = cva(
  "group/video-player relative isolate aspect-video w-full overflow-hidden bg-card text-foreground outline-none [&_video]:h-full [&_video]:w-full [&_video]:object-cover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "rounded-lg edge",
        minimal: "rounded-lg edge",
        theater:
          "mx-auto w-full max-w-4xl rounded-2xl edge bg-background [&_media-control-bar]:px-2 [&_media-control-bar]:py-1",
        poster: "rounded-lg edge",
        youtube:
          "rounded-2xl bg-background [&_video]:bg-background [&_video]:object-contain [&_[data-slot$=-button]]:rounded-full [&_[data-slot$=-button]]:p-2 [&_[data-slot$=-button]]:transition-colors [&_[data-slot$=-button]]:hover:bg-foreground/10 [&_[data-slot=video-player-volume-range]]:max-w-24 [&_[data-slot=video-player-time-range]]:px-0 [&_[data-slot=video-player-time-range]]:py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

type VideoPlayerVariant = NonNullable<
  VariantProps<typeof videoPlayerVariants>["variant"]
>

const VideoPlayerVariantContext =
  React.createContext<VideoPlayerVariant>("default")

/** Read the current player variant from any descendant part. */
export const useVideoPlayerVariant = () =>
  React.useContext(VideoPlayerVariantContext)

export type VideoPlayerProps = ComponentProps<typeof MediaController> &
  VariantProps<typeof videoPlayerVariants>

export const VideoPlayer = ({
  className,
  style,
  variant,
  ...props
}: VideoPlayerProps) => {
  const resolvedVariant: VideoPlayerVariant = variant ?? "default"
  return (
    <VideoPlayerVariantContext.Provider value={resolvedVariant}>
      <MediaController
        data-slot="video-player"
        data-variant={resolvedVariant}
        className={cn(
          videoPlayerVariants({ variant: resolvedVariant }),
          className,
        )}
        style={{ ...mediaVariables, ...style }}
        {...props}
      />
    </VideoPlayerVariantContext.Provider>
  )
}

const controlBarVariants = cva(
  "flex w-full items-center gap-0.5 bg-background/80 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "",
        minimal: "gap-1 bg-transparent backdrop-blur-none",
        theater: "gap-1 px-1",
        poster: "",
        youtube: "scrim-bottom-background gap-1 px-2 pb-1.5 pt-8",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>

export const VideoPlayerControlBar = ({
  className,
  ...props
}: VideoPlayerControlBarProps) => {
  const variant = useVideoPlayerVariant()
  return (
    <MediaControlBar
      data-slot="video-player-control-bar"
      className={cn(controlBarVariants({ variant }), className)}
      {...props}
    />
  )
}

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>

export const VideoPlayerTimeRange = ({
  className,
  children,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    data-slot="video-player-time-range"
    className={cn("flex-1 p-2.5", className)}
    {...props}
  >
    {children}
  </MediaTimeRange>
)

export type VideoPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>

export const VideoPlayerTimeDisplay = ({
  className,
  ...props
}: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay
    data-slot="video-player-time-display"
    className={cn("p-2.5 font-mono text-sm tabular-nums", className)}
    {...props}
  />
)

export type VideoPlayerDurationDisplayProps = ComponentProps<
  typeof MediaDurationDisplay
>

export const VideoPlayerDurationDisplay = ({
  className,
  ...props
}: VideoPlayerDurationDisplayProps) => (
  <MediaDurationDisplay
    data-slot="video-player-duration-display"
    className={cn("p-2.5 font-mono text-sm tabular-nums", className)}
    {...props}
  />
)

export type VideoPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>

export const VideoPlayerVolumeRange = ({
  className,
  ...props
}: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange
    data-slot="video-player-volume-range"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton
    data-slot="video-player-play-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>

export const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton
    data-slot="video-player-seek-backward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>

export const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton
    data-slot="video-player-seek-forward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton
    data-slot="video-player-mute-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerCaptionsButtonProps = ComponentProps<
  typeof MediaCaptionsButton
>

export const VideoPlayerCaptionsButton = ({
  className,
  ...props
}: VideoPlayerCaptionsButtonProps) => (
  <MediaCaptionsButton
    data-slot="video-player-captions-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerFullscreenButtonProps = ComponentProps<
  typeof MediaFullscreenButton
>

export const VideoPlayerFullscreenButton = ({
  className,
  ...props
}: VideoPlayerFullscreenButtonProps) => (
  <MediaFullscreenButton
    data-slot="video-player-fullscreen-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerPipButtonProps = ComponentProps<typeof MediaPipButton>

export const VideoPlayerPipButton = ({
  className,
  ...props
}: VideoPlayerPipButtonProps) => (
  <MediaPipButton
    data-slot="video-player-pip-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerLoopButtonProps = ComponentProps<typeof MediaLoopButton>

export const VideoPlayerLoopButton = ({
  className,
  ...props
}: VideoPlayerLoopButtonProps) => (
  <MediaLoopButton
    data-slot="video-player-loop-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerLiveButtonProps = ComponentProps<typeof MediaLiveButton>

export const VideoPlayerLiveButton = ({
  className,
  ...props
}: VideoPlayerLiveButtonProps) => (
  <MediaLiveButton
    data-slot="video-player-live-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerLoadingIndicatorProps = ComponentProps<
  typeof MediaLoadingIndicator
>

export const VideoPlayerLoadingIndicator = ({
  className,
  ...props
}: VideoPlayerLoadingIndicatorProps) => (
  <MediaLoadingIndicator
    data-slot="video-player-loading-indicator"
    noAutohide
    className={cn(
      "pointer-events-none absolute inset-0 z-10 flex items-center justify-center [--media-loading-indicator-icon-color:var(--brand)]",
      className,
    )}
    {...props}
  />
)

export type VideoPlayerGestureReceiverProps = ComponentProps<
  typeof MediaGestureReceiver
>

export const VideoPlayerGestureReceiver = ({
  className,
  ...props
}: VideoPlayerGestureReceiverProps) => (
  <MediaGestureReceiver
    data-slot="video-player-gesture-receiver"
    className={cn("absolute inset-0", className)}
    {...props}
  />
)

/** A flexible gap that pushes the controls after it to the right (YouTube layout). */
export const VideoPlayerSpacer = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    data-slot="video-player-spacer"
    aria-hidden
    className={cn("flex-1", className)}
    {...props}
  />
)

export type VideoPlayerNextButtonProps = ComponentProps<"button">

/** Skip to the next item — YouTube-style control-bar affordance. */
export const VideoPlayerNextButton = ({
  className,
  ...props
}: VideoPlayerNextButtonProps) => (
  <button
    type="button"
    data-slot="video-player-next-button"
    aria-label="Next"
    className={cn(
      "inline-flex items-center justify-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  >
    <SkipForward className="size-5" aria-hidden />
  </button>
)

export type VideoPlayerTheaterButtonProps = ComponentProps<"button"> & {
  pressed?: boolean
}

/** Toggle theater width — pairs with a narrowed stage wrapper. */
export const VideoPlayerTheaterButton = ({
  className,
  pressed = false,
  ...props
}: VideoPlayerTheaterButtonProps) => (
  <button
    type="button"
    data-slot="video-player-theater-button"
    aria-label={pressed ? "Exit theater mode" : "Theater mode"}
    aria-pressed={pressed}
    className={cn(
      "inline-flex items-center justify-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  >
    <Rectangle className="size-5" aria-hidden />
  </button>
)

export type VideoPlayerPreviewThumbnailProps = ComponentProps<
  typeof MediaPreviewThumbnail
>

export const VideoPlayerPreviewThumbnail = ({
  className,
  ...props
}: VideoPlayerPreviewThumbnailProps) => (
  <MediaPreviewThumbnail
    data-slot="video-player-preview-thumbnail"
    className={cn("overflow-hidden rounded-sm edge", className)}
    {...props}
  />
)

export type VideoPlayerPreviewTimeDisplayProps = ComponentProps<
  typeof MediaPreviewTimeDisplay
>

export const VideoPlayerPreviewTimeDisplay = ({
  className,
  ...props
}: VideoPlayerPreviewTimeDisplayProps) => (
  <MediaPreviewTimeDisplay
    data-slot="video-player-preview-time-display"
    className={cn("font-mono text-xs tabular-nums", className)}
    {...props}
  />
)

export type VideoPlayerPreviewChapterDisplayProps = ComponentProps<
  typeof MediaPreviewChapterDisplay
>

export const VideoPlayerPreviewChapterDisplay = ({
  className,
  ...props
}: VideoPlayerPreviewChapterDisplayProps) => (
  <MediaPreviewChapterDisplay
    data-slot="video-player-preview-chapter-display"
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
)

// --- Settings menu system (gear → quality / captions / speed) ---------------

export type VideoPlayerSettingsMenuProps = ComponentProps<
  typeof MediaSettingsMenu
>

export const VideoPlayerSettingsMenu = ({
  className,
  ...props
}: VideoPlayerSettingsMenuProps) => (
  <MediaSettingsMenu
    data-slot="video-player-settings-menu"
    className={cn(
      "rounded-lg edge bg-popover text-popover-foreground edge",
      className,
    )}
    {...props}
  />
)

export type VideoPlayerSettingsMenuButtonProps = ComponentProps<
  typeof MediaSettingsMenuButton
>

export const VideoPlayerSettingsMenuButton = ({
  className,
  ...props
}: VideoPlayerSettingsMenuButtonProps) => (
  <MediaSettingsMenuButton
    data-slot="video-player-settings-menu-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerSettingsMenuItemProps = ComponentProps<
  typeof MediaSettingsMenuItem
>

export const VideoPlayerSettingsMenuItem = ({
  className,
  ...props
}: VideoPlayerSettingsMenuItemProps) => (
  <MediaSettingsMenuItem
    data-slot="video-player-settings-menu-item"
    className={cn("px-3 py-1.5 text-sm", className)}
    {...props}
  />
)

export type VideoPlayerRenditionMenuProps = ComponentProps<
  typeof MediaRenditionMenu
>

export const VideoPlayerRenditionMenu = ({
  className,
  ...props
}: VideoPlayerRenditionMenuProps) => (
  <MediaRenditionMenu
    data-slot="video-player-rendition-menu"
    className={cn("bg-popover text-popover-foreground", className)}
    {...props}
  />
)

export type VideoPlayerRenditionMenuButtonProps = ComponentProps<
  typeof MediaRenditionMenuButton
>

export const VideoPlayerRenditionMenuButton = ({
  className,
  ...props
}: VideoPlayerRenditionMenuButtonProps) => (
  <MediaRenditionMenuButton
    data-slot="video-player-rendition-menu-button"
    className={cn("p-2.5 font-mono text-xs tabular-nums", className)}
    {...props}
  />
)

export type VideoPlayerCaptionsMenuProps = ComponentProps<
  typeof MediaCaptionsMenu
>

export const VideoPlayerCaptionsMenu = ({
  className,
  ...props
}: VideoPlayerCaptionsMenuProps) => (
  <MediaCaptionsMenu
    data-slot="video-player-captions-menu"
    className={cn("bg-popover text-popover-foreground", className)}
    {...props}
  />
)

export type VideoPlayerCaptionsMenuButtonProps = ComponentProps<
  typeof MediaCaptionsMenuButton
>

export const VideoPlayerCaptionsMenuButton = ({
  className,
  ...props
}: VideoPlayerCaptionsMenuButtonProps) => (
  <MediaCaptionsMenuButton
    data-slot="video-player-captions-menu-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type VideoPlayerPlaybackRateMenuProps = ComponentProps<
  typeof MediaPlaybackRateMenu
>

export const VideoPlayerPlaybackRateMenu = ({
  className,
  rates = PLAYBACK_RATES as unknown as number[],
  ...props
}: VideoPlayerPlaybackRateMenuProps) => (
  <MediaPlaybackRateMenu
    data-slot="video-player-playback-rate-menu"
    rates={rates}
    className={cn("bg-popover text-popover-foreground", className)}
    {...props}
  />
)

export type VideoPlayerPlaybackRateMenuButtonProps = ComponentProps<
  typeof MediaPlaybackRateMenuButton
>

export const VideoPlayerPlaybackRateMenuButton = ({
  className,
  ...props
}: VideoPlayerPlaybackRateMenuButtonProps) => (
  <MediaPlaybackRateMenuButton
    data-slot="video-player-playback-rate-menu-button"
    className={cn("p-2.5 font-mono text-xs tabular-nums", className)}
    {...props}
  />
)

export type VideoPlayerContentProps = ComponentProps<"video">

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  // media-chrome manages the slotted <video> on the client (e.g. adds tabindex),
  // so suppress the resulting SSR attribute mismatch.
  <video
    data-slot="video-player-content"
    suppressHydrationWarning
    className={cn("mt-0 mb-0", className)}
    {...props}
  />
)

export type VideoPlayerPosterProps = ComponentProps<"button"> & {
  /** Poster image shown until the viewer presses play. */
  src?: string
  /** Alt text for the poster image. */
  alt?: string
}

/**
 * Big centered play affordance for the `poster` variant. Renders an overlay
 * (optional image + brand play button) and hides itself once activated, handing
 * playback to the underlying `<video>`. Pair with `variant="poster"`.
 */
export const VideoPlayerPoster = ({
  src,
  alt = "",
  className,
  onClick,
  children,
  ...props
}: VideoPlayerPosterProps) => {
  const [played, setPlayed] = React.useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    setPlayed(true)
    const root = event.currentTarget.closest('[data-slot="video-player"]')
    const video = root?.querySelector("video")
    video?.play?.()
  }

  if (played) {
    return null
  }

  return (
    <button
      type="button"
      data-slot="video-player-poster"
      aria-label="Play video"
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center bg-background/40 outline-none transition-colors hover:bg-background/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          data-slot="video-player-poster-image"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : null}
      {children ?? (
        <span
          aria-hidden
          data-slot="video-player-poster-button"
          className="flex size-16 items-center justify-center rounded-full bg-brand text-primary-foreground edge transition-transform group-hover/video-player:scale-105"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-0.5 size-7"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </button>
  )
}

// --- On-system overlays (token-only) ----------------------------------------

export type VideoPlayerAmbientProps = ComponentProps<"div"> & {
  /** Same source as the primary video — mirrored, blurred, and de-saturated. */
  src?: string
}

/**
 * Ambient glow: a blurred, scaled, low-opacity clone of the video's *own*
 * pixels layered behind the frame. It paints the video, never an authored
 * color, so it stays on-system; opt-in because it decodes the source twice.
 */
export const VideoPlayerAmbient = ({
  src,
  className,
  ...props
}: VideoPlayerAmbientProps) => {
  const mirrorRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const mirror = mirrorRef.current
    if (!mirror) return
    // Works whether the ambient sits inside the player (composable) or beside it
    // in a stage wrapper (the preset, where it must spill past the clipped frame).
    const root = mirror.closest(
      '[data-slot="video-player-stage"], [data-slot="video-player"]',
    )
    const primary = root?.querySelector(
      'video:not([data-slot="video-player-ambient-media"])',
    ) as HTMLVideoElement | null
    if (!primary) return

    const sync = () => {
      if (shouldSyncAmbient(primary.currentTime, mirror.currentTime)) {
        mirror.currentTime = primary.currentTime
      }
      if (primary.paused) mirror.pause()
      else void mirror.play?.()
    }
    primary.addEventListener("timeupdate", sync)
    primary.addEventListener("play", sync)
    primary.addEventListener("pause", sync)
    return () => {
      primary.removeEventListener("timeupdate", sync)
      primary.removeEventListener("play", sync)
      primary.removeEventListener("pause", sync)
    }
  }, [])

  return (
    <div
      aria-hidden
      data-slot="video-player-ambient"
      className={cn("pointer-events-none absolute -inset-8 -z-10", className)}
      {...props}
    >
      <video
        ref={mirrorRef}
        data-slot="video-player-ambient-media"
        src={src}
        muted
        playsInline
        tabIndex={-1}
        aria-hidden
        className="size-full scale-110 object-cover opacity-60 blur-3xl saturate-150"
      />
    </div>
  )
}

export type VideoPlayerHeatmapProps = ComponentProps<"div"> & {
  /** Raw "most-replayed" intensities — normalized to bar heights/opacity. */
  values: number[]
}

/**
 * Most-replayed heatmap. Bars are `bg-brand` toned only by opacity + height —
 * no second hue — so the accent stays single-source.
 */
export const VideoPlayerHeatmap = ({
  values,
  className,
  ...props
}: VideoPlayerHeatmapProps) => {
  const segments = normalizeHeatmap(values)
  if (segments.length === 0) return null
  return (
    <div
      aria-hidden
      data-slot="video-player-heatmap"
      className={cn(
        "pointer-events-none flex h-8 w-full items-end gap-px",
        className,
      )}
      {...props}
    >
      {segments.map((intensity, index) => (
        <span
          key={index}
          data-slot="video-player-heatmap-bar"
          className="flex-1 rounded-t-xs bg-brand"
          style={{
            height: `${Math.max(8, intensity * 100)}%`,
            opacity: 0.25 + intensity * 0.55,
          }}
        />
      ))}
    </div>
  )
}

export type VideoPlayerChapterMarkersProps = ComponentProps<"div"> & {
  chapters: Chapter[]
  /** Total media duration in seconds; markers position as a fraction of it. */
  duration: number
}

/** Chapter tick marks laid over the scrubber, positioned by start time. */
export const VideoPlayerChapterMarkers = ({
  chapters,
  duration,
  className,
  ...props
}: VideoPlayerChapterMarkersProps) => {
  if (duration <= 0 || chapters.length === 0) return null
  return (
    <div
      aria-hidden
      data-slot="video-player-chapter-markers"
      className={cn("pointer-events-none absolute inset-0", className)}
      {...props}
    >
      {chapters.map((chapter, index) => (
        <span
          key={index}
          data-slot="video-player-chapter-marker"
          className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-background/80"
          style={{ left: `${(chapter.startTime / duration) * 100}%` }}
        />
      ))}
    </div>
  )
}

export type VideoPlayerEndScreenNext = {
  title: string
  thumbnail?: string
  href?: string
  onSelect?: () => void
}

export type VideoPlayerEndScreenProps = ComponentProps<"div"> & {
  /** The "up next" card shown when playback ends. */
  next?: VideoPlayerEndScreenNext
  /** Seconds to count down before auto-advancing to `next`. 0 disables. */
  countdownSeconds?: number
}

/**
 * End-screen overlay. Listens for the media `ended` event (always mounted so
 * the listener is live) and reveals an autoplay-next card with a countdown.
 */
export const VideoPlayerEndScreen = ({
  next,
  countdownSeconds = 0,
  className,
  children,
  ...props
}: VideoPlayerEndScreenProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [ended, setEnded] = React.useState(false)
  const [remaining, setRemaining] = React.useState(countdownSeconds)

  React.useEffect(() => {
    const root = rootRef.current?.closest('[data-slot="video-player"]')
    const video = root?.querySelector("video") as HTMLVideoElement | null
    if (!video) return
    const onEnded = () => setEnded(true)
    const onPlay = () => setEnded(false)
    video.addEventListener("ended", onEnded)
    video.addEventListener("play", onPlay)
    return () => {
      video.removeEventListener("ended", onEnded)
      video.removeEventListener("play", onPlay)
    }
  }, [])

  React.useEffect(() => {
    if (!ended) {
      setRemaining(countdownSeconds)
      return
    }
    if (!next || countdownSeconds <= 0) return
    if (remaining <= 0) {
      next.onSelect?.()
      return
    }
    const id = setTimeout(() => setRemaining((value) => value - 1), 1000)
    return () => clearTimeout(id)
  }, [ended, remaining, next, countdownSeconds])

  const cardClassName =
    "flex w-full max-w-sm items-center gap-3 rounded-lg edge bg-card p-3 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  const cardBody = next ? (
    <>
      {next.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={next.thumbnail}
          alt=""
          className="aspect-video w-28 shrink-0 rounded-lg object-cover"
        />
      ) : null}
      <span className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          {countdownSeconds > 0 ? `Up next in ${remaining}s` : "Up next"}
        </span>
        <span className="text-sm font-medium text-foreground">
          {next.title}
        </span>
      </span>
    </>
  ) : null

  return (
    <div
      ref={rootRef}
      data-slot="video-player-end-screen"
      data-ended={ended}
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center bg-background/85 backdrop-blur-sm transition-opacity duration-300",
        ended ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      {...props}
    >
      {ended
        ? (children ??
          (next ? (
            next.href ? (
              <a
                href={next.href}
                data-slot="video-player-end-screen-next"
                onClick={next.onSelect}
                className={cardClassName}
              >
                {cardBody}
              </a>
            ) : (
              <button
                type="button"
                data-slot="video-player-end-screen-next"
                onClick={next.onSelect}
                className={cardClassName}
              >
                {cardBody}
              </button>
            )
          ) : null))
        : null}
    </div>
  )
}

// --- MediaPlayer preset ------------------------------------------------------

export type MediaPlayerCaptionTrack = {
  src: string
  srcLang: string
  label: string
  default?: boolean
}

export type MediaPlayerProps = Omit<VideoPlayerProps, "children"> & {
  /** Video source. */
  src?: string
  /** Poster image shown before playback. */
  poster?: string
  /** Title shown in the top scrim. */
  title?: string
  /** Chapters → a `<track kind="chapters">` + scrubber markers. */
  chapters?: Chapter[]
  /** Most-replayed intensities for the scrubber heatmap. */
  heatmap?: number[]
  /** Storyboard image for hover scrub thumbnails. */
  storyboard?: string
  /** Subtitle/caption tracks. */
  captions?: MediaPlayerCaptionTrack[]
  /** Enable the ambient blurred-pixel glow (opt-in, decodes twice). */
  ambient?: boolean
  /** localStorage namespace enabling resume + preference memory. */
  resumeKey?: string
  /** "Up next" card shown on the end-screen. */
  next?: VideoPlayerEndScreenNext
  /** Seconds before auto-advancing to `next` (0 disables). */
  countdownSeconds?: number
  /** Forwarded to the underlying `<video>`. */
  autoPlay?: boolean
  muted?: boolean
  preload?: ComponentProps<"video">["preload"]
  /** CORS mode for the `<video>` — only set for cross-origin sources that send CORS headers. */
  crossOrigin?: ComponentProps<"video">["crossOrigin"]
  /** Fires when the media ends. */
  onEnded?: () => void
  /** Skip-to-next handler — renders a Next control in the chrome when set. */
  onNext?: () => void
  /** Controlled theater width on the stage wrapper. */
  theater?: boolean
  defaultTheater?: boolean
  onTheaterChange?: (next: boolean) => void
}

const getStorage = (): Storage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage
  } catch {
    return null
  }
}

const RESUME_THROTTLE_MS = 5000

/**
 * Batteries-included, YouTube-faithful player assembled from the primitives.
 * Pass props for a drop-in experience; the smart wiring (resume, the extra
 * keymap, double-tap gestures) delegates to the tested pure helpers.
 */
export const MediaPlayer = ({
  src,
  poster,
  title,
  chapters,
  heatmap,
  storyboard,
  captions,
  ambient = false,
  resumeKey,
  next,
  countdownSeconds = 0,
  variant = "youtube",
  autoPlay,
  muted,
  preload = "metadata",
  crossOrigin,
  onEnded,
  onNext,
  theater,
  defaultTheater = false,
  onTheaterChange,
  className,
  ...props
}: MediaPlayerProps) => {
  const rootRef = React.useRef<HTMLElement>(null)
  const [duration, setDuration] = React.useState(0)
  const [ripple, setRipple] = React.useState<"left" | "right" | null>(null)
  const rippleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTheaterControlled = theater !== undefined
  const [theaterInternal, setTheaterInternal] = React.useState(defaultTheater)
  const theaterOn = isTheaterControlled ? theater! : theaterInternal

  function toggleTheater() {
    const next = !theaterOn
    if (!isTheaterControlled) setTheaterInternal(next)
    onTheaterChange?.(next)
  }

  // Object URLs must be created on the client only — a server-rendered blob URL
  // never matches the client's, causing a hydration mismatch. So this stays null
  // through SSR + first paint and the chapters track is attached after mount.
  const [chaptersVttUrl, setChaptersVttUrl] = React.useState<string | null>(
    null,
  )

  React.useEffect(() => {
    if (!chapters || chapters.length === 0) {
      setChaptersVttUrl(null)
      return
    }
    const blob = new Blob([chaptersToVtt(chapters, duration || undefined)], {
      type: "text/vtt",
    })
    const url = URL.createObjectURL(blob)
    setChaptersVttUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [chapters, duration])

  const queryVideo = React.useCallback(
    () => rootRef.current?.querySelector("video") as HTMLVideoElement | null,
    [],
  )

  // Resume + preference memory.
  React.useEffect(() => {
    if (!resumeKey) return
    const video = queryVideo()
    if (!video) return
    const storage = getStorage()
    const key = resumeStorageKey(resumeKey)
    let lastWrite = 0

    const onLoaded = () => {
      setDuration(video.duration || 0)
      const saved = readPlaybackState(storage, key)
      if (!saved) return
      if (shouldResume(saved.time, video.duration || 0)) {
        video.currentTime = saved.time
      }
      if (typeof saved.volume === "number") video.volume = saved.volume
      if (typeof saved.rate === "number") video.playbackRate = saved.rate
      if (typeof saved.muted === "boolean") video.muted = saved.muted
    }
    const onTime = () => {
      const now = Date.now()
      if (now - lastWrite < RESUME_THROTTLE_MS) return
      lastWrite = now
      writePlaybackState(storage, key, {
        time: video.currentTime,
        volume: video.volume,
        rate: video.playbackRate,
        muted: video.muted,
      })
    }
    const onEndedClear = () => clearPlaybackState(storage, key)

    video.addEventListener("loadedmetadata", onLoaded)
    video.addEventListener("timeupdate", onTime)
    video.addEventListener("ended", onEndedClear)
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded)
      video.removeEventListener("timeupdate", onTime)
      video.removeEventListener("ended", onEndedClear)
    }
  }, [resumeKey, queryVideo])

  // Track duration for chapter markers / heatmap even without resume.
  React.useEffect(() => {
    const video = queryVideo()
    if (!video) return
    const onLoaded = () => setDuration(video.duration || 0)
    video.addEventListener("loadedmetadata", onLoaded)
    if (video.duration) setDuration(video.duration)
    return () => video.removeEventListener("loadedmetadata", onLoaded)
  }, [queryVideo, src])

  // Forward the ended event.
  React.useEffect(() => {
    if (!onEnded) return
    const video = queryVideo()
    if (!video) return
    video.addEventListener("ended", onEnded)
    return () => video.removeEventListener("ended", onEnded)
  }, [onEnded, queryVideo])

  // Extra keyboard shortcuts (layered on media-chrome's native hotkeys).
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const action = resolveMediaKey({
      key: event.key,
      shiftKey: event.shiftKey,
      target: event.target as { tagName?: string } | null,
    })
    if (!action) return
    const video = queryVideo()
    if (!video) return
    event.preventDefault()
    applyMediaAction(video, action)
  }

  React.useEffect(
    () => () => {
      if (rippleTimer.current) clearTimeout(rippleTimer.current)
      if (clickTimer.current) clearTimeout(clickTimer.current)
    },
    [],
  )

  // Single tap toggles play; deferred so a double tap (seek) can cancel it.
  const tapToggle = () => {
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      const video = queryVideo()
      if (video) applyMediaAction(video, { type: "toggle-play" })
    }, 220)
  }

  const seekZone = (zone: "left" | "right") => () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
    const video = queryVideo()
    const action = resolveGesture(zone, 2)
    if (video && action) applyMediaAction(video, action)
    setRipple(zone)
    if (rippleTimer.current) clearTimeout(rippleTimer.current)
    rippleTimer.current = setTimeout(() => setRipple(null), 450)
  }

  return (
    <div
      data-slot="video-player-stage"
      data-theater={theaterOn || undefined}
      className={cn(
        "relative transition-[max-width] duration-300",
        theaterOn && "mx-auto max-w-5xl",
        className,
      )}
    >
      {/* Ambient sits beside the player, not inside its clipped frame, so the
          blurred glow can spill past the edges onto the page (YouTube ambient). */}
      {ambient ? <VideoPlayerAmbient src={src} /> : null}

      <VideoPlayer
        ref={rootRef as never}
        variant={variant}
        className="aspect-video"
        onKeyDown={onKeyDown}
        {...props}
      >
        <VideoPlayerContent
          slot="media"
          src={src}
          poster={poster}
          preload={preload}
          autoPlay={autoPlay}
          muted={muted}
          crossOrigin={crossOrigin}
        >
          {captions?.map((track) => (
            <track
              key={track.srcLang}
              kind="subtitles"
              src={track.src}
              srcLang={track.srcLang}
              label={track.label}
              default={track.default}
            />
          ))}
          {chaptersVttUrl ? (
            <track kind="chapters" src={chaptersVttUrl} default />
          ) : null}
          {storyboard ? (
            <track
              kind="metadata"
              label="thumbnails"
              src={storyboard}
              default
            />
          ) : null}
        </VideoPlayerContent>

        {title ? (
          <div
            data-slot="video-player-title"
            className="scrim-top-background pointer-events-none absolute inset-x-0 top-0 z-10 p-4 opacity-0 transition-opacity group-hover/video-player:opacity-100"
          >
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
        ) : null}

        <VideoPlayerLoadingIndicator />

        {/* Tap = play/pause; double-tap on a side = seek ±10s. The real controls
          live in the control bar, so these pointer affordances are aria-hidden. */}
        <div
          data-slot="video-player-gestures"
          className="absolute inset-0 z-0 grid grid-cols-[1fr_1.2fr_1fr]"
        >
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            data-slot="video-player-gesture-left"
            className="size-full outline-none"
            onClick={tapToggle}
            onDoubleClick={seekZone("left")}
          />
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            data-slot="video-player-gesture-center"
            className="size-full outline-none"
            onClick={tapToggle}
          />
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            data-slot="video-player-gesture-right"
            className="size-full outline-none"
            onClick={tapToggle}
            onDoubleClick={seekZone("right")}
          />
        </div>

        {ripple ? (
          <span
            key={ripple}
            aria-hidden
            data-slot="video-player-ripple"
            data-zone={ripple}
            className={cn(
              "pointer-events-none absolute top-1/2 z-10 size-24 -translate-y-1/2 rounded-full bg-foreground/15 motion-safe:animate-ping",
              ripple === "left" ? "left-[12%]" : "right-[12%]",
            )}
          />
        ) : null}

        {next || countdownSeconds > 0 ? (
          <VideoPlayerEndScreen
            next={next}
            countdownSeconds={countdownSeconds}
          />
        ) : null}

        <div
          data-slot="video-player-chrome"
          className="absolute inset-x-0 bottom-0 z-10 opacity-0 transition-opacity group-hover/video-player:opacity-100 group-focus-within/video-player:opacity-100"
        >
          <div data-slot="video-player-scrubber" className="px-3 pb-1">
            {heatmap && heatmap.length > 0 ? (
              <VideoPlayerHeatmap
                values={heatmap}
                className="mb-1 opacity-0 transition-opacity group-hover/video-player:opacity-100"
              />
            ) : null}
            <VideoPlayerTimeRange className="relative">
              <VideoPlayerPreviewThumbnail slot="preview" />
              <VideoPlayerPreviewChapterDisplay slot="preview" />
              <VideoPlayerPreviewTimeDisplay slot="preview" />
              {chapters && chapters.length > 0 ? (
                <VideoPlayerChapterMarkers
                  chapters={chapters}
                  duration={duration}
                />
              ) : null}
            </VideoPlayerTimeRange>
          </div>

          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            {onNext ? <VideoPlayerNextButton onClick={onNext} /> : null}
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
            <VideoPlayerTimeDisplay showDuration />
            <VideoPlayerSpacer />
            <VideoPlayerCaptionsButton />
            <VideoPlayerSettingsMenuButton />
            <VideoPlayerPipButton />
            <VideoPlayerTheaterButton
              pressed={theaterOn}
              onClick={toggleTheater}
            />
            <VideoPlayerFullscreenButton />
          </VideoPlayerControlBar>
        </div>

        <VideoPlayerSettingsMenu hidden anchor="auto">
          <VideoPlayerSettingsMenuItem>
            Speed
            <VideoPlayerPlaybackRateMenu slot="submenu" hidden>
              <div slot="header">Speed</div>
            </VideoPlayerPlaybackRateMenu>
          </VideoPlayerSettingsMenuItem>
          <VideoPlayerSettingsMenuItem>
            Quality
            <VideoPlayerRenditionMenu slot="submenu" hidden>
              <div slot="header">Quality</div>
            </VideoPlayerRenditionMenu>
          </VideoPlayerSettingsMenuItem>
          <VideoPlayerSettingsMenuItem>
            Captions
            <VideoPlayerCaptionsMenu slot="submenu" hidden>
              <div slot="header">Captions</div>
            </VideoPlayerCaptionsMenu>
          </VideoPlayerSettingsMenuItem>
        </VideoPlayerSettingsMenu>
      </VideoPlayer>
    </div>
  )
}

export { videoPlayerVariants }
