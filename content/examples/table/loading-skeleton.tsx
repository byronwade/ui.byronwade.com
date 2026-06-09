"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  {
    id: "P-001",
    name: "Wireless Mouse",
    category: "Peripherals",
    stock: 142,
    price: "$29.99",
  },
  {
    id: "P-002",
    name: "Laptop Stand",
    category: "Accessories",
    stock: 58,
    price: "$49.99",
  },
  {
    id: "P-003",
    name: "Mechanical Keyboard",
    category: "Peripherals",
    stock: 23,
    price: "$119.99",
  },
  {
    id: "P-004",
    name: "HDMI Cable 2m",
    category: "Cables",
    stock: 310,
    price: "$12.99",
  },
  {
    id: "P-005",
    name: "Noise Cancelling Headset",
    category: "Audio",
    stock: 7,
    price: "$199.99",
  },
]

function SkeletonRow() {
  return (
    <TableRow>
      {[60, 140, 100, 50, 70].map((w, i) => (
        <TableCell key={i}>
          <div
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: w }}
          />
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function Example() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(t)
  }, [])

  function reload() {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading products…" : `${data.length} products`}
        </p>
        <button
          onClick={reload}
          disabled={loading}
          className="px-3 py-1.5 rounded-md edge text-sm hover:bg-muted transition-colors disabled:opacity-50"
        >
          Reload
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.id}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.category}
                  </TableCell>
                  <TableCell
                    className={
                      p.stock < 20 ? "text-destructive font-medium" : ""
                    }
                  >
                    {p.stock}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {p.price}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
