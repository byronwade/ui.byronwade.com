"use client"

import * as React from "react"
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type EngagementAction = {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface EngagementBarProps {
  liked?: boolean
  defaultLiked?: boolean
  onLikedChange?: (next: boolean) => void
  disliked?: boolean
  defaultDisliked?: boolean
  onDislikedChange?: (next: boolean) => void
  likeCount?: number
  onShare?: () => void
  shareLabel?: string
  saved?: boolean
  defaultSaved?: boolean
  onSavedChange?: (next: boolean) => void
  actions?: EngagementAction[]
  menuItems?: EngagementAction[]
  className?: string
}

const pillClass =
  "inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors outline-none hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"

function EngagementBar({
  liked,
  defaultLiked = false,
  onLikedChange,
  disliked,
  defaultDisliked = false,
  onDislikedChange,
  likeCount,
  onShare,
  shareLabel = "Share",
  saved,
  defaultSaved = false,
  onSavedChange,
  actions,
  menuItems,
  className,
}: EngagementBarProps) {
  const isLikedControlled = liked !== undefined
  const isDislikedControlled = disliked !== undefined
  const isSavedControlled = saved !== undefined

  const [likedInternal, setLikedInternal] = React.useState(defaultLiked)
  const [dislikedInternal, setDislikedInternal] = React.useState(defaultDisliked)
  const [savedInternal, setSavedInternal] = React.useState(defaultSaved)

  const likedOn = isLikedControlled ? liked! : likedInternal
  const dislikedOn = isDislikedControlled ? disliked! : dislikedInternal
  const savedOn = isSavedControlled ? saved! : savedInternal

  function handleLike() {
    const next = !likedOn
    if (!isLikedControlled) setLikedInternal(next)
    onLikedChange?.(next)
    // Liking is mutually exclusive with disliking — clear the other half.
    if (next && dislikedOn) {
      if (!isDislikedControlled) setDislikedInternal(false)
      onDislikedChange?.(false)
    }
  }

  function handleDislike() {
    const next = !dislikedOn
    if (!isDislikedControlled) setDislikedInternal(next)
    onDislikedChange?.(next)
    if (next && likedOn) {
      if (!isLikedControlled) setLikedInternal(false)
      onLikedChange?.(false)
    }
  }

  function handleSave() {
    const next = !savedOn
    if (!isSavedControlled) setSavedInternal(next)
    onSavedChange?.(next)
  }

  const compactLikeCount =
    likeCount === undefined
      ? undefined
      : new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(likeCount)

  return (
    <div
      data-slot="engagement-bar"
      className={cn("flex flex-row flex-wrap items-center gap-2", className)}
    >
      <div className="inline-flex h-9 items-center rounded-full bg-secondary text-secondary-foreground">
        <button
          type="button"
          data-slot="engagement-bar-like"
          aria-label="Like"
          aria-pressed={likedOn}
          onClick={handleLike}
          className={cn(
            "inline-flex h-full items-center gap-2 rounded-l-full pr-3 pl-4 text-sm font-medium transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            likedOn && "text-brand",
          )}
        >
          <ThumbsUp className="size-4" aria-hidden />
          {compactLikeCount !== undefined ? (
            <span
              data-slot="engagement-bar-like-count"
              className="font-mono tabular-nums"
            >
              {compactLikeCount}
            </span>
          ) : null}
        </button>
        <Separator
          orientation="vertical"
          className="h-5 bg-foreground/10"
        />
        <button
          type="button"
          data-slot="engagement-bar-dislike"
          aria-label="Dislike"
          aria-pressed={dislikedOn}
          onClick={handleDislike}
          className={cn(
            "inline-flex h-full items-center rounded-r-full px-4 text-sm font-medium transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            dislikedOn && "text-brand",
          )}
        >
          <ThumbsDown className="size-4" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        data-slot="engagement-bar-share"
        onClick={onShare}
        className={pillClass}
      >
        <Share2 className="size-4" aria-hidden />
        {shareLabel}
      </button>

      <button
        type="button"
        data-slot="engagement-bar-save"
        aria-pressed={savedOn}
        onClick={handleSave}
        className={cn(pillClass, savedOn && "text-brand")}
      >
        {savedOn ? (
          <BookmarkCheck className="size-4" aria-hidden />
        ) : (
          <Bookmark className="size-4" aria-hidden />
        )}
        {savedOn ? "Saved" : "Save"}
      </button>

      {actions?.map((action) => (
        <button
          key={action.key}
          type="button"
          data-slot="engagement-bar-action"
          onClick={action.onClick}
          className={pillClass}
        >
          {action.icon ? action.icon : null}
          {action.label}
        </button>
      ))}

      {menuItems && menuItems.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            data-slot="engagement-bar-menu"
            aria-label="More actions"
            className={cn(pillClass, "px-0 w-9 justify-center")}
          >
            <MoreHorizontal className="size-4" aria-hidden />
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

export { EngagementBar }
export type { EngagementBarProps, EngagementAction }
