import { StatusDot } from "@/components/ui/status-dot";

export default function Example() {
  return (
    <div className="flex items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <StatusDot tone="success" size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusDot tone="success" size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusDot tone="success" size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  );
}
