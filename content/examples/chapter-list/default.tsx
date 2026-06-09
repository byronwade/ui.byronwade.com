"use client"

import { ChapterList } from "@/components/chapter-list"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const chapters = [
  {
    title: "Intro & what we're building",
    start: 0,
    thumbnailSrc:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&q=80",
  },
  {
    title: "Setting up the design tokens",
    start: 95,
    thumbnailSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&q=80",
  },
  {
    title: "Authoring the first primitive",
    start: 312,
    thumbnailSrc:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&q=80",
  },
  {
    title: "Composing a pattern from primitives",
    start: 728,
    thumbnailSrc:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=240&q=80",
  },
  {
    title: "Wrap-up & next steps",
    start: 3725,
    thumbnailSrc:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=240&q=80",
  },
]

const skeletonRows = [
  { timeW: "w-8", titleW: "w-48" },
  { timeW: "w-10", titleW: "w-56" },
  { timeW: "w-8", titleW: "w-40" },
  { timeW: "w-12", titleW: "w-52" },
  { timeW: "w-9", titleW: "w-44" },
]

function ChapterListSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col"
      data-slot="chapter-list-skeleton"
    >
      {skeletonRows.map((row, i) => (
        <div
          key={i}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2"
        >
          {/* thumbnail */}
          <Skeleton className="h-14 w-24 shrink-0 rounded-md" />
          {/* timestamp */}
          <Skeleton className={cn("h-3 shrink-0 rounded", row.timeW)} />
          {/* title */}
          <Skeleton className={cn("h-3 rounded", row.titleW)} />
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
    <div aria-busy={isLoading} data-state={state} className="w-[420px]">
      {isLoading ? (
        <ChapterListSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState>No chapters</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load chapters</DemoErrorState>
      ) : (
        <ChapterList defaultActiveIndex={1} chapters={chapters} />
      )}
    </div>
  )
}
