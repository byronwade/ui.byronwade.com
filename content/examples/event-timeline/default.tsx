"use client"

import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

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
        <div className="rounded-lg border border-border/70 py-10 text-center text-sm text-muted-foreground">
          No deployment events yet.
        </div>
      ) : state === "error" ? (
        <div className="rounded-lg bg-destructive/5 py-10 text-center ring-1 ring-destructive/30">
          <span className="mb-2 inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            Error
          </span>
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load the event feed.
          </p>
        </div>
      ) : (
        <EventTimeline events={events} />
      )}
    </div>
  )
}
