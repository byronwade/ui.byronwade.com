import { StatusDot } from "@/components/ui/status-dot";

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <StatusDot tone="success" size="lg" pulse />
      <StatusDot tone="danger" size="lg" pulse />
    </div>
  );
}
