"use client"

import { ActivityRing } from "@/components/ui/activity-ring"
import { useDemoState } from "@/lib/demo-viewport"

const data = [
  { value: 1280, label: "Inbound" },
  { value: 740, label: "Outbound" },
]
const empty = data.map((s) => ({ ...s, value: 0 }))

export default function Example() {
  const state = useDemoState() ?? "default"
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        segments={state === "empty" ? empty : data}
        centerLabel="interactions"
        state={state}
      />
    </div>
  )
}
