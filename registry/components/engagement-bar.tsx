"use client"

import * as React from "react"
import { Bookmark, DotsThree, Scissors, ShareNetwork, Sparkle, ThumbsDown, ThumbsUp } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { useToggleState, type ToggleState } from "@/lib/toggle-state"
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
  /** Grouped like toggle — preferred over flat liked/defaultLiked/onLikedChange. */
  like?: ToggleState
  /** Grouped dislike toggle — preferred over flat disliked props. */
  dislike?: ToggleState
  /** Grouped save toggle — preferred over flat saved props. */
  save?: ToggleState
  /** @deprecated Use `like.value` */
  liked?: boolean
  /** @deprecated Use `like.defaultValue` */
  defaultLiked?: boolean
  /** @deprecated Use `like.onValueChange` */
  onLikedChange?: (next: boolean) => void
  /** @deprecated Use `dislike.value` */
  disliked?: boolean
  /** @deprecated Use `dislike.defaultValue` */
  defaultDisliked?: boolean
  /** @deprecated Use `dislike.onValueChange` */
  onDislikedChange?: (next: boolean) => void
  likeCount?: number
  onShare?: () => void
  shareLabel?: string
  /** @deprecated Use `save.value` */
  saved?: boolean
  /** @deprecated Use `save.defaultValue` */
  defaultSaved?: boolean
  /** @deprecated Use `save.onValueChange` */
  onSavedChange?: (next: boolean) => void
  onClip?: () => void
  clipLabel?: string
  onRemix?: () => void
  remixLabel?: string
  actions?: EngagementAction[]
  menuItems?: EngagementAction[]
  className?: string
}

const pillClass =
  "inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors outline-none hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"

function EngagementBar({
  like,
  dislike,
  save,
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
  onClip,
  clipLabel = "Clip",
  onRemix,
  remixLabel = "Remix",
  actions,
  menuItems,
  className,
}: EngagementBarProps) {
  const [likedOn, setLikedOn] = useToggleState(like, {
    value: liked,
    defaultValue: defaultLiked,
    onValueChange: onLikedChange,
  })
  const [dislikedOn, setDislikedOn] = useToggleState(dislike, {
    value: disliked,
    defaultValue: defaultDisliked,
    onValueChange: onDislikedChange,
  })
  const [savedOn, setSavedOn] = useToggleState(save, {
    value: saved,
    defaultValue: defaultSaved,
    onValueChange: onSavedChange,
  })

  function handleLike() {
    const next = !likedOn
    setLikedOn(next)
    if (next && dislikedOn) setDislikedOn(false)
  }

  function handleDislike() {
    const next = !dislikedOn
    setDislikedOn(next)
    if (next && likedOn) setLikedOn(false)
  }

  function handleSave() {
    setSavedOn(!savedOn)
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
        <ShareNetwork className="size-4" aria-hidden />
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
          <Bookmark className="size-4" aria-hidden />
        ) : (
          <Bookmark className="size-4" aria-hidden />
        )}
        {savedOn ? "Saved" : "Save"}
      </button>

      {onClip ? (
        <button
          type="button"
          data-slot="engagement-bar-clip"
          onClick={onClip}
          className={pillClass}
        >
          <Scissors className="size-4" aria-hidden />
          {clipLabel}
        </button>
      ) : null}

      {onRemix ? (
        <button
          type="button"
          data-slot="engagement-bar-remix"
          onClick={onRemix}
          className={pillClass}
        >
          <Sparkle className="size-4" aria-hidden />
          {remixLabel}
        </button>
      ) : null}

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
            <DotsThree className="size-4" aria-hidden />
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
