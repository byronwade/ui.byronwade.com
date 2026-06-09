"use client"

import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* image area */}
      <Skeleton className="aspect-square w-full rounded-none" />
      {/* body */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3.5 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-2 rounded-full" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-3.5 w-12 rounded" />
          <Skeleton className="h-3.5 w-10 rounded" />
        </div>
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isEmpty) {
    return (
      <div className="w-[260px]">
        <DemoEmptyState>No products</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-[260px]">
        <DemoErrorState>Couldn&apos;t load products</DemoErrorState>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-[260px]">
        <ProductCardSkeleton />
      </div>
    )
  }

  // default + success — show the real card
  return (
    <div className="max-w-[260px]">
      <ProductCard
        title="Merino Wool Crew Sweater"
        vendor="Northbound Apparel"
        image="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
        status={state === "success" ? "active" : "active"}
        price={89}
        compareAtPrice={120}
        inventory={42}
        onClick={() => {}}
      />
    </div>
  )
}
