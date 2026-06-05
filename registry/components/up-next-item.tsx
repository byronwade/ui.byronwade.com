"use client"

import * as React from "react"
import { MoreVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type UpNextItemMenuItem = {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface UpNextItemProps {
  title: string
  href?: string
  onClick?: () => void
  thumbnailSrc?: string
  duration?: string
  progress?: number
  live?: boolean
  channelName?: string
  verified?: boolean
  views?: number
  timestamp?: string
  menuItems?: UpNextItemMenuItem[]
  className?: string
}

function UpNextItem({
  title,
  href,
  onClick,
  thumbnailSrc,
  duration,
  progress,
  live = false,
  channelName,
  verified = false,
  views,
  timestamp,
  menuItems,
  className,
}: UpNextItemProps) {
  const viewsLabel = React.useMemo(() => {
    if (views === undefined) return undefined
    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views)
    return `${compact} views`
  }, [views])

  // Only the thumbnail + text surface is interactive; the overflow menu is a
  // sibling at the root so its trigger never nests inside the anchor/button —
  // keeping the markup valid and axe-clean.
  const button = href === undefined && onClick !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick!()
    }
  }

  const surfaceClass =
    "flex min-w-0 flex-1 gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"

  const inner = (
    <>
      <Thumbnail
        data-slot="up-next-item-media"
        src={thumbnailSrc}
        alt={title}
        duration={duration}
        progress={progress}
        live={live}
        className="w-40 shrink-0"
      />
      <div
        data-slot="up-next-item-body"
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <span
          data-slot="up-next-item-title"
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground"
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
      className={cn("flex items-start gap-2", className)}
    >
      {href !== undefined ? (
        <a href={href} className={cn(surfaceClass, "hover:bg-accent")}>
          {inner}
        </a>
      ) : button ? (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className={cn(
            surfaceClass,
            "cursor-pointer text-left hover:bg-accent",
          )}
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
            className="inline-flex size-6 shrink-0 items-center justify-center self-start rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MoreVertical className="size-4" />
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
