"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { useDemoState } from "@/lib/demo-viewport"

const data = [
  { value: 820, label: "Delivered", tone: "success" as const },
  { value: 140, label: "Pending", tone: "warning" as const },
  { value: 60, label: "Failed", tone: "danger" as const },
]
const empty = data.map((s) => ({ ...s, value: 0 }))

export default function Example() {
  const state = useDemoState() ?? "default"
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        verdict
        segments={state === "empty" ? empty : data}
        centerLabel="messages"
        state={state}
      />
    </div>
  )
}
