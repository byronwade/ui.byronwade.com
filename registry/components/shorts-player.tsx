"use client"

import * as React from "react"
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreVertical,
  Music,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ActionRail, type ActionRailItem } from "@/components/ui/action-rail"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { Button } from "@/components/ui/button"

type ShortsAuthor = {
  name: string
  handle?: string
  avatarSrc?: string
  verified?: boolean
}

interface ShortsPlayerProps {
  posterSrc?: string
  children?: React.ReactNode
  author: ShortsAuthor
  following?: boolean
  defaultFollowing?: boolean
  onFollowingChange?: (next: boolean) => void
  caption?: React.ReactNode
  sound?: string
  likeCount?: number
  liked?: boolean
  defaultLiked?: boolean
  onLikedChange?: (next: boolean) => void
  disliked?: boolean
  defaultDisliked?: boolean
  onDislikedChange?: (next: boolean) => void
  commentCount?: number
  onComment?: () => void
  shareCount?: number
  onShare?: () => void
  onMore?: () => void
  extraActions?: ActionRailItem[]
  width?: number | string
  className?: string
}

function ShortsPlayer({
  posterSrc,
  children,
  author,
  following,
  defaultFollowing = false,
  onFollowingChange,
  caption,
  sound,
  likeCount,
  liked,
  defaultLiked = false,
  onLikedChange,
  disliked,
  defaultDisliked = false,
  onDislikedChange,
  commentCount,
  onComment,
  shareCount,
  onShare,
  onMore,
  extraActions,
  width = 320,
  className,
}: ShortsPlayerProps) {
  const isFollowingControlled = following !== undefined
  const isLikedControlled = liked !== undefined
  const isDislikedControlled = disliked !== undefined

  const [followingInternal, setFollowingInternal] =
    React.useState(defaultFollowing)
  const [likedInternal, setLikedInternal] = React.useState(defaultLiked)
  const [dislikedInternal, setDislikedInternal] = React.useState(defaultDisliked)

  const followingOn = isFollowingControlled ? following! : followingInternal
  const likedOn = isLikedControlled ? liked! : likedInternal
  const dislikedOn = isDislikedControlled ? disliked! : dislikedInternal

  function handleFollow() {
    const next = !followingOn
    if (!isFollowingControlled) setFollowingInternal(next)
    onFollowingChange?.(next)
  }

  function handleLike() {
    const next = !likedOn
    if (!isLikedControlled) setLikedInternal(next)
    onLikedChange?.(next)
    // Liking clears an existing dislike (mutually exclusive).
    if (next && dislikedOn) {
      if (!isDislikedControlled) setDislikedInternal(false)
      onDislikedChange?.(false)
    }
  }

  function handleDislike() {
    const next = !dislikedOn
    if (!isDislikedControlled) setDislikedInternal(next)
    onDislikedChange?.(next)
  }

  const initials = author.name.slice(0, 2).toUpperCase()

  const actions: ActionRailItem[] = [
    {
      key: "like",
      icon: <Heart aria-hidden />,
      label: "Like",
      count: likeCount,
      active: likedOn,
      onClick: handleLike,
    },
    {
      key: "dislike",
      icon: <ThumbsDown aria-hidden />,
      label: "Dislike",
      active: dislikedOn,
      onClick: handleDislike,
    },
    {
      key: "comment",
      icon: <MessageCircle aria-hidden />,
      label: "Comment",
      count: commentCount,
      onClick: onComment,
    },
    {
      key: "share",
      icon: <Share2 aria-hidden />,
      label: "Share",
      count: shareCount,
      onClick: onShare,
    },
    {
      key: "more",
      icon: <MoreVertical aria-hidden />,
      label: "More",
      onClick: onMore,
    },
    ...(extraActions ?? []),
  ]

  return (
    <div
      data-slot="shorts-player"
      style={{ width }}
      className={cn(
        "relative aspect-[9/16] overflow-hidden rounded-xl bg-muted",
        className,
      )}
    >
      <div
        data-slot="shorts-player-media"
        className="absolute inset-0 size-full"
      >
        {children ? (
          children
        ) : posterSrc ? (
          <img
            src={posterSrc}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div
            data-slot="shorts-player-placeholder"
            className="flex size-full items-center justify-center text-muted-foreground"
          >
            <Music className="size-8" aria-hidden />
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-foreground/60 to-transparent"
      />

      <ActionRail
        data-slot="shorts-player-rail"
        actions={actions}
        className="absolute right-2 bottom-3 z-10 text-background"
      />

      <div
        data-slot="shorts-player-overlay"
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3 pr-16 text-background"
      >
        <div
          data-slot="shorts-player-author"
          className="flex items-center gap-2"
        >
          <Avatar size="sm" className="shrink-0">
            {author.avatarSrc ? (
              <AvatarImage src={author.avatarSrc} alt={author.name} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 items-center gap-1">
            <span className="truncate text-sm font-medium tracking-tight">
              {author.handle ?? author.name}
            </span>
            {author.verified ? (
              <VerifiedBadge className="text-background" />
            ) : null}
          </span>
          <Button
            data-slot="shorts-player-follow"
            size="sm"
            variant={followingOn ? "secondary" : "default"}
            aria-pressed={followingOn}
            onClick={handleFollow}
          >
            {followingOn ? "Following" : "Follow"}
          </Button>
        </div>

        {caption != null ? (
          <p
            data-slot="shorts-player-caption"
            className="line-clamp-2 text-sm tracking-tight"
          >
            {caption}
          </p>
        ) : null}

        {sound != null ? (
          <span
            data-slot="shorts-player-sound"
            className="flex items-center gap-1.5 text-xs"
          >
            <Music className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{sound}</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}

export { ShortsPlayer }
export type { ShortsPlayerProps }
