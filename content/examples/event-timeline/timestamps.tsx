import { EventTimeline, type TimelineEvent } from "@/components/event-timeline";

const events: TimelineEvent[] = [
  {
    title: "Task queued",
    description: "Waiting for an available worker.",
    timestamp: "2026-05-31T08:00:00Z",
    tone: "neutral",
  },
  {
    title: "Task started",
    description: "Worker picked up the job.",
    timestamp: "2026-05-31T08:03:17Z",
    tone: "info",
  },
  {
    title: "Checkpoint saved",
    description: "Intermediate results written to storage.",
    timestamp: "2026-05-31T08:11:44Z",
    tone: "neutral",
  },
  {
    title: "Task completed",
    description: "Output is ready to download.",
    timestamp: "2026-05-31T08:19:02Z",
    tone: "success",
  },
];

export default function Example() {
  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">With Timestamps</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        ISO timestamps are rendered in a monospace style below each event.
      </p>
      <EventTimeline events={events} />
    </div>
  );
}
