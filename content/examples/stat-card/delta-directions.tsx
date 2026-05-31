import { StatCard } from "@/components/stat-card";

/** Demonstrates all three delta directions: up (positive), down (negative), and flat (neutral). */
export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 max-w-2xl">
      <StatCard
        label="Revenue"
        value="$48,200"
        delta={{ value: "+12.5%", direction: "up" }}
        hint="vs. previous month"
      />
      <StatCard
        label="Avg. Session"
        value="4m 32s"
        delta={{ value: "-0.8%", direction: "down" }}
        hint="vs. previous month"
      />
      <StatCard
        label="Bounce Rate"
        value="38.0%"
        delta={{ value: "0.0%", direction: "flat" }}
        hint="no change"
      />
    </div>
  );
}
