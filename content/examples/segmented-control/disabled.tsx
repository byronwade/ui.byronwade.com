"use client"

import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"

export default function Example() {
  const [active, setActive] = useState("table")

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Active (enabled) */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Enabled</span>
        <SegmentedControl
          options={[
            { label: "Table", value: "table" },
            { label: "Chart", value: "chart" },
            { label: "Raw", value: "raw" },
          ]}
          value={active}
          onValueChange={setActive}
        />
      </div>

      {/* Disabled via pointer-events + opacity wrapper */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Disabled</span>
        <div className="pointer-events-none select-none opacity-40">
          <SegmentedControl
            options={[
              { label: "Table", value: "table" },
              { label: "Chart", value: "chart" },
              { label: "Raw", value: "raw" },
            ]}
            value="chart"
            onValueChange={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
