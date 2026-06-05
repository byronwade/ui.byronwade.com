import { StatusPill } from "@/components/status-pill"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <StatusPill tone="success">Operational</StatusPill>
      <StatusPill tone="warning">Degraded</StatusPill>
      <StatusPill tone="danger">Outage</StatusPill>
      <StatusPill tone="info">Scheduled</StatusPill>
      <StatusPill tone="neutral">Unknown</StatusPill>
      <StatusPill tone="success" pulse>
        Live
      </StatusPill>
    </div>
  )
}
