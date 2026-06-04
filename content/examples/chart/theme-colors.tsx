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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", a: 40, b: 28, c: 15 },
  { month: "Feb", a: 52, b: 35, c: 22 },
  { month: "Mar", a: 47, b: 40, c: 18 },
  { month: "Apr", a: 63, b: 44, c: 30 },
  { month: "May", a: 58, b: 50, c: 27 },
  { month: "Jun", a: 72, b: 55, c: 38 },
]

// Using the `theme` key instead of a flat `color` for light/dark theme awareness
const chartConfig: ChartConfig = {
  a: {
    label: "Series A",
    theme: {
      light: "#16a34a",
      dark: "#4ade80",
    },
  },
  b: {
    label: "Series B",
    theme: {
      light: "#0284c7",
      dark: "#38bdf8",
    },
  },
  c: {
    label: "Series C",
    theme: {
      light: "#dc2626",
      dark: "#f87171",
    },
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-1 text-foreground">Theme-aware Colors</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Using the <code className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">theme</code> key
        for separate light/dark color values
      </p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="a" stroke="var(--color-a)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="b" stroke="var(--color-b)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="c" stroke="var(--color-c)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
