import { Skeleton } from "@/components/ui/skeleton"

export default function Example() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* 2×2 grid of media cards */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-2 shadow-sm">
            {/* Thumbnail */}
            <Skeleton className="h-28 w-full rounded-md" />
            {/* Title */}
            <Skeleton className="h-3.5 w-4/5" />
            {/* Meta */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
