import { Play } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type ThumbnailProps = React.ComponentProps<"div"> & {
  /** Image URL. When omitted, a muted placeholder is rendered instead. */
  src?: string
  /** Alt text for the image; its initial seeds the placeholder glyph. */
  alt?: string
  /** Runtime label (e.g. "12:34") shown as a bottom-right mono pill. */
  duration?: string
  /** Watched fraction, 0–100, drawn as a thin bar pinned to the bottom edge. */
  progress?: number
  /** Render a top-left "LIVE" chip on the destructive token. */
  live?: boolean
  /** Aspect ratio passed to AspectRatio. Default 16/9. */
  ratio?: number
  /** Show a play glyph overlay on group hover (YouTube-style preview hint). */
  hoverPlay?: boolean
}

function Thumbnail({
  src,
  alt = "",
  duration,
  progress,
  live = false,
  ratio = 16 / 9,
  hoverPlay = false,
  className,
  ...props
}: ThumbnailProps) {
  return (
    <div
      data-slot="thumbnail"
      className={cn(
        "group/thumbnail relative isolate overflow-hidden rounded-lg bg-muted",
        className,
      )}
      {...props}
    >
      <AspectRatio ratio={ratio}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            data-slot="thumbnail-image"
            className="size-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-105"
          />
        ) : (
          <div
            data-slot="thumbnail-placeholder"
            className="grid size-full place-items-center bg-muted text-muted-foreground"
          >
            {alt ? (
              <span aria-hidden className="font-mono text-2xl">
                {alt.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Play aria-hidden className="size-8 fill-current" />
            )}
          </div>
        )}
      </AspectRatio>

      {hoverPlay && src ? (
        <div
          aria-hidden
          data-slot="thumbnail-hover-play"
          className="pointer-events-none absolute inset-0 grid place-items-center bg-foreground/0 opacity-0 transition-opacity duration-200 group-hover/thumbnail:bg-foreground/10 group-hover/thumbnail:opacity-100"
        >
          <span className="grid size-12 place-items-center rounded-full bg-background/80 text-foreground edge backdrop-blur-sm">
            <Play className="size-5 fill-current" />
          </span>
        </div>
      ) : null}

      {live ? (
        <span
          data-slot="thumbnail-live"
          className="absolute top-2 left-2 z-10 rounded-sm bg-destructive px-1.5 py-0.5 text-xs font-medium tracking-wide text-destructive-foreground uppercase"
        >
          Live
        </span>
      ) : null}

      {duration ? (
        <span
          data-slot="thumbnail-duration"
          className="absolute right-2 bottom-2 z-10 rounded-sm bg-foreground/80 px-1.5 py-0.5 font-mono text-xs tabular-nums text-background"
        >
          {duration}
        </span>
      ) : null}

      {progress !== undefined ? (
        <div
          data-slot="thumbnail-progress"
          className="absolute inset-x-0 bottom-0 z-10 h-1 bg-foreground/30"
        >
          <div
            data-slot="thumbnail-progress-fill"
            className="h-full bg-brand"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}

export { Thumbnail }
export type { ThumbnailProps }
