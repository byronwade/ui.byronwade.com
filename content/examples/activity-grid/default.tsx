import { ActivityGrid } from "@/components/ui/activity-grid";

const data = Array.from({ length: 26 * 7 }, (_, i) => {
  // Realistic contribution-style pattern with spikes
  const weekday = i % 7;
  const weekend = weekday === 0 || weekday === 6;
  const base = weekend ? Math.random() * 2 : Math.random() * 5;
  const spike = Math.random() > 0.85 ? Math.random() * 8 : 0;
  return Math.round(base + spike);
});

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <ActivityGrid data={data} />
      <p className="text-xs text-muted-foreground">182 contributions in the last 6 months</p>
    </div>
  );
}
