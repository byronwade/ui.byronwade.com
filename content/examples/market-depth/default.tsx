"use client"

import { MarketDepth } from "@/components/market-depth"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { makeOrderBook } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const book = makeOrderBook({ seed: 4, depth: 10 })

function MarketDepthSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3" aria-hidden="true">
      {/* header metrics row */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
      {/* chart area */}
      <Skeleton className="h-[200px] w-full rounded-lg" />
      {/* order book rows */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <Skeleton
              className={cn("h-3 rounded", i % 2 === 0 ? "w-20" : "w-16")}
            />
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return <MarketDepthSkeleton />
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-md">
        <DemoEmptyState>No depth data</DemoEmptyState>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-md">
        <DemoErrorState>Couldn&apos;t load depth</DemoErrorState>
      </div>
    )
  }

  // default + success both show the normal depth view
  return (
    <div className="w-full max-w-md">
      <MarketDepth bids={book.bids} asks={book.asks} />
    </div>
  )
}
