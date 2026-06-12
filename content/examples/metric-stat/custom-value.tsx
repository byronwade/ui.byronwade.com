import { MetricStat } from "@/components/metric-stat"
import { Pulse } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-8">
      {/* React node as value: colored span */}
      <MetricStat
        label="System Health"
        value={<span className="text-success">Healthy</span>}
      />

      {/* React node as value: badge-style pill */}
      <MetricStat
        label="Build Status"
        value={
          <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-lg font-semibold text-success">
            Passing
          </span>
        }
      />

      {/* React node as value: multi-unit display */}
      <MetricStat
        icon={Pulse}
        label="P95 Latency"
        value={
          <span>
            142
            <span className="ml-1 text-base font-normal text-muted-foreground">
              ms
            </span>
          </span>
        }
        delta={{ value: "-18ms", direction: "up" }}
      />
    </div>
  )
}
