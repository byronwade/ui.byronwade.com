"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface DescriptionBoxProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Total view count — rendered compact ("2.2M views") in tabular mono. */
  views?: number
  /** Relative or absolute publish time, e.g. "2 months ago". */
  timestamp?: string
  /** Lines shown before the body is clamped (collapsed). */
  collapsedLines?: number
  /** Initial open state for the uncontrolled component. */
  defaultExpanded?: boolean
  /** Controlled open state — pair with `onExpandedChange`. */
  expanded?: boolean
  onExpandedChange?: (next: boolean) => void
  moreLabel?: React.ReactNode
  lessLabel?: React.ReactNode
  /** Optional topic/hashtag chips rendered below the header. */
  tags?: string[]
  children: React.ReactNode
}

function DescriptionBox({
  views,
  timestamp,
  collapsedLines = 3,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  moreLabel = "...more",
  lessLabel = "Show less",
  tags,
  className,
  children,
  ...props
}: DescriptionBoxProps) {
  const isControlled = expanded !== undefined
  const [internal, setInternal] = React.useState(defaultExpanded)
  const isExpanded = isControlled ? expanded : internal

  function toggle(next: boolean) {
    if (!isControlled) setInternal(next)
    onExpandedChange?.(next)
  }

  const viewsLabel = React.useMemo(() => {
    if (views === undefined) return undefined
    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views)
    return `${compact} views`
  }, [views])

  const hasHeader = viewsLabel !== undefined || timestamp !== undefined

  return (
    <div
      data-slot="description-box"
      data-expanded={isExpanded}
      className={cn(
        "rounded-2xl bg-secondary/80 p-3 text-sm text-foreground transition-colors hover:bg-secondary",
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div
          data-slot="description-box-header"
          className="flex flex-wrap items-center gap-1 font-medium"
        >
          {viewsLabel ? (
            <span className="font-mono tabular-nums">{viewsLabel}</span>
          ) : null}
          {viewsLabel && timestamp ? <span aria-hidden>·</span> : null}
          {timestamp ? <span>{timestamp}</span> : null}
        </div>
      ) : null}

      {tags && tags.length > 0 ? (
        <div
          data-slot="description-box-tags"
          className={cn("flex flex-wrap gap-2", hasHeader ? "mt-2" : undefined)}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              data-slot="description-box-tag"
              className="rounded-full bg-background/60 px-2.5 py-0.5 text-xs font-medium text-foreground"
            >
              #{tag.replace(/^#/, "")}
            </span>
          ))}
        </div>
      ) : null}

      <div
        data-slot="description-box-body"
        className={cn("whitespace-pre-line", hasHeader && "mt-1")}
        style={
          isExpanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: collapsedLines,
                overflow: "hidden",
              }
        }
      >
        {children}
      </div>

      <button
        type="button"
        data-slot="description-box-toggle"
        onClick={() => toggle(!isExpanded)}
        aria-expanded={isExpanded}
        className="mt-1 font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {isExpanded ? lessLabel : moreLabel}
      </button>
    </div>
  )
}

export { DescriptionBox }
export type { DescriptionBoxProps }
