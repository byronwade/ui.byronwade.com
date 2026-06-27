"use client"

import * as React from "react"
import { DotsThreeVertical } from "@/lib/icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Thumbnail, type ThumbnailProps } from "@/components/ui/thumbnail"
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
  thumbnailRatio?: ThumbnailProps["ratio"]
  duration?: string
  progress?: number
  live?: boolean
  views?: number
  timestamp?: string
  channelName: string
  channelAvatarSrc?: string
  verified?: boolean
  description?: React.ReactNode
  badges?: React.ReactNode
  stats?: React.ReactNode
  actions?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  menuItems?: VideoCardMenuItem[]
  className?: string
}

const videoCardVariants = cva("group/video-card text-foreground", {
  variants: {
    variant: {
      default: "flex flex-col gap-3",
      compact: "flex flex-col gap-2",
      horizontal: "grid grid-cols-[minmax(9rem,42%)_1fr] gap-3",
      overlay: "relative isolate overflow-hidden rounded-xl",
      featured: "grid gap-4 md:grid-cols-[minmax(18rem,56%)_1fr]",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  compoundVariants: [
    {
      variant: "horizontal",
      density: "compact",
      className: "gap-2",
    },
    {
      variant: "featured",
      density: "compact",
      className: "gap-3",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    density: "comfortable",
  },
})

const titleVariants = cva(
  "text-foreground group-hover/video-card:text-brand",
  {
    variants: {
      variant: {
        default: "line-clamp-2 text-sm font-medium leading-snug",
        compact: "line-clamp-2 text-sm font-medium leading-snug",
        horizontal: "line-clamp-2 text-sm font-medium leading-snug",
        overlay: "line-clamp-2 text-base font-medium leading-tight text-background group-hover/video-card:text-background",
        featured: "line-clamp-3 text-lg font-medium leading-tight tracking-tight sm:text-xl",
      },
      size: {
        sm: "text-sm",
        md: "",
        lg: "text-base sm:text-lg",
      },
    },
    compoundVariants: [
      {
        variant: "featured",
        size: "lg",
        className: "text-xl sm:text-2xl",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

const bodyVariants = cva("min-w-0", {
  variants: {
    variant: {
      default: "flex gap-3",
      compact: "flex gap-2",
      horizontal: "flex gap-3",
      overlay:
        "absolute inset-x-0 bottom-0 z-10 flex gap-3 p-3 text-background",
      featured: "flex gap-3 self-center",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  compoundVariants: [
    {
      variant: "overlay",
      density: "compact",
      className: "p-2",
    },
  ],
  defaultVariants: {
    variant: "default",
    density: "comfortable",
  },
})

type VideoCardVariantProps = VariantProps<typeof videoCardVariants>

function VideoCard({
  title,
  href,
  onClick,
  thumbnailSrc,
  thumbnailRatio,
  duration,
  progress,
  live = false,
  views,
  timestamp,
  channelName,
  channelAvatarSrc,
  verified = false,
  variant = "default",
  size = "md",
  density = "comfortable",
  description,
  badges,
  stats,
  actions,
  selected = false,
  disabled = false,
  menuItems,
  className,
}: VideoCardProps & VideoCardVariantProps) {
  const viewsLabel = React.useMemo(() => {
    if (views === undefined) return undefined
    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views)
    return `${compact} views`
  }, [views])

  const button = !disabled && href === undefined && onClick !== undefined
  const linked = !disabled && href !== undefined

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick()
    }
  }

  const surfaceClass =
    "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"

  const media = (
    <Thumbnail
      data-slot="video-card-media"
      src={thumbnailSrc}
      alt={title}
      ratio={thumbnailRatio}
      duration={duration}
      progress={progress}
      live={live}
      hoverPlay
    />
  )

  const heading = (
    <span
      data-slot="video-card-title"
      className={cn(titleVariants({ variant, size }))}
    >
      {title}
    </span>
  )

  function renderSurface(content: React.ReactNode, className?: string) {
    if (linked) {
      return (
        <a href={href} className={cn(surfaceClass, className)}>
          {content}
        </a>
      )
    }
    if (button) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className={cn(surfaceClass, "cursor-pointer text-left", className)}
        >
          {content}
        </div>
      )
    }
    return <div className={className}>{content}</div>
  }

  const defaultStats = (
    <>
      {viewsLabel ? (
        <span className="font-mono tabular-nums">{viewsLabel}</span>
      ) : null}
      {viewsLabel && timestamp ? <span aria-hidden>·</span> : null}
      {timestamp ? <span>{timestamp}</span> : null}
    </>
  )

  const showAvatar = variant !== "overlay" || size !== "sm"

  return (
    <div
      data-slot="video-card"
      data-variant={variant}
      data-size={size}
      data-density={density}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        videoCardVariants({ variant, size, density }),
        selected && "rounded-xl ring-2 ring-ring ring-offset-2 ring-offset-background",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {renderSurface(media)}

      {variant === "overlay" ? (
        <div
          aria-hidden
          className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
        />
      ) : null}

      <div
        data-slot="video-card-body"
        className={cn(bodyVariants({ variant, density }))}
      >
        {showAvatar ? (
          <Avatar
            size={size === "lg" ? "default" : "sm"}
            className="mt-0.5 shrink-0"
          >
            {channelAvatarSrc ? (
              <AvatarImage src={channelAvatarSrc} alt={channelName} />
            ) : null}
            <AvatarFallback>{channelName.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {badges ? (
            <div
              data-slot="video-card-badges"
              className={cn(
                "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
                variant === "overlay" && "text-background/80",
              )}
            >
              {badges}
            </div>
          ) : null}

          {renderSurface(heading)}

          <div
            data-slot="video-card-byline"
            className="flex items-center gap-1"
          >
            <span className="truncate text-sm text-muted-foreground">
              {channelName}
            </span>
            {verified ? (
              <VerifiedBadge title={`${channelName} verified`} />
            ) : null}
          </div>

          {description ? (
            <div
              data-slot="video-card-description"
              className={cn(
                "line-clamp-2 text-sm leading-snug text-muted-foreground",
                variant === "overlay" && "text-background/80",
                density === "compact" && "line-clamp-1 text-xs",
              )}
            >
              {description}
            </div>
          ) : null}

          <div
            data-slot="video-card-meta"
            className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground",
              variant === "overlay" && "text-background/75",
            )}
          >
            {stats ?? defaultStats}
          </div>
        </div>

        {actions ? (
          <div data-slot="video-card-actions" className="shrink-0">
            {actions}
          </div>
        ) : null}

        {menuItems && !disabled ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              data-slot="video-card-menu"
              aria-label="More options"
              className="inline-flex size-8 shrink-0 items-center justify-center self-start rounded-lg text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
    </div>
  )
}

export { VideoCard }
export type { VideoCardProps, VideoCardMenuItem }
