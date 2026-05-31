import { Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8 max-w-xl">
      <StatCard
        label="Total Users"
        value="12,480"
        delta={{ value: "+8.3%", direction: "up" }}
        icon={Users}
        hint="vs. last 30 days"
      />
      <StatCard
        label="Churn Rate"
        value="2.1%"
        delta={{ value: "-0.4%", direction: "down" }}
        hint="monthly average"
      />
    </div>
  );
}
