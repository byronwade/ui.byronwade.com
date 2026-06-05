"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"
import { Slider } from "@/components/ui/slider"

/**
 * Sticky bottom transport bar, composed from `album-cover` + `slider`. The
 * parts are fully controlled: `NowPlayingBar` is layout-only and each part
 * takes the props/callbacks it needs. Active controls follow `--brand`.
 *
 * Compose: `NowPlayingBar` > `NowPlayingBarTrack` + `NowPlayingBarControls`
 * (+ `NowPlayingBarProgress`) + `NowPlayingBarExtras`.
 */
export type NowPlayingBarProps = React.ComponentProps<"div">

export function NowPlayingBar({
  className,
  children,
  ...props
}: NowPlayingBarProps) {
  return (
    <div
      data-slot="now-playing-bar"
      role="region"
      aria-label="Now playing"
      className={cn(
        "flex w-full items-center gap-4 border-t border-border bg-card px-4 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const HeartGlyph = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
    className="size-4"
  >
    <path d="M12 21s-7-4.5-9.5-8.5C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 7C19 16.5 12 21 12 21z" />
  </svg>
)

export type NowPlayingBarTrackProps = React.ComponentProps<"div"> & {
  src: string
  title: string
  artist?: string
  liked?: boolean
  onLikeToggle?: () => void
}

export function NowPlayingBarTrack({
  src,
  title,
  artist,
  liked = false,
  onLikeToggle,
  className,
  ...props
}: NowPlayingBarTrackProps) {
  return (
    <div
      data-slot="now-playing-bar-track"
      className={cn("flex min-w-0 flex-1 items-center gap-3", className)}
      {...props}
    >
      <AlbumCover src={src} alt={title} size="sm" rounded="md" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {artist ? (
          <span className="block truncate text-xs text-muted-foreground">
            {artist}
          </span>
        ) : null}
      </span>
      {onLikeToggle ? (
        <button
          type="button"
          data-slot="now-playing-bar-like"
          aria-label={liked ? "Unlike" : "Like"}
          aria-pressed={liked}
          onClick={onLikeToggle}
          className={cn(
            "ml-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            liked
              ? "text-brand"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <HeartGlyph filled={liked} />
        </button>
      ) : null}
    </div>
  )
}

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={cn("size-4", className)}
  >
    <path d={d} />
  </svg>
)

const ICONS = {
  shuffle: "M17 3h4v4M21 3l-7 7M3 21l6-6M3 7h3l11 11h4M21 17v4h-4",
  prev: "M6 5v14M20 5L9 12l11 7z",
  next: "M18 5v14M4 5l11 7L4 19z",
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  repeat:
    "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
}

export type NowPlayingBarControlsProps = React.ComponentProps<"div"> & {
  isPlaying?: boolean
  shuffle?: boolean
  repeat?: boolean
  onPlayPause?: () => void
  onPrev?: () => void
  onNext?: () => void
  onShuffleToggle?: () => void
  onRepeatToggle?: () => void
}

export function NowPlayingBarControls({
  isPlaying = false,
  shuffle = false,
  repeat = false,
  onPlayPause,
  onPrev,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  className,
  ...props
}: NowPlayingBarControlsProps) {
  const ctrl =
    "flex items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
  const tone = (on?: boolean) =>
    on ? "text-brand" : "text-muted-foreground hover:text-foreground"
  return (
    <div
      data-slot="now-playing-bar-controls"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <button
        type="button"
        aria-label="Shuffle"
        aria-pressed={shuffle}
        onClick={onShuffleToggle}
        className={cn(ctrl, "size-7", tone(shuffle))}
      >
        <Icon d={ICONS.shuffle} />
      </button>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        className={cn(ctrl, "size-7", tone())}
      >
        <Icon d={ICONS.prev} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-pressed={isPlaying}
        onClick={onPlayPause}
        className={cn(
          ctrl,
          "size-9 bg-brand text-primary-foreground transition-transform hover:scale-105",
        )}
      >
        <Icon d={isPlaying ? ICONS.pause : ICONS.play} className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className={cn(ctrl, "size-7", tone())}
      >
        <Icon d={ICONS.next} />
      </button>
      <button
        type="button"
        aria-label="Repeat"
        aria-pressed={repeat}
        onClick={onRepeatToggle}
        className={cn(ctrl, "size-7", tone(repeat))}
      >
        <Icon d={ICONS.repeat} />
      </button>
    </div>
  )
}

const formatTime = (seconds: number) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  const minutes = Math.floor(safe / 60)
  const rest = Math.floor(safe % 60)
  return `${minutes}:${rest.toString().padStart(2, "0")}`
}

const toScalar = (value: number | readonly number[]) =>
  Array.isArray(value) ? value[0] : (value as number)

export type NowPlayingBarProgressProps = Omit<
  React.ComponentProps<"div">,
  "onSeek"
> & {
  /** Elapsed time, in seconds. */
  progress?: number
  /** Total duration, in seconds. */
  duration?: number
  /** Seek callback, in seconds. */
  onSeek?: (seconds: number) => void
}

export function NowPlayingBarProgress({
  progress = 0,
  duration = 0,
  onSeek,
  className,
  ...props
}: NowPlayingBarProgressProps) {
  return (
    <div
      data-slot="now-playing-bar-progress"
      className={cn("flex w-full flex-1 items-center gap-2", className)}
      {...props}
    >
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {formatTime(progress)}
      </span>
      <Slider
        aria-label="Seek"
        value={progress}
        min={0}
        max={duration || 1}
        onValueChange={(value) => onSeek?.(toScalar(value))}
        className="flex-1"
      />
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {formatTime(duration)}
      </span>
    </div>
  )
}

const VolumeGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="size-4 text-muted-foreground"
  >
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
  </svg>
)

export type NowPlayingBarExtrasProps = Omit<
  React.ComponentProps<"div">,
  "onVolumeChange"
> & {
  /** Volume, 0–100. */
  volume?: number
  onVolumeChange?: (volume: number) => void
}

export function NowPlayingBarExtras({
  volume = 100,
  onVolumeChange,
  className,
  children,
  ...props
}: NowPlayingBarExtrasProps) {
  return (
    <div
      data-slot="now-playing-bar-extras"
      className={cn("flex flex-1 items-center justify-end gap-3", className)}
      {...props}
    >
      {children}
      <VolumeGlyph />
      <Slider
        aria-label="Volume"
        value={volume}
        min={0}
        max={100}
        onValueChange={(value) => onVolumeChange?.(toScalar(value))}
        className="w-24"
      />
    </div>
  )
}
