"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { EqualizerBars } from "@/components/ui/equalizer-bars"

/**
 * Square album / playlist artwork with an optional hover-reveal play button.
 *
 * Token-only: the play affordance is `bg-brand` (re-skins with `--brand`) and,
 * while `playing`, an `equalizer-bars` overlay marks the active state. The play
 * button is a real `<button>` with an `aria-label`, so the cover stays
 * keyboard- and screen-reader-accessible.
 */
const albumCoverVariants = cva(
  "group/album-cover relative isolate aspect-square overflow-hidden bg-muted",
  {
    variants: {
      size: {
        sm: "w-full max-w-12",
        md: "w-full max-w-40",
        lg: "w-full max-w-56",
        xl: "w-full max-w-72",
      },
      rounded: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      shadow: {
        true: "shadow-md",
        false: "",
      },
    },
    defaultVariants: { size: "md", rounded: "md", shadow: false },
  },
)

const PlayIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="ml-0.5 size-5"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
)

export type AlbumCoverProps = Omit<React.ComponentProps<"div">, "onPlay"> &
  VariantProps<typeof albumCoverVariants> & {
    /** Cover image URL. */
    src: string
    /** Alt text — also names the play button ("Play {alt}"). */
    alt: string
    /** Show the active/playing state (equalizer overlay + pause icon). */
    playing?: boolean
    /** When provided, renders a play/pause button that calls this. */
    onPlay?: () => void
  }

export function AlbumCover({
  src,
  alt,
  size,
  rounded,
  shadow,
  playing = false,
  onPlay,
  className,
  ...props
}: AlbumCoverProps) {
  return (
    <div
      data-slot="album-cover"
      data-playing={playing}
      className={cn(albumCoverVariants({ size, rounded, shadow }), className)}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        data-slot="album-cover-image"
        className="size-full object-cover"
      />
      {playing ? (
        <span
          data-slot="album-cover-equalizer"
          className="absolute top-2 left-2 z-10 rounded-sm bg-background/70 p-1 backdrop-blur-sm"
        >
          <EqualizerBars size="sm" playing aria-label={`${alt} is playing`} />
        </span>
      ) : null}
      {onPlay ? (
        <button
          type="button"
          data-slot="album-cover-play"
          aria-label={`${playing ? "Pause" : "Play"} ${alt}`}
          onClick={onPlay}
          className={cn(
            "absolute right-2 bottom-2 z-10 flex size-10 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            playing
              ? "opacity-100"
              : "translate-y-1 opacity-0 group-hover/album-cover:translate-y-0 group-hover/album-cover:opacity-100 group-focus-within/album-cover:translate-y-0 group-focus-within/album-cover:opacity-100",
          )}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      ) : null}
    </div>
  )
}
