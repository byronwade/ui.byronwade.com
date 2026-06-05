import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

const events: TimelineEvent[] = [
  { title: "Account created", tone: "success" },
  { title: "Email verified", tone: "success" },
  { title: "Profile completed", tone: "info" },
  { title: "Two-factor enabled", tone: "success" },
  { title: "First login", tone: "neutral" },
]

export default function Example() {
  return (
    <div className="max-w-sm p-6">
      <h2 className="mb-4 text-sm font-semibold">Title Only</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Events without description or timestamp — minimal footprint.
      </p>
      <EventTimeline events={events} />
    </div>
  )
}
