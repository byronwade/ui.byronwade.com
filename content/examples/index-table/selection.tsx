"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { IndexTable, type IndexTableColumn } from "@/components/index-table"

type Order = {
  id: string
  order: string
  customer: string
  total: string
  status: "paid" | "pending"
}

const orders: Order[] = [
  {
    id: "1001",
    order: "#1001",
    customer: "Ada Lovelace",
    total: "$128.00",
    status: "paid",
  },
  {
    id: "1002",
    order: "#1002",
    customer: "Alan Turing",
    total: "$64.50",
    status: "pending",
  },
  {
    id: "1003",
    order: "#1003",
    customer: "Grace Hopper",
    total: "$312.00",
    status: "paid",
  },
]

const columns: IndexTableColumn<Order>[] = [
  { key: "order", header: "Order", sortable: true },
  { key: "customer", header: "Customer" },
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
    render: (row) => (
      <Badge variant={row.status === "paid" ? "success" : "warning"}>
        {row.status}
      </Badge>
    ),
  },
]

export default function Example() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([
    "1001",
    "1003",
  ])

  return (
    <IndexTable
      columns={columns}
      rows={orders}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={[
        { label: "Fulfill", promoted: true },
        { label: "Archive" },
        { label: "Delete", tone: "destructive" },
      ]}
    />
  )
}
