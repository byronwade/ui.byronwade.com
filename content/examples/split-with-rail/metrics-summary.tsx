import { SplitWithRail } from "@/components/split-with-rail"
import { MetricStat } from "@/components/metric-stat"
import { ActivityRing } from "@/components/ui/activity-ring"
import { TimelineRail } from "@/components/timeline-rail"
import { StatusDot } from "@/components/ui/status-dot"
import { Activity, Clock, Users, Zap } from "lucide-react"

export default function Example() {
  return (
    <div className="p-6">
      <SplitWithRail
        summary={
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Service health
              </p>
              <h2 className="mt-1 text-lg font-semibold">api.example.com</h2>
            </div>

            <div className="flex justify-center py-2">
              <ActivityRing value={94} label="Uptime" size={140} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <MetricStat
                label="Requests / min"
                value="4.2k"
                delta={{ value: "+12%", direction: "up" }}
                icon={Activity}
              />
              <MetricStat
                label="Avg latency"
                value="38ms"
                delta={{ value: "-4ms", direction: "up" }}
                icon={Clock}
              />
              <MetricStat
                label="Active users"
                value="291"
                delta={{ value: "+8", direction: "up" }}
                icon={Users}
              />
              <MetricStat
                label="Error rate"
                value="0.3%"
                delta={{ value: "+0.1%", direction: "down" }}
                icon={Zap}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
              <StatusDot tone="success" size="sm" pulse />
              <span className="text-sm text-muted-foreground">
                All systems operational
              </span>
            </div>
          </div>
        }
        rail={
          <TimelineRail
            terminalLabel="Monitoring started"
            groups={[
              {
                label: "Last hour",
                items: [
                  {
                    tone: "success",
                    title: "P99 latency within SLA",
                    meta: "3m ago",
                  },
                  {
                    tone: "info",
                    title: "Auto-scaled to 6 replicas",
                    meta: "18m ago",
                  },
                  {
                    tone: "warning",
                    title: "Memory usage above 80%",
                    meta: "34m ago",
                  },
                  {
                    tone: "success",
                    title: "Memory pressure resolved",
                    meta: "41m ago",
                  },
                ],
              },
              {
                label: "Earlier today",
                items: [
                  {
                    tone: "danger",
                    title: "Database connection spike",
                    meta: "2h ago",
                  },
                  {
                    tone: "success",
                    title: "Connection pool restored",
                    meta: "2h ago",
                  },
                  {
                    tone: "info",
                    title: "Scheduled cert renewal",
                    meta: "4h ago",
                  },
                  {
                    tone: "neutral",
                    title: "Config deploy (v2.13.9)",
                    meta: "6h ago",
                  },
                ],
              },
            ]}
          />
        }
      />
    </div>
  )
}
