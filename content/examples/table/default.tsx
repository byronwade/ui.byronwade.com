"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

type Invoice = {
  id: string
  customer: string
  date: string
  amount: number
  status: "Paid" | "Pending" | "Overdue"
}

const INVOICES: Invoice[] = [
  {
    id: "INV-001",
    customer: "Acme Corp",
    date: "2025-05-12",
    amount: 25000,
    status: "Paid",
  },
  {
    id: "INV-002",
    customer: "Globex Inc",
    date: "2025-05-19",
    amount: 12500,
    status: "Pending",
  },
  {
    id: "INV-003",
    customer: "Initech",
    date: "2025-05-24",
    amount: 40000,
    status: "Overdue",
  },
  {
    id: "INV-004",
    customer: "Umbrella Ltd",
    date: "2025-05-30",
    amount: 31000,
    status: "Paid",
  },
  {
    id: "INV-005",
    customer: "Hooli",
    date: "2025-06-03",
    amount: 9000,
    status: "Pending",
  },
]

const STATUS_CLASS = {
  Paid: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Overdue: "bg-destructive/15 text-destructive",
} as const

function formatAmount(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}

const TOTAL = INVOICES.reduce((sum, inv) => sum + inv.amount, 0)
const COL_COUNT = 4

const SKELETON_ROWS = Array.from({ length: COL_COUNT }, (_, i) => i)

export default function Example() {
  const state = useDemoState() ?? "default"

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Table>
        <TableCaption>
          {isSuccess
            ? "All invoices up to date."
            : isError
              ? null
              : "A list of recent invoices."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            SKELETON_ROWS.map((i) => (
              <TableRow key={i} aria-hidden="true">
                <TableCell>
                  <Skeleton className="h-4 w-20 font-mono" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
              </TableRow>
            ))
          ) : isEmpty ? (
            <TableRow>
              <TableCell colSpan={COL_COUNT} className="p-0">
                <DemoEmptyState className="border-0">No data</DemoEmptyState>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={COL_COUNT} className="p-0">
                <DemoErrorState>Couldn&apos;t load data</DemoErrorState>
              </TableCell>
            </TableRow>
          ) : (
            INVOICES.map((inv) => (
              <TableRow
                key={inv.id}
                data-state={isSuccess ? "selected" : undefined}
              >
                <TableCell>
                  <span className="font-mono text-xs font-medium">
                    {inv.id}
                  </span>
                </TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatAmount(inv.amount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {!isLoading && !isEmpty && !isError && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatAmount(TOTAL)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
