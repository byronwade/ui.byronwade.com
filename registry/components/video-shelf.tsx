"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const videoShelfVariants = cva("relative", {
  variants: {
    density: {
      comfortable: "",
      compact: "",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
})

const trackVariants = cva("", {
  variants: {
    variant: {
      carousel:
        "mask-fade-x scrollbar-thin flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
      grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
      rail: "mask-fade-x scrollbar-thin flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2",
      stack: "flex flex-col gap-3",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  compoundVariants: [
    {
      variant: "carousel",
      density: "compact",
      className: "gap-3",
    },
    {
      variant: "rail",
      density: "compact",
      className: "gap-2",
    },
    {
      variant: "grid",
      density: "compact",
      className: "gap-3",
    },
    {
      variant: "stack",
      density: "compact",
      className: "gap-2",
    },
  ],
  defaultVariants: {
    variant: "carousel",
    density: "comfortable",
  },
})

type VideoShelfProps = VariantProps<typeof videoShelfVariants> &
  VariantProps<typeof trackVariants> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  controls?: "hover" | "always" | "none"
  empty?: React.ReactNode
  loading?: boolean
  loadingItems?: number
  itemClassName?: string
  scrollAmount?: number | "page"
  onScrollStateChange?: (state: {
    canScrollLeft: boolean
    canScrollRight: boolean
  }) => void
  className?: string
}

function VideoShelf({
  title,
  description,
  action,
  children,
  variant = "carousel",
  density = "comfortable",
  controls = "hover",
  empty,
  loading = false,
  loadingItems = 4,
  itemClassName,
  scrollAmount = "page",
  onScrollStateChange,
  className,
}: VideoShelfProps) {
  const track = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const horizontal = variant === "carousel" || variant === "rail"
  const childArray = React.Children.toArray(children).filter(Boolean)
  const isEmpty = !loading && childArray.length === 0

  function updateScrollState() {
    const el = track.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const next = {
      canScrollLeft: scrollLeft > 4,
      canScrollRight: scrollLeft + clientWidth < scrollWidth - 4,
    }
    setCanScrollLeft(next.canScrollLeft)
    setCanScrollRight(next.canScrollRight)
    onScrollStateChange?.(next)
  }

  React.useEffect(() => {
    const el = track.current
    if (!el || !horizontal) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScrollState)
      observer.observe(el)
    }
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
      observer?.disconnect()
    }
  }, [children, horizontal, onScrollStateChange])

  function scroll(direction: "left" | "right") {
    const el = track.current
    if (!el) return
    const amount =
      scrollAmount === "page"
        ? Math.max(el.clientWidth * 0.85, 320)
        : scrollAmount
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  function handleTrackKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!horizontal) return
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scroll("left")
    }
    if (event.key === "ArrowRight") {
      event.preventDefault()
      scroll("right")
    }
  }

  const hasHeader = title != null || description != null || action != null
  const showControls = horizontal && controls !== "none" && !loading && !isEmpty

  const chevronClass =
    "absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-all outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-0"

  return (
    <section
      data-slot="video-shelf"
      data-variant={variant}
      data-density={density}
      className={cn(videoShelfVariants({ density }), className)}
    >
      {hasHeader ? (
        <div
          data-slot="video-shelf-header"
          className={cn(
            "mb-3 flex items-start justify-between gap-4",
            density === "compact" && "mb-2",
          )}
        >
          <div className="min-w-0">
            {title != null ? (
              <h2
                data-slot="video-shelf-title"
                className="text-lg font-medium tracking-tight text-foreground sm:text-xl"
              >
                {title}
              </h2>
            ) : null}
            {description != null ? (
              <p
                data-slot="video-shelf-description"
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {action != null ? (
            <div data-slot="video-shelf-action" className="shrink-0">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}

      {isEmpty ? (
        <div
          data-slot="video-shelf-empty"
          className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground"
        >
          {empty ?? "No videos to show."}
        </div>
      ) : null}

      {loading ? (
        <div
          data-slot="video-shelf-track"
          className={cn(trackVariants({ variant, density }))}
        >
          {Array.from({ length: loadingItems }, (_, index) => (
            <div
              key={index}
              data-slot="video-shelf-item"
              className={cn(
                horizontal && "shrink-0 snap-start scroll-ml-4",
                itemClassName,
              )}
            >
              <Skeleton
                data-slot="video-shelf-skeleton"
                className="aspect-video w-64 rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : null}

      {!loading && !isEmpty ? (
      <div className="group relative">
        {showControls ? (
          <button
            type="button"
            data-slot="video-shelf-scroll-left"
            aria-label="Scroll left"
            disabled={!canScrollLeft}
            onClick={() => scroll("left")}
            className={cn(
              chevronClass,
              "left-0",
              controls === "hover" &&
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              controls === "always" && "opacity-100",
              canScrollLeft && "opacity-100",
            )}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        ) : null}

        <div
          ref={track}
          data-slot="video-shelf-track"
          tabIndex={horizontal ? 0 : undefined}
          onKeyDown={handleTrackKeyDown}
          className={cn(
            trackVariants({ variant, density }),
            horizontal &&
              "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        >
          {childArray.map((child) => (
            <div
              key={(child as React.ReactElement).key}
              data-slot="video-shelf-item"
              className={cn(
                horizontal && "shrink-0 snap-start scroll-ml-4",
                itemClassName,
              )}
            >
              {child}
            </div>
          ))}
        </div>

        {showControls ? (
          <button
            type="button"
            data-slot="video-shelf-scroll-right"
            aria-label="Scroll right"
            disabled={!canScrollRight}
            onClick={() => scroll("right")}
            className={cn(
              chevronClass,
              "right-0",
              controls === "hover" &&
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              controls === "always" && "opacity-100",
              canScrollRight && "opacity-100",
            )}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>
      ) : null}
    </section>
  )
}

export { VideoShelf }
export type { VideoShelfProps }
