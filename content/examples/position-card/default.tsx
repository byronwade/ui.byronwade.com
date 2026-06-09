"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { PositionCard } from "@/components/position-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makePosition } from "@/lib/market"
import { cn } from "@/lib/utils"

const position = makePosition({ seed: 9 })
const successPosition = makePosition({ seed: 12 })

function PositionCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      data-slot="position-card"
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl edge bg-card p-4"
    >
      {/* header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>
      {/* entry / mark grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-10 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-10 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </div>
      {/* P&L block */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-28 rounded-md" />
        <Skeleton className="h-6 w-36 rounded-md" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className={cn(
        "flex justify-center p-8",
        isSuccess && "rounded-xl ring-1 ring-success/20",
      )}
    >
      {isLoading ? (
        <PositionCardSkeleton />
      ) : isEmpty ? (
        <div className="w-full max-w-sm">
          <DemoEmptyState>No position open</DemoEmptyState>
        </div>
      ) : isError ? (
        <div className="w-full max-w-sm">
          <DemoErrorState>Couldn&apos;t load position</DemoErrorState>
        </div>
      ) : (
        <PositionCard position={isSuccess ? successPosition : position} />
      )}
    </div>
  )
}
