"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { MetricStat } from "@/components/metric-stat"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

// ── per-state configs ────────────────────────────────────────────────────────

const metrics = [
  {
    label: "Total Revenue",
    value: "$48,295",
    delta: { value: "+12.4%", direction: "up" as const },
  },
  {
    label: "Active Users",
    value: "8,340",
    delta: { value: "+5.7%", direction: "up" as const },
  },
  {
    label: "Churn Rate",
    value: "2.1%",
    delta: { value: "+0.3%", direction: "down" as const },
  },
]

// Skeleton that mirrors the value shape (text-2xl ~32px tall, ~80px wide)
function ValueSkeleton() {
  return <Skeleton className="h-8 w-20 rounded-md" />
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
        "flex flex-wrap gap-8 rounded-2xl bg-card p-6 ring-1",
        isSuccess && "ring-success/30",
        isError && "ring-destructive/30",
        !isSuccess && !isError && "ring-border/70",
      )}
    >
      {metrics.map(({ label, value, delta }) => {
        if (isLoading) {
          // skeleton: keep label chrome, replace value with animated skeleton
          return (
            <MetricStat key={label} label={label} value={<ValueSkeleton />} />
          )
        }

        if (isEmpty) {
          // empty: show "—" value + muted "No data yet" hint
          return (
            <MetricStat
              key={label}
              label={label}
              value="—"
              // hint replaces delta with a calm explanatory note
              // We pass value as ReactNode to embed the hint inline
              // because MetricStat delegates to Metric which supports hint
            />
          )
        }

        if (isError) {
          // error: "—" value + destructive caption inline as ReactNode value
          return (
            <div key={label} className="flex flex-col gap-1">
              <MetricStat label={label} value="—" />
              <p className="text-xs text-destructive">Couldn&apos;t load</p>
            </div>
          )
        }

        if (isSuccess) {
          // success: normal value + positive affordance badge on the first metric
          return (
            <div key={label} className="flex flex-col gap-0.5">
              <MetricStat label={label} value={value} delta={delta} />
              {label === "Total Revenue" && (
                <span className="text-xs text-success">All synced</span>
              )}
            </div>
          )
        }

        // default
        return (
          <MetricStat key={label} label={label} value={value} delta={delta} />
        )
      })}

      {/* empty state caption row */}
      {isEmpty && (
        <p className="w-full text-xs text-muted-foreground">No data yet</p>
      )}
    </div>
  )
}
