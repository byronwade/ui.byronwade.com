import { Activity, Clock, Users } from "lucide-react"

import { Metric } from "@/components/ui/metric"

export default function Example() {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-3">
      <Metric
        icon={Users}
        label="Active users"
        value="8,340"
        delta={{ value: "+5.7%", direction: "up" }}
      />
      <Metric
        variant="card"
        icon={Activity}
        label="Requests"
        value="2.4M"
        hint="rolling 30 days"
        delta={{ value: "-1.2%", direction: "down" }}
      />
      <Metric
        variant="compact"
        icon={Clock}
        label="Uptime"
        value="99.99%"
        delta={{ value: "0.0%", direction: "flat" }}
      />
    </div>
  )
}
