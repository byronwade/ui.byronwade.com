"use client"

import { LightweightChart } from "@/components/ui/lightweight-chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"
import { makeCandles } from "@/lib/market"

const chartData = makeCandles(72, { seed: 7 })

function ChartSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full w-full flex-col gap-2 p-3">
      {/* price axis rows */}
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col justify-between gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-px w-full" />
          ))}
        </div>
        <Skeleton className="w-12 self-stretch" />
      </div>
      {/* volume bar row */}
      <div className="flex h-10 items-end gap-px">
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${20 + ((i * 17 + 3) % 60)}%` }}
          />
        ))}
      </div>
      {/* time axis */}
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-12" />
        ))}
      </div>
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
        aria-busy={isLoading}
        data-state={state}
        className={cn(
          "h-[360px] w-full max-w-3xl overflow-hidden rounded-lg edge bg-card",
          isSuccess && "ring-1 ring-success/30",
          isError && "ring-1 ring-destructive/30",
        )}
      >
        {isLoading ? (
          <ChartSkeleton />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center p-6">
            <DemoEmptyState className="w-full">No data</DemoEmptyState>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center p-6">
            <DemoErrorState className="w-full">
              Couldn&apos;t load chart
            </DemoErrorState>
          </div>
        ) : (
          <LightweightChart
            data={chartData}
            chartType="candles"
            fill
            showVolume
            aria-label="AAPL daily candles"
          />
        )}
      </div>
    </div>
  )
}
