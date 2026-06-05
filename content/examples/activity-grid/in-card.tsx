import { ActivityGrid } from "@/components/ui/activity-grid";

const weeklyData = Array.from({ length: 26 * 7 }, (_, i) => {
  const col = Math.floor(i / 7);
  const row = i % 7;
  const isWeekend = row === 0 || row === 6;
  if (isWeekend) return 0;
  // Simulate busier recent weeks
  const recencyBoost = col > 18 ? 1.5 : 1;
  return Math.round(Math.random() * 6 * recencyBoost);
});

const totalActive = weeklyData.filter((n) => n > 0).length;
const totalCount = weeklyData.reduce((a, b) => a + b, 0);

export default function Example() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm w-fit">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold">Contributions</p>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </div>
        <span className="text-2xl font-medium tabular-nums">{totalCount.toLocaleString()}</span>
      </div>

      <ActivityGrid data={weeklyData} columns={26} />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{totalActive} active days</p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-0.5">
            {[0, 1, 3, 7, 12].map((v) => (
              <ActivityGrid key={v} data={[v]} columns={1} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
