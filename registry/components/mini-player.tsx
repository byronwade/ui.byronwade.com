"use client"

import * as React from "react"
import { ArrowsOut, Pause, Play, X } from "@/lib/icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { Button } from "@/components/ui/button"

const miniPlayerVariants = cva(
  "edge overflow-hidden bg-card text-foreground edge",
  {
    variants: {
      variant: {
        floating: "rounded-xl",
        inline: "grid rounded-xl sm:grid-cols-[minmax(12rem,44%)_1fr]",
        dock: "rounded-lg",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      state: {
        default: "",
        collapsed: "",
        expanded: "",
      },
    },
    compoundVariants: [
      {
        variant: "dock",
        size: "sm",
        className: "max-w-sm",
      },
      {
        variant: "floating",
        size: "lg",
        className: "max-w-xl",
      },
    ],
    defaultVariants: {
      variant: "floating",
      size: "md",
      state: "default",
    },
  },
)

const miniPlayerBodyVariants = cva("flex items-center gap-2", {
  variants: {
    variant: {
      floating: "px-3 py-2",
      inline: "px-3 py-3 sm:px-4",
      dock: "px-2.5 py-2",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    state: {
      default: "",
      collapsed: "",
      expanded: "items-start",
    },
  },
  compoundVariants: [
    {
      variant: "inline",
      state: "expanded",
      className: "items-start",
    },
  ],
  defaultVariants: {
    variant: "floating",
    size: "md",
    state: "default",
  },
})

type MiniPlayerProps = VariantProps<typeof miniPlayerVariants> & {
  title: string
  subtitle?: React.ReactNode
  posterSrc?: string
  /** When set, swaps the poster for inline `<video>` playback while playing. */
  src?: string
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
  /** Force the close control to render; disabled unless `onClose` is provided. */
  showClose?: boolean
  queueLabel?: React.ReactNode
  metadata?: React.ReactNode
  actions?: React.ReactNode
  disabled?: boolean
  playbackLabel?: string
  className?: string
}

function MiniPlayer({
  title,
  subtitle = "Continue watching",
  posterSrc,
  src,
  progress,
  live = false,
  playing,
  defaultPlaying,
  onPlayingChange,
  href,
  onExpand,
  onClose,
  showClose = false,
  queueLabel,
  metadata,
  actions,
  disabled = false,
  playbackLabel,
  variant = "floating",
  size = "md",
  state = "default",
  className,
}: MiniPlayerProps) {
  const isControlled = playing !== undefined
  const [internal, setInternal] = React.useState(defaultPlaying ?? false)
  const isPlaying = isControlled ? playing : internal
  const videoRef = React.useRef<HTMLVideoElement>(null)

  function togglePlaying() {
    if (disabled) return
    const next = !isPlaying
    if (!isControlled) setInternal(next)
    onPlayingChange?.(next)
  }

  React.useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    if (isPlaying && !disabled) {
      const playResult = video.play()
      if (playResult && typeof playResult.catch === "function") {
        void playResult.catch(() => {})
      }
    } else {
      video.pause()
    }
  }, [disabled, isPlaying, src])

  const showVideo = Boolean(src && isPlaying && !disabled)
  const compactState = state === "collapsed"
  const showSecondary = !compactState
  const playLabel = isPlaying ? "Pause" : "Play"
  const playAriaLabel = playbackLabel
    ? `${playLabel} ${playbackLabel}`
    : playLabel
  const shouldRenderClose = showClose || onClose !== undefined

  function handleClose() {
    if (disabled) return
    onClose?.()
  }

  function handleExpand() {
    if (disabled) return
    onExpand?.()
  }

  return (
    <div
      data-slot="mini-player"
      data-variant={variant}
      data-size={size}
      data-state={state}
      data-disabled={disabled || undefined}
      className={cn(
        miniPlayerVariants({ variant, size, state }),
        disabled && "opacity-60",
        className,
      )}
    >
      <div
        data-slot="mini-player-media"
        className={cn(
          "relative aspect-video",
          variant === "inline" && "sm:aspect-auto sm:min-h-full",
        )}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            data-slot="mini-player-video"
            src={src}
            poster={posterSrc}
            className="size-full object-cover"
            playsInline
            muted
          />
        ) : (
          <Thumbnail
            src={posterSrc}
            alt={title}
            progress={progress}
            live={live}
            className="size-full rounded-none"
          />
        )}

        <div className="absolute inset-0 grid place-items-center bg-foreground/0 transition-colors hover:bg-foreground/10">
          <Button
            data-slot="mini-player-play"
            variant="ghost"
            size="icon"
            aria-label={playAriaLabel}
            onClick={togglePlaying}
            disabled={disabled}
            className="rounded-full bg-foreground/60 text-background hover:bg-foreground/70 hover:text-background"
          >
            {isPlaying ? (
              <Pause className="fill-current" />
            ) : (
              <Play className="fill-current" />
            )}
          </Button>
        </div>

        {shouldRenderClose ? (
          <Button
            data-slot="mini-player-close"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={handleClose}
            disabled={disabled || !onClose}
            className="absolute top-1.5 right-1.5 rounded-full bg-foreground/60 text-background hover:bg-foreground/70 hover:text-background"
          >
            <X />
          </Button>
        ) : null}
      </div>

      <div
        data-slot="mini-player-body"
        className={cn(miniPlayerBodyVariants({ variant, size, state }))}
      >
        <div className="min-w-0 flex-1">
          {showSecondary && queueLabel != null ? (
            <div
              data-slot="mini-player-queue-label"
              className="mb-0.5 line-clamp-1 text-xs text-muted-foreground"
            >
              {queueLabel}
            </div>
          ) : null}
          <div
            data-slot="mini-player-title"
            className={cn(
              "line-clamp-1 text-sm font-medium leading-snug",
              size === "lg" && "text-base",
            )}
          >
            {title}
          </div>
          {showSecondary ? (
            <div
              data-slot="mini-player-subtitle"
              className="line-clamp-1 text-xs text-muted-foreground"
            >
              {subtitle}
            </div>
          ) : null}
          {showSecondary && metadata != null ? (
            <div
              data-slot="mini-player-metadata"
              className="mt-1 line-clamp-2 text-xs text-muted-foreground"
            >
              {metadata}
            </div>
          ) : null}
        </div>

        {showSecondary && actions != null ? (
          <div data-slot="mini-player-actions" className="shrink-0">
            {actions}
          </div>
        ) : null}

        {href !== undefined ? (
          <Button
            data-slot="mini-player-expand"
            variant="ghost"
            size="icon-sm"
            aria-label="Expand"
            disabled={disabled}
            render={<a href={href} />}
          >
            <ArrowsOut />
          </Button>
        ) : (
          <Button
            data-slot="mini-player-expand"
            variant="ghost"
            size="icon-sm"
            aria-label="Expand"
            onClick={handleExpand}
            disabled={disabled}
          >
            <ArrowsOut />
          </Button>
        )}
      </div>
    </div>
  )
}

export { MiniPlayer }
export type { MiniPlayerProps }
