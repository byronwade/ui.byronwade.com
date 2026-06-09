"use client"

import { SectorRotation } from "@/components/ui/sector-rotation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { makeSectorSegments } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const segments = makeSectorSegments(6, { seed: 21 })

function SectorRotationSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      {/* Ring skeleton */}
      <Skeleton className="size-[180px] shrink-0 rounded-full" />
      {/* Legend rows skeleton */}
      <ul className="grid w-full min-w-0 gap-1.5 sm:max-w-xs">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex items-center justify-between px-2 py-1.5">
            <span className="flex items-center gap-2">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </span>
            <span className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-8 rounded" />
              <Skeleton className="h-3.5 w-12 rounded" />
            </span>
          </li>
        ))}
      </ul>
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
      <div className="w-full max-w-lg">
        <SectorRotationSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-lg">
        <DemoEmptyState>No sector data</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-lg">
        <DemoErrorState>Couldn't load</DemoErrorState>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <SectorRotation segments={segments} />
    </div>
  )
}
