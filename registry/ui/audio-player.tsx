/**
 * Audio sibling of `video-player`. Same token-mapped media-chrome chrome,
 * scoped to an `<audio>` element. The accent (range progress, focus) resolves to
 * `--brand`, so the player re-skins with the rest of the system and inherits
 * dark mode for free — nothing is pinned to a literal color.
 */
"use client"

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import type { ComponentProps, CSSProperties } from "react"

import { cn } from "@/lib/utils"

const mediaVariables = {
  "--media-primary-color": "var(--foreground)",
  "--media-secondary-color": "var(--muted)",
  "--media-text-color": "var(--foreground)",
  "--media-background-color": "var(--background)",
  "--media-control-background": "transparent",
  "--media-control-hover-background": "var(--accent)",
  "--media-font-family": "var(--font-sans)",
  "--media-font-weight": "400",
  "--media-range-track-background": "var(--border)",
  "--media-range-bar-color": "var(--brand)",
  "--media-range-thumb-background": "var(--brand)",
  "--media-time-range-buffered-color": "var(--muted-foreground)",
} as CSSProperties

const audioPlayerVariants = cva(
  "group/audio-player isolate w-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_media-controller]:w-full",
  {
    variants: {
      variant: {
        default: "rounded-lg edge bg-card",
        minimal: "rounded-lg edge bg-transparent",
        card: "flex items-center gap-3 rounded-2xl edge bg-background p-2",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export type AudioPlayerProps = ComponentProps<typeof MediaController> &
  VariantProps<typeof audioPlayerVariants>

export const AudioPlayer = ({
  className,
  style,
  variant,
  ...props
}: AudioPlayerProps) => {
  const resolvedVariant = variant ?? "default"
  return (
    <MediaController
      audio
      data-slot="audio-player"
      data-variant={resolvedVariant}
      className={cn(
        audioPlayerVariants({ variant: resolvedVariant }),
        className,
      )}
      style={{ ...mediaVariables, ...style }}
      {...props}
    />
  )
}

export type AudioPlayerContentProps = ComponentProps<"audio">

export const AudioPlayerContent = ({
  className,
  ...props
}: AudioPlayerContentProps) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <audio
    slot="media"
    data-slot="audio-player-content"
    className={cn("mt-0 mb-0", className)}
    {...props}
  />
)

export type AudioPlayerControlBarProps = ComponentProps<typeof MediaControlBar>

export const AudioPlayerControlBar = ({
  className,
  ...props
}: AudioPlayerControlBarProps) => (
  <MediaControlBar
    data-slot="audio-player-control-bar"
    className={cn("flex w-full items-center gap-0.5 bg-transparent", className)}
    {...props}
  />
)

export type AudioPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>

export const AudioPlayerPlayButton = ({
  className,
  ...props
}: AudioPlayerPlayButtonProps) => (
  <MediaPlayButton
    data-slot="audio-player-play-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type AudioPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>

export const AudioPlayerSeekBackwardButton = ({
  className,
  ...props
}: AudioPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton
    data-slot="audio-player-seek-backward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type AudioPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>

export const AudioPlayerSeekForwardButton = ({
  className,
  ...props
}: AudioPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton
    data-slot="audio-player-seek-forward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type AudioPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>

export const AudioPlayerTimeRange = ({
  className,
  ...props
}: AudioPlayerTimeRangeProps) => (
  <MediaTimeRange
    data-slot="audio-player-time-range"
    className={cn("flex-1 p-2.5", className)}
    {...props}
  />
)

export type AudioPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>

export const AudioPlayerTimeDisplay = ({
  className,
  ...props
}: AudioPlayerTimeDisplayProps) => (
  <MediaTimeDisplay
    data-slot="audio-player-time-display"
    className={cn("p-2.5 font-mono text-sm tabular-nums", className)}
    {...props}
  />
)

export type AudioPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>

export const AudioPlayerMuteButton = ({
  className,
  ...props
}: AudioPlayerMuteButtonProps) => (
  <MediaMuteButton
    data-slot="audio-player-mute-button"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export type AudioPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>

export const AudioPlayerVolumeRange = ({
  className,
  ...props
}: AudioPlayerVolumeRangeProps) => (
  <MediaVolumeRange
    data-slot="audio-player-volume-range"
    className={cn("p-2.5", className)}
    {...props}
  />
)

export { audioPlayerVariants }
