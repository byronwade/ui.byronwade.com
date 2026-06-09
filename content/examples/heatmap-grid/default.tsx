"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { HeatmapGrid } from "@/components/ui/heatmap-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeHeatmapCells } from "@/lib/market"
import { cn } from "@/lib/utils"

const cells = makeHeatmapCells(16, { seed: 5 })

// Skeleton mirrors the heatmap layout: 4-column flex grid with proportional cells
function HeatmapSkeleton({ count }: { count: number }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap gap-1"
      style={{ minHeight: "120px" }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          className="min-h-14 flex-1 rounded-md"
          style={{ flexBasis: `${100 / 4}%` }}
        />
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
    <div className="flex justify-center p-8">
      <div
        className={cn(
          "w-[480px] rounded-xl bg-card ring-1 ring-border/70",
          isSuccess && "ring-success/30",
          isError && "ring-destructive/30",
        )}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Market Heatmap</p>
            {isSuccess && (
              <span className="rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
                Updated
              </span>
            )}
            {isError && (
              <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                Stale
              </span>
            )}
          </div>

          {isLoading ? (
            <HeatmapSkeleton count={cells.length} />
          ) : isEmpty ? (
            <DemoEmptyState>No data</DemoEmptyState>
          ) : isError ? (
            <DemoErrorState>Couldn&apos;t load</DemoErrorState>
          ) : (
            <HeatmapGrid cells={cells} columns={4} scale="tone" />
          )}
        </div>
      </div>
    </div>
  )
}
