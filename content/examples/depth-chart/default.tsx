"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { DepthChart } from "@/components/ui/depth-chart"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { makeOrderBook } from "@/lib/market"
import { cn } from "@/lib/utils"

const { bids, asks } = makeOrderBook({ seed: 7, depth: 16 })

const CHART_WIDTH = 448
const CHART_HEIGHT = 200

function DepthChartSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded"
      style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
    >
      {/* Background fill */}
      <Skeleton className="absolute inset-0 rounded" />
      {/* Left bid curve suggestion */}
      <Skeleton
        className="absolute bottom-0 left-0 rounded-tr-2xl"
        style={{ width: CHART_WIDTH / 2, height: CHART_HEIGHT * 0.65 }}
      />
      {/* Right ask curve suggestion */}
      <Skeleton
        className="absolute bottom-0 right-0 rounded-tl-2xl"
        style={{ width: CHART_WIDTH / 2, height: CHART_HEIGHT * 0.55 }}
      />
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
        data-state={state}
        aria-busy={isLoading}
        className={cn(
          "w-[480px] rounded-lg bg-card p-4 ring-1 ring-border/70",
          isSuccess && "ring-success/30",
          isError && "ring-destructive/30",
        )}
      >
        {isLoading ? (
          <DepthChartSkeleton />
        ) : isEmpty ? (
          <div
            style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
            className="flex items-center"
          >
            <DemoEmptyState className="w-full">No depth data</DemoEmptyState>
          </div>
        ) : isError ? (
          <div
            style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
            className="flex items-center"
          >
            <DemoErrorState className="w-full">
              Couldn&apos;t load depth
            </DemoErrorState>
          </div>
        ) : (
          <DepthChart
            bids={bids}
            asks={asks}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            aria-label="AAPL order book depth"
            className={cn(isSuccess && "opacity-100")}
          />
        )}
      </div>
    </div>
  )
}
