import { StatusDot } from "@/components/ui/status-dot"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <StatusDot tone="success" size="lg" pulse />
        <span className="text-sm">Live — active connection</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="danger" size="lg" pulse />
        <span className="text-sm">Alert — requires attention</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="warning" size="lg" pulse />
        <span className="text-sm">Processing — in progress</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="info" size="lg" pulse />
        <span className="text-sm">Syncing — fetching data</span>
      </div>
    </div>
  )
}
