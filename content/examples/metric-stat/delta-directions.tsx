import { MetricStat } from "@/components/metric-stat";

export default function Example() {
  return (
    <div className="flex flex-wrap gap-8">
      <MetricStat
        label="Sessions"
        value="9,210"
        delta={{ value: "+14.3%", direction: "up" }}
      />
      <MetricStat
        label="Error Rate"
        value="0.8%"
        delta={{ value: "+0.2%", direction: "down" }}
      />
      <MetricStat
        label="Uptime"
        value="99.9%"
        delta={{ value: "0.0%", direction: "flat" }}
      />
    </div>
  );
}
