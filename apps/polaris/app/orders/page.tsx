import Link from "next/link"

import { AdminShell } from "@/components/polaris/admin-shell"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ORDERS = [
  {
    id: "1042",
    number: "#1042",
    customer: "Alex Rivera",
    status: "Fulfilled",
    total: "$128.00",
  },
  {
    id: "1041",
    number: "#1041",
    customer: "Jordan Lee",
    status: "Unfulfilled",
    total: "$64.50",
  },
  {
    id: "1040",
    number: "#1040",
    customer: "Sam Chen",
    status: "Paid",
    total: "$42.00",
  },
  {
    id: "1039",
    number: "#1039",
    customer: "Riley Park",
    status: "Partially fulfilled",
    total: "$210.00",
  },
  {
    id: "1038",
    number: "#1038",
    customer: "Casey Morgan",
    status: "Refunded",
    total: "$36.00",
  },
]

export default function OrdersPage() {
  return (
    <AdminShell activeId="orders" title="Orders">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Orders</h2>
            <p className="text-xs text-muted-foreground">
              {ORDERS.length} recent orders
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    {order.number}
                  </Link>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Badge variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  )
}
