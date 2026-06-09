"use client"

import { ActivityRing, scoreTone } from "@/components/ui/activity-ring"
import { useDemoState } from "@/lib/demo-viewport"

const scores = [32, 67, 91]

export default function Example() {
  const state = useDemoState() ?? "default"
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-8">
      {scores.map((v) => (
        <ActivityRing
          key={v}
          value={state === "empty" ? 0 : v}
          tone={state === "empty" ? "neutral" : scoreTone(v)}
          label={state === "empty" ? "—" : scoreTone(v)}
          size={110}
          thickness={8}
          state={state}
        />
      ))}
    </div>
  )
}
