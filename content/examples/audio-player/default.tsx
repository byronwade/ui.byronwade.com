"use client"

import {
  AudioPlayer,
  AudioPlayerContent,
  AudioPlayerControlBar,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "@/components/ui/audio-player"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isError) {
    return (
      <div className="w-full max-w-xl p-8">
        <DemoErrorState>Couldn&apos;t load track</DemoErrorState>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-xl p-8">
        <DemoEmptyState>No track selected</DemoEmptyState>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-xl p-8">
        <div className="rounded-lg edge bg-card w-full">
          {/* Track metadata skeleton */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <Skeleton className="size-10 rounded-md shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-36 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          {/* Waveform / progress skeleton mirroring the control bar layout */}
          <div className="flex items-center gap-2 px-3 pb-3">
            <Skeleton className="size-8 rounded-md shrink-0" />
            <Skeleton className="size-8 rounded-md shrink-0" />
            <Skeleton className="size-8 rounded-md shrink-0" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-4 w-20 rounded shrink-0" />
            <Skeleton className="size-8 rounded-md shrink-0" />
            <Skeleton className="h-2 w-16 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    )
  }

  // default + success — normal player with a loaded track
  return (
    <div className="w-full max-w-xl p-8">
      <AudioPlayer
        variant="default"
        className={cn(state === "success" && "ring-success/30")}
      >
        <AudioPlayerContent
          src="https://www.w3schools.com/html/horse.mp3"
          preload="metadata"
        />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
          <AudioPlayerSeekBackwardButton />
          <AudioPlayerSeekForwardButton />
          <AudioPlayerTimeRange />
          <AudioPlayerTimeDisplay showDuration />
          <AudioPlayerMuteButton />
          <AudioPlayerVolumeRange />
        </AudioPlayerControlBar>
      </AudioPlayer>
    </div>
  )
}
