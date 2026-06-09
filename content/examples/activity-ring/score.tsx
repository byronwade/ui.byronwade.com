"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

export default function Example() {
  const state = useDemoState() ?? "default"
  const isError = state === "error"
  const isEmpty = state === "empty"
  const blank = isEmpty || isError

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <Skeleton className="size-40 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <ActivityRing
        value={blank ? 0 : state === "success" ? 92 : 78}
        tone={blank ? "neutral" : state === "success" ? "success" : undefined}
        label={isEmpty ? "No data" : "Performance"}
        className={cn(isError && "opacity-60")}
      />
      {state === "success" && (
        <p className="text-xs text-success">Healthy · all checks passed</p>
      )}
      {isError && (
        <p className="text-xs text-destructive">Couldn’t load score</p>
      )}
    </div>
  )
}
