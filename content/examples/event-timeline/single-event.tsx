import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

const events: TimelineEvent[] = [
  {
    title: "Waiting for first event",
    description:
      "No activity recorded yet. Events will appear here as they occur.",
    tone: "neutral",
  },
]

export default function Example() {
  return (
    <div className="max-w-sm p-6">
      <h2 className="mb-4 text-sm font-semibold">Single Event</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        A list with one item, no connector line is rendered below the last dot.
      </p>
      <EventTimeline events={events} />
    </div>
  )
}
