"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"

/**
 * Grid tile composing `album-cover` + title + description — the playlist/album
 * card in a browse grid. The cover surfaces the hover-reveal play button and
 * the active equalizer overlay; the whole card lifts on hover (`bg-accent`).
 * Token-only and presentational: playback state and clicks come from props.
 */
export type PlaylistCardProps = Omit<
  React.ComponentProps<"div">,
  "onPlay" | "title"
> & {
  src: string
  title: string
  description?: string
  playing?: boolean
  onPlay?: () => void
}

export function PlaylistCard({
  src,
  title,
  description,
  playing = false,
  onPlay,
  className,
  ...props
}: PlaylistCardProps) {
  return (
    <div
      data-slot="playlist-card"
      className={cn(
        "group/playlist-card flex w-full max-w-56 flex-col gap-3 rounded-2xl bg-card p-3 transition-colors hover:bg-accent",
        className,
      )}
      {...props}
    >
      <AlbumCover
        src={src}
        alt={title}
        size="lg"
        rounded="md"
        shadow
        playing={playing}
        onPlay={onPlay}
        className="max-w-none"
      />
      <span data-slot="playlist-card-body" className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  )
}
