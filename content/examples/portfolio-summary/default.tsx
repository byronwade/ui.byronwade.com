"use client"

import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeSeries } from "@/lib/market"
import { cn } from "@/lib/utils"

const spark = makeSeries(40, { seed: 16 })
const flatSpark = Array.from({ length: 40 }, () => 0.5)

function PortfolioSummarySkeleton() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {/* top row: stat card + sparkline card */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        {/* stat card skeleton */}
        <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="mb-3 h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* sparkline card skeleton */}
        <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
          <Skeleton className="mb-3 h-4 w-20" />
          <Skeleton className="h-[72px] w-[220px]" />
        </div>
      </div>
      {/* allocation skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        {[58, 22, 20].map((w) => (
          <div key={w} className="space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <Skeleton
                className="h-full rounded-full"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        ))}
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="w-full max-w-3xl p-4" aria-busy="true">
        <PortfolioSummarySkeleton />
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-3xl p-4">
        <DemoErrorState>Couldn&apos;t load portfolio data</DemoErrorState>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-3xl p-4">
        <PortfolioSummary
          totalValue={0}
          dayChange={0}
          dayChangePercent={0}
          spark={flatSpark}
          allocations={[
            { label: "Equities", percent: 0 },
            { label: "Options", percent: 0 },
            { label: "Cash", percent: 0 },
          ]}
          className={cn("opacity-60")}
        />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          No data
        </p>
      </div>
    )
  }

  if (state === "success") {
    return (
      <div className="w-full max-w-3xl p-4">
        <PortfolioSummary spark={spark} />
        <p className="mt-2 text-xs text-success">Portfolio synced</p>
      </div>
    )
  }

  // default
  return (
    <div className="w-full max-w-3xl p-4">
      <PortfolioSummary spark={spark} />
    </div>
  )
}
