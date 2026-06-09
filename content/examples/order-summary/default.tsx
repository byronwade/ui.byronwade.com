"use client"

import { OrderSummary } from "@/components/order-summary"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const LINE_ITEMS = [
  {
    id: "tee",
    title: "Heavyweight Cotton Tee",
    variant: "Black / M",
    quantity: 2,
    price: 32,
    image: "https://github.com/shadcn.png",
  },
  {
    id: "cap",
    title: "Embroidered Cap",
    sku: "CAP-001",
    quantity: 1,
    price: 24,
  },
]

const DISCOUNTS = [{ label: "Welcome offer", code: "WELCOME10", amount: 8.8 }]

function OrderSummarySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-4 rounded-lg edge bg-card p-4 max-w-sm"
    >
      {/* line items */}
      <ul className="flex flex-col gap-3">
        {[0, 1].map((i) => (
          <li key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
            <Skeleton className="h-4 w-14 shrink-0 rounded" />
          </li>
        ))}
      </ul>

      {/* separator */}
      <Skeleton className="h-px w-full rounded-none" />

      {/* totals rows */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton
              className={cn("h-3.5 rounded", i === 3 ? "w-10" : "w-16")}
            />
            <Skeleton
              className={cn("h-3.5 rounded", i === 3 ? "w-20" : "w-14")}
            />
          </div>
        ))}
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
    return <OrderSummarySkeleton />
  }

  if (isError) {
    return (
      <div className="max-w-sm">
        <DemoErrorState>Couldn&apos;t load order</DemoErrorState>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <OrderSummary className="max-w-sm" lineItems={[]} shipping={0} tax={0} />
    )
  }

  // default + success — same data, success gets a ring hint
  return (
    <OrderSummary
      className={cn(
        "max-w-sm",
        state === "success" && "ring-1 ring-success/30",
      )}
      lineItems={LINE_ITEMS}
      discounts={DISCOUNTS}
      shipping={5}
      tax={6.32}
    />
  )
}
