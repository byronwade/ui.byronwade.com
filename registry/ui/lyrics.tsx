"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Synced, scrolling lyric lines. The active line (by `activeIndex`) is
 * `text-foreground` and slightly heavier; the rest are `text-muted-foreground`.
 * When `activeIndex` changes the active line scrolls into view, switching to an
 * instant jump under `prefers-reduced-motion`.
 *
 * Presentational/controlled: lines and the active index come from the consumer;
 * lines become buttons (seek-to-line) only when `onLineClick` is supplied.
 */
export type LyricLine = {
  /** Optional timestamp in seconds (for the consumer's sync logic). */
  time?: number
  text: string
}

export type LyricsProps = React.ComponentProps<"div"> & {
  lines: LyricLine[]
  activeIndex?: number
  onLineClick?: (index: number) => void
}

export function Lyrics({
  lines,
  activeIndex = -1,
  onLineClick,
  className,
  ...props
}: LyricsProps) {
  const activeRef = React.useRef<HTMLLIElement>(null)

  React.useEffect(() => {
    const el = activeRef.current
    if (!el) return
    const reduced =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({
      block: "center",
      behavior: reduced ? "auto" : "smooth",
    })
  }, [activeIndex])

  return (
    <div
      data-slot="lyrics"
      className={cn("scrollbar-thin max-h-80 overflow-y-auto", className)}
      {...props}
    >
      <ol className="flex flex-col gap-3 py-4">
        {lines.map((line, i) => {
          const active = i === activeIndex
          const content = (
            <span
              className={cn(
                "block text-2xl tracking-tight transition-colors motion-reduce:transition-none",
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {line.text}
            </span>
          )
          return (
            <li
              key={i}
              ref={active ? activeRef : undefined}
              data-slot="lyrics-line"
              data-active={active}
            >
              {onLineClick ? (
                <button
                  type="button"
                  onClick={() => onLineClick(i)}
                  className="block w-full rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
