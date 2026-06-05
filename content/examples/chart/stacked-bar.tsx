"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", bugs: 12, features: 8, improvements: 5 },
  { month: "Feb", bugs: 9, features: 14, improvements: 7 },
  { month: "Mar", bugs: 15, features: 11, improvements: 9 },
  { month: "Apr", bugs: 7, features: 18, improvements: 12 },
  { month: "May", bugs: 11, features: 16, improvements: 8 },
  { month: "Jun", bugs: 6, features: 20, improvements: 14 },
]

const chartConfig: ChartConfig = {
  bugs: {
    label: "Bugs",
    color: "var(--chart-3)",
  },
  features: {
    label: "Features",
    color: "var(--chart-1)",
  },
  improvements: {
    label: "Improvements",
    color: "var(--chart-2)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-1 text-foreground">
        Issue Breakdown
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Stacked by category per month
      </p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
            strokeOpacity={0.6}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="bugs" stackId="a" fill="var(--color-bugs)" />
          <Bar
            dataKey="improvements"
            stackId="a"
            fill="var(--color-improvements)"
          />
          <Bar
            dataKey="features"
            stackId="a"
            fill="var(--color-features)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
