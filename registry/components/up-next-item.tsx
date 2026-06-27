"use client"

import * as React from "react"
import { DotsThreeVertical } from "@/lib/icons"

import type { OverflowMenuItem } from "@/lib/overflow-menu-item"
import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type UpNextItemMenuItem = OverflowMenuItem

interface UpNextItemProps {
  title: string
  href?: string
  onClick?: () => void
  thumbnailSrc?: string
  /** Muted loop preview played on hover/focus (YouTube-style). */
  previewSrc?: string
  duration?: string
  progress?: number
  live?: boolean
  channelName?: string
  verified?: boolean
  views?: number
  timestamp?: string
  /** Highlights the row as the currently playing video. */
  active?: boolean
  menuItems?: UpNextItemMenuItem[]
  className?: string
}

function UpNextItem({
  title,
  href,
  onClick,
  thumbnailSrc,
  previewSrc,
  duration,
  progress,
  live = false,
  channelName,
  verified = false,
  views,
  timestamp,
  active = false,
  menuItems,
  className,
}: UpNextItemProps) {
  const [previewing, setPreviewing] = React.useState(false)
  const previewVideoRef = React.useRef<HTMLVideoElement>(null)

  const viewsLabel = React.useMemo(() => {
    if (views === undefined) return undefined
    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views)
    return `${compact} views`
  }, [views])

  const button = href === undefined && onClick !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick!()
    }
  }

  function startPreview() {
    if (!previewSrc) return
    setPreviewing(true)
    const video = previewVideoRef.current
    if (video) {
      const playResult = video.play()
      if (playResult && typeof playResult.catch === "function") {
        void playResult.catch(() => {})
      }
    }
  }

  function stopPreview() {
    setPreviewing(false)
    previewVideoRef.current?.pause()
  }

  const surfaceClass = cn(
    "group/up-next flex min-w-0 flex-1 gap-3 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
    active
      ? "border-l-2 border-brand bg-accent/60 pl-2"
      : "hover:bg-accent/40",
  )

  const media = (
    <div
      data-slot="up-next-item-media-wrap"
      className="relative w-40 shrink-0"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
    >
      {previewSrc && previewing ? (
        <video
          ref={previewVideoRef}
          data-slot="up-next-item-preview"
          src={previewSrc}
          className="aspect-video size-full rounded-lg object-cover"
          muted
          loop
          playsInline
          aria-hidden
        />
      ) : (
        <Thumbnail
          data-slot="up-next-item-media"
          src={thumbnailSrc}
          alt={title}
          duration={duration}
          progress={progress}
          live={live}
          hoverPlay={Boolean(thumbnailSrc)}
        />
      )}

      {active ? (
        <span
          data-slot="up-next-item-now-playing"
          className="absolute bottom-1 left-1 z-10 rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-brand-foreground uppercase"
        >
          Now playing
        </span>
      ) : null}
    </div>
  )

  const inner = (
    <>
      {media}
      <div
        data-slot="up-next-item-body"
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <span
          data-slot="up-next-item-title"
          className={cn(
            "line-clamp-2 text-sm font-medium leading-snug",
            active ? "text-brand" : "text-foreground group-hover/up-next:text-brand",
          )}
        >
          {title}
        </span>

        {channelName ? (
          <span
            data-slot="up-next-item-channel"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <span className="truncate">{channelName}</span>
            {verified ? (
              <VerifiedBadge title={`${channelName} verified`} />
            ) : null}
          </span>
        ) : null}

        <div
          data-slot="up-next-item-meta"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          {viewsLabel ? (
            <span className="font-mono tabular-nums">{viewsLabel}</span>
          ) : null}
          {viewsLabel && timestamp ? <span aria-hidden>·</span> : null}
          {timestamp ? <span>{timestamp}</span> : null}
        </div>
      </div>
    </>
  )

  return (
    <div
      data-slot="up-next-item"
      data-active={active || undefined}
      className={cn("flex items-start gap-2", className)}
    >
      {href !== undefined ? (
        <a href={href} className={surfaceClass}>
          {inner}
        </a>
      ) : button ? (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className={cn(surfaceClass, "cursor-pointer text-left")}
        >
          {inner}
        </div>
      ) : (
        <div className={surfaceClass}>{inner}</div>
      )}

      {menuItems ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            data-slot="up-next-item-menu"
            aria-label="More options"
            className="inline-flex size-6 shrink-0 items-center justify-center self-start rounded-lg text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
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
      ) : null}
    </div>
  )
}

export { UpNextItem }
export type { UpNextItemProps, UpNextItemMenuItem }
