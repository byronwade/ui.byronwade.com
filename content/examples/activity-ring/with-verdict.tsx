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
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
      </div>
    )
  }

  const caption = isEmpty
    ? "No interactions yet"
    : isError
      ? "Couldn’t load this week"
      : state === "success"
        ? "Synced · 2,020 this week"
        : "1,280 in · 740 out this week"

  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        verdict
        caption={caption}
        segments={isEmpty || isError ? empty : data}
        centerLabel="interactions"
        className={cn(isError && "opacity-60")}
      />
    </div>
  )
}
