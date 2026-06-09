"use client"

import { ChannelHeader } from "@/components/channel-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const BANNER =
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200&q=80"
const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"

const TABS = [
  { value: "home", label: "Home" },
  { value: "videos", label: "Videos" },
  { value: "shorts", label: "Shorts" },
  { value: "live", label: "Live" },
  { value: "playlists", label: "Playlists" },
]

function ChannelHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* banner */}
      <Skeleton className="h-32 w-full rounded-xl sm:h-40" />

      {/* identity row */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* avatar */}
        <Skeleton className="size-20 shrink-0 rounded-full sm:size-28" />

        <div className="flex min-w-0 flex-col gap-2">
          {/* name */}
          <Skeleton className="h-8 w-56 rounded-md" />
          {/* meta line: handle · subs · videos */}
          <Skeleton className="h-4 w-72 rounded-md" />
          {/* description */}
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          {/* action buttons */}
          <div className="mt-1 flex gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* tabs bar */}
      <div className="flex gap-4 border-b border-border pb-px">
        {TABS.map((tab) => (
          <Skeleton key={tab.value} className="h-8 w-16 rounded-md" />
        ))}
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
      <div className="w-[900px] max-w-full">
        <ChannelHeaderSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-[900px] max-w-full">
        <DemoEmptyState>No channel data</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-[900px] max-w-full">
        <DemoErrorState>Couldn&apos;t load channel</DemoErrorState>
      </div>
    )
  }

  // default + success both show the full channel header
  return (
    <div className="w-[900px] max-w-full">
      <ChannelHeader
        name="Marques Brownlee"
        verified
        handle="@mkbhd"
        subscriberCount={21000000}
        videoCount={1800}
        description="Quality tech videos, reviews, and the occasional ketchup taste test."
        avatarSrc={AVATAR}
        bannerSrc={BANNER}
        onSubscribedChange={() => {}}
        onJoin={() => {}}
        defaultTab="home"
        onTabChange={() => {}}
        tabs={TABS}
      />
    </div>
  )
}
