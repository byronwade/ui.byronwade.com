"use client"

import { ActivityGrid } from "@/components/ui/activity-grid"
import { useDemoDensity } from "@/lib/demo-viewport"

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const data = Array.from({ length: 26 * 7 }, (_, i) => {
  // Realistic contribution-style pattern with spikes
  const weekday = i % 7
  const weekend = weekday === 0 || weekday === 6
  const base = weekend ? seededValue(i, 1) * 2 : seededValue(i, 2) * 5
  const spike = seededValue(i, 3) > 0.85 ? seededValue(i, 4) * 8 : 0
  return Math.round(base + spike)
})

export default function Example() {
  const density = useDemoDensity() ?? "default"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium">Contribution cadence</p>
          <p className="text-xs text-muted-foreground">
            182 contributions in the last 6 months
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">26 x 7</span>
      </div>
      <ActivityGrid data={data} size={density} />
    </div>
  )
}
