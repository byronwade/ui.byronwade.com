import { Skeleton } from "@/components/ui/skeleton"

export default function Example() {
  const rows = 5
  const cols = [180, 120, 90, 100]

  return (
    <div className="w-full max-w-xl rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/40">
        {cols.map((w, i) => (
          <Skeleton
            key={i}
            className="h-3.5 rounded"
            style={{ width: w / 2 }}
          />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0"
        >
          {cols.map((w, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 rounded"
              style={{ width: w - ((rowIdx * 7 + colIdx * 11) % 30) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
