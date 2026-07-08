import { AdminShell } from "@/components/polaris/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PRODUCTS = [
  {
    name: "Organic cotton tote",
    status: "Active",
    inventory: 128,
    price: "$28.00",
  },
  {
    name: "Ceramic mug set",
    status: "Active",
    inventory: 64,
    price: "$42.00",
  },
  {
    name: "Wool beanie",
    status: "Draft",
    inventory: 0,
    price: "$24.00",
  },
  {
    name: "Trail daypack",
    status: "Active",
    inventory: 37,
    price: "$89.00",
  },
  {
    name: "Merino base layer",
    status: "Archived",
    inventory: 12,
    price: "$68.00",
  },
]

export default function ProductsPage() {
  return (
    <AdminShell
      activeId="products"
      title="Products"
      headerActions={<Button size="sm">Add product</Button>}
    >
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">All products</h2>
            <p className="text-xs text-muted-foreground">
              {PRODUCTS.length} products in your catalog
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRODUCTS.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.status}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {product.inventory} in stock
                </TableCell>
                <TableCell className="font-mono text-xs">{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  )
}
