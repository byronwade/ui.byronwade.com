"use client"

import { Flag, ListPlus } from "lucide-react"

import { VideoCard } from "@/components/video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

const menuItems = [
  {
    key: "save",
    label: "Save to playlist",
    icon: <ListPlus className="size-4" />,
    onClick: () => {},
  },
  {
    key: "report",
    label: "Report",
    icon: <Flag className="size-4" />,
    onClick: () => {},
  },
]

function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* thumbnail */}
      <Skeleton className="aspect-video w-full rounded-xl" />
      {/* body */}
      <div className="flex gap-3">
        {/* avatar */}
        <Skeleton className="mt-0.5 size-8 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          {/* title lines */}
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
          {/* channel name */}
          <Skeleton className="h-3 w-24 rounded" />
          {/* meta: views · timestamp */}
          <Skeleton className="h-3 w-32 rounded" />
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

  if (isLoading) {
    return (
      <div className="w-[360px]">
        <VideoCardSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-[360px]">
        <DemoEmptyState>No videos</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-[360px]">
        <DemoErrorState>Couldn&apos;t load videos</DemoErrorState>
      </div>
    )
  }

  // default + success both show the normal card
  return (
    <div className="w-[360px]">
      <VideoCard
        title="Building a design system from scratch, tokens, primitives, and composites"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=720&q=80"
        duration="14:08"
        progress={42}
        views={2200000}
        timestamp="2 months ago"
        channelName="byronwade"
        channelAvatarSrc="https://i.pravatar.cc/64?img=12"
        verified
        menuItems={menuItems}
      />
    </div>
  )
}
