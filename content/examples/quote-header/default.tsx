"use client"

import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { QuoteHeader } from "@/components/quote-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeQuote, makeSeries } from "@/lib/market"

const quote = makeQuote({ seed: 7 })
const spark = makeSeries(36, { seed: 7 })

function QuoteHeaderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* main row: symbol/name + price/change + sparkline */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          {/* symbol + name */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          {/* price + change */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-32 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>
        {/* sparkline placeholder */}
        <Skeleton className="h-10 w-[120px] rounded" />
      </div>
      {/* stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-10 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div
        aria-busy="true"
        className="w-full max-w-3xl rounded-xl edge bg-card p-6"
      >
        <QuoteHeaderSkeleton />
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-3xl rounded-xl edge bg-card p-6">
        <DemoErrorState>Couldn&apos;t load quote data</DemoErrorState>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-3xl rounded-xl edge bg-card p-6">
        <QuoteHeader
          quote={{ symbol: "—", price: 0, change: 0, changePercent: 0 }}
          stats={[
            { label: "Open", value: "—" },
            { label: "High", value: "—" },
            { label: "Low", value: "—" },
            { label: "Volume", value: "—" },
            { label: "Mkt cap", value: "—" },
          ]}
          spark={[]}
        />
        <p className="mt-2 text-xs text-muted-foreground">No quote available</p>
      </div>
    )
  }

  // default + success: render normal quote; success gets a subtle ring affordance
  return (
    <div
      className={[
        "w-full max-w-3xl rounded-xl edge bg-card p-6",
        state === "success" ? "ring-1 ring-success/30" : "",
      ]
        .join(" ")
        .trim()}
    >
      <QuoteHeader quote={quote} spark={spark} />
    </div>
  )
}
