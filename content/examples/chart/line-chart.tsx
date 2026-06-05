"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts"

const data = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 71 },
  { week: "W4", score: 65 },
  { week: "W5", score: 74 },
  { week: "W6", score: 80 },
  { week: "W7", score: 78 },
  { week: "W8", score: 85 },
]

const chartConfig: ChartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-1 text-foreground">
        Performance Score
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        8-week rolling average with target line
      </p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <LineChart
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
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[50, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine
            y={75}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{
              value: "Target",
              fontSize: 10,
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <ChartTooltip
            cursor={{
              stroke: "var(--muted-foreground)",
              strokeOpacity: 0.25,
              strokeWidth: 1,
            }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-score)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-score)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
