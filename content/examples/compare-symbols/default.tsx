"use client"

import { CompareSymbols } from "@/components/compare-symbols"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

function CompareSymbolsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap items-center gap-2 rounded-xl bg-card px-3 py-2 ring-1 ring-border/70"
    >
      <Skeleton className="h-4 w-14 rounded" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-7 w-24 rounded-lg" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl p-4">
        <CompareSymbolsSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-2xl p-4">
        <DemoEmptyState>No symbols to compare</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-2xl p-4">
        <DemoErrorState>Couldn&apos;t load comparison</DemoErrorState>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl p-4">
      <CompareSymbols onAdd={() => undefined} onRemove={() => undefined} />
    </div>
  )
}
