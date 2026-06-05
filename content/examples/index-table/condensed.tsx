"use client"

import { Badge } from "@/components/ui/badge"
import { IndexTable, type IndexTableColumn } from "@/components/index-table"

type Product = {
  id: string
  product: string
  sku: string
  inventory: string
  status: "active" | "draft"
}

const products: Product[] = [
  {
    id: "p1",
    product: "Aero Runner",
    sku: "AR-001",
    inventory: "128",
    status: "active",
  },
  {
    id: "p2",
    product: "Trail Boot",
    sku: "TB-014",
    inventory: "12",
    status: "draft",
  },
  {
    id: "p3",
    product: "Court Classic",
    sku: "CC-220",
    inventory: "0",
    status: "active",
  },
  {
    id: "p4",
    product: "City Slip-On",
    sku: "CS-099",
    inventory: "54",
    status: "active",
  },
]

const columns: IndexTableColumn<Product>[] = [
  { key: "product", header: "Product", sortable: true },
  {
    key: "sku",
    header: "SKU",
    render: (row) => <span className="font-mono">{row.sku}</span>,
  },
  {
    key: "inventory",
    header: "Inventory",
    align: "end",
    render: (row) => (
      <span className="font-mono tabular-nums">{row.inventory}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={row.status === "active" ? "success" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
]

export default function Example() {
  return <IndexTable columns={columns} rows={products} density="condensed" />
}
