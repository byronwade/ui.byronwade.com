import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

const events: TimelineEvent[] = [
  {
    title: "Success tone",
    description: "Operation completed without errors.",
    tone: "success",
  },
  {
    title: "Info tone",
    description: "Background task is now running.",
    tone: "info",
  },
  {
    title: "Warning tone",
    description: "Approaching rate limit — 80 % used.",
    tone: "warning",
  },
  {
    title: "Danger tone",
    description: "Authentication failed after 3 attempts.",
    tone: "danger",
  },
  {
    title: "Neutral tone",
    description: "No tone specified — default appearance.",
  },
]

export default function Example() {
  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">All Tones</h2>
      <EventTimeline events={events} />
    </div>
  )
}
