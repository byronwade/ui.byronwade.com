"use client"

// Hero-chart archetype, a telemetry dashboard fronted by one big chart.
// uses: Chart, MetricStat, SegmentedControl, Badge, Table, Sparkline
//
// Design: the chart is the unmistakable hero, a brand-lit, gradient-filled area with
// a range switcher and an oversized headline figure. A tiled KPI strip (each with its
// own sparkline) and a breakdown/products bento carry the supporting detail.
import * as React from "react"
import { Activity, CreditCard, Users, Zap } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { MetricStat } from "@/components/metric-stat"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sparkline } from "@/app/layouts/_components/spark"

const data = [
  { month: "Jul", revenue: 42, active: 28 },
  { month: "Aug", revenue: 51, active: 31 },
  { month: "Sep", revenue: 47, active: 30 },
  { month: "Oct", revenue: 63, active: 38 },
  { month: "Nov", revenue: 58, active: 41 },
  { month: "Dec", revenue: 72, active: 44 },
  { month: "Jan", revenue: 69, active: 47 },
  { month: "Feb", revenue: 78, active: 52 },
  { month: "Mar", revenue: 85, active: 55 },
  { month: "Apr", revenue: 92, active: 61 },
  { month: "May", revenue: 88, active: 64 },
  { month: "Jun", revenue: 101, active: 72 },
]

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue ($k)", color: "var(--brand)" },
  active: { label: "Active users (k)", color: "var(--chart-3)" },
}

const kpis = [
  {
    label: "MRR",
    value: "$101k",
    icon: CreditCard,
    dir: "up" as const,
    delta: "14.7%",
    data: [42, 51, 47, 63, 58, 72, 69, 78, 85, 92, 88, 101],
    tone: "text-brand",
  },
  {
    label: "Active users",
    value: "72.4k",
    icon: Users,
    dir: "up" as const,
    delta: "12.5%",
    data: [28, 31, 30, 38, 41, 44, 47, 52, 55, 61, 64, 72],
    tone: "text-brand",
  },
  {
    label: "Conversion",
    value: "4.8%",
    icon: Activity,
    dir: "up" as const,
    delta: "0.3%",
    data: [3.9, 4.0, 4.1, 4.0, 4.3, 4.4, 4.5, 4.4, 4.6, 4.7, 4.7, 4.8],
    tone: "text-success",
  },
  {
    label: "Churn",
    value: "1.9%",
    icon: Zap,
    dir: "down" as const,
    delta: "0.2%",
    data: [2.6, 2.5, 2.5, 2.3, 2.4, 2.2, 2.2, 2.1, 2.1, 2.0, 2.0, 1.9],
    tone: "text-success",
  },
]

const sources = [
  { name: "Pro subscription", revenue: "$48.2k", share: 47 },
  { name: "Team seats", revenue: "$31.9k", share: 31 },
  { name: "Usage overage", revenue: "$14.1k", share: 14 },
  { name: "Add-ons", revenue: "$8.3k", share: 8 },
]

const products = [
  {
    name: "Pro subscription",
    sku: "SUB-PRO",
    revenue: "$48,200",
    trend: "up" as const,
    share: "47%",
  },
  {
    name: "Team seats",
    sku: "SUB-TEAM",
    revenue: "$31,940",
    trend: "up" as const,
    share: "31%",
  },
  {
    name: "Usage overage",
    sku: "USG-OVR",
    revenue: "$14,110",
    trend: "down" as const,
    share: "14%",
  },
  {
    name: "Add-ons",
    sku: "ADD-ONS",
    revenue: "$8,300",
    trend: "up" as const,
    share: "8%",
  },
]

type Range = "6m" | "12m"

export function HeroChartArchetype() {
  const [range, setRange] = React.useState<Range>("12m")
  const shown = range === "6m" ? data.slice(-6) : data

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_50%_at_50%_0%,#000,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Overview
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-medium tracking-tight">
              Revenue &amp; engagement
              <Badge variant="success">Live</Badge>
            </h1>
          </div>
          <SegmentedControl
            value={range}
            onValueChange={(v) => setRange(v as Range)}
            options={[
              { label: "6M", value: "6m" },
              { label: "12M", value: "12m" },
            ]}
          />
        </header>

        {/* ── Hero chart ───────────────────────────────────────────── */}
        <section className="edge relative mt-6 overflow-hidden rounded-2xl bg-card p-6">
          <div
            aria-hidden
            className="glow-brand pointer-events-none absolute inset-x-0 -top-10 h-48 opacity-70"
          />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly recurring revenue
              </p>
              <div className="mt-1 flex items-end gap-3">
                <span className="text-gradient-brand text-5xl tracking-tight tabular-nums">
                  $101k
                </span>
                <span className="mb-1.5 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-sm font-medium text-success tabular-nums">
                  ↑ 14.7%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                vs. $88k last month · trailing {range === "6m" ? "6" : "12"}{" "}
                months
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-brand" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-3" /> Active users
              </span>
            </div>
          </div>

          <ChartContainer
            config={chartConfig}
            className="relative mt-6 h-72 w-full"
          >
            <AreaChart
              data={shown}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-active)"
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-active)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="var(--color-active)"
                fill="url(#fillActive)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="url(#fillRevenue)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ChartContainer>
        </section>

        {/* ── KPI strip ────────────────────────────────────────────── */}
        <div className="edge mt-6 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="flex flex-col gap-3 bg-card p-5">
              <MetricStat
                label={k.label}
                value={k.value}
                icon={k.icon}
                delta={{ value: k.delta, direction: k.dir }}
              />
              <Sparkline data={k.data} fill className={cn("mt-auto", k.tone)} />
            </div>
          ))}
        </div>

        {/* ── Breakdown + products bento ───────────────────────────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="edge overflow-hidden rounded-2xl bg-card p-5">
            <h2 className="text-sm font-medium tracking-tight">
              Revenue by source
            </h2>
            <div className="mt-5 space-y-4">
              {sources.map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {s.revenue}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${s.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="edge overflow-hidden rounded-2xl bg-card">
            <div className="border-b border-border px-5 py-3 text-sm font-medium tracking-tight">
              Top products
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="pr-5 text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell className="pl-5 font-medium">{p.name}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {p.sku}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {p.revenue}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Badge
                        variant={p.trend === "up" ? "success" : "destructive"}
                      >
                        {p.share}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </div>
    </div>
  )
}
