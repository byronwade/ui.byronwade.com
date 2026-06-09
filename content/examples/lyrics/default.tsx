"use client"

import { Lyrics } from "@/components/ui/lyrics"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

const LINES = [
  { text: "We were the embers of a fading light" },
  { text: "Chasing the morning through the longest night" },
  { text: "Every horizon a line we'd cross" },
  { text: "Counting the cities in the afterglow" },
  { text: "Holding the silence we were scared to know" },
  { text: "Now I can hear it in the quiet" },
]

const SKELETON_LINE_WIDTHS = [
  "w-2/3",
  "w-3/4",
  "w-1/2",
  "w-4/5",
  "w-3/5",
  "w-2/5",
]

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="w-full max-w-md p-8">
      {isLoading ? (
        <div aria-busy="true" className="flex flex-col gap-3 py-4">
          {SKELETON_LINE_WIDTHS.map((w, i) => (
            <Skeleton key={i} className={`h-8 rounded-md ${w}`} />
          ))}
        </div>
      ) : isEmpty ? (
        <DemoEmptyState>No lyrics available</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load lyrics</DemoErrorState>
      ) : (
        <Lyrics lines={LINES} activeIndex={2} onLineClick={() => {}} />
      )}
    </div>
  )
}
