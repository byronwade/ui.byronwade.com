import { StatusPill } from "@/components/status-pill";
import type { StatusTone } from "@/components/ui/status-dot";

const tones: { tone: StatusTone; label: string; description: string }[] = [
  { tone: "success", label: "Healthy", description: "System is operating normally" },
  { tone: "warning", label: "Degraded", description: "Performance is below expected thresholds" },
  { tone: "danger", label: "Critical", description: "Service is unavailable or failing" },
  { tone: "info", label: "Pending", description: "Awaiting confirmation or processing" },
  { tone: "neutral", label: "Inactive", description: "No recent activity detected" },
];

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">All tones</p>
      {tones.map(({ tone, label, description }) => (
        <div key={tone} className="flex items-center gap-4">
          <StatusPill tone={tone}>{label}</StatusPill>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      ))}
    </div>
  );
}
