"use client"

import * as React from "react"

import {
  NowPlayingBar,
  NowPlayingBarControls,
  NowPlayingBarExtras,
  NowPlayingBarProgress,
  NowPlayingBarTrack,
} from "@/components/ui/now-playing-bar"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"

function NowPlayingBarSkeleton() {
  return (
    <NowPlayingBar className="rounded-xl edge" aria-busy="true">
      {/* track skeleton */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-md" />
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      {/* controls + progress skeleton */}
      <div className="flex flex-[2] flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {[28, 28, 36, 28, 28].map((size, i) => (
            <Skeleton
              key={i}
              className="rounded-full"
              style={{ width: size, height: size }}
            />
          ))}
        </div>
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
      {/* extras skeleton */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <Skeleton className="h-3 w-4 rounded" />
        <Skeleton className="h-1.5 w-24 rounded-full" />
      </div>
    </NowPlayingBar>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  const [isPlaying, setIsPlaying] = React.useState(true)
  const [liked, setLiked] = React.useState(false)
  const [progress, setProgress] = React.useState(72)
  const [volume, setVolume] = React.useState(70)

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl p-4">
        <NowPlayingBarSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-3xl p-4">
        <NowPlayingBar className="rounded-xl edge">
          <div className="flex w-full items-center justify-center py-2">
            <DemoEmptyState className="w-full border-0 py-3 text-xs">
              Nothing playing
            </DemoEmptyState>
          </div>
        </NowPlayingBar>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-3xl p-4">
        <NowPlayingBar className="rounded-xl edge">
          <div className="flex w-full items-center justify-center py-2">
            <DemoErrorState className="w-full py-3">
              Couldn&apos;t load track
            </DemoErrorState>
          </div>
        </NowPlayingBar>
      </div>
    )
  }

  // default + success share the normal bar; success gets a ring accent
  return (
    <div className="w-full max-w-3xl p-4">
      <NowPlayingBar
        className={[
          "rounded-xl edge",
          state === "success" && "ring-1 ring-success/30",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <NowPlayingBarTrack
          src={COVER}
          title="Lost in the Echo"
          artist="Aurora Skies"
          liked={liked}
          onLikeToggle={() => setLiked((v) => !v)}
        />
        <div className="flex flex-[2] flex-col items-center gap-1">
          <NowPlayingBarControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((v) => !v)}
          />
          <NowPlayingBarProgress
            progress={progress}
            duration={204}
            onSeek={setProgress}
          />
        </div>
        <NowPlayingBarExtras volume={volume} onVolumeChange={setVolume} />
      </NowPlayingBar>
    </div>
  )
}
