"use client"

import { InventoryBar } from "@/components/inventory-bar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

function InventoryBarSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-14 rounded" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
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
      <div className="flex w-full max-w-sm flex-col gap-6">
        <InventoryBarSkeleton />
        <InventoryBarSkeleton />
        <InventoryBarSkeleton />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <DemoEmptyState>No inventory data</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <DemoErrorState>Couldn&apos;t load inventory</DemoErrorState>
      </div>
    )
  }

  // default + success: normal inventory bars with varied stock levels
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <InventoryBar available={128} total={200} />
      <InventoryBar available={6} total={200} />
      <InventoryBar available={0} total={200} />
    </div>
  )
}
