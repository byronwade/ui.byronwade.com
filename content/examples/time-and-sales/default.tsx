"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TimeAndSales } from "@/components/time-and-sales"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { makeTimeAndSalesRows } from "@/lib/market"
import { cn } from "@/lib/utils"

const rows = makeTimeAndSalesRows(16, { seed: 2 })
const SKELETON_ROW_COUNT = 8

function TimeAndSalesSkeleton() {
  return (
    <div aria-hidden="true" className="w-full">
      {/* header row */}
      <div className="grid grid-cols-[minmax(4.5rem,auto)_1fr_auto] gap-2 border-b border-border px-2 py-1.5">
        <Skeleton className="h-3 w-10 rounded" />
        <Skeleton className="ml-auto h-3 w-10 rounded" />
        <Skeleton className="h-3 w-8 rounded" />
      </div>
      {/* body rows */}
      <ul className="divide-y divide-border">
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
          <li
            key={i}
            className="grid grid-cols-[minmax(4.5rem,auto)_1fr_auto] gap-2 px-2 py-1.5"
          >
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton
              className={cn(
                "ml-auto h-3 rounded",
                i % 3 === 0 ? "w-16" : i % 3 === 1 ? "w-14" : "w-12",
              )}
            />
            <Skeleton className="h-3 w-8 rounded" />
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

  return (
    <div className="w-full max-w-sm p-4">
      {isLoading ? (
        <TimeAndSalesSkeleton />
      ) : isEmpty ? (
        <DemoEmptyState>No trades</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load tape</DemoErrorState>
      ) : (
        <TimeAndSales rows={rows} />
      )}
    </div>
  )
}
