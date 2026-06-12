// Gauge archetype, a health page built around one ring gauge.
// uses: Gauge, MetricStat, ActivityGrid, EventTimeline, StatusPill, StatusDot, Sparkline
//
// Design: a "control tower" status page. One oversized, glowing ring anchors the
// hero on a gridded, brand-lit backdrop; a multi-region strip and a tiled bento of
// KPI sparklines, activity, and a timeline carry the density below. Rounded/elevated
// surfaces are reserved for the floating hero card; data tiles sit on 1px seams.
import { Cpu, Lightning, Pulse, Timer } from "@/lib/icons"

import { ActivityRing } from "@/components/ui/activity-ring"
import { ActivityGrid } from "@/components/ui/activity-grid"
import { MetricStat } from "@/components/metric-stat"
import { EventTimeline } from "@/components/event-timeline"
import { StatusPill } from "@/components/status-pill"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { Sparkline } from "@/app/layouts/_components/spark"

// Deterministic series so SSR and client agree (no Math.random at render).
const series = {
  uptime: [99.91, 99.94, 99.9, 99.96, 99.95, 99.98, 99.97, 99.98],
  latency: [188, 172, 181, 160, 152, 149, 144, 142],
  errors: [0.09, 0.07, 0.08, 0.06, 0.05, 0.05, 0.04, 0.04],
  throughput: [2.4, 2.6, 2.5, 2.9, 3.0, 3.05, 3.1, 3.2],
}

const kpis = [
  {
    label: "Uptime",
    value: "99.98%",
    hint: "30-day",
    icon: Pulse,
    data: series.uptime,
    dir: "up" as const,
    delta: "0.02%",
    tone: "text-success",
  },
  {
    label: "p95 latency",
    value: "142ms",
    hint: "last hour",
    icon: Timer,
    data: series.latency,
    dir: "down" as const,
    delta: "8ms",
    tone: "text-brand",
  },
  {
    label: "Error rate",
    value: "0.04%",
    hint: "last hour",
    icon: Lightning,
    data: series.errors,
    dir: "down" as const,
    delta: "0.01%",
    tone: "text-success",
  },
  {
    label: "Throughput",
    value: "3.2k/s",
    hint: "requests",
    icon: Cpu,
    data: series.throughput,
    dir: "up" as const,
    delta: "320",
    tone: "text-brand",
  },
]

const regions: {
  code: string
  tone: StatusTone
  p95: string
  load: number[]
}[] = [
  {
    code: "us-east-1",
    tone: "success",
    p95: "142ms",
    load: [3, 4, 3, 5, 4, 6, 5, 6],
  },
  {
    code: "eu-west-1",
    tone: "success",
    p95: "119ms",
    load: [4, 3, 4, 4, 5, 4, 5, 5],
  },
  {
    code: "ap-south-1",
    tone: "warning",
    p95: "268ms",
    load: [5, 6, 7, 6, 8, 7, 9, 8],
  },
  {
    code: "us-west-2",
    tone: "success",
    p95: "98ms",
    load: [2, 3, 2, 3, 3, 4, 3, 4],
  },
  {
    code: "edge",
    tone: "success",
    p95: "41ms",
    load: [6, 6, 7, 6, 7, 7, 8, 7],
  },
]

// Incident-free days heat (deterministic).
const activity = Array.from({ length: 26 * 5 }, (_, i) =>
  i % 23 === 0 ? 0 : ((i * 3 + 1) % 4) + 1,
)

export function GaugeArchetype() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      {/* atmosphere */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_55%_at_50%_0%,#000,transparent)]"
      />
      <div
        aria-hidden
        className="glow-brand pointer-events-none absolute inset-x-0 top-0 h-[420px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full edge bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            System health
          </span>

          <div className="relative mt-8">
            <div
              aria-hidden
              className="glow-brand absolute -inset-12 -z-10 opacity-80"
            />
            <ActivityRing
              value={98}
              label="health score"
              size={236}
              thickness={14}
            />
          </div>

          <h1 className="text-gradient mt-8 text-3xl tracking-tight sm:text-4xl">
            All systems operational
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Live status across every region and service, refreshed continuously.
          </p>
          <div className="mt-4">
            <StatusPill tone="success" pulse>
              99.98% uptime · 0 active incidents
            </StatusPill>
          </div>
        </header>

        {/* ── Region strip (control tower) ─────────────────────────── */}
        <div className="edge mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-5">
          {regions.map((r) => (
            <div key={r.code} className="flex flex-col gap-2 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <StatusDot tone={r.tone} />
                  {r.code}
                </span>
                <span className="text-xs font-medium tabular-nums">
                  {r.p95}
                </span>
              </div>
              <Sparkline
                data={r.load}
                fill
                className={
                  r.tone === "warning" ? "h-6 text-warning" : "h-6 text-brand"
                }
              />
            </div>
          ))}
        </div>

        {/* ── KPI bento ────────────────────────────────────────────── */}
        <div className="edge mt-px grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="flex flex-col gap-3 bg-card p-5">
              <MetricStat
                label={k.label}
                value={k.value}
                icon={k.icon}
                delta={{ value: k.delta, direction: k.dir }}
              />
              <Sparkline data={k.data} fill className={`${k.tone} mt-auto`} />
              <span className="text-[11px] text-muted-foreground">
                {k.hint}
              </span>
            </div>
          ))}
        </div>

        {/* ── Activity + timeline ──────────────────────────────────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="edge overflow-hidden rounded-2xl bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium tracking-tight">
                Incident-free days
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                last 18 weeks
              </span>
            </div>
            <ActivityGrid data={activity} columns={26} className="mx-auto" />
            <div className="mt-5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <span>Less</span>
              <span className="size-2.5 rounded-full bg-muted" />
              <span className="size-2.5 rounded-full bg-brand/30" />
              <span className="size-2.5 rounded-full bg-brand/50" />
              <span className="size-2.5 rounded-full bg-brand/75" />
              <span className="size-2.5 rounded-full bg-brand" />
              <span>More</span>
            </div>
          </section>

          <section className="rounded-2xl bg-card p-5 edge">
            <h2 className="mb-5 text-sm font-semibold tracking-tight">
              Recent events
            </h2>
            <EventTimeline
              events={[
                {
                  title: "Latency returned to baseline",
                  tone: "success",
                  timestamp: "12:04 UTC",
                  description: "us-east-1 recovered after cache warm-up.",
                },
                {
                  title: "Elevated p95 in ap-south-1",
                  tone: "warning",
                  timestamp: "11:48 UTC",
                  description: "Auto-scaled from 8 to 12 nodes.",
                },
                {
                  title: "Deploy v2.14.0",
                  tone: "info",
                  timestamp: "09:30 UTC",
                  description: "Rolled out to all regions.",
                },
                {
                  title: "Nightly backup complete",
                  tone: "neutral",
                  timestamp: "04:00 UTC",
                },
              ]}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
