"use client"

import { SymbolSearch } from "@/components/symbol-search"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { makeQuotes } from "@/lib/market"
import { cn } from "@/lib/utils"

const symbols = makeQuotes(8, { seed: 25 })

// Mirror the 3-group layout: 5 Stocks + 2 Crypto + 1 Forex = 8 rows
const SKELETON_GROUPS = [
  { label: "Stocks", count: 5 },
  { label: "Crypto", count: 2 },
  { label: "Forex", count: 1 },
]

function SymbolSearchSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md overflow-hidden rounded-xl edge bg-popover"
    >
      {/* Input row */}
      <div className="flex items-center border-b border-border px-3 py-2">
        <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
        <Skeleton className="ml-2 h-4 w-36 rounded" />
      </div>
      {/* Hint bar */}
      <div className="flex items-center gap-1 border-b border-border px-3 py-1.5">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-4 w-5 rounded-sm" />
        <Skeleton className="h-4 w-5 rounded-sm" />
        <Skeleton className="h-3 w-10 rounded" />
        <Skeleton className="h-4 w-5 rounded-sm" />
      </div>
      {/* Result groups */}
      <div className="py-1">
        {SKELETON_GROUPS.map((group) => (
          <div key={group.label} className="py-1">
            {/* Group heading */}
            <div className="px-3 py-1">
              <Skeleton className="h-3 w-10 rounded" />
            </div>
            {/* Rows */}
            {Array.from({ length: group.count }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-3 py-1.5"
              >
                {/* Symbol + name */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Skeleton className="h-4 w-10 shrink-0 rounded font-mono" />
                  <Skeleton className="h-3.5 w-28 rounded" />
                </div>
                {/* Price change badge */}
                <Skeleton className="h-5 w-14 rounded" />
                {/* Shortcut */}
                <Skeleton className="h-4 w-10 rounded-sm" />
              </div>
            ))}
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

  return (
    <div
      className={cn("flex justify-center p-8")}
      aria-busy={isLoading}
      data-state={state}
    >
      {isLoading ? (
        <SymbolSearchSkeleton />
      ) : isEmpty ? (
        <div className="w-full max-w-md">
          <DemoEmptyState>No symbols found</DemoEmptyState>
        </div>
      ) : isError ? (
        <div className="w-full max-w-md">
          <DemoErrorState>Couldn&apos;t search</DemoErrorState>
        </div>
      ) : (
        <SymbolSearch symbols={symbols} />
      )}
    </div>
  )
}
