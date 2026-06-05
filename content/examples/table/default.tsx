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

const invoices = [
  { id: "INV-001", customer: "Acme Corp", amount: "$250.00", status: "Paid" },
  {
    id: "INV-002",
    customer: "Globex Inc",
    amount: "$125.00",
    status: "Pending",
  },
  { id: "INV-003", customer: "Initech", amount: "$400.00", status: "Overdue" },
  {
    id: "INV-004",
    customer: "Umbrella Ltd",
    amount: "$310.00",
    status: "Paid",
  },
  { id: "INV-005", customer: "Hooli", amount: "$90.00", status: "Pending" },
]

export default function Example() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell className="text-right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$1,175.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
