import { Badge } from "@/components/ui/badge";

const items = [
  { label: "Deployment #847", status: "success" as const, text: "Live" },
  { label: "Deployment #846", status: "warning" as const, text: "Building" },
  { label: "Deployment #845", status: "destructive" as const, text: "Failed" },
  { label: "Deployment #844", status: "secondary" as const, text: "Cancelled" },
  { label: "Deployment #843", status: "outline" as const, text: "Queued" },
];

export default function Example() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        Recent deployments
      </p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-sm">{item.label}</span>
          <Badge variant={item.status}>{item.text}</Badge>
        </div>
      ))}
    </div>
  );
}
