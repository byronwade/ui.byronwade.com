"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "ORD-8821", product: "Mechanical Keyboard", qty: 2, date: "May 28", status: "Shipped" },
  { id: "ORD-8820", product: "USB-C Hub", qty: 1, date: "May 27", status: "Processing" },
  { id: "ORD-8819", product: "Monitor Stand", qty: 1, date: "May 26", status: "Delivered" },
  { id: "ORD-8818", product: "Webcam HD", qty: 3, date: "May 25", status: "Cancelled" },
  { id: "ORD-8817", product: "Desk Lamp", qty: 1, date: "May 24", status: "Delivered" },
  { id: "ORD-8816", product: "Cable Management Kit", qty: 4, date: "May 23", status: "Processing" },
];

type Status = "Shipped" | "Processing" | "Delivered" | "Cancelled";

const statusVariant: Record<Status, "default" | "secondary" | "success" | "destructive"> = {
  Delivered: "success",
  Shipped: "default",
  Processing: "secondary",
  Cancelled: "destructive",
};

export default function Example() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.qty}</TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status as Status]}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
