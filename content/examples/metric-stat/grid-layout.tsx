import { MetricStat } from "@/components/metric-stat";
import { BarChart2, Users, DollarSign, Percent, Package, RefreshCw } from "lucide-react";

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-3">
      <MetricStat
        icon={DollarSign}
        label="MRR"
        value="$21,450"
        delta={{ value: "+9.1%", direction: "up" }}
      />
      <MetricStat
        icon={Users}
        label="Paying Customers"
        value="312"
        delta={{ value: "+4.0%", direction: "up" }}
      />
      <MetricStat
        icon={Percent}
        label="Conversion Rate"
        value="3.8%"
        delta={{ value: "+0.5%", direction: "up" }}
      />
      <MetricStat
        icon={BarChart2}
        label="Page Views"
        value="104K"
        delta={{ value: "-2.3%", direction: "down" }}
      />
      <MetricStat
        icon={Package}
        label="Shipments"
        value="876"
        delta={{ value: "0.0%", direction: "flat" }}
      />
      <MetricStat
        icon={RefreshCw}
        label="Renewal Rate"
        value="91%"
        delta={{ value: "+1.2%", direction: "up" }}
      />
    </div>
  );
}
