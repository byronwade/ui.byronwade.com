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

const CUSTOMERS = [
  {
    name: "Alex Rivera",
    email: "alex@example.com",
    orders: 12,
    spent: "$1,240.00",
    location: "Portland, OR",
  },
  {
    name: "Jordan Lee",
    email: "jordan@example.com",
    orders: 5,
    spent: "$312.50",
    location: "Austin, TX",
  },
  {
    name: "Sam Chen",
    email: "sam@example.com",
    orders: 8,
    spent: "$640.00",
    location: "Seattle, WA",
  },
  {
    name: "Riley Park",
    email: "riley@example.com",
    orders: 2,
    spent: "$210.00",
    location: "Denver, CO",
  },
  {
    name: "Casey Morgan",
    email: "casey@example.com",
    orders: 1,
    spent: "$36.00",
    location: "Chicago, IL",
  },
]

export default function CustomersPage() {
  return (
    <AdminShell activeId="customers" title="Customers">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Customers</h2>
            <p className="text-xs text-muted-foreground">
              {CUSTOMERS.length} customers who have placed an order
            </p>
          </div>
          <Badge variant="secondary">All customers</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Amount spent</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CUSTOMERS.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.email}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {customer.orders}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {customer.spent}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.location}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  )
}
