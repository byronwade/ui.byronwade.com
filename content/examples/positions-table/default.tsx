"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { PositionsTable } from "@/components/positions-table"
import { makePositions } from "@/lib/market"
import { useDemoState } from "@/lib/demo-viewport"

const POSITIONS = makePositions(5, { seed: 2 })
const SKELETON_ROWS = 5

function PositionsTableSkeleton() {
  return (
    <div data-slot="positions-table-skeleton" className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Mark</TableHead>
            <TableHead className="text-right">P&amp;L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <TableRow key={i} aria-hidden="true">
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-12 rounded-md" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10 font-mono" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-20 font-mono" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-20 font-mono" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total unrealized P&amp;L</TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-4 w-20 font-mono" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "error") {
    return (
      <div className="w-full max-w-4xl p-4">
        <DemoErrorState>Couldn&apos;t load positions</DemoErrorState>
      </div>
    )
  }

  if (state === "loading") {
    return (
      <div className="w-full max-w-4xl p-4">
        <PositionsTableSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="w-full max-w-4xl p-4">
        <PositionsTable positions={[]} />
        <DemoEmptyState>No open positions</DemoEmptyState>
      </div>
    )
  }

  // default + success — success shows the same table; natural positive affordance
  // comes from the P&L values already rendered with success/destructive tokens.
  return (
    <div className="w-full max-w-4xl p-4">
      <PositionsTable positions={POSITIONS} />
    </div>
  )
}
