import { LiveBadge } from "@/components/ui/live-badge"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-8">
      <LiveBadge />
      <LiveBadge count={1234} />
      <LiveBadge pulse={false}>Replay</LiveBadge>
    </div>
  )
}
