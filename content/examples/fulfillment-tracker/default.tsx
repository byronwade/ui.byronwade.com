"use client"

import { FulfillmentTracker } from "@/components/fulfillment-tracker"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const NORMAL_STEPS = [
  {
    label: "Order placed",
    state: "done" as const,
    description: "Payment captured",
    timestamp: "Jun 3, 9:42 AM",
  },
  {
    label: "Packed",
    state: "done" as const,
    description: "2 of 3 items",
    timestamp: "Jun 3, 2:15 PM",
  },
  {
    label: "In transit",
    state: "current" as const,
    description: "Out for delivery",
  },
  {
    label: "Delivered",
    state: "upcoming" as const,
  },
]

const SUCCESS_STEPS = [
  {
    label: "Order placed",
    state: "done" as const,
    description: "Payment captured",
    timestamp: "Jun 3, 9:42 AM",
  },
  {
    label: "Packed",
    state: "done" as const,
    description: "3 of 3 items",
    timestamp: "Jun 3, 2:15 PM",
  },
  {
    label: "In transit",
    state: "done" as const,
    description: "Delivered to door",
    timestamp: "Jun 4, 11:20 AM",
  },
  {
    label: "Delivered",
    state: "done" as const,
    timestamp: "Jun 4, 11:20 AM",
  },
]

function FulfillmentTrackerSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Status pills row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-14 rounded" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
      {/* Step rail */}
      <div className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return <FulfillmentTrackerSkeleton />
  }

  if (state === "empty") {
    return <DemoEmptyState>No fulfillment yet</DemoEmptyState>
  }

  if (state === "error") {
    return <DemoErrorState>Couldn&apos;t load tracking</DemoErrorState>
  }

  if (state === "success") {
    return (
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        steps={SUCCESS_STEPS}
      />
    )
  }

  // default
  return (
    <FulfillmentTracker
      paymentStatus="paid"
      fulfillmentStatus="partially_fulfilled"
      steps={NORMAL_STEPS}
    />
  )
}
