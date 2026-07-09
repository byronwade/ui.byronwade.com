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

const CUSTOMERS: Record<
  string,
  {
    name: string
    email: string
    orders: number
    spent: string
    location: string
    since: string
    recentOrders: Array<{ id: string; status: string; total: string }>
  }
> = {
  "alex-rivera": {
    name: "Alex Rivera",
    email: "alex@example.com",
    orders: 12,
    spent: "$1,240.00",
    location: "Portland, OR",
    since: "Mar 2024",
    recentOrders: [
      { id: "1042", status: "Fulfilled", total: "$128.00" },
      { id: "1028", status: "Fulfilled", total: "$89.00" },
    ],
  },
  "jordan-lee": {
    name: "Jordan Lee",
    email: "jordan@example.com",
    orders: 5,
    spent: "$312.50",
    location: "Austin, TX",
    since: "Aug 2024",
    recentOrders: [{ id: "1041", status: "Unfulfilled", total: "$64.50" }],
  },
  "sam-chen": {
    name: "Sam Chen",
    email: "sam@example.com",
    orders: 8,
    spent: "$640.00",
    location: "Seattle, WA",
    since: "Jan 2025",
    recentOrders: [{ id: "1040", status: "Paid", total: "$42.00" }],
  },
  "riley-park": {
    name: "Riley Park",
    email: "riley@example.com",
    orders: 2,
    spent: "$210.00",
    location: "Denver, CO",
    since: "Nov 2025",
    recentOrders: [
      { id: "1039", status: "Partially fulfilled", total: "$210.00" },
    ],
  },
  "casey-morgan": {
    name: "Casey Morgan",
    email: "casey@example.com",
    orders: 1,
    spent: "$36.00",
    location: "Chicago, IL",
    since: "Jun 2026",
    recentOrders: [{ id: "1038", status: "Refunded", total: "$36.00" }],
  },
}

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params
  const customer = CUSTOMERS[id]

  if (!customer) {
    return (
      <AdminShell activeId="customers" title="Customer not found">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No customer matches <code className="font-mono text-xs">{id}</code>.
          </p>
          <Button variant="outline" render={<Link href="/customers" />}>
            Back to customers
          </Button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      activeId="customers"
      title={customer.name}
      headerActions={
        <Button size="sm" variant="outline">
          Edit customer
        </Button>
      }
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/customers" />}>
                Customers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{customer.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              {customer.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {customer.email} · Customer since {customer.since}
            </p>
          </div>
          <Badge variant="secondary">{customer.location}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Orders</CardDescription>
              <CardTitle className="font-mono text-2xl">
                {customer.orders}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Amount spent</CardDescription>
              <CardTitle className="font-mono text-2xl">
                {customer.spent}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Location</CardDescription>
              <CardTitle className="text-lg">{customer.location}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>
              Latest purchases from this customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        href={`/orders/${order.id}`}
                        className="underline-offset-2 hover:underline"
                      >
                        #{order.id}
                      </Link>
                    </TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
