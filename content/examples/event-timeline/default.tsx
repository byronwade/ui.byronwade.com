"use client"

import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

const events: TimelineEvent[] = [
  {
    title: "Build succeeded",
    description: "All 42 tests passed with no warnings.",
    timestamp: "2026-05-31T09:15:00Z",
    tone: "success",
  },
  {
    title: "Deployment started",
    description: "Uploading assets to production environment.",
    timestamp: "2026-05-31T09:16:03Z",
    tone: "info",
  },
  {
    title: "Health check failed",
    description: "Service did not respond within 30 s, retrying.",
    timestamp: "2026-05-31T09:17:45Z",
    tone: "warning",
  },
  {
    title: "Rollback triggered",
    description: "Previous stable release restored automatically.",
    timestamp: "2026-05-31T09:18:02Z",
    tone: "danger",
  },
]

export default function Example() {
  const state = useDemoState() ?? "default"

  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">Deployment Events</h2>
      {state === "loading" ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-2.5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      ) : state === "empty" ? (
        <DemoEmptyState>No deployment events yet.</DemoEmptyState>
      ) : state === "error" ? (
        <DemoErrorState>Couldn&apos;t load the event feed.</DemoErrorState>
      ) : (
        <EventTimeline events={events} />
      )}
    </div>
  )
}
