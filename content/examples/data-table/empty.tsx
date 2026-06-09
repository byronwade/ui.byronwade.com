"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"

type Row = { id: string; name: string }

const columns: DataTableColumn<Row>[] = [{ key: "name", header: "Name" }]

export default function Example() {
  return (
    <DataTable
      columns={columns}
      rows={[]}
      query=""
      onQueryChange={() => {}}
      searchPlaceholder="Search orders"
      showDensityToggle={false}
    />
  )
}
