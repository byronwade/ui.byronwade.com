"use client"

import { ActivityGrid } from "@/components/ui/activity-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoDensity, useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const data = Array.from({ length: 26 * 7 }, (_, i) => {
  // Realistic contribution-style pattern with spikes
  const weekday = i % 7
  const weekend = weekday === 0 || weekday === 6
  const base = weekend ? seededValue(i, 1) * 2 : seededValue(i, 2) * 5
  const spike = seededValue(i, 3) > 0.85 ? seededValue(i, 4) * 8 : 0
  return Math.round(base + spike)
})

const emptyData = Array.from({ length: 26 * 7 }, () => 0)
const cellSize = {
  compact: "size-2",
  default: "size-2.5",
  comfortable: "size-3",
} satisfies Record<"compact" | "default" | "comfortable", string>

export default function Example() {
  const density = useDemoDensity() ?? "default"
  const state = useDemoState() ?? "default"

  const subtitle = {
    default: "182 contributions in the last 6 months",
    loading: "Loading contributions…",
    empty: "No contributions yet",
    success: "Up to date · 182 contributions",
    error: "Couldn’t load contributions",
  }[state]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium">Contribution cadence</p>
          <p
            className={cn(
              "text-xs text-muted-foreground",
              state === "success" && "text-success",
              state === "error" && "text-destructive",
            )}
          >
            {subtitle}
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">26 x 7</span>
      </div>

      {state === "loading" ? (
        <div
          aria-hidden="true"
          className="grid w-fit gap-1"
          style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}
        >
          {data.map((_, i) => (
            <Skeleton
              key={i}
              className={cn(cellSize[density], "rounded-full")}
            />
          ))}
        </div>
      ) : (
        <ActivityGrid
          data={state === "empty" || state === "error" ? emptyData : data}
          size={density}
          className={cn(state === "error" && "opacity-60")}
        />
      )}
    </div>
  )
}
