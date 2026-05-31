import { MetricStat } from "@/components/metric-stat";

export default function Example() {
  return (
    <div className="flex gap-8">
      <MetricStat
        label="Total Revenue"
        value="$48,295"
        delta={{ value: "+12.4%", direction: "up" }}
      />
      <MetricStat
        label="Active Users"
        value="8,340"
        delta={{ value: "+5.7%", direction: "up" }}
      />
      <MetricStat
        label="Churn Rate"
        value="2.1%"
        delta={{ value: "+0.3%", direction: "down" }}
      />
    </div>
  );
}
