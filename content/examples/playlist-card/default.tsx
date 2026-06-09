"use client"

import { PlaylistCard } from "@/components/playlist-card"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

const PLAYLISTS = [
  {
    src: COVER,
    title: "Evening Acoustic",
    description: "Wind down with mellow guitar and soft vocals.",
    playing: false,
  },
  {
    src: COVER,
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-rock.",
    playing: true,
  },
  {
    src: COVER,
    title: "Morning Drive",
    description: "Upbeat tracks to start the day.",
    playing: false,
  },
]

function PlaylistCardSkeleton() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-3 rounded-lg bg-card p-3">
      {/* cover */}
      <Skeleton className="aspect-square w-full rounded-md" />
      {/* title + description */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isEmpty) {
    return (
      <div className="p-8">
        <DemoEmptyState>No playlists</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <DemoErrorState>Couldn&apos;t load playlists</DemoErrorState>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 p-8">
        {PLAYLISTS.map((_, i) => (
          <PlaylistCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 p-8">
      {PLAYLISTS.map((playlist) => (
        <PlaylistCard
          key={playlist.title}
          src={playlist.src}
          title={playlist.title}
          description={playlist.description}
          playing={playlist.playing}
          onPlay={() => {}}
        />
      ))}
    </div>
  )
}
