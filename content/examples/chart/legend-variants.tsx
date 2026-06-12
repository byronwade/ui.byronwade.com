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
import { Circle, TrendUp } from "@/lib/icons"

const data = [
  { q: "Q1", alpha: 42, beta: 31 },
  { q: "Q2", alpha: 58, beta: 44 },
  { q: "Q3", alpha: 51, beta: 37 },
  { q: "Q4", alpha: 69, beta: 52 },
]

const chartConfigWithIcons: ChartConfig = {
  alpha: {
    label: "Alpha",
    color: "var(--chart-1)",
    icon: TrendUp,
  },
  beta: {
    label: "Beta",
    color: "var(--chart-2)",
    icon: Circle,
  },
}

const chartConfigNoIcons: ChartConfig = {
  alpha: {
    label: "Alpha",
    color: "var(--chart-1)",
  },
  beta: {
    label: "Beta",
    color: "var(--chart-2)",
  },
}

export default function Example() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      {/* Legend at bottom (default) */}
      <div className="p-6 rounded-2xl edge bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Legend bottom (default)
        </h2>
        <ChartContainer config={chartConfigNoIcons} className="h-44 w-full">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="q"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="alpha"
              fill="var(--color-alpha)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="beta"
              fill="var(--color-beta)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Legend at top */}
      <div className="p-6 rounded-2xl edge bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Legend top
        </h2>
        <ChartContainer config={chartConfigNoIcons} className="h-44 w-full">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="q"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend
              verticalAlign="top"
              content={<ChartLegendContent verticalAlign="top" />}
            />
            <Bar
              dataKey="alpha"
              fill="var(--color-alpha)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="beta"
              fill="var(--color-beta)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Legend with custom icons */}
      <div className="p-6 rounded-2xl edge bg-card">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Legend with icons
        </h2>
        <ChartContainer config={chartConfigWithIcons} className="h-44 w-full">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="q"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="alpha"
              fill="var(--color-alpha)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="beta"
              fill="var(--color-beta)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
