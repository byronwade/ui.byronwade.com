"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 5100, expenses: 3100 },
  { month: "Mar", revenue: 4700, expenses: 2600 },
  { month: "Apr", revenue: 6300, expenses: 3400 },
  { month: "May", revenue: 5800, expenses: 3000 },
  { month: "Jun", revenue: 7200, expenses: 3700 },
]

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-semibold mb-4 text-foreground">Monthly Overview</h2>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            fill="var(--color-revenue)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            fill="var(--color-expenses)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
