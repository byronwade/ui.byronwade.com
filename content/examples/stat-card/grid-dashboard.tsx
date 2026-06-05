import { Activity, Database, Server, Users, Zap } from "lucide-react"
import { StatCard } from "@/components/stat-card"

/**
 * A realistic four-card dashboard grid showing how StatCards compose
 * together as a summary row — the most common real-world usage.
 */
export default function Example() {
  return (
    <div className="p-8 max-w-3xl space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Overview</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Active Users"
          value="8,340"
          delta={{ value: "+5.2%", direction: "up" }}
          icon={Users}
          hint="last 24 h"
        />
        <StatCard
          label="Requests / s"
          value="2,104"
          delta={{ value: "+1.8%", direction: "up" }}
          icon={Activity}
          hint="p95 latency 42 ms"
        />
        <StatCard
          label="Error Rate"
          value="0.04%"
          delta={{ value: "+0.01%", direction: "down" }}
          icon={Zap}
          hint="last 1 h window"
        />
        <StatCard
          label="DB Queries"
          value="182K"
          delta={{ value: "-3.4%", direction: "down" }}
          icon={Database}
          hint="cache hit 94%"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Servers Online"
          value="24 / 24"
          icon={Server}
          hint="all regions healthy"
        />
        <StatCard
          label="Uptime"
          value="99.99%"
          delta={{ value: "0.0%", direction: "flat" }}
          hint="rolling 30 days"
        />
      </div>
    </div>
  )
}
