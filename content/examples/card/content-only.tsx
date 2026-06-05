import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const tasks = [
  { icon: CheckCircle2, color: "text-success", label: "Database migration", meta: "Completed 9:14 AM" },
  { icon: Clock, color: "text-warning", label: "Deploy to staging", meta: "In progress · ~4 min left" },
  { icon: AlertCircle, color: "text-destructive", label: "Run integration tests", meta: "Blocked — waiting on staging" },
];

export default function Example() {
  return (
    <div className="flex flex-wrap gap-6 p-8 bg-background items-start justify-center">
      {/* Content-only: no header, no footer — just a clean container */}
      <Card className="w-72">
        <CardContent>
          <p className="text-sm font-medium text-foreground mb-3">Deployment checklist</p>
          <ul className="space-y-3">
            {tasks.map(({ icon: Icon, color, label, meta }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                <div>
                  <p className="text-sm leading-snug">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Content-only: small size, single value spotlight */}
      <Card size="sm" className="w-48">
        <CardContent>
          <p className="text-xs text-muted-foreground">Uptime</p>
          <p className="text-4xl font-semibold mt-1 leading-none">99.9%</p>
          <p className="text-xs text-muted-foreground mt-2">Last 90 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
