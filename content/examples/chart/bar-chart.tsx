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
  { day: "Mon", downloads: 420, uploads: 180 },
  { day: "Tue", downloads: 580, uploads: 240 },
  { day: "Wed", downloads: 390, uploads: 160 },
  { day: "Thu", downloads: 710, uploads: 310 },
  { day: "Fri", downloads: 650, uploads: 280 },
  { day: "Sat", downloads: 290, uploads: 120 },
  { day: "Sun", downloads: 210, uploads: 90 },
]

const chartConfig: ChartConfig = {
  downloads: {
    label: "Downloads",
    color: "var(--chart-1)",
  },
  uploads: {
    label: "Uploads",
    color: "var(--chart-2)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl edge bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-1 text-foreground">
        Weekly Transfer Activity
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Downloads vs uploads per day
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
            dataKey="day"
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
          <Bar
            dataKey="downloads"
            fill="var(--color-downloads)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="uploads"
            fill="var(--color-uploads)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
