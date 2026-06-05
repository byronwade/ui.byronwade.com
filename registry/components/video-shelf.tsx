"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type VideoShelfProps = {
  title?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

function VideoShelf({ title, action, children, className }: VideoShelfProps) {
  const track = React.useRef<HTMLDivElement>(null)

  function scroll(direction: "left" | "right") {
    track.current?.scrollBy({
      left: direction === "left" ? -480 : 480,
      behavior: "smooth",
    })
  }

  const hasHeader = title != null || action != null

  return (
    <section data-slot="video-shelf" className={cn("relative", className)}>
      {hasHeader ? (
        <div
          data-slot="video-shelf-header"
          className="mb-3 flex items-center justify-between gap-4"
        >
          {title != null ? (
            <h2
              data-slot="video-shelf-title"
              className="text-lg font-medium tracking-tight text-foreground sm:text-xl"
            >
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action != null ? (
            <div data-slot="video-shelf-action" className="shrink-0">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="group relative">
        <button
          type="button"
          data-slot="video-shelf-scroll-left"
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-0 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity outline-none group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div
          ref={track}
          data-slot="video-shelf-track"
          className="mask-fade-x scrollbar-thin flex gap-4 overflow-x-auto pb-2"
        >
          {React.Children.map(children, (child) => (
            <div data-slot="video-shelf-item" className="shrink-0">
              {child}
            </div>
          ))}
        </div>

        <button
          type="button"
          data-slot="video-shelf-scroll-right"
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-0 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity outline-none group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </section>
  )
}

export { VideoShelf }
export type { VideoShelfProps }
