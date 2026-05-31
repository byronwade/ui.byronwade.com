import { Skeleton } from "@/components/ui/skeleton"

export default function Example() {
  return (
    <div className="w-72 rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-4">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-lg" />

      {/* Title + subtitle */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Footer: avatar + action */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}
