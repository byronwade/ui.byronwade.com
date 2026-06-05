"use client"

import * as React from "react"
import { Check, Heart, Reply, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/ui/verified-badge"

const compact = new Intl.NumberFormat("en", { notation: "compact" })

type ModerationStatus = "held" | "published" | "approved" | "removed"

const statusTone: Record<
  ModerationStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  held: { label: "Held for review", variant: "warning" },
  published: { label: "Published", variant: "success" },
  approved: { label: "Approved", variant: "success" },
  removed: { label: "Removed", variant: "secondary" },
}

type CommentModerationRowProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  author: string
  authorAvatarSrc?: string
  verified?: boolean
  timestamp?: string
  text: React.ReactNode
  likeCount?: number
  status?: ModerationStatus
  onApprove?: () => void
  onRemove?: () => void
  onReply?: () => void
  /** Creator-heart toggle (the lone red token). Controlled. */
  hearted?: boolean
  defaultHearted?: boolean
  onHeartedChange?: (next: boolean) => void
  videoTitle?: string
  videoThumbnailSrc?: string
}

function CommentModerationRow({
  author,
  authorAvatarSrc,
  verified = false,
  timestamp,
  text,
  likeCount,
  status = "held",
  onApprove,
  onRemove,
  onReply,
  hearted,
  defaultHearted = false,
  onHeartedChange,
  videoTitle,
  videoThumbnailSrc,
  className,
  ...props
}: CommentModerationRowProps) {
  const [internalHearted, setInternalHearted] = React.useState(defaultHearted)
  const isHearted = hearted !== undefined ? hearted : internalHearted

  function toggleHearted() {
    const next = !isHearted
    if (hearted === undefined) setInternalHearted(next)
    onHeartedChange?.(next)
  }

  const initials = author.slice(0, 2).toUpperCase()
  const tone = statusTone[status]
  // Moderation actions only make sense while a comment is awaiting a decision.
  const showActions = status === "held"

  return (
    <div
      data-slot="comment-moderation-row"
      className={cn(
        "flex gap-3 rounded-lg border border-border p-3",
        className,
      )}
      {...props}
    >
      <Avatar className="mt-0.5">
        {authorAvatarSrc ? (
          <AvatarImage src={authorAvatarSrc} alt={author} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          data-slot="comment-moderation-row-header"
          className="flex items-center gap-1.5 text-sm"
        >
          <span className="font-medium text-foreground">{author}</span>
          {verified ? <VerifiedBadge /> : null}
          {timestamp ? (
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {timestamp}
            </span>
          ) : null}
          <Badge
            data-slot="comment-moderation-row-status"
            variant={tone.variant}
            className="ml-auto"
          >
            {tone.label}
          </Badge>
        </div>

        <div
          data-slot="comment-moderation-row-text"
          className="text-sm text-foreground"
        >
          {text}
        </div>

        <div className="flex items-center gap-2">
          {likeCount != null ? (
            <span
              data-slot="comment-moderation-row-likes"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Heart className="size-3.5" aria-hidden />
              <span className="font-mono tabular-nums">
                {compact.format(likeCount)}
              </span>
            </span>
          ) : null}

          {videoTitle ? (
            <span
              data-slot="comment-moderation-row-context"
              className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground"
            >
              {videoThumbnailSrc ? (
                <img
                  src={videoThumbnailSrc}
                  alt=""
                  className="h-5 w-9 shrink-0 rounded-sm object-cover"
                />
              ) : null}
              <span className="truncate">on: {videoTitle}</span>
            </span>
          ) : null}
        </div>

        {showActions ? (
          <div
            data-slot="comment-moderation-row-actions"
            className="flex items-center gap-1"
          >
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Approve"
              onClick={onApprove}
            >
              <Check aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove"
              onClick={onRemove}
            >
              <Trash2 aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Heart"
              aria-pressed={isHearted}
              onClick={toggleHearted}
              className={cn(isHearted && "text-destructive")}
            >
              <Heart
                aria-hidden
                className={cn(isHearted && "fill-current")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Reply"
              onClick={onReply}
            >
              <Reply aria-hidden />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { CommentModerationRow }
export type { CommentModerationRowProps, ModerationStatus }
