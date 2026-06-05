"use client"

// Dashboard template — a complete analytics app shell.
// uses: Chart, MetricStat, Card, Table, Badge, StatusDot, GradientAvatar, Button
//
// Design: unlike the centered hero-chart report, this is a real product *shell* —
// a persistent sidebar and top bar frame a scrolling workspace: a KPI strip, one
// brand-lit hero chart, and a recent-orders table beside a live activity feed. All
// surfaces are tokens, so overriding --brand re-skins the entire console.
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Bell,
  CreditCard,
  Home,
  LineChart,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { MetricStat } from "@/components/metric-stat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/ui/status-dot"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const nav = [
  { label: "Overview", icon: Home, active: true },
  { label: "Customers", icon: Users, active: false },
  { label: "Revenue", icon: CreditCard, active: false },
  { label: "Reports", icon: LineChart, active: false },
  { label: "Settings", icon: Settings, active: false },
]

const kpis = [
  {
    label: "Revenue",
    value: "$48,260",
    delta: { value: "12.4%", direction: "up" as const },
    icon: CreditCard,
  },
  {
    label: "Orders",
    value: "1,284",
    delta: { value: "8.1%", direction: "up" as const },
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    value: "9,412",
    delta: { value: "3.2%", direction: "up" as const },
    icon: Users,
  },
  {
    label: "Refund rate",
    value: "1.4%",
    delta: { value: "0.3%", direction: "down" as const },
    icon: LineChart,
  },
]

const data = [
  { d: "Mon", revenue: 4200, orders: 180 },
  { d: "Tue", revenue: 5100, orders: 210 },
  { d: "Wed", revenue: 4700, orders: 198 },
  { d: "Thu", revenue: 6300, orders: 262 },
  { d: "Fri", revenue: 7200, orders: 301 },
  { d: "Sat", revenue: 6800, orders: 288 },
  { d: "Sun", revenue: 8100, orders: 334 },
]

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--brand)" },
  orders: { label: "Orders", color: "var(--chart-3)" },
}

const orders = [
  {
    id: "#4821",
    customer: "Ana Reyes",
    total: "$248.00",
    status: "Paid",
    tone: "success" as const,
  },
  {
    id: "#4820",
    customer: "Liam Cho",
    total: "$92.50",
    status: "Paid",
    tone: "success" as const,
  },
  {
    id: "#4819",
    customer: "Priya Nair",
    total: "$1,420.00",
    status: "Pending",
    tone: "warning" as const,
  },
  {
    id: "#4818",
    customer: "Marco Diaz",
    total: "$64.00",
    status: "Refunded",
    tone: "danger" as const,
  },
  {
    id: "#4817",
    customer: "Sora Tanaka",
    total: "$310.00",
    status: "Paid",
    tone: "success" as const,
  },
]

const activity = [
  { who: "Ana Reyes", what: "placed order #4821", when: "2m ago" },
  { who: "System", what: "payout of $4,200 settled", when: "1h ago" },
  { who: "Liam Cho", what: "upgraded to Pro", when: "3h ago" },
  { who: "Priya Nair", what: "requested a refund", when: "5h ago" },
]

export function DashboardTemplate() {
  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-5 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground">
            <ShoppingCart className="size-4" />
          </span>
          Helio
        </div>
        <nav aria-label="Primary" className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map((n) => (
            <button
              key={n.label}
              type="button"
              aria-current={n.active ? "page" : undefined}
              className={cn(
                "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                n.active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {n.active && (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand" />
              )}
              <n.icon className="size-4" />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <GradientAvatar seed="ana reyes" size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Ana Reyes</p>
              <p className="truncate text-xs text-muted-foreground">
                ana@helio.app
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-base font-semibold tracking-tight">
              Overview
            </h1>
            <Badge variant="success">
              <StatusDot tone="success" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="edge hidden items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-sm text-muted-foreground sm:flex">
              <Search className="size-4" />
              <span>Search…</span>
            </div>
            <Button variant="outline" size="icon-sm" aria-label="Notifications">
              <Bell />
            </Button>
            <Button size="sm">
              <Plus data-icon="inline-start" />
              New
            </Button>
          </div>
        </header>

        {/* Scrolling content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {/* KPI strip */}
          <div className="grid gap-px overflow-hidden rounded-2xl bg-border shadow-card sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="bg-card p-5">
                <MetricStat
                  label={k.label}
                  value={k.value}
                  icon={k.icon}
                  delta={k.delta}
                />
              </div>
            ))}
          </div>

          {/* Hero chart */}
          <section className="relative mt-6 overflow-hidden rounded-2xl bg-card p-6 shadow-card">
            <div
              aria-hidden
              className="glow-brand pointer-events-none absolute inset-x-0 -top-10 h-40 opacity-60"
            />
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Revenue this week
                </p>
                <p className="text-gradient-brand mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                  $48,260
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-brand" /> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[var(--chart-3)]" />{" "}
                  Orders
                </span>
              </div>
            </div>
            <ChartContainer
              config={chartConfig}
              className="relative mt-6 h-64 w-full"
            >
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="dashOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="d"
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
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  fill="url(#dashOrders)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="url(#dashRevenue)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </section>

          {/* Orders + activity */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h2 className="text-sm font-semibold tracking-tight">
                  Recent orders
                </h2>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="pr-5 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="pl-5 font-mono text-muted-foreground">
                        {o.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {o.customer}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {o.total}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <StatusDot tone={o.tone} />
                          <span className="text-muted-foreground">
                            {o.status}
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            <section className="rounded-2xl bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold tracking-tight">Activity</h2>
              <ol className="mt-4 space-y-4">
                {activity.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <GradientAvatar seed={a.who} size="sm" className="mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-pretty">
                        <span className="font-medium">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.what}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{a.when}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
