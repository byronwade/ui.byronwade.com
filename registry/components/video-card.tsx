"use client"

import * as React from "react"
import { MoreVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Thumbnail } from "@/components/ui/thumbnail"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type VideoCardMenuItem = {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface VideoCardProps {
  title: string
  href?: string
  onClick?: () => void
  thumbnailSrc?: string
  duration?: string
  progress?: number
  live?: boolean
  views?: number
  timestamp?: string
  channelName: string
  channelAvatarSrc?: string
  verified?: boolean
  menuItems?: VideoCardMenuItem[]
  className?: string
}

function VideoCard({
  title,
  href,
  onClick,
  thumbnailSrc,
  duration,
  progress,
  live = false,
  views,
  timestamp,
  channelName,
  channelAvatarSrc,
  verified = false,
  menuItems,
  className,
}: VideoCardProps) {
  const viewsLabel = React.useMemo(() => {
    if (views === undefined) return undefined
    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views)
    return `${compact} views`
  }, [views])

  // The clickable surface (media + title) is the only interactive element, so a
  // sibling DropdownMenu button never nests inside an anchor/button — keeping the
  // markup valid and axe-clean.
  const button = href === undefined && onClick !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick!()
    }
  }

  const media = (
    <Thumbnail
      data-slot="video-card-media"
      src={thumbnailSrc}
      alt={title}
      duration={duration}
      progress={progress}
      live={live}
    />
  )

  const heading = (
    <span
      data-slot="video-card-title"
      className="line-clamp-2 text-sm font-medium leading-snug text-foreground"
    >
      {title}
    </span>
  )

  const surfaceClass =
    "flex flex-col gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div
      data-slot="video-card"
      className={cn("flex flex-col gap-3", className)}
    >
      {href !== undefined ? (
        <a href={href} className={surfaceClass}>
          {media}
          {heading}
        </a>
      ) : button ? (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className={cn(surfaceClass, "cursor-pointer text-left")}
        >
          {media}
          {heading}
        </div>
      ) : (
        <div className={surfaceClass}>
          {media}
          {heading}
        </div>
      )}

      <div data-slot="video-card-body" className="flex flex-col gap-1">
        <div
          data-slot="video-card-byline"
          className="flex items-center gap-2"
        >
          <Avatar size="sm">
            {channelAvatarSrc ? (
              <AvatarImage src={channelAvatarSrc} alt={channelName} />
            ) : null}
            <AvatarFallback>{channelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm text-muted-foreground">
            {channelName}
          </span>
          {verified ? <VerifiedBadge title={`${channelName} verified`} /> : null}
        </div>

        <div
          data-slot="video-card-meta"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          {viewsLabel ? (
            <span className="font-mono tabular-nums">{viewsLabel}</span>
          ) : null}
          {viewsLabel && timestamp ? <span aria-hidden>·</span> : null}
          {timestamp ? <span>{timestamp}</span> : null}

          {menuItems ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                data-slot="video-card-menu"
                aria-label="More options"
                className="ml-auto inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
      </div>
    </div>
  )
}

export { VideoCard }
export type { VideoCardProps, VideoCardMenuItem }
