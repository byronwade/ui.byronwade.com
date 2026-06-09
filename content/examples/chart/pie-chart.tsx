"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

const data = [
  { category: "organic", value: 42 },
  { category: "referral", value: 28 },
  { category: "direct", value: 18 },
  { category: "social", value: 12 },
]

const chartConfig: ChartConfig = {
  organic: {
    label: "Organic",
    color: "var(--chart-1)",
  },
  referral: {
    label: "Referral",
    color: "var(--chart-2)",
  },
  direct: {
    label: "Direct",
    color: "var(--chart-3)",
  },
  social: {
    label: "Social",
    color: "var(--chart-4)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl edge bg-card w-full max-w-sm">
      <h2 className="text-sm font-medium mb-1 text-foreground">
        Traffic Sources
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Breakdown by acquisition channel
      </p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="category" hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={`var(--color-${entry.category})`}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
