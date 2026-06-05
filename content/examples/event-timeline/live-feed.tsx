"use client"

import { useState, useEffect } from "react"
import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

const pool: TimelineEvent[] = [
  {
    title: "Request received",
    description: "POST /api/process — 1.2 KB payload",
    tone: "neutral",
  },
  {
    title: "Validation passed",
    description: "Schema and auth checks succeeded",
    tone: "success",
  },
  {
    title: "Job enqueued",
    description: "Position 4 in the default queue",
    tone: "info",
  },
  {
    title: "Worker assigned",
    description: "Worker-07 picked up the job",
    tone: "info",
  },
  {
    title: "Processing",
    description: "Step 1/3 — parsing input data",
    tone: "info",
  },
  {
    title: "Step 2 complete",
    description: "Transformation applied in 38 ms",
    tone: "success",
  },
  {
    title: "Step 3 complete",
    description: "Output written to storage",
    tone: "success",
  },
  {
    title: "Webhook dispatched",
    description: "Callback URL notified — 200 OK",
    tone: "success",
  },
]

export default function Example() {
  const [events, setEvents] = useState<TimelineEvent[]>([pool[0]])
  const [idx, setIdx] = useState(1)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    if (idx >= pool.length) {
      setRunning(false)
      return
    }
    const t = setTimeout(() => {
      setEvents((prev) => [pool[idx], ...prev])
      setIdx((i) => i + 1)
    }, 1200)
    return () => clearTimeout(t)
  }, [idx, running])

  function reset() {
    setEvents([pool[0]])
    setIdx(1)
    setRunning(true)
  }

  return (
    <div className="max-w-md p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Live Event Feed</h2>
        <button
          onClick={reset}
          className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Replay
        </button>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        New events prepend to the top — most recent first.
      </p>
      <EventTimeline events={events} />
    </div>
  )
}
