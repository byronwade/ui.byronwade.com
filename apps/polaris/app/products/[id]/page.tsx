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

const PRODUCTS: Record<
  string,
  {
    name: string
    status: "Active" | "Draft" | "Archived"
    inventory: number
    price: string
    description: string
    vendor: string
    productType: string
    variants: Array<{
      sku: string
      option: string
      inventory: number
      price: string
    }>
  }
> = {
  "organic-cotton-tote": {
    name: "Organic cotton tote",
    status: "Active",
    inventory: 128,
    price: "$28.00",
    description: "Heavyweight organic cotton tote with reinforced handles.",
    vendor: "Snowpeak Outfitters",
    productType: "Bags",
    variants: [
      { sku: "TOTE-NAT", option: "Natural", inventory: 64, price: "$28.00" },
      { sku: "TOTE-BLK", option: "Black", inventory: 42, price: "$28.00" },
      { sku: "TOTE-OLV", option: "Olive", inventory: 22, price: "$28.00" },
    ],
  },
  "ceramic-mug-set": {
    name: "Ceramic mug set",
    status: "Active",
    inventory: 64,
    price: "$42.00",
    description: "Set of two stoneware mugs, dishwasher safe.",
    vendor: "Snowpeak Outfitters",
    productType: "Home",
    variants: [
      { sku: "MUG-SET-2", option: "Set of 2", inventory: 40, price: "$42.00" },
      { sku: "MUG-SET-4", option: "Set of 4", inventory: 24, price: "$72.00" },
    ],
  },
  "wool-beanie": {
    name: "Wool beanie",
    status: "Draft",
    inventory: 0,
    price: "$24.00",
    description: "Merino wool beanie with folded cuff.",
    vendor: "Snowpeak Outfitters",
    productType: "Apparel",
    variants: [
      { sku: "BN-GRY", option: "Gray / One size", inventory: 0, price: "$24.00" },
      { sku: "BN-NVY", option: "Navy / One size", inventory: 0, price: "$24.00" },
    ],
  },
  "trail-daypack": {
    name: "Trail daypack",
    status: "Active",
    inventory: 37,
    price: "$89.00",
    description: "20L daypack with padded laptop sleeve and hydration port.",
    vendor: "Snowpeak Outfitters",
    productType: "Bags",
    variants: [
      { sku: "DP-20-SL", option: "Slate", inventory: 18, price: "$89.00" },
      { sku: "DP-20-FG", option: "Forest green", inventory: 19, price: "$89.00" },
    ],
  },
  "merino-base-layer": {
    name: "Merino base layer",
    status: "Archived",
    inventory: 12,
    price: "$68.00",
    description: "150gsm merino long-sleeve base layer.",
    vendor: "Snowpeak Outfitters",
    productType: "Apparel",
    variants: [
      { sku: "MBL-S", option: "Small", inventory: 2, price: "$68.00" },
      { sku: "MBL-M", option: "Medium", inventory: 5, price: "$68.00" },
      { sku: "MBL-L", option: "Large", inventory: 5, price: "$68.00" },
    ],
  },
}

type ProductDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params
  const product = PRODUCTS[id] ?? {
    name: decodeURIComponent(id).replace(/-/g, " "),
    status: "Draft" as const,
    inventory: 0,
    price: "—",
    description: "Product not found in the demo catalog.",
    vendor: "Snowpeak Outfitters",
    productType: "Unknown",
    variants: [],
  }

  return (
    <AdminShell
      activeId="products"
      title={product.name}
      headerActions={
        <>
          <Button variant="outline" size="sm">
            Duplicate
          </Button>
          <Button size="sm">Edit product</Button>
        </>
      }
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/products" />}>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-medium text-foreground">
                {product.name}
              </h2>
              <Badge variant="outline">{product.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Inventory</CardDescription>
              <CardTitle className="font-mono text-base">
                {product.inventory} in stock
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Price</CardDescription>
              <CardTitle className="font-mono text-base">
                {product.price}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Type</CardDescription>
              <CardTitle className="text-base">{product.productType}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Vendor · {product.vendor}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>
              {product.variants.length} variants for this product
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Option</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-muted-foreground"
                    >
                      No variants
                    </TableCell>
                  </TableRow>
                ) : (
                  product.variants.map((variant) => (
                    <TableRow key={variant.sku}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {variant.sku}
                      </TableCell>
                      <TableCell>{variant.option}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {variant.inventory}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {variant.price}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
