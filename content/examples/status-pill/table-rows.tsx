import { StatusPill } from "@/components/status-pill"
import type { StatusTone } from "@/components/ui/status-dot"

const services: {
  name: string
  region: string
  tone: StatusTone
  label: string
  pulse?: boolean
  uptime: string
}[] = [
  {
    name: "API Gateway",
    region: "us-east-1",
    tone: "success",
    label: "Operational",
    uptime: "99.98%",
  },
  {
    name: "Auth Service",
    region: "us-east-1",
    tone: "success",
    label: "Operational",
    uptime: "100%",
  },
  {
    name: "Storage Bucket",
    region: "eu-west-2",
    tone: "warning",
    label: "Degraded",
    uptime: "97.41%",
  },
  {
    name: "Job Queue",
    region: "ap-southeast-1",
    tone: "info",
    label: "Syncing",
    pulse: true,
    uptime: "99.10%",
  },
  {
    name: "Email Worker",
    region: "us-west-2",
    tone: "danger",
    label: "Outage",
    uptime: "88.32%",
  },
  {
    name: "Cache Layer",
    region: "eu-central-1",
    tone: "neutral",
    label: "Unknown",
    uptime: "-",
  },
]

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-2xl edge p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Service
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Region
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Uptime
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc, i) => (
            <tr
              key={svc.name}
              className={
                i < services.length - 1 ? "border-b border-border" : ""
              }
            >
              <td className="px-4 py-3 font-medium">{svc.name}</td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                {svc.region}
              </td>
              <td className="px-4 py-3">
                <StatusPill tone={svc.tone} pulse={svc.pulse}>
                  {svc.label}
                </StatusPill>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                {svc.uptime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
