"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { EqualizerBars } from "@/components/ui/equalizer-bars"

/**
 * A list of song rows. `TrackList` is the container; `TrackRow` is one row.
 *
 * Token-only: hover/focus rows tint `bg-accent`, the active row's title and
 * play affordance follow `--brand`, and the active+playing row swaps its index
 * for `equalizer-bars`. The leading play affordance is a real `<button>` (the
 * keyboard control); whole-row click is a mouse convenience.
 */
export type TrackListProps = React.ComponentProps<"div">

export function TrackList({ className, children, ...props }: TrackListProps) {
  return (
    <div
      data-slot="track-list"
      role="list"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

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

export type TrackRowProps = Omit<React.ComponentProps<"div">, "onPlay"> & {
  /** 1-based position shown in the leading cell. */
  index: number
  title: string
  artist?: string
  album?: string
  /** Pre-formatted duration, e.g. "3:24". */
  duration: string
  /** This row is the current track. */
  active?: boolean
  /** The current track is playing (only meaningful with `active`). */
  playing?: boolean
  explicit?: boolean
  liked?: boolean
  onPlay?: () => void
  onLikeToggle?: () => void
}

export function TrackRow({
  index,
  title,
  artist,
  album,
  duration,
  active = false,
  playing = false,
  explicit = false,
  liked = false,
  onPlay,
  onLikeToggle,
  className,
  ...props
}: TrackRowProps) {
  const meta = [artist, album].filter(Boolean).join(" • ")
  return (
    <div
      data-slot="track-row"
      data-active={active}
      role="listitem"
      onClick={onPlay}
      className={cn(
        "group/track-row grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent",
        onPlay && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <span
        data-slot="track-row-index"
        className="flex w-8 items-center justify-center text-sm text-muted-foreground"
      >
        {active && playing ? (
          <EqualizerBars size="sm" playing aria-label={`${title} is playing`} />
        ) : onPlay ? (
          <button
            type="button"
            data-slot="track-row-play"
            aria-label={`Play ${title}`}
            onClick={(event) => {
              event.stopPropagation()
              onPlay()
            }}
            className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-mono tabular-nums group-hover/track-row:hidden group-focus-within/track-row:hidden">
              {index}
            </span>
            <span className="hidden text-foreground group-hover/track-row:inline group-focus-within/track-row:inline">
              <PlayGlyph />
            </span>
          </button>
        ) : (
          <span className="font-mono tabular-nums">{index}</span>
        )}
      </span>

      <span data-slot="track-row-meta" className="min-w-0">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            active ? "text-brand" : "text-foreground",
          )}
        >
          {title}
        </span>
        {meta ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {explicit ? (
              <Badge
                variant="secondary"
                aria-label="Explicit"
                className="h-3.5 px-1 text-[0.6rem]"
              >
                E
              </Badge>
            ) : null}
            <span className="truncate">{meta}</span>
          </span>
        ) : null}
      </span>

      <span data-slot="track-row-end" className="flex items-center gap-3">
        {onLikeToggle ? (
          <button
            type="button"
            data-slot="track-row-like"
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
            onClick={(event) => {
              event.stopPropagation()
              onLikeToggle()
            }}
            className={cn(
              "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              liked
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <HeartGlyph filled={liked} />
          </button>
        ) : null}
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {duration}
        </span>
      </span>
    </div>
  )
}
