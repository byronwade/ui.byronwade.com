"use client"

import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, Label } from "recharts"

const data = [
  { status: "active", count: 340 },
  { status: "idle", count: 120 },
  { status: "offline", count: 45 },
]

const chartConfig: ChartConfig = {
  active: {
    label: "Active",
    color: "hsl(var(--chart-1))",
  },
  idle: {
    label: "Idle",
    color: "hsl(var(--chart-2))",
  },
  offline: {
    label: "Offline",
    color: "hsl(var(--chart-3))",
  },
}

export default function Example() {
  const total = React.useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [])

  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-sm">
      <h2 className="text-sm font-semibold mb-1 text-foreground">Device Status</h2>
      <p className="text-xs text-muted-foreground mb-2">Current session overview</p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={80}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={`var(--color-${entry.status})`} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                      {total}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-muted-foreground text-xs">
                      devices
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex justify-center gap-4 pt-2">
        {data.map((entry) => (
          <div key={entry.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: `var(--color-${entry.status})` }}
            />
            {chartConfig[entry.status]?.label}
            <span className="font-medium text-foreground">{entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
