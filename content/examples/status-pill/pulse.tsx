import { StatusPill } from "@/components/status-pill"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Pulse, live / active states
        </p>
        <div className="flex flex-wrap gap-3">
          <StatusPill tone="success" pulse>
            Streaming
          </StatusPill>
          <StatusPill tone="danger" pulse>
            Incident active
          </StatusPill>
          <StatusPill tone="info" pulse>
            Syncing
          </StatusPill>
          <StatusPill tone="warning" pulse>
            Throttled
          </StatusPill>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          No pulse, static states
        </p>
        <div className="flex flex-wrap gap-3">
          <StatusPill tone="success">Completed</StatusPill>
          <StatusPill tone="danger">Failed</StatusPill>
          <StatusPill tone="info">Queued</StatusPill>
          <StatusPill tone="warning">Stale</StatusPill>
        </div>
      </div>
    </div>
  )
}
