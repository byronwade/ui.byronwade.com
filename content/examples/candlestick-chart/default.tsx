"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { useDemoState } from "@/lib/demo-viewport"
import { makeCandles } from "@/lib/market"

const data = makeCandles(48, { seed: 7 })

function ChartSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[260px] w-full flex-col gap-1 px-1"
    >
      {/* Simulate candle rows — alternating heights to mirror chart shape */}
      <div className="flex flex-1 items-end gap-[3px]">
        {Array.from({ length: 32 }, (_, i) => {
          const h = 30 + (Math.sin(i * 1.9) * 0.5 + 0.5) * 70
          return (
            <Skeleton
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${h}%` }}
            />
          )
        })}
      </div>
      {/* Volume band skeleton */}
      <div className="flex h-[52px] items-end gap-[3px]">
        {Array.from({ length: 32 }, (_, i) => {
          const h = 20 + (Math.sin(i * 2.3 + 1) * 0.5 + 0.5) * 70
          return (
            <Skeleton
              key={i}
              className="flex-1 rounded-sm opacity-60"
              style={{ height: `${h}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex justify-center p-8">
      <div className="w-[480px] rounded-lg edge bg-card p-4">
        {isLoading ? (
          <ChartSkeleton />
        ) : isEmpty ? (
          <DemoEmptyState className="h-[260px] flex items-center justify-center py-0">
            No price data
          </DemoEmptyState>
        ) : isError ? (
          <DemoErrorState className="h-[260px] flex items-center justify-center py-0">
            Couldn&apos;t load chart
          </DemoErrorState>
        ) : (
          <CandlestickChart
            data={data}
            width={448}
            height={260}
            aria-label="AAPL daily candles"
          />
        )}
      </div>
    </div>
  )
}
