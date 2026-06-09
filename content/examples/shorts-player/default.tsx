"use client"

import * as React from "react"

import { ShortsPlayer } from "@/components/shorts-player"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"

const AUTHOR = {
  name: "Coastline Studio",
  handle: "@coastline",
  avatarSrc:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
  verified: true,
}

/** Matches the natural 9/16 player frame at width=320 */
function PlayerFrameSkeleton() {
  return (
    <Skeleton
      className="w-[320px] rounded-xl"
      style={{ aspectRatio: "9/16" }}
    />
  )
}

/** Sized to the player frame so state panels don't collapse */
function PlayerFrameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-[320px] items-center justify-center"
      style={{ aspectRatio: "9/16" }}
    >
      {children}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const [liked, setLiked] = React.useState(false)
  const [following, setFollowing] = React.useState(false)

  if (state === "loading") {
    return (
      <div className="flex justify-center">
        <PlayerFrameSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex justify-center">
        <PlayerFrameWrapper>
          <DemoEmptyState className="w-full">No short</DemoEmptyState>
        </PlayerFrameWrapper>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex justify-center">
        <PlayerFrameWrapper>
          <DemoErrorState className="w-full">Couldn&apos;t load</DemoErrorState>
        </PlayerFrameWrapper>
      </div>
    )
  }

  // default + success: render the live player
  // success uses the native `status` prop to surface a "Live" badge in the overlay
  const statusLabel = state === "success" ? "Live" : undefined

  return (
    <div className="flex justify-center">
      <ShortsPlayer
        src={SRC}
        posterSrc="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=720&h=1280&fit=crop"
        progress={34}
        author={AUTHOR}
        following={following}
        onFollowingChange={setFollowing}
        caption="Golden hour over the cliffs — tap the speaker to unmute."
        sound="original sound · Coastline Studio"
        liked={liked}
        onLikedChange={setLiked}
        likeCount={128000}
        commentCount={2400}
        shareCount={910}
        status={statusLabel}
      />
    </div>
  )
}
