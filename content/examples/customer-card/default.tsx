"use client"

import { CustomerCard } from "@/components/customer-card"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

function CustomerCardSkeleton() {
  return (
    <div className="max-w-sm rounded-xl bg-card ring-1 ring-border/70">
      {/* Header: avatar + name/email */}
      <div className="flex items-center gap-3 p-6 pb-0">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-44 rounded" />
        </div>
      </div>

      {/* Stats: orders + lifetime spend */}
      <div className="flex flex-wrap gap-x-10 gap-y-4 px-6 py-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-5 w-8 rounded font-mono" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-5 w-20 rounded font-mono" />
        </div>
      </div>

      {/* Address block */}
      <div className="flex flex-col gap-1.5 px-6 pb-6">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-36 rounded" />
        <Skeleton className="mt-1 h-3 w-28 rounded" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return <CustomerCardSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="max-w-sm">
        <DemoEmptyState>No customer</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-sm">
        <DemoErrorState>Couldn&apos;t load customer</DemoErrorState>
      </div>
    )
  }

  return (
    <CustomerCard
      className="max-w-sm"
      name="Maya Hernandez"
      email="maya.hernandez@example.com"
      avatar="https://i.pravatar.cc/80?u=maya-hernandez"
      ordersCount={27}
      totalSpent={4821.5}
      currency="USD"
      locale="en-US"
      location="Austin, United States"
      address={{
        line1: "2417 Guadalupe St",
        line2: "Suite 210",
        city: "Austin",
        region: "TX",
        postalCode: "78705",
        country: "United States",
      }}
    />
  )
}
