"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const data = [
  { value: 1280, label: "Inbound" },
  { value: 740, label: "Outbound" },
]
const empty = data.map((s) => ({ ...s, value: 0 }))

export default function Example() {
  const state = useDemoState() ?? "default"
  const isError = state === "error"
  const isEmpty = state === "empty"

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Skeleton className="size-[168px] rounded-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <ActivityRing
        segments={isEmpty || isError ? empty : data}
        centerLabel="interactions"
        className={cn(isError && "opacity-60")}
      />
      {state === "success" && (
        <p className="text-xs text-success">Up to date · 2,020 interactions</p>
      )}
      {isEmpty && (
        <p className="text-xs text-muted-foreground">No interactions yet</p>
      )}
      {isError && (
        <p className="text-xs text-destructive">Couldn’t load interactions</p>
      )}
    </div>
  )
}
