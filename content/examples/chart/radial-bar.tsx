"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarGrid } from "recharts"

const data = [
  { name: "storage", value: 72, fill: "var(--color-storage)" },
  { name: "memory", value: 55, fill: "var(--color-memory)" },
  { name: "cpu", value: 38, fill: "var(--color-cpu)" },
]

const chartConfig: ChartConfig = {
  storage: {
    label: "Storage",
    color: "var(--chart-1)",
  },
  memory: {
    label: "Memory",
    color: "var(--chart-2)",
  },
  cpu: {
    label: "CPU",
    color: "var(--chart-3)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-sm">
      <h2 className="text-sm font-medium mb-1 text-foreground">
        Resource Utilization
      </h2>
      <p className="text-xs text-muted-foreground mb-2">
        Current usage percentages
      </p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <RadialBarChart
          data={data}
          innerRadius={30}
          outerRadius={90}
          startAngle={90}
          endAngle={-270}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <RadialBar dataKey="value" background cornerRadius={4} />
        </RadialBarChart>
      </ChartContainer>
      <div className="flex justify-center gap-4 pt-1">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.fill }}
            />
            {chartConfig[entry.name]?.label}
            <span className="font-medium text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
