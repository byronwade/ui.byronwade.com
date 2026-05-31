import { Skeleton } from "@/components/ui/skeleton"

export default function Example() {
  return (
    <div className="w-80 rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center gap-4">
      {/* Avatar */}
      <Skeleton className="h-20 w-20 rounded-full" />

      {/* Name + handle */}
      <div className="flex flex-col items-center gap-2 w-full">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Bio lines */}
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6 mx-auto" />
        <Skeleton className="h-3.5 w-4/6 mx-auto" />
      </div>

      {/* Stats row */}
      <div className="flex w-full justify-around pt-2 border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 w-full">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  )
}
