"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { SymbolDetails } from "@/components/symbol-details"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeSymbolStats, type SymbolStats } from "@/lib/market"
import { cn } from "@/lib/utils"

const normalStats: SymbolStats = makeSymbolStats({ seed: 4 })
const successStats: SymbolStats = makeSymbolStats({ seed: 4 })

// Skeleton that mirrors the SymbolDetails grid layout (labels kept, values replaced)
function SymbolDetailsSkeleton() {
  return (
    <div
      className="flex w-full flex-col gap-6"
      aria-busy="true"
      aria-label="Loading symbol details"
    >
      {/* Quote header skeleton */}
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
          <div className="ml-auto flex flex-col items-end gap-1.5">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
        {/* Sparkline skeleton */}
        <Skeleton className="h-12 w-full rounded" />
        {/* Stats row skeleton */}
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Exchange / sector / industry skeleton */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-20 rounded" />
        ))}
      </div>
      {/* Tabs skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full max-w-md rounded-md" />
        {/* Stat grid skeleton — mirrors 4-column grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                {["Market cap", "Volume", "Avg volume", "Beta"][i]}
              </span>
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Empty-state version: keeps chrome/labels but shows "—" for all stat values
function SymbolDetailsEmpty() {
  const emptyStats: SymbolStats = {
    ...normalStats,
    overview: normalStats.overview.map((row) => ({ ...row, value: "—" })),
    financials: normalStats.financials.map((row) => ({ ...row, value: "—" })),
    statistics: normalStats.statistics.map((row) => ({ ...row, value: "—" })),
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <SymbolDetails stats={emptyStats} />
      <DemoEmptyState>No data available for this symbol</DemoEmptyState>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  return (
    <div
      className={cn("w-full max-w-3xl p-4", state === "error" && "rounded-xl")}
    >
      {state === "loading" && <SymbolDetailsSkeleton />}
      {state === "empty" && <SymbolDetailsEmpty />}
      {state === "error" && (
        <DemoErrorState>Couldn&apos;t load details</DemoErrorState>
      )}
      {(state === "default" || state === "success") && (
        <SymbolDetails
          stats={state === "success" ? successStats : normalStats}
          data-state={state}
        />
      )}
    </div>
  )
}
