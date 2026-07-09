import Link from "next/link"

import { AdminShell } from "@/components/polaris/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ORDERS: Record<
  string,
  {
    number: string
    customer: string
    customerId: string
    email: string
    status: string
    total: string
    date: string
    items: Array<{ name: string; qty: number; price: string }>
  }
> = {
  "1042": {
    number: "#1042",
    customer: "Alex Rivera",
    customerId: "alex-rivera",
    email: "alex@example.com",
    status: "Fulfilled",
    total: "$128.00",
    date: "Jul 2, 2026",
    items: [
      { name: "Organic cotton tote", qty: 2, price: "$56.00" },
      { name: "Ceramic mug set", qty: 1, price: "$42.00" },
      { name: "Wool beanie", qty: 1, price: "$24.00" },
    ],
  },
  "1041": {
    number: "#1041",
    customer: "Jordan Lee",
    customerId: "jordan-lee",
    email: "jordan@example.com",
    status: "Unfulfilled",
    total: "$64.50",
    date: "Jul 1, 2026",
    items: [{ name: "Trail daypack", qty: 1, price: "$89.00" }],
  },
  "1040": {
    number: "#1040",
    customer: "Sam Chen",
    customerId: "sam-chen",
    email: "sam@example.com",
    status: "Paid",
    total: "$42.00",
    date: "Jun 30, 2026",
    items: [{ name: "Ceramic mug set", qty: 1, price: "$42.00" }],
  },
  "1039": {
    number: "#1039",
    customer: "Riley Park",
    customerId: "riley-park",
    email: "riley@example.com",
    status: "Partially fulfilled",
    total: "$210.00",
    date: "Jun 28, 2026",
    items: [
      { name: "Merino base layer", qty: 2, price: "$136.00" },
      { name: "Trail daypack", qty: 1, price: "$89.00" },
    ],
  },
  "1038": {
    number: "#1038",
    customer: "Casey Morgan",
    customerId: "casey-morgan",
    email: "casey@example.com",
    status: "Refunded",
    total: "$36.00",
    date: "Jun 26, 2026",
    items: [{ name: "Organic cotton tote", qty: 1, price: "$28.00" }],
  },
}

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params
  const order = ORDERS[id]

  if (!order) {
    return (
      <AdminShell activeId="orders" title="Order not found">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No order matches <code className="font-mono text-xs">#{id}</code>.
          </p>
          <Button variant="outline" render={<Link href="/orders" />}>
            Back to orders
          </Button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      activeId="orders"
      title={order.number}
      headerActions={
        <Button size="sm" variant="outline">
          Print packing slip
        </Button>
      }
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/orders" />}>
                Orders
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{order.number}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium tracking-tight">
                {order.number}
              </h2>
              <Badge variant="outline">{order.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {order.date} ·{" "}
              <Link
                href={`/customers/${order.customerId}`}
                className="text-foreground underline-offset-2 hover:underline"
              >
                {order.customer}
              </Link>
            </p>
          </div>
          <p className="font-mono text-lg font-medium">{order.total}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Line items</CardTitle>
              <CardDescription>
                {order.items.length} items in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.qty}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Contact for this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customer}</p>
              <p className="text-muted-foreground">{order.email}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                render={<Link href={`/customers/${order.customerId}`} />}
              >
                View customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
