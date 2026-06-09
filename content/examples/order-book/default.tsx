"use client"

import { OrderBook } from "@/components/ui/order-book"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { makeOrderBook } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const { bids, asks } = makeOrderBook({ seed: 3, depth: 10 })

// Mirror the bid/ask row layout: price col + size col, repeated depth times
const SKELETON_DEPTH = 8

function OrderBookSkeleton() {
  return (
    <div className="w-[320px] overflow-hidden rounded-md bg-card ring-1 ring-border/70">
      {/* Ask rows */}
      {Array.from({ length: SKELETON_DEPTH }, (_, i) => (
        <div
          key={`ask-skel-${i}`}
          className="grid grid-cols-[1fr_auto] items-center gap-2 px-2 py-1"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
      {/* Spread row */}
      <div className="flex items-center justify-center gap-1 border-y border-border bg-muted/30 px-2 py-1.5">
        <Skeleton className="h-2.5 w-10" />
        <Skeleton className="h-3 w-12" />
      </div>
      {/* Bid rows */}
      {Array.from({ length: SKELETON_DEPTH }, (_, i) => (
        <div
          key={`bid-skel-${i}`}
          className="grid grid-cols-[1fr_auto] items-center gap-2 px-2 py-1"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="flex justify-center p-8">
        <OrderBookSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex justify-center p-8">
        <div className="w-[320px]">
          <DemoEmptyState>No orders</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex justify-center p-8">
        <div className="w-[320px]">
          <DemoErrorState>Couldn&apos;t load order book</DemoErrorState>
        </div>
      </div>
    )
  }

  // default + success: render the real order book
  // success gets a subtle ring affordance to signal fresh data
  return (
    <div className="flex justify-center p-8">
      <div className="w-[320px]">
        <OrderBook
          bids={bids}
          asks={asks}
          depth={8}
          layout="vertical"
          className={state === "success" ? "ring-success/30" : undefined}
        />
      </div>
    </div>
  )
}
