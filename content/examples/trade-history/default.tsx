"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { TradeHistory } from "@/components/trade-history"
import { makeTrades } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const TRADES = makeTrades(8, { seed: 5 })
const SKELETON_ROWS = Array.from({ length: 8 }, (_, i) => i)

function TradeHistorySkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SKELETON_ROWS.map((i) => (
          <TableRow key={i} aria-hidden="true">
            <TableCell>
              <Skeleton className="h-3.5 w-20 rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3.5 w-14 rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-10 rounded-md" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-3.5 w-20 rounded" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-3.5 w-10 rounded" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-3.5 w-20 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "error") {
    return (
      <div className="w-full max-w-4xl p-4">
        <DemoErrorState>Couldn&apos;t load trade history</DemoErrorState>
      </div>
    )
  }

  if (state === "loading") {
    return (
      <div className="w-full max-w-4xl p-4">
        <TradeHistorySkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-4xl p-4">
        <DemoEmptyState>No trades yet</DemoEmptyState>
      </div>
    )
  }

  // default + success both render the normal trade list
  return (
    <div className="w-full max-w-4xl p-4">
      <TradeHistory trades={TRADES} />
    </div>
  )
}
