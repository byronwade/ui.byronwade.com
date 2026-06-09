"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { useDemoState } from "@/lib/demo-viewport"

export default function Example() {
  const state = useDemoState() ?? "default"
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        value={state === "empty" ? 0 : 78}
        tone={state === "empty" ? "neutral" : undefined}
        label="Performance"
        state={state}
      />
    </div>
  )
}
