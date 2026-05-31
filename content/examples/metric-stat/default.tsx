import { MetricStat } from "@/components/metric-stat";

export default function Example() {
  return (
    <div className="flex gap-8">
      <MetricStat
        label="Visitors"
        value="12,430"
        delta={{ value: "+8.2%", direction: "up" }}
      />
      <MetricStat
        label="Bounce rate"
        value="42%"
        delta={{ value: "-3.1%", direction: "down" }}
      />
    </div>
  );
}
