"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChatCircle, DotsThreeVertical, Heart, MusicNote, ShareNetwork, SpeakerHigh, SpeakerX, ThumbsDown } from "@/lib/icons"

import { useToggleState, type ToggleState } from "@/lib/toggle-state"
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

const shortsPlayerVariants = cva("relative aspect-[9/16] overflow-hidden bg-muted", {
  variants: {
    variant: {
      default: "rounded-2xl",
      preview: "rounded-lg",
      immersive: "rounded-none",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "comfortable",
  },
})

type ShortsPlayerProps = VariantProps<typeof shortsPlayerVariants> & {
  /** MP4/WebM source — renders a looping, muted-by-default video when no children. */
  src?: string
  posterSrc?: string
  children?: React.ReactNode
  author: ShortsAuthor
  follow?: ToggleState
  /** @deprecated Use `follow.value` */
  following?: boolean
  /** @deprecated Use `follow.defaultValue` */
  defaultFollowing?: boolean
  /** @deprecated Use `follow.onValueChange` */
  onFollowingChange?: (next: boolean) => void
  caption?: React.ReactNode
  sound?: string
  likeCount?: number
  like?: ToggleState
  /** @deprecated Use `like.value` */
  liked?: boolean
  /** @deprecated Use `like.defaultValue` */
  defaultLiked?: boolean
  /** @deprecated Use `like.onValueChange` */
  onLikedChange?: (next: boolean) => void
  dislike?: ToggleState
  /** @deprecated Use `dislike.value` */
  disliked?: boolean
  /** @deprecated Use `dislike.defaultValue` */
  defaultDisliked?: boolean
  /** @deprecated Use `dislike.onValueChange` */
  onDislikedChange?: (next: boolean) => void
  commentCount?: number
  onComment?: () => void
  shareCount?: number
  onShare?: () => void
  onMore?: () => void
  extraActions?: ActionRailItem[]
  mute?: ToggleState
  /** @deprecated Use `mute.value` */
  muted?: boolean
  /** @deprecated Use `mute.defaultValue` */
  defaultMuted?: boolean
  /** @deprecated Use `mute.onValueChange` */
  onMutedChange?: (next: boolean) => void
  /** Show a thin progress bar along the top edge (0–100). */
  progress?: number
  rail?: "right" | "left" | "hidden"
  captionMode?: "clamped" | "expanded" | "hidden"
  status?: React.ReactNode
  authorAction?: React.ReactNode
  overlay?: React.ReactNode
  topActions?: React.ReactNode
  fallback?: React.ReactNode
  onVideoClick?: () => void
  play?: ToggleState
  /** @deprecated Use `play.value` */
  playing?: boolean
  /** @deprecated Use `play.defaultValue` */
  defaultPlaying?: boolean
  /** @deprecated Use `play.onValueChange` */
  onPlayingChange?: (next: boolean) => void
  width?: number | string
  className?: string
}

function ShortsPlayer({
  src,
  posterSrc,
  children,
  author,
  follow,
  following,
  defaultFollowing = false,
  onFollowingChange,
  caption,
  sound,
  likeCount,
  like,
  liked,
  defaultLiked = false,
  onLikedChange,
  dislike,
  disliked,
  defaultDisliked = false,
  onDislikedChange,
  commentCount,
  onComment,
  shareCount,
  onShare,
  onMore,
  extraActions,
  mute,
  muted,
  defaultMuted = true,
  onMutedChange,
  progress,
  variant = "default",
  rail = "right",
  density = "comfortable",
  captionMode = "clamped",
  status,
  authorAction,
  overlay,
  topActions,
  fallback,
  onVideoClick,
  play,
  playing,
  defaultPlaying = true,
  onPlayingChange,
  width = 320,
  className,
}: ShortsPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [followingOn, setFollowingOn] = useToggleState(follow, {
    value: following,
    defaultValue: defaultFollowing,
    onValueChange: onFollowingChange,
  })
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
  const [mutedOn, setMutedOn] = useToggleState(mute, {
    value: muted,
    defaultValue: defaultMuted,
    onValueChange: onMutedChange,
  })
  const [playingOn, setPlayingOn] = useToggleState(play, {
    value: playing,
    defaultValue: defaultPlaying,
    onValueChange: onPlayingChange,
  })

  React.useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    if (playingOn) {
      const playResult = video.play()
      if (playResult && typeof playResult.catch === "function") {
        void playResult.catch(() => {})
      }
    } else {
      video.pause()
    }
  }, [playingOn, src])

  function togglePlaying() {
    onVideoClick?.()
    setPlayingOn(!playingOn)
  }

  function handleFollow() {
    setFollowingOn(!followingOn)
  }

  function handleLike() {
    const next = !likedOn
    setLikedOn(next)
    if (next && dislikedOn) setDislikedOn(false)
  }

  function handleDislike() {
    setDislikedOn(!dislikedOn)
  }

  function handleMuteToggle() {
    setMutedOn(!mutedOn)
  }

  const initials = author.name.slice(0, 2).toUpperCase()

  const actions: ActionRailItem[] = [
    {
      key: "like",
      icon: <Heart aria-hidden className={likedOn ? "fill-current" : undefined} />,
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
      icon: <ChatCircle aria-hidden />,
      label: "Comment",
      count: commentCount,
      onClick: onComment,
    },
    {
      key: "share",
      icon: <ShareNetwork aria-hidden />,
      label: "Share",
      count: shareCount,
      onClick: onShare,
    },
    {
      key: "more",
      icon: <DotsThreeVertical aria-hidden />,
      label: "More",
      onClick: onMore,
    },
    ...(extraActions ?? []),
  ]

  const media =
    children ??
    (src ? (
      <video
        ref={videoRef}
        data-slot="shorts-player-video"
        src={src}
        poster={posterSrc}
        className="size-full object-cover"
        playsInline
        loop
        autoPlay={playingOn}
        muted={mutedOn}
      />
    ) : posterSrc ? (
      <img
        src={posterSrc}
        alt=""
        className="size-full object-cover"
      />
    ) : fallback ? (
      <div data-slot="shorts-player-fallback" className="size-full">
        {fallback}
      </div>
    ) : (
      <div
        data-slot="shorts-player-placeholder"
        className="flex size-full items-center justify-center text-muted-foreground"
      >
        <MusicNote className="size-8" aria-hidden />
      </div>
    ))

  return (
    <div
      data-slot="shorts-player"
      data-variant={variant}
      data-rail={rail}
      data-density={density}
      data-caption-mode={captionMode}
      style={{ width }}
      className={cn(
        shortsPlayerVariants({ variant, density }),
        className,
      )}
    >
      <div
        data-slot="shorts-player-media"
        className="absolute inset-0 size-full"
      >
        {media}
      </div>

      {src ? (
        <button
          type="button"
          data-slot="shorts-player-tap"
          aria-label={playingOn ? "Pause" : "Play"}
          onClick={togglePlaying}
          className="absolute inset-0 z-[5] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
        />
      ) : null}

      {progress !== undefined ? (
        <div
          data-slot="shorts-player-progress"
          className="absolute inset-x-0 top-0 z-20 h-0.5 bg-background/30"
          aria-hidden
        >
          <div
            data-slot="shorts-player-progress-fill"
            className="h-full bg-brand"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
            }}
          />
        </div>
      ) : null}

      {src ? (
        <Button
          data-slot="shorts-player-mute"
          variant="ghost"
          size="icon-sm"
          aria-label={mutedOn ? "Unmute" : "Mute"}
          aria-pressed={mutedOn}
          onClick={handleMuteToggle}
          className="absolute top-3 right-3 z-20 rounded-full bg-background/20 text-background backdrop-blur-sm hover:bg-background/30 hover:text-background"
        >
          {mutedOn ? <SpeakerX /> : <SpeakerHigh />}
        </Button>
      ) : null}

      {topActions != null ? (
        <div
          data-slot="shorts-player-top-actions"
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5"
        >
          {topActions}
        </div>
      ) : null}

      <div
        aria-hidden
        className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
      />

      {rail !== "hidden" ? (
        <ActionRail
          data-slot="shorts-player-rail"
          actions={actions}
          variant="overlay"
          size="sm"
          className={cn(
            "absolute bottom-3 z-10",
            rail === "right" && "right-2",
            rail === "left" && "left-2",
          )}
        />
      ) : null}

      {overlay != null ? (
        <div
          data-slot="shorts-player-custom-overlay"
          className="absolute inset-x-0 bottom-0 z-10 p-3 text-background"
        >
          {overlay}
        </div>
      ) : null}

      <div
        data-slot="shorts-player-overlay"
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3 text-background",
          rail === "right" && "pr-14",
          rail === "left" && "pl-14",
          rail === "hidden" && "pr-3",
          density === "compact" && "gap-1.5 p-2",
          overlay != null && "pointer-events-none opacity-0",
        )}
      >
        {status != null ? (
          <div
            data-slot="shorts-player-status"
            className="w-fit rounded-sm bg-background/20 px-1.5 py-0.5 text-xs text-background backdrop-blur-sm"
          >
            {status}
          </div>
        ) : null}

        <div
          data-slot="shorts-player-author"
          className="flex items-center gap-2"
        >
          <Avatar size="sm" className="shrink-0 ring-1 ring-background/20">
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
          {authorAction != null ? (
            <div data-slot="shorts-player-author-action">{authorAction}</div>
          ) : (
            <Button
              data-slot="shorts-player-follow"
              size="sm"
              variant={followingOn ? "secondary" : "default"}
              aria-pressed={followingOn}
              onClick={handleFollow}
              className={cn(
                followingOn
                  ? "bg-background/20 text-background hover:bg-background/30"
                  : "bg-background text-foreground hover:bg-background/90",
              )}
            >
              {followingOn ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {caption != null && captionMode !== "hidden" ? (
          <p
            data-slot="shorts-player-caption"
            className={cn(
              "text-sm leading-snug tracking-tight",
              captionMode === "clamped" && "line-clamp-2",
              density === "compact" && "text-xs",
            )}
          >
            {caption}
          </p>
        ) : null}

        {sound != null ? (
          <span
            data-slot="shorts-player-sound"
            className="flex items-center gap-1.5 text-xs opacity-90"
          >
            <MusicNote className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{sound}</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}

export { ShortsPlayer }
export type { ShortsPlayerProps, ShortsAuthor }
