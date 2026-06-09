"use client"

import { ActivityGrid } from "@/components/ui/activity-grid"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDemoDensity,
  useDemoDepth,
  useDemoFrame,
  useDemoState,
} from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const weeklyData = Array.from({ length: 26 * 7 }, (_, i) => {
  const col = Math.floor(i / 7)
  const row = i % 7
  const isWeekend = row === 0 || row === 6
  if (isWeekend) return 0
  // Simulate busier recent weeks
  const recencyBoost = col > 18 ? 1.5 : 1
  return Math.round(seededValue(i, 6) * 6 * recencyBoost)
})

const emptyData = Array.from({ length: 26 * 7 }, () => 0)
const totalActive = weeklyData.filter((n) => n > 0).length
const totalCount = weeklyData.reduce((a, b) => a + b, 0)
const skeletonCells = Array.from({ length: 26 * 7 }, (_, i) => i)

function ActivityGridSkeleton({
  density,
}: {
  density: "compact" | "default" | "comfortable"
}) {
  const cellSize = {
    compact: "size-2",
    default: "size-2.5",
    comfortable: "size-3",
  } satisfies Record<typeof density, string>

  return (
    <div
      aria-hidden="true"
      className="grid w-fit gap-1"
      style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}
    >
      {skeletonCells.map((cell) => (
        <Skeleton
          key={cell}
          className={cn(cellSize[density], "rounded-full")}
        />
      ))}
    </div>
  )
}

export default function Example() {
  const density = useDemoDensity() ?? "default"
  const frame = useDemoFrame() ?? "default"
  const depth = useDemoDepth() ?? "none"
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  const stateLabel = {
    default: "Live",
    loading: "Loading",
    empty: "No activity",
    success: "Synced",
    error: "Sync failed",
  }[state]

  const countLabel = isLoading
    ? "--"
    : isEmpty || isError
      ? "0"
      : totalCount.toLocaleString()

  const footerLabel = isError
    ? "Unable to load activity"
    : isLoading
      ? "Loading active days"
      : isEmpty
        ? "No active days yet"
        : `${totalActive} active days`

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className={cn(
        "w-fit rounded-xl bg-card text-card-foreground ring-1 ring-border/70",
        frame === "default" && "p-5",
        frame === "inset" && "bg-muted/30 p-2",
        state === "success" && "ring-success/30",
        isError && "ring-destructive/30",
        depth === "none" && "shadow-none",
        depth === "soft" && "depth-soft",
        depth === "raised" && "depth-raised",
      )}
    >
      <div
        className={cn(
          "rounded-lg",
          frame === "inset" && "bg-card p-4 ring-1 ring-border/70",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Contributions</p>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                state === "success" && "bg-success/10 text-success",
                isError && "bg-destructive/10 text-destructive",
                (state === "loading" ||
                  state === "empty" ||
                  state === "default") &&
                  "bg-muted text-muted-foreground",
              )}
            >
              {stateLabel}
            </span>
            <span className="text-2xl font-medium tabular-nums">
              {countLabel}
            </span>
          </div>
        </div>

        {isLoading ? (
          <ActivityGridSkeleton density={density} />
        ) : (
          <ActivityGrid
            data={isEmpty || isError ? emptyData : weeklyData}
            columns={26}
            size={density}
            className={cn(isError && "opacity-60")}
          />
        )}

        <div className="mt-3 flex items-center justify-between">
          <p
            className={cn(
              "text-xs text-muted-foreground",
              state === "success" && "text-success",
              isError && "text-destructive",
            )}
          >
            {footerLabel}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-0.5">
              {[0, 1, 3, 7, 12].map((v) => (
                <ActivityGrid key={v} data={[v]} columns={1} size={density} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
