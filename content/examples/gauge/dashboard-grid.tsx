import { Gauge, scoreTone } from "@/components/ui/gauge";

const metrics = [
  { label: "Uptime", value: 99, sublabel: "Great" },
  { label: "Latency", value: 61, sublabel: "Needs work" },
  { label: "Error rate", value: 8, sublabel: "Poor" },
  { label: "Throughput", value: 88, sublabel: "Good" },
];

export default function Example() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold">System health</h3>
        <p className="text-xs text-muted-foreground">Last updated just now</p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-2">
            <Gauge value={m.value} tone={scoreTone(m.value)} size={110} thickness={8} />
            <div className="text-center">
              <p className="text-xs font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
