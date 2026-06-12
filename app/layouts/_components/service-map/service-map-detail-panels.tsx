"use client"

import { useMemo } from "react"
import { ArrowRight, Cube, Graph, X } from "@/lib/icons"
import { Bar, BarChart, CartesianGrid, Line, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import { getServiceLegendColor } from "@/lib/service-map-colors"
import type {
  ServiceDbEdge,
  ServiceDbQuerySummary,
  ServiceEdge,
  ServiceOverview,
  ServicePlatform,
  ServiceWorkload,
} from "@/lib/service-map-types"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDbDescriptor } from "./service-map-db"
import {
  DB_NODE_PREFIX,
  getServiceMapNodeColor,
  type ServiceMapColorMode,
} from "./service-map-utils"

function formatRate(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  if (value >= 1) return value.toFixed(1)
  return value.toFixed(2)
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${ms.toFixed(1)}ms`
}

function formatPercent(value: number | null): string {
  if (value == null) return "—"
  return `${(value * 100).toFixed(0)}%`
}

function formatCompactCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toLocaleString()
}

function formatQueryLabel(value: string): string {
  const collapsed = value.replace(/\s+/g, " ").trim()
  if (collapsed.length <= 96) return collapsed || "unknown query"
  return `${collapsed.slice(0, 78)}…${collapsed.slice(-16)}`
}

function getHealthDotClass(errorRate: number): string {
  if (errorRate > 0.05) return "bg-destructive"
  if (errorRate > 0.01) return "bg-warning"
  return "bg-success"
}

const DB_QUERY_CHART_CONFIG = {
  queryCount: { label: "Queries", color: "var(--chart-2)" },
  p50DurationMs: { label: "P50", color: "var(--chart-3)" },
  p95DurationMs: { label: "P95", color: "var(--chart-4)" },
} satisfies ChartConfig

function DbQueryActivityChart({
  response,
}: {
  response: ServiceDbQuerySummary | null
}) {
  const data = useMemo(
    () =>
      (response?.timeseries ?? []).map((point) => ({
        ...point,
        queryCount: Math.round(point.estimatedQueryCount || point.queryCount),
      })),
    [response],
  )

  if (data.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground">
        No database query spans in this window
      </div>
    )
  }

  return (
    <ChartContainer config={DB_QUERY_CHART_CONFIG} className="h-44 w-full">
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="bucket"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          minTickGap={20}
          fontSize={10}
          tickFormatter={(value) =>
            new Date(String(value)).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />
        <YAxis
          yAxisId="count"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={34}
          fontSize={10}
          tickFormatter={(value) => formatCompactCount(Number(value))}
        />
        <YAxis
          yAxisId="latency"
          orientation="right"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={42}
          fontSize={10}
          tickFormatter={(value) => formatLatency(Number(value))}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.3 }}
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                const label = name === "queryCount" ? "Queries" : String(name)
                const formatted =
                  name === "queryCount"
                    ? formatCompactCount(Number(value))
                    : formatLatency(Number(value))
                return (
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono font-medium tabular-nums">
                      {formatted}
                    </span>
                  </span>
                )
              }}
            />
          }
        />
        <Bar
          yAxisId="count"
          dataKey="queryCount"
          fill="var(--color-queryCount)"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
        <Line
          yAxisId="latency"
          type="monotone"
          dataKey="p50DurationMs"
          stroke="var(--color-p50DurationMs)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          yAxisId="latency"
          type="monotone"
          dataKey="p95DurationMs"
          stroke="var(--color-p95DurationMs)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

function ServiceWorkloadRow({ workload }: { workload: ServiceWorkload }) {
  return (
    <div
      data-slot="service-map-workload-row"
      className="space-y-2.5 rounded-md edge bg-card p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] tracking-wide text-muted-foreground uppercase">
            <Cube size={11} />
            <span>{workload.workloadKind}</span>
          </div>
          <p className="mt-0.5 truncate text-xs font-medium text-foreground">
            {workload.workloadName}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {workload.namespace || "default"}
            {workload.clusterName ? ` · ${workload.clusterName}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-px">
          <span className="text-[9px] tracking-wide text-muted-foreground/60 uppercase">
            pods
          </span>
          <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
            {workload.podCount}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center justify-between rounded bg-muted/30 px-2 py-1">
          <span className="text-muted-foreground">CPU</span>
          <span className="font-mono text-foreground tabular-nums">
            {formatPercent(workload.avgCpuLimitUtilization)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded bg-muted/30 px-2 py-1">
          <span className="text-muted-foreground">Memory</span>
          <span className="font-mono text-foreground tabular-nums">
            {formatPercent(workload.avgMemoryLimitUtilization)}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[10px] text-brand transition-colors hover:text-brand/80"
      >
        View pods <ArrowRight size={10} />
      </button>
    </div>
  )
}

function ServiceInfraEmptyState() {
  return (
    <div className="space-y-3 rounded-md border border-dashed bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Cube size={14} className="text-muted-foreground/50" />
        <p className="text-xs font-medium text-foreground">
          No Kubernetes workloads found
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Install the maple-k8s-infra Helm chart and label your namespace to
        enable infrastructure context:
      </p>
      <pre className="overflow-x-auto rounded bg-muted px-2 py-1.5 font-mono text-[10px] text-foreground">
        kubectl label namespace &lt;ns&gt; maple.io/instrument=true
      </pre>
    </div>
  )
}

export function ServiceDetailPanel({
  serviceId,
  services,
  edges,
  overviews,
  workloads,
  durationSeconds,
  showInfraTab,
  platforms,
  colorMode,
  onClose,
  onNavigate,
}: {
  serviceId: string
  services: string[]
  edges: ServiceEdge[]
  overviews: ServiceOverview[]
  workloads: ServiceWorkload[]
  durationSeconds: number
  showInfraTab: boolean
  platforms: Map<string, ServicePlatform>
  colorMode: ServiceMapColorMode
  onClose: () => void
  onNavigate?: (serviceName: string) => void
}) {
  const overview = overviews.find((o) => o.serviceName === serviceId)
  const errorRate = overview?.errorRate ?? 0
  const accentColor = getServiceMapNodeColor(
    {
      label: serviceId,
      kind: "service",
      errorRate,
      platform: platforms.get(serviceId),
    },
    services,
    colorMode,
  )
  const throughput = overview?.throughput ?? 0
  const hasSampling = overview?.hasSampling ?? false
  const avgLatencyMs = overview?.p50LatencyMs ?? 0
  const p95LatencyMs = overview?.p95LatencyMs ?? 0
  const dependencies = edges.filter((e) => e.sourceService === serviceId)
  const calledBy = edges.filter((e) => e.targetService === serviceId)
  const serviceWorkloads = workloads.filter((w) => w.serviceName === serviceId)

  return (
    <div
      data-slot="service-map-service-detail"
      className="flex h-full flex-col overflow-hidden bg-background"
    >
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="h-[18px] w-[3px] shrink-0 rounded-sm"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              getHealthDotClass(errorRate),
            )}
          />
          <span className="truncate text-sm font-semibold text-foreground">
            {serviceId}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate(serviceId)}
              className="text-[10px] text-brand transition-colors hover:text-brand/80"
            >
              View service
            </button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="service" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="shrink-0 px-4 pt-2">
          <TabsTrigger value="service">
            <Graph size={12} />
            Service
          </TabsTrigger>
          {showInfraTab && (
            <TabsTrigger value="infrastructure">
              <Cube size={12} />
              Infrastructure
              {serviceWorkloads.length > 0 && (
                <span className="ml-1 font-mono text-[9px] text-muted-foreground/70 tabular-nums">
                  {serviceWorkloads.length}
                </span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="service" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-5 p-4">
              <div className="space-y-3">
                <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                  Metrics
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Throughput
                    </span>
                    <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                      {hasSampling ? "~" : ""}
                      {formatRate(throughput)}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      req/s
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Error Rate
                    </span>
                    <p
                      className={cn(
                        "font-mono text-xl font-semibold tabular-nums",
                        errorRate > 0.05
                          ? "text-destructive"
                          : errorRate > 0.01
                            ? "text-warning"
                            : "text-foreground",
                      )}
                    >
                      {(errorRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Avg Latency
                    </span>
                    <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                      {formatLatency(avgLatencyMs)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      P95 Latency
                    </span>
                    <p
                      className={cn(
                        "font-mono text-xl font-semibold tabular-nums",
                        p95LatencyMs > avgLatencyMs * 3
                          ? "text-warning"
                          : "text-foreground",
                      )}
                    >
                      {formatLatency(p95LatencyMs)}
                    </p>
                  </div>
                </div>
              </div>

              {dependencies.length > 0 && (
                <DependencyList
                  title="Dependencies"
                  items={dependencies.map((dep) => ({
                    id: dep.targetService,
                    rps:
                      (dep.hasSampling
                        ? dep.estimatedCallCount
                        : dep.callCount) / Math.max(durationSeconds, 1),
                    errorRate: dep.errorRate,
                    hasSampling: dep.hasSampling,
                  }))}
                  services={services}
                />
              )}

              {calledBy.length > 0 && (
                <DependencyList
                  title="Called By"
                  items={calledBy.map((caller) => ({
                    id: caller.sourceService,
                    rps:
                      (caller.hasSampling
                        ? caller.estimatedCallCount
                        : caller.callCount) / Math.max(durationSeconds, 1),
                    errorRate: caller.errorRate,
                    hasSampling: caller.hasSampling,
                  }))}
                  services={services}
                />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {showInfraTab && (
          <TabsContent value="infrastructure" className="mt-0 min-h-0 flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {serviceWorkloads.length === 0 ? (
                  <ServiceInfraEmptyState />
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                      Kubernetes workloads
                    </h4>
                    {serviceWorkloads.map((wl) => (
                      <ServiceWorkloadRow
                        key={`${wl.workloadKind}/${wl.workloadName}/${wl.namespace}`}
                        workload={wl}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function DependencyList({
  title,
  items,
  services,
}: {
  title: string
  items: Array<{
    id: string
    rps: number
    errorRate: number
    hasSampling: boolean
  }>
  services: string[]
}) {
  return (
    <div className="space-y-3">
      <div className="h-px bg-border" />
      <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
        {title}
      </h4>
      <div className="space-y-1.5">
        {items.map((item) => {
          const color = getServiceLegendColor(item.id, services)
          const isError = item.errorRate > 0.05
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-md edge px-2.5 py-2 text-xs",
                isError
                  ? "border-destructive/12 bg-destructive/5"
                  : "border-border bg-card",
              )}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <div
                  className="h-3.5 w-[3px] shrink-0 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate text-foreground">{item.id}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[10px]">
                <span className="font-mono text-muted-foreground tabular-nums">
                  {item.hasSampling ? "~" : ""}
                  {formatRate(item.rps)} req/s
                </span>
                <span
                  className={cn(
                    "font-mono tabular-nums",
                    item.errorRate > 0.05
                      ? "text-destructive"
                      : item.errorRate > 0.01
                        ? "text-warning"
                        : "text-success",
                  )}
                >
                  {(item.errorRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DatabaseDetailPanel({
  dbSystem,
  dbEdges,
  services,
  durationSeconds,
  summary,
  onClose,
}: {
  dbSystem: string
  dbEdges: ServiceDbEdge[]
  services: string[]
  durationSeconds: number
  summary: ServiceDbQuerySummary | null
  onClose: () => void
}) {
  const callers = dbEdges.filter((e) => e.dbSystem === dbSystem)
  const totalCalls = callers.reduce((sum, e) => sum + e.callCount, 0)
  const totalErrors = callers.reduce((sum, e) => sum + e.errorCount, 0)
  const errorRate = totalCalls > 0 ? totalErrors / totalCalls : 0
  const avgLatencyMs =
    totalCalls > 0
      ? callers.reduce((sum, e) => sum + e.avgDurationMs * e.callCount, 0) /
        totalCalls
      : 0
  const p95LatencyMs = callers.reduce(
    (max, e) => Math.max(max, e.p95DurationMs),
    0,
  )
  const metricQueryCount = summary?.summary.estimatedQueryCount ?? totalCalls
  const metricCallsPerSecond = metricQueryCount / Math.max(durationSeconds, 1)
  const metricErrorRate = summary?.summary.errorRate ?? errorRate
  const metricAvgLatencyMs = summary?.summary.avgDurationMs ?? avgLatencyMs
  const metricP50LatencyMs = summary?.summary.p50DurationMs ?? avgLatencyMs
  const metricP95LatencyMs = summary?.summary.p95DurationMs ?? p95LatencyMs
  const metricHasSampling = summary
    ? summary.summary.estimatedQueryCount > summary.summary.queryCount + 1
    : callers.some((caller) => caller.hasSampling)

  const { category, Icon: DbIcon, color: dbColor } = getDbDescriptor(dbSystem)

  return (
    <div
      data-slot="service-map-db-detail"
      className="flex h-full flex-col overflow-hidden bg-background"
    >
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="h-[18px] w-[3px] shrink-0 rounded-sm"
            style={{ backgroundColor: dbColor }}
          />
          <DbIcon size={14} className="shrink-0" style={{ color: dbColor }} />
          <span className="truncate text-sm font-semibold text-foreground">
            {dbSystem}
          </span>
          <span className="shrink-0 text-[9px] font-medium tracking-wide text-muted-foreground/60 uppercase">
            {category}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 p-4">
          <div className="space-y-3">
            <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
              Metrics
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Queries
                </span>
                <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                  {metricHasSampling ? "~" : ""}
                  {formatCompactCount(metricQueryCount)}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Throughput
                </span>
                <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                  {metricHasSampling ? "~" : ""}
                  {formatRate(metricCallsPerSecond)}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  calls/s
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Error Rate
                </span>
                <p
                  className={cn(
                    "font-mono text-xl font-semibold tabular-nums",
                    metricErrorRate > 0.05
                      ? "text-destructive"
                      : metricErrorRate > 0.01
                        ? "text-warning"
                        : "text-foreground",
                  )}
                >
                  {(metricErrorRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  P50 Latency
                </span>
                <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                  {formatLatency(metricP50LatencyMs)}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  P95 Latency
                </span>
                <p
                  className={cn(
                    "font-mono text-xl font-semibold tabular-nums",
                    metricP95LatencyMs > metricP50LatencyMs * 3
                      ? "text-warning"
                      : "text-foreground",
                  )}
                >
                  {formatLatency(metricP95LatencyMs)}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Avg Latency
                </span>
                <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                  {formatLatency(metricAvgLatencyMs)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-px bg-border" />
            <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
              Query Activity
            </h4>
            <DbQueryActivityChart response={summary} />
          </div>

          {summary?.topQueries.length ? (
            <div className="space-y-3">
              <div className="h-px bg-border" />
              <h4 className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                Top Query Shapes
              </h4>
              <div className="space-y-1.5">
                {summary.topQueries.map((query) => (
                  <div
                    key={query.queryKey}
                    className="rounded-md edge bg-card px-2.5 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-foreground">
                        {formatQueryLabel(query.queryLabel)}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-[10px] tabular-nums",
                          query.errorRate > 0.05
                            ? "text-destructive"
                            : query.errorRate > 0.01
                              ? "text-warning"
                              : "text-muted-foreground",
                        )}
                      >
                        {(query.errorRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {callers.length > 0 && (
            <DependencyList
              title="Called By"
              items={callers.map((caller) => ({
                id: caller.sourceService,
                rps: caller.callCount / Math.max(durationSeconds, 1),
                errorRate: caller.errorRate,
                hasSampling: caller.hasSampling,
              }))}
              services={services}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function decodeDbNodeId(nodeId: string): string {
  return decodeURIComponent(nodeId.slice(DB_NODE_PREFIX.length))
}
