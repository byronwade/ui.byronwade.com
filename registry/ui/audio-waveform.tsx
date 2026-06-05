"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Bar-style waveform scrubber. Played bars resolve to `bg-brand`; the remainder
 * to `bg-muted-foreground/30`, so the progress fill re-skins with `--brand`.
 *
 * Presentational/controlled: `peaks` (bar heights) and `progress` are supplied
 * by the consumer; clicks and arrow keys report a 0–1 ratio through `onSeek`.
 * It exposes `role="slider"` with the usual aria-value* attributes.
 */
const STEP = 0.05

export type AudioWaveformProps = Omit<
  React.ComponentProps<"div">,
  "onSeek" | "children"
> & {
  /** Bar heights, each 0–1. */
  peaks: number[]
  /** Playback progress, 0–1. */
  progress?: number
  /** Seek callback receiving a clamped 0–1 ratio. Omit for a static display. */
  onSeek?: (ratio: number) => void
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))

export function AudioWaveform({
  peaks,
  progress = 0,
  onSeek,
  className,
  "aria-label": ariaLabel = "Seek",
  ...props
}: AudioWaveformProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const seekFromClientX = (clientX: number) => {
    const el = ref.current
    if (!el || !onSeek) return
    const rect = el.getBoundingClientRect()
    onSeek(clamp((clientX - rect.left) / rect.width))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!onSeek) return
    if (event.key === "ArrowRight") {
      event.preventDefault()
      onSeek(clamp(progress + STEP))
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      onSeek(clamp(progress - STEP))
    } else if (event.key === "Home") {
      event.preventDefault()
      onSeek(0)
    } else if (event.key === "End") {
      event.preventDefault()
      onSeek(1)
    }
  }

  return (
    <div
      ref={ref}
      data-slot="audio-waveform"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamp(progress) * 100)}
      tabIndex={onSeek ? 0 : undefined}
      onClick={onSeek ? (event) => seekFromClientX(event.clientX) : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex h-12 w-full items-center gap-px outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        onSeek && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {peaks.map((peak, i) => {
        const played = peaks.length > 0 && i / peaks.length <= progress
        return (
          <span
            key={i}
            data-slot="audio-waveform-bar"
            className={cn(
              "min-h-0.5 flex-1 rounded-full transition-colors motion-reduce:transition-none",
              played ? "bg-brand" : "bg-muted-foreground/30",
            )}
            style={{ height: `${Math.max(4, clamp(peak) * 100)}%` }}
          />
        )
      })}
    </div>
  )
}
