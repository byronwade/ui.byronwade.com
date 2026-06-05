import { StatusDot } from "@/components/ui/status-dot"

const services = [
  { name: "API Gateway", tone: "success" as const, label: "Operational" },
  { name: "Database", tone: "success" as const, label: "Operational" },
  { name: "Storage", tone: "warning" as const, label: "Degraded" },
  { name: "Email Delivery", tone: "danger" as const, label: "Outage" },
  { name: "CDN", tone: "info" as const, label: "Updating" },
  { name: "Analytics", tone: "neutral" as const, label: "Unknown" },
]

export default function Example() {
  return (
    <div className="w-full max-w-sm rounded-2xl border p-4">
      <p className="mb-3 text-sm font-medium">Service Status</p>
      <ul className="flex flex-col gap-2">
        {services.map((s) => (
          <li key={s.name} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{s.name}</span>
            <span className="flex items-center gap-1.5">
              <StatusDot tone={s.tone} size="sm" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
