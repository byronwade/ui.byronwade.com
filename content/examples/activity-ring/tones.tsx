"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const data = [
  { value: 820, label: "Delivered", tone: "success" as const },
  { value: 140, label: "Pending", tone: "warning" as const },
  { value: 60, label: "Failed", tone: "danger" as const },
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
        <Skeleton className="h-5 w-28 rounded-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <ActivityRing
        verdict
        segments={isEmpty || isError ? empty : data}
        centerLabel="messages"
        className={cn(isError && "opacity-60")}
      />
      {state === "success" && (
        <p className="text-xs text-success">All messages delivered</p>
      )}
      {isEmpty && (
        <p className="text-xs text-muted-foreground">No messages yet</p>
      )}
      {isError && (
        <p className="text-xs text-destructive">Couldn’t load messages</p>
      )}
    </div>
  )
}
