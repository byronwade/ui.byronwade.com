"use client"

import { ActivityRing, scoreTone } from "@/components/ui/activity-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const scores = [32, 67, 91]

export default function Example() {
  const state = useDemoState() ?? "default"
  const isError = state === "error"
  const isEmpty = state === "empty"
  const blank = isEmpty || isError

  if (state === "loading") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-8 p-8">
        {scores.map((v) => (
          <Skeleton key={v} className="size-[110px] rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 p-8">
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-8",
          isError && "opacity-60",
        )}
      >
        {scores.map((v) => (
          <ActivityRing
            key={v}
            value={blank ? 0 : v}
            tone={blank ? "neutral" : scoreTone(v)}
            label={blank ? "—" : scoreTone(v)}
            size={110}
            thickness={8}
          />
        ))}
      </div>
      {state === "success" && (
        <p className="text-xs text-success">All scores refreshed</p>
      )}
      {isEmpty && (
        <p className="text-xs text-muted-foreground">No scores yet</p>
      )}
      {isError && (
        <p className="text-xs text-destructive">Couldn’t load scores</p>
      )}
    </div>
  )
}
