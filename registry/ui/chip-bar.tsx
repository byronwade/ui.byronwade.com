"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type ChipBarItem = { value: string; label: React.ReactNode }

type ChipBarProps = {
  items: Array<ChipBarItem | string>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

function normalize(item: ChipBarItem | string): ChipBarItem {
  return typeof item === "string" ? { value: item, label: item } : item
}

function ChipBar({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: ChipBarProps) {
  const normalized = items.map(normalize)
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const selected = isControlled ? value : internal

  const scroller = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollability = React.useCallback(() => {
    const el = scroller.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  React.useEffect(() => {
    updateScrollability()
  }, [updateScrollability])

  function select(next: string) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function scroll(direction: "left" | "right") {
    scroller.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    })
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const delta = event.key === "ArrowRight" ? 1 : -1
    const next = (index + delta + normalized.length) % normalized.length
    select(normalized[next].value)
  }

  // Fade only the side(s) that can actually scroll, so the first/last chip is
  // never faded or crowded when you're already at that end.
  const maskClass =
    canScrollLeft && canScrollRight
      ? "mask-fade-x"
      : canScrollLeft
        ? "mask-fade-l"
        : canScrollRight
          ? "mask-fade-r"
          : ""

  return (
    <div
      data-slot="chip-bar"
      className={cn("relative flex items-center", className)}
    >
      <div
        ref={scroller}
        data-slot="chip-bar-scroller"
        role="tablist"
        aria-orientation="horizontal"
        onScroll={updateScrollability}
        className={cn(
          "scrollbar-thin flex flex-1 gap-2 overflow-x-auto px-1",
          maskClass,
        )}
      >
        {normalized.map((item, index) => {
          const active = item.value === selected
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              data-slot="chip-bar-chip"
              data-active={active}
              aria-selected={active}
              onClick={() => select(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "h-8 shrink-0 rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Clean chevrons that float in the masked edge (no disc over the chips).
          Each hides — and stops capturing clicks — when that end is reached. */}
      <button
        type="button"
        data-slot="chip-bar-scroll-left"
        aria-label="Scroll left"
        tabIndex={canScrollLeft ? 0 : -1}
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 z-10 grid size-8 place-items-center rounded-full text-foreground outline-none transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>

      <button
        type="button"
        data-slot="chip-bar-scroll-right"
        aria-label="Scroll right"
        tabIndex={canScrollRight ? 0 : -1}
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 z-10 grid size-8 place-items-center rounded-full text-foreground outline-none transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export { ChipBar }
export type { ChipBarProps }
