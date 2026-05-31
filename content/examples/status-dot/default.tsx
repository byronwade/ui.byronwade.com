import { StatusDot } from "@/components/ui/status-dot";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <StatusDot tone="success" size="md" />
        <span className="text-sm text-muted-foreground">Success</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="warning" size="md" />
        <span className="text-sm text-muted-foreground">Warning</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="danger" size="md" />
        <span className="text-sm text-muted-foreground">Danger</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="info" size="md" />
        <span className="text-sm text-muted-foreground">Info</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusDot tone="neutral" size="md" />
        <span className="text-sm text-muted-foreground">Neutral</span>
      </div>
    </div>
  );
}
