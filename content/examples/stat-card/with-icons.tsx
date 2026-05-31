import { BarChart2, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";

/** Each card uses a different Lucide icon to show how the icon slot is rendered. */
export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8 max-w-xl">
      <StatCard
        label="Page Views"
        value="1.24M"
        delta={{ value: "+18.2%", direction: "up" }}
        icon={BarChart2}
        hint="last 7 days"
      />
      <StatCard
        label="Orders"
        value="3,892"
        delta={{ value: "+4.1%", direction: "up" }}
        icon={ShoppingCart}
        hint="last 7 days"
      />
      <StatCard
        label="Avg. Rating"
        value="4.7"
        delta={{ value: "+0.2", direction: "up" }}
        icon={Star}
        hint="from 1,240 reviews"
      />
      <StatCard
        label="Growth Rate"
        value="22.8%"
        delta={{ value: "+3.5%", direction: "up" }}
        icon={TrendingUp}
        hint="month-over-month"
      />
    </div>
  );
}
