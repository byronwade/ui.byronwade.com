"use client"

import { EconomicCalendar } from "@/components/economic-calendar"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { makeMarketEvents } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const events = makeMarketEvents(8, { seed: 13 })

// Skeleton rows mirror the 4-column event-row layout:
// [5rem time] [3rem country] [minmax title+meta] [badge]
function EventRowSkeleton() {
  return (
    <div className="grid grid-cols-[5rem_3rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-3.5 w-7" />
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  )
}

function DayGroupSkeleton({ rows }: { rows: number }) {
  return (
    <section className="border-b border-border last:border-b-0">
      <div className="border-b border-border bg-muted/30 px-4 py-2">
        <Skeleton className="h-4 w-36" />
      </div>
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i}>
            <EventRowSkeleton />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex justify-center p-8">
      {isLoading ? (
        <div className="w-full max-w-2xl rounded-xl edge bg-card">
          <DayGroupSkeleton rows={3} />
          <DayGroupSkeleton rows={2} />
        </div>
      ) : isEmpty ? (
        <div className="w-full max-w-2xl">
          <DemoEmptyState>No events scheduled</DemoEmptyState>
        </div>
      ) : isError ? (
        <div className="w-full max-w-2xl">
          <DemoErrorState>Couldn&apos;t load calendar</DemoErrorState>
        </div>
      ) : (
        // default + success: normal event list
        <EconomicCalendar events={events} />
      )}
    </div>
  )
}
