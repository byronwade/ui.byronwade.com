"use client"

import { Sparkline } from "@/components/ui/sparkline"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeSeries } from "@/lib/market"
import { cn } from "@/lib/utils"

const upData = makeSeries(28, { seed: 7 })
const downData = makeSeries(28, { seed: 7 }).slice().reverse()
const flatData = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
const zeroData = Array.from({ length: 20 }, () => 0)
const brandData = makeSeries(28, { seed: 3 })

function SparklineSkeleton({
  width = 96,
  height = 32,
}: {
  width?: number
  height?: number
}) {
  return (
    <Skeleton
      style={{ width, height }}
      className="rounded-sm"
      aria-hidden="true"
    />
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="flex items-center gap-6">
          <SparklineSkeleton width={96} height={32} />
          <SparklineSkeleton width={96} height={32} />
          <SparklineSkeleton width={96} height={32} />
        </div>
        <div className="flex items-center gap-6">
          <SparklineSkeleton width={140} height={44} />
          <SparklineSkeleton width={140} height={44} />
        </div>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="flex items-center gap-6">
          <Sparkline data={zeroData} tone="muted" aria-label="No data" />
          <Sparkline data={zeroData} tone="muted" aria-label="No data" />
          <Sparkline data={zeroData} tone="muted" aria-label="No data" />
        </div>
        <DemoEmptyState className="w-72">No data</DemoEmptyState>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <DemoErrorState className="w-72">Couldn&apos;t load</DemoErrorState>
      </div>
    )
  }

  // success: positive brand affordance on area chart; default: standard layout
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-6">
        <Sparkline data={upData} aria-label="Up trend" />
        <Sparkline data={downData} aria-label="Down trend" />
        <Sparkline data={flatData} aria-label="Flat trend" />
      </div>
      <div className="flex items-center gap-6">
        <Sparkline
          variant="area"
          data={makeSeries(28, { seed: 11 })}
          width={140}
          height={44}
          aria-label="Area trend"
          className={cn(
            state === "success" && "ring-1 ring-success/30 rounded-sm",
          )}
        />
        <Sparkline
          variant="area"
          tone="brand"
          data={brandData}
          width={140}
          height={44}
          aria-label="Brand area trend"
          className={cn(
            state === "success" && "ring-1 ring-success/30 rounded-sm",
          )}
        />
      </div>
    </div>
  )
}
