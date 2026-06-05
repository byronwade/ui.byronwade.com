import { StatusDot, type StatusTone } from "@/components/ui/status-dot"

const tones: { tone: StatusTone; label: string; description: string }[] = [
  {
    tone: "success",
    label: "Success",
    description: "Healthy, active, passing",
  },
  {
    tone: "warning",
    label: "Warning",
    description: "Degraded, slow, near-limit",
  },
  { tone: "danger", label: "Danger", description: "Failed, offline, critical" },
  {
    tone: "info",
    label: "Info",
    description: "Pending, syncing, informational",
  },
  { tone: "neutral", label: "Neutral", description: "Unknown, idle, disabled" },
]

export default function Example() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {tones.map(({ tone, label, description }) => (
        <div key={tone} className="flex items-center gap-3">
          <StatusDot tone={tone} size="md" />
          <span className="w-16 text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      ))}
    </div>
  )
}
