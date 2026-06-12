"use client"

import * as React from "react"
import { CaretDown, Heart, PushPin, ThumbsDown, ThumbsUp } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"

const compact = new Intl.NumberFormat("en", { notation: "compact" })

type CommentProps = Omit<React.ComponentProps<"div">, "children"> & {
  author: string
  authorAvatarSrc?: string
  verified?: boolean
  timestamp?: string
  text: React.ReactNode
  likeCount?: number
  /** Controlled liked state. Omit to let the component manage it. */
  liked?: boolean
  defaultLiked?: boolean
  onLikedChange?: (next: boolean) => void
  /** Controlled disliked state. Mutually exclusive with `liked`. */
  disliked?: boolean
  defaultDisliked?: boolean
  onDislikedChange?: (next: boolean) => void
  onReply?: () => void
  pinned?: boolean
  /** Creator-heart badge overlapping the like area (the lone red token). */
  hearted?: boolean
  replyCount?: number
  children?: React.ReactNode
  defaultRepliesOpen?: boolean
}

function Comment({
  author,
  authorAvatarSrc,
  verified = false,
  timestamp,
  text,
  likeCount,
  liked,
  defaultLiked = false,
  onLikedChange,
  disliked,
  defaultDisliked = false,
  onDislikedChange,
  onReply,
  pinned = false,
  hearted = false,
  replyCount,
  children,
  defaultRepliesOpen = false,
  className,
  ...props
}: CommentProps) {
  const [internalLiked, setInternalLiked] = React.useState(defaultLiked)
  const [internalDisliked, setInternalDisliked] =
    React.useState(defaultDisliked)
  const [repliesOpen, setRepliesOpen] = React.useState(defaultRepliesOpen)

  const isLiked = liked !== undefined ? liked : internalLiked
  const isDisliked = disliked !== undefined ? disliked : internalDisliked

  function toggleLiked() {
    const next = !isLiked
    if (liked === undefined) setInternalLiked(next)
    onLikedChange?.(next)
    // Liking clears an existing dislike (mutually exclusive).
    if (next && isDisliked) {
      if (disliked === undefined) setInternalDisliked(false)
      onDislikedChange?.(false)
    }
  }

  function toggleDisliked() {
    const next = !isDisliked
    if (disliked === undefined) setInternalDisliked(next)
    onDislikedChange?.(next)
    if (next && isLiked) {
      if (liked === undefined) setInternalLiked(false)
      onLikedChange?.(false)
    }
  }

  const initials = author.slice(0, 2).toUpperCase()
  const hasReplies = (replyCount != null && replyCount > 0) || children != null

  return (
    <div
      data-slot="comment"
      className={cn("flex gap-3", className)}
      {...props}
    >
      <Avatar className="mt-0.5">
        {authorAvatarSrc ? (
          <AvatarImage src={authorAvatarSrc} alt={author} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-col gap-1.5">
        {pinned ? (
          <span
            data-slot="comment-pinned"
            className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground"
          >
            <PushPin className="size-3" aria-hidden />
            Pinned
          </span>
        ) : null}

        <div
          data-slot="comment-header"
          className="flex items-center gap-1.5 text-sm"
        >
          <span className="font-medium text-foreground">{author}</span>
          {verified ? <VerifiedBadge /> : null}
          {timestamp ? (
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {timestamp}
            </span>
          ) : null}
        </div>

        <div data-slot="comment-body" className="text-sm text-foreground">
          {text}
        </div>

        <div
          data-slot="comment-actions"
          className="flex items-center gap-1 text-muted-foreground"
        >
          <button
            type="button"
            data-slot="comment-like"
            aria-pressed={isLiked}
            aria-label="Like"
            onClick={toggleLiked}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isLiked && "text-brand",
            )}
          >
            <ThumbsUp className="size-4" aria-hidden />
            {likeCount != null ? (
              <span className="font-mono tabular-nums">
                {compact.format(likeCount)}
              </span>
            ) : null}
          </button>

          {hearted ? (
            <span
              data-slot="comment-heart"
              role="img"
              aria-label="Hearted by creator"
              className="inline-flex text-destructive"
            >
              <Heart className="size-3.5 fill-current" aria-hidden />
            </span>
          ) : null}

          <button
            type="button"
            data-slot="comment-dislike"
            aria-pressed={isDisliked}
            aria-label="Dislike"
            onClick={toggleDisliked}
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isDisliked && "text-foreground",
            )}
          >
            <ThumbsDown className="size-4" aria-hidden />
          </button>

          <button
            type="button"
            data-slot="comment-reply"
            onClick={onReply}
            className="rounded-full px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Reply
          </button>
        </div>

        {hasReplies ? (
          <div data-slot="comment-replies" className="flex flex-col gap-3">
            <button
              type="button"
              data-slot="comment-replies-toggle"
              aria-expanded={repliesOpen}
              onClick={() => setRepliesOpen((open) => !open)}
              className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <CaretDown
                className={cn(
                  "size-4 transition-transform",
                  repliesOpen && "rotate-180",
                )}
                aria-hidden
              />
              {repliesOpen
                ? "Hide replies"
                : replyCount != null && replyCount > 0
                  ? `View ${compact.format(replyCount)} replies`
                  : "View replies"}
            </button>

            {repliesOpen && children != null ? (
              <div
                data-slot="comment-replies-list"
                className="flex flex-col gap-4"
              >
                {children}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { Comment }
export type { CommentProps }
