import { ActivityGrid } from "@/components/ui/activity-grid";

const makeData = (length: number) =>
  Array.from({ length }, (_, i) => Math.round(Math.abs(Math.sin(i * 0.7)) * 8));

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">12 columns — compact week view</p>
        <ActivityGrid data={makeData(12 * 7)} columns={12} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">26 columns — default (6 months)</p>
        <ActivityGrid data={makeData(26 * 7)} columns={26} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">52 columns — full year</p>
        <ActivityGrid data={makeData(52 * 7)} columns={52} />
      </div>
    </div>
  );
}
