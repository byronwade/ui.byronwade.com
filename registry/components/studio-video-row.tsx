"use client"

import * as React from "react"
import { Clock, DotsThreeVertical, FileText, Globe, LinkSimple, Lock } from "@/lib/icons"

import type { OverflowMenuItem } from "@/lib/overflow-menu-item"
import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type VideoVisibility =
  | "public"
  | "unlisted"
  | "private"
  | "draft"
  | "scheduled"

type StudioVideoRowMenuItem = OverflowMenuItem

interface StudioVideoRowProps {
  title: string
  thumbnailSrc?: string
  duration?: string
  description?: string
  visibility: VideoVisibility
  date?: string
  dateLabel?: string
  views?: number
  comments?: number
  likes?: number
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (next: boolean) => void
  menuItems?: StudioVideoRowMenuItem[]
  onClick?: () => void
  /** Emphasize the row — e.g. the video currently open in the editor. */
  highlighted?: boolean
  className?: string
}

// Visibility → tone + label + icon, driven from one record so the StatusDot
// tone and the Badge variant always agree. There is no literal colour here:
// `public` reads as success, `scheduled` as a pending warning, and the private
// family (`unlisted`/`private`/`draft`) reads muted via the `secondary` chip —
// the token carries the meaning.
const visibilityMap: Record<
  VideoVisibility,
  {
    tone: StatusTone
    variant: "success" | "warning" | "secondary"
    label: string
    icon: React.ReactNode
  }
> = {
  public: {
    tone: "success",
    variant: "success",
    label: "Public",
    icon: <Globe aria-hidden className="size-3.5" />,
  },
  scheduled: {
    tone: "warning",
    variant: "warning",
    label: "Scheduled",
    icon: <Clock aria-hidden className="size-3.5" />,
  },
  unlisted: {
    tone: "neutral",
    variant: "secondary",
    label: "Unlisted",
    icon: <LinkSimple aria-hidden className="size-3.5" />,
  },
  private: {
    tone: "neutral",
    variant: "secondary",
    label: "Private",
    icon: <Lock aria-hidden className="size-3.5" />,
  },
  draft: {
    tone: "neutral",
    variant: "secondary",
    label: "Draft",
    icon: <FileText aria-hidden className="size-3.5" />,
  },
}

function formatMetric(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function MetricCell({
  slot,
  value,
}: {
  slot: string
  value?: number
}) {
  return (
    <span
      data-slot={slot}
      className="w-16 text-right font-mono text-sm tabular-nums text-muted-foreground"
    >
      {value === undefined ? "—" : formatMetric(value)}
    </span>
  )
}

function StudioVideoRow({
  title,
  thumbnailSrc,
  duration,
  description,
  visibility,
  date,
  dateLabel,
  views,
  comments,
  likes,
  selected,
  defaultSelected,
  onSelectedChange,
  menuItems,
  onClick,
  highlighted = false,
  className,
}: StudioVideoRowProps) {
  const [internalSelected, setInternalSelected] = React.useState(
    defaultSelected ?? false,
  )
  const isControlled = selected !== undefined
  const isChecked = isControlled ? selected : internalSelected

  function handleSelectedChange(value: boolean | "indeterminate") {
    const next = value === true
    if (!isControlled) setInternalSelected(next)
    onSelectedChange?.(next)
  }

  // Only the title/thumbnail surface is clickable; the checkbox and menu are
  // siblings outside it, so no interactive element ever nests inside another —
  // keeping the markup valid and axe-clean.
  const interactive = onClick !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick!()
    }
  }

  const visibilityInfo = visibilityMap[visibility]

  const video = (
    <div className="flex min-w-0 items-center gap-3">
      <Thumbnail
        data-slot="studio-video-row-thumbnail"
        src={thumbnailSrc}
        alt={title}
        duration={duration}
        className="w-28 shrink-0"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          data-slot="studio-video-row-title"
          className="truncate text-sm font-medium leading-snug text-foreground"
        >
          {title}
        </span>
        {description ? (
          <span
            data-slot="studio-video-row-description"
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </div>
    </div>
  )

  return (
    <div
      data-slot="studio-video-row"
      className={cn(
        "flex items-center gap-4 border-b border-border px-3 py-2 transition-colors last:border-b-0",
        highlighted && "bg-accent/50",
        className,
      )}
    >
      <div
        data-slot="studio-video-row-select"
        className="shrink-0"
      >
        <Checkbox
          aria-label={`Select ${title}`}
          checked={isChecked}
          onCheckedChange={handleSelectedChange}
        />
      </div>

      <div data-slot="studio-video-row-video" className="min-w-0 flex-1">
        {interactive ? (
          <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className="cursor-pointer rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {video}
          </div>
        ) : (
          video
        )}
      </div>

      <div
        data-slot="studio-video-row-visibility"
        className="hidden w-28 shrink-0 items-center gap-1.5 sm:flex"
      >
        <StatusDot tone={visibilityInfo.tone} />
        <Badge variant={visibilityInfo.variant}>
          {visibilityInfo.icon}
          {visibilityInfo.label}
        </Badge>
      </div>

      <div
        data-slot="studio-video-row-date"
        className="hidden w-28 shrink-0 flex-col md:flex"
      >
        {dateLabel ? (
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
        ) : null}
        <span className="font-mono text-sm tabular-nums text-foreground">
          {date ?? "—"}
        </span>
      </div>

      <MetricCell slot="studio-video-row-views" value={views} />
      <MetricCell slot="studio-video-row-comments" value={comments} />
      <MetricCell slot="studio-video-row-likes" value={likes} />

      {menuItems ? (
        <div data-slot="studio-video-row-menu" className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More options for ${title}`}
              className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <DotsThreeVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.key} onClick={item.onClick}>
                  {item.icon ? item.icon : null}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  )
}

export { StudioVideoRow }
export type { StudioVideoRowProps, VideoVisibility }
