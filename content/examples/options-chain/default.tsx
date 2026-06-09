"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { OptionsChain } from "@/components/options-chain"
import { makeOptionsChainRows } from "@/lib/market"

const ROWS = makeOptionsChainRows(11, { seed: 3, spot: 180 })
const SPOT = 180

// Mirror the options-chain table layout: 5 columns per side + 1 strike = skeleton rows
const SKELETON_ROW_COUNT = 11

function OptionsChainSkeleton() {
  return (
    <div className="w-full rounded-xl ring-1 ring-border bg-card overflow-hidden">
      {/* header */}
      <div className="border-b border-border px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </div>
      {/* tab bar */}
      <div className="flex border-b border-border">
        <div className="flex-1 px-4 py-2.5">
          <Skeleton className="mx-auto h-3.5 w-10" />
        </div>
        <div className="flex-1 px-4 py-2.5">
          <Skeleton className="mx-auto h-3.5 w-10" />
        </div>
      </div>
      {/* header row */}
      <div className="grid grid-cols-5 gap-3 px-4 py-2 border-b border-border">
        {[
          "text-right",
          "text-right",
          "text-right",
          "text-right",
          "text-center",
        ].map((align, i) => (
          <Skeleton key={i} className="h-3 w-8 justify-self-center" />
        ))}
      </div>
      {/* data rows */}
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-3 px-4 py-2.5 border-b border-border/50 last:border-0"
        >
          <Skeleton className="h-3.5 w-10 justify-self-end" />
          <Skeleton className="h-3.5 w-10 justify-self-end" />
          <Skeleton className="h-3.5 w-10 justify-self-end" />
          <Skeleton className="h-3.5 w-8 justify-self-end" />
          <Skeleton className="h-3.5 w-12 justify-self-center" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="w-full max-w-3xl p-4">
        <OptionsChainSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-3xl p-4">
        <DemoEmptyState>No contracts</DemoEmptyState>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-3xl p-4">
        <DemoErrorState>Couldn&apos;t load options chain</DemoErrorState>
      </div>
    )
  }

  // default + success both render the live chain
  return (
    <div className="w-full max-w-3xl p-4">
      <OptionsChain rows={ROWS} spot={SPOT} />
    </div>
  )
}
