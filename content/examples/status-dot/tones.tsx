import { StatusDot } from "@/components/ui/status-dot";

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <StatusDot tone="success" />
      <StatusDot tone="warning" />
      <StatusDot tone="danger" />
      <StatusDot tone="info" />
      <StatusDot tone="neutral" />
    </div>
  );
}
