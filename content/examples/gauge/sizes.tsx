import { Gauge } from "@/components/ui/gauge";

export default function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <Gauge value={82} label="Score" size={80} thickness={6} />
        <span className="text-xs text-muted-foreground">80px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={82} label="Score" size={120} thickness={8} />
        <span className="text-xs text-muted-foreground">120px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={82} label="Score" size={160} />
        <span className="text-xs text-muted-foreground">160px (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={82} label="Score" size={200} thickness={12} />
        <span className="text-xs text-muted-foreground">200px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={82} label="Score" size={240} thickness={14} />
        <span className="text-xs text-muted-foreground">240px</span>
      </div>
    </div>
  );
}
