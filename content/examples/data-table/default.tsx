"use client"

import * as React from "react"
import { Eye, LayoutList } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDemoState } from "@/lib/demo-viewport"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "@/components/data-table"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"

type Product = {
  id: string
  title: string
  vendor: string
  productType: string
  channels: number
  status: "active" | "draft" | "archived"
  inventory: number | null
  thumbTone: "muted" | "secondary" | "accent" | "card"
}

const THUMB_TONE_CLASS = {
  muted: "bg-muted",
  secondary: "bg-secondary",
  accent: "bg-accent",
  card: "bg-card ring-1 ring-border/80",
} as const

const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Smart Perfume 1998",
    vendor: "Beauty Pro",
    productType: "Beauty & Personal Care",
    channels: 4,
    status: "active",
    inventory: null,
    thumbTone: "muted",
  },
  {
    id: "2",
    title: "Smart Perfume 1999",
    vendor: "Beauty Pro",
    productType: "Beauty & Personal Care",
    channels: 4,
    status: "active",
    inventory: null,
    thumbTone: "secondary",
  },
  {
    id: "3",
    title: "Smart Perfume 2000",
    vendor: "Beauty Pro",
    productType: "Beauty & Personal Care",
    channels: 4,
    status: "active",
    inventory: null,
    thumbTone: "accent",
  },
  {
    id: "4",
    title: "Smart Perfume 2001",
    vendor: "Beauty Pro",
    productType: "Beauty & Personal Care",
    channels: 4,
    status: "active",
    inventory: null,
    thumbTone: "card",
  },
  {
    id: "5",
    title: "Smart Perfume 2002",
    vendor: "Beauty Pro",
    productType: "Beauty & Personal Care",
    channels: 4,
    status: "active",
    inventory: null,
    thumbTone: "muted",
  },
  {
    id: "6",
    title: "Canvas tote bag",
    vendor: "Acme Supply Co.",
    productType: "Accessories",
    channels: 3,
    status: "active",
    inventory: 142,
    thumbTone: "secondary",
  },
  {
    id: "7",
    title: "Wool scarf",
    vendor: "North Loom",
    productType: "Apparel",
    channels: 2,
    status: "draft",
    inventory: 0,
    thumbTone: "accent",
  },
  {
    id: "8",
    title: "Ceramic mug",
    vendor: "Studio Kiln",
    productType: "Home & Kitchen",
    channels: 5,
    status: "active",
    inventory: 210,
    thumbTone: "card",
  },
]

const STATUS_LABEL = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
} as const

function IndexStatus({ status }: { status: Product["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        status === "active" && "bg-success/15 text-success",
        status === "draft" && "bg-warning/15 text-warning",
        status === "archived" && "bg-muted text-muted-foreground",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

const PAGE_SIZE = 5

function sortRows(rows: Product[], sort: DataTableSort) {
  const sorted = [...rows]
  sorted.sort((a, b) => {
    const direction = sort.direction === "asc" ? 1 : -1
    if (sort.key === "inventory") {
      const left = a.inventory ?? -1
      const right = b.inventory ?? -1
      return (left - right) * direction
    }
    if (sort.key === "channels") return (a.channels - b.channels) * direction
    const left = String(a[sort.key as keyof Product] ?? "")
    const right = String(b[sort.key as keyof Product] ?? "")
    return left.localeCompare(right) * direction
  })
  return sorted
}

function inventoryLabel(inventory: number | null) {
  if (inventory == null) return "Inventory not tracked"
  if (inventory === 0) return "0 in stock"
  return `${inventory} in stock for 50 variants`
}

export default function Example() {
  const [view, setView] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [sort, setSort] = React.useState<DataTableSort>({
    key: "title",
    direction: "asc",
  })

  const state = useDemoState() ?? "default"

  const filtered = React.useMemo(() => {
    let rows = PRODUCTS
    if (view !== "all") rows = rows.filter((row) => row.status === view)
    if (query.trim()) {
      const needle = query.trim().toLowerCase()
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(needle) ||
          row.vendor.toLowerCase().includes(needle) ||
          row.productType.toLowerCase().includes(needle),
      )
    }
    return sortRows(rows, sort)
  }, [query, sort, view])

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [view, query])

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const tableRows = isEmpty ? [] : pageRows

  if (state === "error") {
    return (
      <div className="rounded-xl bg-muted/40 p-1">
        <DemoErrorState>
          Couldn&apos;t load products. Retry in a moment.
        </DemoErrorState>
      </div>
    )
  }

  const columns: DataTableColumn<Product>[] = [
    {
      key: "title",
      header: "Product",
      sortable: true,
      primary: {
        title: (row) => row.title,
        media: (row) => (
          <span
            aria-hidden
            className={cn("block size-full", THUMB_TONE_CLASS[row.thumbTone])}
          />
        ),
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <IndexStatus status={row.status} />,
    },
    {
      key: "inventory",
      header: "Inventory",
      sortable: true,
      render: (row) => (
        <span className="text-[13px] text-muted-foreground">
          {inventoryLabel(row.inventory)}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: () => (
        <span className="text-[13px] text-muted-foreground">—</span>
      ),
    },
    {
      key: "channels",
      header: "Channels",
      align: "end",
      sortable: true,
      render: (row) => (
        <span className="text-[13px] tabular-nums">{row.channels}</span>
      ),
    },
    {
      key: "productType",
      header: "Product type",
      render: (row) => (
        <span className="text-[13px] text-foreground">{row.productType}</span>
      ),
    },
    {
      key: "vendor",
      header: "Vendor",
      render: (row) => (
        <span className="text-[13px] text-foreground">{row.vendor}</span>
      ),
    },
    {
      key: "view",
      header: "",
      align: "end",
      width: 44,
      render: (row) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 transition-opacity group-hover/data-table-row:opacity-100 focus-visible:opacity-100"
          aria-label={`View ${row.title}`}
          onClick={(event) => {
            event.stopPropagation()
            console.log("View product", row.id)
          }}
        >
          <Eye />
        </Button>
      ),
    },
  ]

  return (
    <div className="rounded-xl bg-muted/40 p-1">
      <DataTable
        columns={columns}
        rows={tableRows}
        loading={isLoading}
        emptyState={
          <DemoEmptyState className="border-0">
            No products match these filters yet.
          </DemoEmptyState>
        }
        views={[{ id: "all", label: "All" }]}
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search and filter"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        sort={sort}
        onSortChange={setSort}
        bulkActions={[
          { label: "Edit products", promoted: true },
          { label: "Set as draft" },
          { label: "Archive", tone: "destructive" },
        ]}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: filtered.length,
          onPageChange: setPage,
        }}
        filterActions={
          <Button variant="ghost" size="icon-sm" aria-label="Customize columns">
            <LayoutList />
          </Button>
        }
        onRowClick={(row) => console.log("Open product", row.id)}
      />
    </div>
  )
}
