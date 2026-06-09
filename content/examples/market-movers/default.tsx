"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { MarketMovers } from "@/components/market-movers"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

function MoverRowSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <Skeleton className="h-3 w-14 rounded" />
      </div>
      <Skeleton className="h-5 w-14 rounded" />
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  )
}

function MoversSkeleton() {
  return (
    <div className="w-full max-w-md rounded-xl edge bg-card p-3">
      <div className="grid w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        <Skeleton className="h-7 rounded-md" />
        <Skeleton className="h-7 rounded-md" />
        <Skeleton className="h-7 rounded-md" />
      </div>
      <div className="mt-3 space-y-1">
        {Array.from({ length: 5 }, (_, i) => (
          <MoverRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="flex justify-center p-8">
        <MoversSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex justify-center p-8">
        <div className="w-full max-w-md">
          <DemoEmptyState>No movers right now</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex justify-center p-8">
        <div className="w-full max-w-md">
          <DemoErrorState>Couldn&apos;t load movers</DemoErrorState>
        </div>
      </div>
    )
  }

  // default + success: render normal movers list
  // success gets a subtle positive ring affordance via data-state
  return (
    <div className="flex justify-center p-8">
      <MarketMovers data-state={state} />
    </div>
  )
}
