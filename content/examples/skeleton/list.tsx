import { Skeleton } from "@/components/ui/skeleton"

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  )
}

export default function Example() {
  return (
    <div className="w-80 rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}
