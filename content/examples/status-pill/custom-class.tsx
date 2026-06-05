import { StatusPill } from "@/components/status-pill"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Larger text via className
        </p>
        <div className="flex flex-wrap gap-3">
          <StatusPill tone="success" className="text-sm px-3 py-1">
            Active
          </StatusPill>
          <StatusPill tone="danger" className="text-sm px-3 py-1">
            Inactive
          </StatusPill>
          <StatusPill tone="info" className="text-sm px-3 py-1">
            Processing
          </StatusPill>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Full-width pill (block stretch)
        </p>
        <div className="flex flex-col gap-2 max-w-xs">
          <StatusPill tone="success" className="w-full justify-center">
            All systems operational
          </StatusPill>
          <StatusPill tone="warning" className="w-full justify-center">
            Partial outage detected
          </StatusPill>
          <StatusPill tone="danger" className="w-full justify-center" pulse>
            Major incident ongoing
          </StatusPill>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Inside a card header
        </p>
        <div className="rounded-2xl border border-border p-4 max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Background Worker</span>
            <StatusPill tone="success" pulse>
              Running
            </StatusPill>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Last heartbeat 2 seconds ago — processing batch 47 of 120.
          </p>
        </div>
      </div>
    </div>
  )
}
