import { ActivityGrid } from "@/components/ui/activity-grid"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <ActivityGrid
        data={Array.from({ length: 26 * 7 }, () => 0)}
        columns={26}
      />
      <p className="text-sm text-muted-foreground">No activity recorded yet</p>
    </div>
  )
}
