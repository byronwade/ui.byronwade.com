"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { DatePicker } from "@/components/ui/date-picker"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isError = state === "error"

  // loading — skeleton that mimics the trigger + calendar popover area
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-[240px] rounded-md" />
        <div className="w-[240px] rounded-xl border border-border/70 p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <Skeleton className="h-4 w-6 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-6 rounded" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // error — disabled trigger + error message (availability fetch failed)
  if (isError) {
    return (
      <div className="flex flex-col gap-3">
        <DatePicker placeholder="Select a date" disabled />
        <div className="w-[240px]">
          <DemoErrorState>Couldn&apos;t load availability</DemoErrorState>
        </div>
      </div>
    )
  }

  // default / success / empty — all fall through to the normal date picker
  // (a date picker has no meaningful "empty" or "success" affordance at the
  //  demo level; success = a date was chosen, which is just the default state)
  return <DatePicker placeholder="Select a date" />
}
