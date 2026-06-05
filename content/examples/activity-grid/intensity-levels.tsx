import { ActivityGrid } from "@/components/ui/activity-grid"

// Explicit data showing all 5 intensity buckets (0 = empty, 1–4 = brand at increasing opacity)
// The component buckets relative to the max value in the data array.
// With values [0, 1, 2, 3, 4] the max is 4, so each maps to its own bucket.
const levelDemo = [0, 1, 2, 3, 4]

// A gradient strip across a full row
const gradientRow = Array.from({ length: 26 }, (_, i) =>
  Math.round((i / 25) * 12),
)

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium">All 5 intensity levels</p>
        <p className="text-xs text-muted-foreground">
          Empty → faint → medium → strong → full brand
        </p>
        <ActivityGrid data={levelDemo} columns={5} />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium">Gradient ramp — 26 cells</p>
        <ActivityGrid data={gradientRow} columns={26} />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium">Uniform high activity</p>
        <ActivityGrid
          data={Array.from({ length: 26 * 7 }, () => 10)}
          columns={26}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium">
          Sparse activity — most cells empty
        </p>
        <ActivityGrid
          data={Array.from({ length: 26 * 7 }, (_, i) =>
            i % 19 === 0 ? 5 : 0,
          )}
          columns={26}
        />
      </div>
    </div>
  )
}
