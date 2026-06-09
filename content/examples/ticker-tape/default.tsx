"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { TickerTape } from "@/components/ticker-tape"
import { makeQuote } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const items = Array.from({ length: 8 }, (_, index) =>
  makeQuote({ seed: index + 1 }),
)

// Mirror the ticker's horizontal pill shape: symbol + price + change
const SKELETON_COUNT = 8

function TickerTapeSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-center gap-2 overflow-hidden border-y border-border bg-muted/30 py-2 px-3"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <div key={i} className="flex shrink-0 items-center gap-1.5 px-3">
          {/* symbol */}
          <Skeleton className="h-3.5 w-10 rounded" />
          {/* price */}
          <Skeleton className="h-3.5 w-14 rounded font-mono" />
          {/* change pill */}
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="w-full max-w-3xl" aria-busy="true">
        <TickerTapeSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-3xl">
        <DemoEmptyState>No quotes</DemoEmptyState>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-3xl">
        <DemoErrorState>Couldn&apos;t load quotes</DemoErrorState>
      </div>
    )
  }

  // default + success both show the live scrolling ticker
  return (
    <div className="w-full max-w-3xl">
      <TickerTape items={items} />
    </div>
  )
}
