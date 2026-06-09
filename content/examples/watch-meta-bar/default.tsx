"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { ChannelByline } from "@/components/channel-byline"
import { EngagementBar } from "@/components/engagement-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { WatchMetaBar } from "@/components/watch-meta-bar"
import { useDemoState } from "@/lib/demo-viewport"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"

function WatchMetaBarSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      {/* channel byline skeleton */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
      </div>
      {/* engagement bar skeleton */}
      <div className="flex shrink-0 items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl" aria-busy>
        <WatchMetaBarSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-3xl">
        <DemoEmptyState>No video selected</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-3xl">
        <DemoErrorState>Couldn&apos;t load video metadata</DemoErrorState>
      </div>
    )
  }

  // default + success: render the normal watch meta bar
  return (
    <div className="w-full max-w-3xl">
      <WatchMetaBar
        channel={
          <ChannelByline
            name="Marques Brownlee"
            avatarSrc={AVATAR}
            verified
            subscriberCount={8_600_000}
          />
        }
        engagement={<EngagementBar likeCount={124_000} />}
      />
    </div>
  )
}
