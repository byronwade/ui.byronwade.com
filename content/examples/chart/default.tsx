"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

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
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-4 text-foreground">
        Monthly Overview
      </h2>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.04}
              />
            </linearGradient>
            <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expenses)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expenses)"
                stopOpacity={0.04}
              />
            </linearGradient>
          </defs>
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
            cursor={{
              stroke: "var(--muted-foreground)",
              strokeOpacity: 0.25,
              strokeWidth: 1,
            }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            fill="url(#fillRevenue)"
            fillOpacity={1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            fill="url(#fillExpenses)"
            fillOpacity={1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
