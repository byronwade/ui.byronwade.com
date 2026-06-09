"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { Watchlist } from "@/components/watchlist"
import { makeQuote } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const items = Array.from({ length: 6 }, (_, index) =>
  makeQuote({ seed: index + 20 }),
)

const SKELETON_ROWS = 6

function WatchlistSkeleton() {
  return (
    <div aria-hidden="true" className="w-full">
      {/* header row */}
      <div className="flex items-center border-b border-border/60 px-3 py-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="ml-auto h-3 w-8" />
        <Skeleton className="ml-8 h-3 w-12" />
        <Skeleton className="ml-8 h-3 w-9" />
        <Skeleton className="ml-8 h-3 w-10" />
      </div>
      {/* data rows */}
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border/40 px-3 py-2.5"
        >
          {/* symbol + name */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          {/* last price */}
          <Skeleton className="ml-auto h-3.5 w-14 font-mono" />
          {/* change */}
          <Skeleton className="ml-8 h-5 w-16 rounded" />
          {/* sparkline */}
          <Skeleton className="ml-8 h-6 w-[72px] rounded" />
          {/* volume */}
          <Skeleton className="ml-8 h-3.5 w-12" />
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
  const isSuccess = state === "success"

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className={cn(
        "w-full max-w-3xl rounded-xl bg-card text-card-foreground ring-1 ring-border/70 overflow-hidden",
        isSuccess && "ring-success/30",
        isError && "ring-destructive/30",
      )}
    >
      {isLoading ? (
        <WatchlistSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState className="m-4">
          No symbols in this watchlist
        </DemoEmptyState>
      ) : isError ? (
        <DemoErrorState className="m-4">
          Couldn&apos;t load watchlist
        </DemoErrorState>
      ) : (
        <Watchlist items={items} selectedSymbol={items[0].symbol} />
      )}
    </div>
  )
}
