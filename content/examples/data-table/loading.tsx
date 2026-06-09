"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"

type Row = { id: string; name: string; qty: number }

const rows: Row[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  name: `SKU-${100 + index}`,
  qty: 20 + index * 3,
}))

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "SKU", sortable: true },
  {
    key: "qty",
    header: "Quantity",
    align: "end",
    sortable: true,
    render: (row) => <span className="font-mono tabular-nums">{row.qty}</span>,
  },
]

export default function Example() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      loading
      showDensityToggle={false}
    />
  )
}
