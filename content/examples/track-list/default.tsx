"use client"

import { TrackList, TrackRow } from "@/components/ui/track-list"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

const tracks = [
  {
    index: 1,
    title: "Lost in the Echo",
    artist: "Aurora Skies",
    duration: "3:24",
    active: true,
    playing: true,
    liked: true,
    explicit: false,
  },
  {
    index: 2,
    title: "Neon Roads",
    artist: "Aurora Skies",
    duration: "4:01",
    explicit: true,
    active: false,
    playing: false,
    liked: false,
  },
  {
    index: 3,
    title: "Slow Tide",
    artist: "Aurora Skies",
    album: "Coastlines",
    duration: "2:58",
    active: false,
    playing: false,
    liked: false,
    explicit: false,
  },
]

function TrackListSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md px-3 py-2"
        >
          {/* index cell */}
          <Skeleton className="mx-auto h-4 w-4 rounded-sm" />
          {/* title + artist */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-32 rounded-sm" />
            <Skeleton className="h-3 w-20 rounded-sm" />
          </div>
          {/* duration */}
          <Skeleton className="h-3 w-8 rounded-sm" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="w-full max-w-lg p-4">
      {isLoading ? (
        <TrackListSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState>No tracks</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load tracks</DemoErrorState>
      ) : (
        <TrackList>
          {tracks.map((track) => (
            <TrackRow
              key={track.index}
              index={track.index}
              title={track.title}
              artist={track.artist}
              album={track.album}
              duration={track.duration}
              active={track.active}
              playing={track.playing}
              liked={track.liked}
              explicit={track.explicit}
              onPlay={() => {}}
              onLikeToggle={() => {}}
            />
          ))}
        </TrackList>
      )}
    </div>
  )
}
