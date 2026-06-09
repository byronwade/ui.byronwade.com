"use client"

import { Clock, Flag, ListPlus } from "lucide-react"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { UpNextItem } from "@/components/up-next-item"
import { useDemoState } from "@/lib/demo-viewport"

const PREVIEW =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"

const MENU_ITEMS = [
  {
    key: "save",
    label: "Save to playlist",
    icon: <ListPlus className="size-4" />,
    onClick: () => {},
  },
  {
    key: "watch-later",
    label: "Save to Watch later",
    icon: <Clock className="size-4" />,
    onClick: () => {},
  },
  {
    key: "report",
    label: "Report",
    icon: <Flag className="size-4" />,
    onClick: () => {},
  },
]

function UpNextItemSkeleton() {
  return (
    <div className="flex items-start gap-3">
      {/* thumbnail skeleton */}
      <Skeleton className="h-[90px] w-40 shrink-0 rounded-lg" />
      {/* body skeleton */}
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
        <Skeleton className="mt-1 h-3 w-24 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
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
    <div className="flex w-[400px] flex-col gap-2">
      {isLoading ? (
        <>
          <UpNextItemSkeleton />
          <UpNextItemSkeleton />
          <UpNextItemSkeleton />
        </>
      ) : isEmpty ? (
        <DemoEmptyState className="w-full">Nothing up next</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState className="w-full">Couldn't load</DemoErrorState>
      ) : (
        <>
          <UpNextItem
            title="The state of CSS in 2026, what changed and what's next"
            href="#"
            thumbnailSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80"
            previewSrc={PREVIEW}
            live
            channelName="frontend weekly"
            verified
            views={48200}
            timestamp="streaming now"
          />
          <UpNextItem
            title="Building a design system from scratch, tokens, primitives, and composites"
            href="#"
            thumbnailSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=480&q=80"
            previewSrc={PREVIEW}
            duration="14:08"
            progress={42}
            channelName="byronwade"
            verified
            views={2200000}
            timestamp="2 months ago"
            active
          />
          <UpNextItem
            title="A quiet hour of ambient focus music for deep work"
            href="#"
            thumbnailSrc="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=480&q=80"
            duration="1:02:11"
            channelName="lofi room"
            views={910000}
            timestamp="1 year ago"
            menuItems={MENU_ITEMS}
          />
        </>
      )}
    </div>
  )
}
