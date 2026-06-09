"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"

type Row = { id: string; order: string; total: string }

const rows: Row[] = [
  { id: "1", order: "#1042", total: "$128.00" },
  { id: "2", order: "#1043", total: "$64.50" },
  { id: "3", order: "#1044", total: "$312.00" },
  { id: "4", order: "#1045", total: "$89.00" },
  { id: "5", order: "#1046", total: "$44.00" },
]

const columns: DataTableColumn<Row>[] = [
  { key: "order", header: "Order", sortable: true },
  {
    key: "total",
    header: "Total",
    align: "end",
    render: (row) => (
      <span className="font-mono tabular-nums">{row.total}</span>
    ),
  },
]

export default function Example() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      density="condensed"
      frame="inset"
      showDensityToggle={false}
    />
  )
}
