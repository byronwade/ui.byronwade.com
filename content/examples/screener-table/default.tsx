"use client"

import { ScreenerTable } from "@/components/screener-table"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const SKELETON_ROWS = 6

function ScreenerTableSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col gap-3"
      data-slot="screener-table-skeleton"
    >
      {/* Filter tabs skeleton */}
      <div className="flex gap-2">
        {[72, 64, 56].map((w) => (
          <Skeleton key={w} className="h-7 rounded-md" style={{ width: w }} />
        ))}
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_80px_96px_80px_80px_72px] gap-x-4 border-b border-border/60 pb-2">
        {["Symbol", "Price", "Change", "Volume", "Mkt cap", "Trend"].map(
          (col) => (
            <Skeleton key={col} className="h-3.5 w-3/4 rounded" />
          ),
        )}
      </div>

      {/* Data rows */}
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_80px_96px_80px_80px_72px] items-center gap-x-4 py-1.5"
        >
          {/* Symbol + name */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-12 rounded font-mono" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          {/* Price */}
          <Skeleton className="ml-auto h-3.5 w-14 rounded font-mono" />
          {/* Change */}
          <Skeleton className="ml-auto h-3.5 w-16 rounded" />
          {/* Volume */}
          <Skeleton className="ml-auto h-3.5 w-10 rounded font-mono" />
          {/* Mkt cap */}
          <Skeleton className="ml-auto h-3.5 w-10 rounded font-mono" />
          {/* Trend sparkline */}
          <Skeleton className="h-6 w-[72px] rounded" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "error") {
    return (
      <div className="w-full max-w-5xl p-4">
        <DemoErrorState>Couldn&apos;t run screener</DemoErrorState>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-5xl p-4">
        <DemoEmptyState>No matches for this screen</DemoEmptyState>
      </div>
    )
  }

  if (state === "loading") {
    return (
      <div className="w-full max-w-5xl p-4">
        <ScreenerTableSkeleton />
      </div>
    )
  }

  // default + success — render normal screener; success needs no extra affordance for market data
  return (
    <div className="w-full max-w-5xl p-4">
      <ScreenerTable rows={undefined} />
    </div>
  )
}
