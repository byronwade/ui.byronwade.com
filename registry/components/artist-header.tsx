"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AlbumCover } from "@/components/ui/album-cover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Artist hero header — composes `album-cover` (round artwork) + a verified
 * `badge` + the monthly-listeners stat + Play/Follow `button`s. Editorial
 * typography: the name is `font-normal` with tight tracking, the listener count
 * is `font-mono`. The primary Play button follows `--brand`.
 */
const VerifiedGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3">
    <path d="M12 2l2.4 1.7 2.9-.3 1.3 2.6 2.6 1.3-.3 2.9L22 12l-1.7 2.4.3 2.9-2.6 1.3-1.3 2.6-2.9-.3L12 22l-2.4-1.7-2.9.3-1.3-2.6L2.8 16.7l.3-2.9L2 12l1.1-2.4-.3-2.9 2.6-1.3L6.7 2.8l2.9.3L12 2zm-1 13l5-5-1.4-1.4L11 12.2 9.4 10.6 8 12l3 3z" />
  </svg>
)

export type ArtistHeaderProps = Omit<React.ComponentProps<"div">, "onPlay"> & {
  name: string
  image: string
  verified?: boolean
  monthlyListeners?: number
  isFollowing?: boolean
  isPlaying?: boolean
  onPlay?: () => void
  onFollowToggle?: () => void
}

const listenerFormatter = new Intl.NumberFormat("en-US")

export function ArtistHeader({
  name,
  image,
  verified = false,
  monthlyListeners,
  isFollowing = false,
  isPlaying = false,
  onPlay,
  onFollowToggle,
  className,
  ...props
}: ArtistHeaderProps) {
  const formatted =
    monthlyListeners != null ? listenerFormatter.format(monthlyListeners) : null
  return (
    <div
      data-slot="artist-header"
      className={cn("flex flex-col gap-6 sm:flex-row sm:items-end", className)}
      {...props}
    >
      <AlbumCover
        src={image}
        alt={name}
        size="lg"
        rounded="full"
        shadow
        className="shrink-0"
      />
      <div className="flex flex-col gap-3">
        {verified ? (
          <Badge variant="secondary" className="w-fit gap-1">
            <VerifiedGlyph /> Verified Artist
          </Badge>
        ) : null}
        <h1
          data-slot="artist-header-name"
          className="text-5xl font-normal tracking-tight text-foreground"
        >
          {name}
        </h1>
        {formatted ? (
          <p className="font-mono text-sm tabular-nums text-muted-foreground">
            {formatted} monthly listeners
          </p>
        ) : null}
        <div className="mt-1 flex items-center gap-3">
          <Button
            onClick={onPlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            aria-pressed={isPlaying}
            className="bg-brand text-primary-foreground hover:bg-brand/90"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            aria-pressed={isFollowing}
            onClick={onFollowToggle}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
    </div>
  )
}
