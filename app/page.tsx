import { Gauge } from "@/components/ui/gauge";
import { StatusDot } from "@/components/ui/status-dot";
import { ThemeToggle } from "@/app/_components/theme-toggle";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center gap-6 bg-background text-foreground">
      <ThemeToggle />
      <div className="flex items-center gap-8">
        <Gauge value={42} label="Low" />
        <Gauge value={72} label="Score" />
        <Gauge value={95} label="Great" />
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="success" pulse /> <StatusDot tone="warning" /> <StatusDot tone="danger" />
      </div>
    </main>
  );
}
