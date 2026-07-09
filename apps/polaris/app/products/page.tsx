import Link from "next/link"

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
    id: "organic-cotton-tote",
    name: "Organic cotton tote",
    status: "Active",
    inventory: 128,
    price: "$28.00",
  },
  {
    id: "ceramic-mug-set",
    name: "Ceramic mug set",
    status: "Active",
    inventory: 64,
    price: "$42.00",
  },
  {
    id: "wool-beanie",
    name: "Wool beanie",
    status: "Draft",
    inventory: 0,
    price: "$24.00",
  },
  {
    id: "trail-daypack",
    name: "Trail daypack",
    status: "Active",
    inventory: 37,
    price: "$89.00",
  },
  {
    id: "merino-base-layer",
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
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    {product.name}
                  </Link>
                </TableCell>
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
