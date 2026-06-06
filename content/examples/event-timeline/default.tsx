import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

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
  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">Deployment Events</h2>
      <EventTimeline events={events} />
    </div>
  )
}
