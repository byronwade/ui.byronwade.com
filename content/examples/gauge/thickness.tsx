import { Gauge } from "@/components/ui/gauge";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <Gauge value={74} label="Thin" size={160} thickness={4} />
        <span className="text-xs text-muted-foreground">thickness 4</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={74} label="Default" size={160} thickness={10} />
        <span className="text-xs text-muted-foreground">thickness 10 (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={74} label="Thick" size={160} thickness={18} />
        <span className="text-xs text-muted-foreground">thickness 18</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={74} label="Bold" size={160} thickness={26} />
        <span className="text-xs text-muted-foreground">thickness 26</span>
      </div>
    </div>
  );
}
