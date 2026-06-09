"use client"

import { ArtistHeader } from "@/components/artist-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const IMAGE =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

function ArtistHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
      {/* avatar circle */}
      <Skeleton className="size-32 shrink-0 rounded-full" />
      <div className="flex flex-col gap-3">
        {/* verified badge */}
        <Skeleton className="h-5 w-28 rounded-full" />
        {/* artist name */}
        <Skeleton className="h-12 w-64" />
        {/* monthly listeners */}
        <Skeleton className="h-4 w-40" />
        {/* play / follow buttons */}
        <div className="mt-1 flex items-center gap-3">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="w-full max-w-2xl p-8">
      {isLoading ? (
        <ArtistHeaderSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState>No artist</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load artist</DemoErrorState>
      ) : (
        <ArtistHeader
          name="Aurora Skies"
          image={IMAGE}
          verified
          monthlyListeners={2841093}
          onPlay={() => {}}
          onFollowToggle={() => {}}
        />
      )}
    </div>
  )
}
