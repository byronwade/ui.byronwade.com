import { SplitWithRail } from "@/components/split-with-rail"
import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"
import { Badge } from "@/components/ui/badge"
import { StatusDot } from "@/components/ui/status-dot"

const events: TimelineEvent[] = [
  {
    title: "Deployment succeeded",
    description: "All 38 checks passed. Serving traffic.",
    timestamp: "2026-05-31T14:22:01Z",
    tone: "success",
  },
  {
    title: "Smoke tests running",
    description: "Verifying /healthz and critical endpoints.",
    timestamp: "2026-05-31T14:21:45Z",
    tone: "info",
  },
  {
    title: "Build completed",
    description: "Compiled 312 modules in 14.2 s.",
    timestamp: "2026-05-31T14:20:58Z",
    tone: "success",
  },
  {
    title: "Cache miss on node_modules",
    description: "Cold install took 42 s, consider pinning a lock file.",
    timestamp: "2026-05-31T14:20:12Z",
    tone: "warning",
  },
  {
    title: "Pipeline triggered",
    description: "Push to main by carol@example.com.",
    timestamp: "2026-05-31T14:19:55Z",
    tone: "neutral",
  },
]

export default function Example() {
  return (
    <div className="p-6">
      <SplitWithRail
        summary={
          <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Deployment
              </p>
              <h2 className="mt-1 text-lg font-semibold">v2.14.0</h2>
              <p className="text-sm text-muted-foreground">
                Triggered by push to main
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusDot tone="success" size="md" pulse />
              <span className="text-sm font-medium text-success">Live</span>
              <Badge variant="success" className="ml-auto">
                Healthy
              </Badge>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border">
              {[
                { label: "Triggered by", value: "carol@example.com" },
                { label: "Branch", value: "main" },
                { label: "Commit", value: "a3f9c12" },
                { label: "Duration", value: "2m 7s" },
                { label: "Environment", value: "Production" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        }
        rail={
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="mb-4 text-sm font-semibold">Pipeline events</p>
            <EventTimeline events={events} />
          </div>
        }
      />
    </div>
  )
}
