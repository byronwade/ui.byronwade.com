"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = Array.from({ length: 24 }, (_, index) => ({
  id: String(index + 1),
  sku: `SKU-${1000 + index}`,
  warehouse: index % 2 === 0 ? "East" : "West",
  onHand: 40 + index * 3,
}))

export default function Example() {
  return (
    <div className="max-h-80 overflow-auto rounded-lg edge">
      <Table layout="sticky-header">
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="text-right">On hand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono">{row.sku}</TableCell>
              <TableCell>{row.warehouse}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {row.onHand}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
