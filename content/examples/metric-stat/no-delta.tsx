import { MetricStat } from "@/components/metric-stat"
import { Clock, Database, Globe } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-8">
      <MetricStat label="Storage Used" value="128 GB" />
      <MetricStat icon={Database} label="Records" value="2.4M" />
      <MetricStat icon={Clock} label="Avg Response" value="230 ms" />
      <MetricStat icon={Globe} label="Regions" value="12" />
    </div>
  )
}
