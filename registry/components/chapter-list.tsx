"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"

type Chapter = {
  title: string
  /** Start offset in seconds. */
  start: number
  thumbnailSrc?: string
}

interface ChapterListProps {
  chapters: Chapter[]
  /** Controlled active chapter index. Takes precedence over `currentTime`. */
  activeIndex?: number
  /** Initial active index when uncontrolled. */
  defaultActiveIndex?: number
  onSelect?: (index: number, chapter: Chapter) => void
  /**
   * Playhead position in seconds. When set and no `activeIndex` is given, the
   * active chapter is the last one whose `start` is at or before this time.
   */
  currentTime?: number
  showThumbnails?: boolean
  /** Collapse to this many rows with a Show all / Show less toggle. */
  maxVisible?: number
  className?: string
}

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const ss = String(s).padStart(2, "0")
  if (h > 0) {
    const mm = String(m).padStart(2, "0")
    return `${h}:${mm}:${ss}`
  }
  return `${m}:${ss}`
}

function deriveFromTime(chapters: Chapter[], currentTime: number) {
  let index = -1
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].start <= currentTime) index = i
  }
  return index
}

function ChapterList({
  chapters,
  activeIndex,
  defaultActiveIndex,
  onSelect,
  currentTime,
  showThumbnails = true,
  maxVisible,
  className,
}: ChapterListProps) {
  const isControlled = activeIndex !== undefined
  const [internalIndex, setInternalIndex] = React.useState(
    defaultActiveIndex ?? -1,
  )
  const [expanded, setExpanded] = React.useState(false)

  let active: number
  if (isControlled) {
    active = activeIndex
  } else if (currentTime !== undefined) {
    active = deriveFromTime(chapters, currentTime)
  } else {
    active = internalIndex
  }

  function handleSelect(index: number) {
    onSelect?.(index, chapters[index])
    if (!isControlled) setInternalIndex(index)
  }

  const collapsible =
    maxVisible !== undefined && chapters.length > maxVisible && !expanded
  const visibleChapters = collapsible
    ? chapters.slice(0, maxVisible)
    : chapters

  return (
    <div data-slot="chapter-list" className={cn("flex flex-col", className)}>
      <div
        data-slot="chapter-list-scroll"
        className={cn(
          "flex flex-col",
          maxVisible !== undefined && expanded && "max-h-80 overflow-y-auto scrollbar-thin",
        )}
      >
        {visibleChapters.map((chapter, index) => {
        const isActive = index === active
        const next = chapters[index + 1]
        const impliedDuration =
          next !== undefined ? next.start - chapter.start : undefined

        return (
          <button
            key={index}
            type="button"
            data-slot="chapter-list-item"
            data-active={isActive}
            aria-current={isActive ? "true" : undefined}
            onClick={() => handleSelect(index)}
            className={cn(
              "group/chapter flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-secondary text-foreground"
                : "hover:bg-accent",
            )}
          >
            {showThumbnails ? (
              <Thumbnail
                data-slot="chapter-list-thumbnail"
                src={chapter.thumbnailSrc}
                alt=""
                className="w-24 shrink-0"
              />
            ) : null}

            <span
              data-slot="chapter-list-time"
              className={cn(
                "font-mono text-xs tabular-nums",
                isActive ? "text-brand" : "text-muted-foreground",
              )}
            >
              {formatTime(chapter.start)}
            </span>

            <span
              data-slot="chapter-list-title"
              className={cn(
                "min-w-0 flex-1 truncate text-sm",
                isActive ? "text-brand" : "text-foreground",
              )}
            >
              {chapter.title}
            </span>

            {impliedDuration !== undefined ? (
              <span
                data-slot="chapter-list-duration"
                className="font-mono text-xs tabular-nums text-muted-foreground"
              >
                {formatTime(impliedDuration)}
              </span>
            ) : null}
          </button>
        )
      })}
      </div>

      {maxVisible !== undefined && chapters.length > maxVisible ? (
        <button
          type="button"
          data-slot="chapter-list-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 self-start rounded-lg px-2 py-1 text-sm font-medium text-brand outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded ? "Show less" : `Show all (${chapters.length})`}
        </button>
      ) : null}
    </div>
  )
}

export { ChapterList }
export type { ChapterListProps, Chapter }
