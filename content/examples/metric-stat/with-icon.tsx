import { MetricStat } from "@/components/metric-stat"
import { ShoppingCart, Star, TrendUp, Users } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-8">
      <MetricStat
        icon={Users}
        label="Subscribers"
        value="24,800"
        delta={{ value: "+3.2%", direction: "up" }}
      />
      <MetricStat
        icon={ShoppingCart}
        label="Orders"
        value="1,045"
        delta={{ value: "-1.8%", direction: "down" }}
      />
      <MetricStat
        icon={TrendUp}
        label="Growth"
        value="18.6%"
        delta={{ value: "+2.1%", direction: "up" }}
      />
      <MetricStat
        icon={Star}
        label="Avg Rating"
        value="4.7"
        delta={{ value: "0.0%", direction: "flat" }}
      />
    </div>
  )
}
