"use client"

import * as React from "react"
import { Maximize2, Pause, Play, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { Button } from "@/components/ui/button"

type MiniPlayerProps = {
  title: string
  subtitle?: React.ReactNode
  posterSrc?: string
  /** Watched fraction, 0–100, forwarded to the poster Thumbnail. */
  progress?: number
  live?: boolean
  /** Controlled play state. Pair with `onPlayingChange`. */
  playing?: boolean
  /** Initial play state when uncontrolled. */
  defaultPlaying?: boolean
  onPlayingChange?: (next: boolean) => void
  /** Renders the expand control as a link; falls back to `onExpand` otherwise. */
  href?: string
  onExpand?: () => void
  /** When provided, renders a close (X) button in the media's top-right. */
  onClose?: () => void
  className?: string
}

function MiniPlayer({
  title,
  subtitle = "Continue watching",
  posterSrc,
  progress,
  live = false,
  playing,
  defaultPlaying,
  onPlayingChange,
  href,
  onExpand,
  onClose,
  className,
}: MiniPlayerProps) {
  const isControlled = playing !== undefined
  const [internal, setInternal] = React.useState(defaultPlaying ?? false)
  const isPlaying = isControlled ? playing : internal

  function togglePlaying() {
    const next = !isPlaying
    if (!isControlled) setInternal(next)
    onPlayingChange?.(next)
  }

  return (
    <div
      data-slot="mini-player"
      className={cn(
        "edge overflow-hidden rounded-xl bg-card text-foreground",
        className,
      )}
    >
      <div data-slot="mini-player-media" className="relative">
        <Thumbnail
          src={posterSrc}
          alt={title}
          progress={progress}
          live={live}
        />

        <div className="absolute inset-0 grid place-items-center">
          <Button
            data-slot="mini-player-play"
            variant="ghost"
            size="icon"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlaying}
            className="rounded-full bg-foreground/60 text-background hover:bg-foreground/70 hover:text-background"
          >
            {isPlaying ? (
              <Pause className="fill-current" />
            ) : (
              <Play className="fill-current" />
            )}
          </Button>
        </div>

        {onClose ? (
          <Button
            data-slot="mini-player-close"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-1.5 right-1.5 rounded-full bg-foreground/60 text-background hover:bg-foreground/70 hover:text-background"
          >
            <X />
          </Button>
        ) : null}
      </div>

      <div
        data-slot="mini-player-body"
        className="flex items-center gap-2 px-3 py-2"
      >
        <div className="min-w-0 flex-1">
          <div
            data-slot="mini-player-title"
            className="line-clamp-1 text-sm font-medium leading-snug"
          >
            {title}
          </div>
          <div
            data-slot="mini-player-subtitle"
            className="line-clamp-1 text-xs text-muted-foreground"
          >
            {subtitle}
          </div>
        </div>

        {href !== undefined ? (
          <Button
            data-slot="mini-player-expand"
            variant="ghost"
            size="icon-sm"
            aria-label="Expand"
            render={<a href={href} />}
          >
            <Maximize2 />
          </Button>
        ) : (
          <Button
            data-slot="mini-player-expand"
            variant="ghost"
            size="icon-sm"
            aria-label="Expand"
            onClick={onExpand}
          >
            <Maximize2 />
          </Button>
        )}
      </div>
    </div>
  )
}

export { MiniPlayer }
export type { MiniPlayerProps }
