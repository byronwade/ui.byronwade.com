"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  IndexTable,
  type IndexTableColumn,
  type IndexTableSort,
} from "@/components/index-table"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

type Order = {
  id: string
  order: string
  customer: string
  date: string
  total: string
  items: number
  status: "paid" | "pending" | "refunded"
}

const ORDERS: Order[] = [
  {
    id: "1001",
    order: "#1001",
    customer: "Ada Lovelace",
    date: "Jun 2, 2026",
    total: "$128.00",
    items: 3,
    status: "paid",
  },
  {
    id: "1002",
    order: "#1002",
    customer: "Alan Turing",
    date: "Jun 3, 2026",
    total: "$64.50",
    items: 1,
    status: "pending",
  },
  {
    id: "1003",
    order: "#1003",
    customer: "Grace Hopper",
    date: "Jun 4, 2026",
    total: "$312.00",
    items: 5,
    status: "refunded",
  },
  {
    id: "1004",
    order: "#1004",
    customer: "Linus Torvalds",
    date: "Jun 5, 2026",
    total: "$89.99",
    items: 2,
    status: "paid",
  },
  {
    id: "1005",
    order: "#1005",
    customer: "Margaret Hamilton",
    date: "Jun 6, 2026",
    total: "$240.00",
    items: 4,
    status: "paid",
  },
]

const STATUS_VARIANT = {
  paid: "success",
  pending: "warning",
  refunded: "secondary",
} as const

function OrderStatus({ status }: { status: Order["status"] }) {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    refunded: "Refunded",
  }
  return <Badge variant={STATUS_VARIANT[status]}>{labels[status]}</Badge>
}

const COLUMNS: IndexTableColumn<Order>[] = [
  { key: "order", header: "Order", sortable: true },
  { key: "customer", header: "Customer", sortable: true },
  { key: "date", header: "Date" },
  {
    key: "items",
    header: "Items",
    align: "end",
    render: (row) => (
      <span className="font-mono tabular-nums text-muted-foreground">
        {row.items}
      </span>
    ),
  },
  {
    key: "total",
    header: "Total",
    align: "end",
    render: (row) => (
      <span className="font-mono tabular-nums">{row.total}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <OrderStatus status={row.status} />,
  },
]

function sortRows(rows: Order[], sort: IndexTableSort): Order[] {
  const sorted = [...rows]
  sorted.sort((a, b) => {
    const dir = sort.direction === "asc" ? 1 : -1
    if (sort.key === "total") {
      const av = parseFloat(a.total.replace(/[^0-9.]/g, ""))
      const bv = parseFloat(b.total.replace(/[^0-9.]/g, ""))
      return (av - bv) * dir
    }
    if (sort.key === "items") return (a.items - b.items) * dir
    const av = String(a[sort.key as keyof Order] ?? "")
    const bv = String(b[sort.key as keyof Order] ?? "")
    return av.localeCompare(bv) * dir
  })
  return sorted
}

export default function Example() {
  const state = useDemoState() ?? "default"

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<IndexTableSort>({
    key: "order",
    direction: "asc",
  })

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  const rows = React.useMemo(() => {
    if (isEmpty || isLoading || isError) return []
    return sortRows(ORDERS, sort)
  }, [sort, isEmpty, isLoading, isError])

  if (isError) {
    return (
      <div className="rounded-xl bg-muted/40 p-1">
        <DemoErrorState>
          Couldn&apos;t load orders. Retry in a moment.
        </DemoErrorState>
      </div>
    )
  }

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className="rounded-xl bg-muted/40 p-1"
    >
      <IndexTable
        columns={COLUMNS}
        rows={rows}
        loading={isLoading}
        loadingRowCount={5}
        emptyState={
          <DemoEmptyState className="border-0">
            No orders yet. Orders will appear here once customers check out.
          </DemoEmptyState>
        }
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        sort={sort}
        onSortChange={setSort}
        bulkActions={[
          { label: "Fulfill", promoted: true },
          { label: "Archive" },
          { label: "Delete", tone: "destructive" },
        ]}
        pagination={{
          page: 1,
          pageSize: 10,
          total: isEmpty ? 0 : ORDERS.length,
          onPageChange: () => undefined,
        }}
        onRowClick={(row) => console.log("Open order", row.id)}
      />
    </div>
  )
}
