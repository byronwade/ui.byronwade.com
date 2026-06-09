"use client"

import { ActivityGrid } from "@/components/ui/activity-grid"
import { useDemoDensity } from "@/lib/demo-viewport"

const data = Array.from({ length: 18 * 7 }, (_, index) => {
  const day = index % 7
  if (day === 0 || day === 6) return index % 3 === 0 ? 1 : 0
  return (index * 7) % 11
})

export default function Example() {
  const density = useDemoDensity() ?? "default"

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Circle</p>
          <p className="text-xs text-muted-foreground">Contribution map</p>
        </div>
        <ActivityGrid data={data} columns={18} size={density} shape="circle" />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Rounded</p>
          <p className="text-xs text-muted-foreground">Operational heat</p>
        </div>
        <ActivityGrid data={data} columns={18} size={density} shape="rounded" />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Square</p>
          <p className="text-xs text-muted-foreground">Dense telemetry</p>
        </div>
        <ActivityGrid data={data} columns={18} size={density} shape="square" />
      </div>
    </div>
  )
}
