"use client"

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomTooltipProps = { active?: boolean; payload?: any[]; label?: string }

const data = [
  { date: "Jan 1", visitors: 1200, pageviews: 3400 },
  { date: "Jan 8", visitors: 1850, pageviews: 5100 },
  { date: "Jan 15", visitors: 1400, pageviews: 4200 },
  { date: "Jan 22", visitors: 2300, pageviews: 6800 },
  { date: "Jan 29", visitors: 2100, pageviews: 6200 },
]

const chartConfig: ChartConfig = {
  visitors: {
    label: "Unique Visitors",
    color: "var(--chart-1)",
  },
  pageviews: {
    label: "Page Views",
    color: "var(--chart-2)",
  },
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-background shadow-xl px-3 py-2 text-xs min-w-36">
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {String(chartConfig[item.dataKey as string]?.label ?? item.dataKey ?? "")}
          </span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {(item.value as number).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  return (
    <div className="p-6 rounded-2xl border bg-card w-full max-w-xl">
      <h2 className="text-sm font-medium mb-1 text-foreground">Site Analytics</h2>
      <p className="text-xs text-muted-foreground mb-4">Custom tooltip renderer</p>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-pageviews)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-pageviews)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ChartTooltip content={(props: any) => <CustomTooltip {...props} />} />
          <Area
            type="monotone"
            dataKey="pageviews"
            stroke="var(--color-pageviews)"
            fill="url(#fillPageviews)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="var(--color-visitors)"
            fill="url(#fillVisitors)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
