import { Clock, Globe, Hash } from "@/lib/icons"
import { StatCard } from "@/components/stat-card"

/** Cards that display a value and hint without any delta indicator, useful for absolute metrics. */
export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 max-w-2xl">
      <StatCard
        label="Uptime"
        value="99.98%"
        icon={Clock}
        hint="last 90 days"
      />
      <StatCard
        label="Regions"
        value="12"
        icon={Globe}
        hint="active datacenters"
      />
      <StatCard
        label="Build #"
        value="4,021"
        icon={Hash}
        hint="current pipeline"
      />
    </div>
  )
}
