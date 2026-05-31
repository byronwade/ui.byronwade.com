import { Gauge } from "@/components/ui/gauge";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <Gauge value={32} tone="danger" label="Danger" />
        <span className="text-xs text-muted-foreground">danger</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={67} tone="warning" label="Warning" />
        <span className="text-xs text-muted-foreground">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={91} tone="success" label="Success" />
        <span className="text-xs text-muted-foreground">success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={55} tone="info" label="Info" />
        <span className="text-xs text-muted-foreground">info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={50} tone="neutral" label="Neutral" />
        <span className="text-xs text-muted-foreground">neutral</span>
      </div>
    </div>
  );
}
