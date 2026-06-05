"use client"

import * as React from "react"

import { IndexTable, type IndexTableColumn } from "@/components/index-table"

type Order = {
  id: string
  order: string
  customer: string
  total: string
}

const allOrders: Order[] = Array.from({ length: 240 }, (_, i) => ({
  id: String(2000 + i),
  order: `#${2000 + i}`,
  customer: `Customer ${i + 1}`,
  total: `$${(20 + i).toFixed(2)}`,
}))

const columns: IndexTableColumn<Order>[] = [
  { key: "order", header: "Order" },
  { key: "customer", header: "Customer" },
  {
    key: "total",
    header: "Total",
    align: "end",
    render: (row) => (
      <span className="font-mono tabular-nums">{row.total}</span>
    ),
  },
]

const pageSize = 20

export default function Example() {
  const [page, setPage] = React.useState(1)
  const rows = allOrders.slice((page - 1) * pageSize, page * pageSize)

  return (
    <IndexTable
      columns={columns}
      rows={rows}
      pagination={{
        page,
        pageSize,
        total: allOrders.length,
        onPageChange: setPage,
      }}
    />
  )
}
