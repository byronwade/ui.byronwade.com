"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { label: "Q1", revenue: 12400, cost: 8200 },
  { label: "Q2", revenue: 15800, cost: 9100 },
  { label: "Q3", revenue: 13200, cost: 7800 },
  { label: "Q4", revenue: 18600, cost: 10400 },
]

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  cost: {
    label: "Cost",
    color: "var(--chart-2)",
  },
}

export default function Example() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      {/* Dot indicator (default) */}
      <div className="p-6 rounded-2xl border bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Dot indicator</h2>
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Line indicator */}
      <div className="p-6 rounded-2xl border bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Line indicator</h2>
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Dashed indicator */}
      <div className="p-6 rounded-2xl border bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Dashed indicator</h2>
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
