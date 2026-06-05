"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useMemo, useState } from "react"

import { IndexFilters } from "@/components/index-filters"
import {
  IndexTable,
  type IndexTableSort,
} from "@/components/index-table"
import { PriceChange } from "@/components/ui/price-change"
import { Sparkline } from "@/components/ui/sparkline"
import {
  formatCompact,
  formatPrice,
  formatVolume,
  makeScreenerRows,
  type ScreenerRow,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ROWS = makeScreenerRows(8, { seed: 6 })

const FILTER_VIEWS = [
  { id: "all", label: "All" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
]

type ScreenerTableProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  rows?: ScreenerRow[]
  view?: string
  onViewChange?: (view: string) => void
  sortBy?: IndexTableSort
  onSortChange?: (sort: IndexTableSort) => void
  onSelect?: (symbol: string) => void
}

function ScreenerTable({
  rows = DEFAULT_ROWS,
  view: viewProp,
  onViewChange,
  sortBy: sortProp,
  onSortChange,
  onSelect,
  className,
  ...props
}: ScreenerTableProps) {
  const [internalView, setInternalView] = useState("all")
  const [internalSort, setInternalSort] = useState<IndexTableSort | undefined>()

  const view = viewProp ?? internalView
  const sort = sortProp ?? internalSort

  const handleViewChange = (next: string) => {
    onViewChange?.(next)
    if (viewProp === undefined) setInternalView(next)
  }

  const handleSortChange = (next: IndexTableSort) => {
    onSortChange?.(next)
    if (sortProp === undefined) setInternalSort(next)
  }

  const filteredRows = useMemo(() => {
    let next = rows
    if (view === "gainers") next = rows.filter((row) => row.changePercent > 0)
    if (view === "losers") next = rows.filter((row) => row.changePercent < 0)
    if (!sort) return next
    return [...next].sort((a, b) => {
      const left = sort.key === "change" ? a.changePercent : a[sort.key as keyof ScreenerRow]
      const right = sort.key === "change" ? b.changePercent : b[sort.key as keyof ScreenerRow]
      if (typeof left !== "number" || typeof right !== "number") return 0
      return sort.direction === "asc" ? left - right : right - left
    })
  }, [rows, sort, view])

  const columns = useMemo(
    () => [
      {
        key: "symbol",
        header: "Symbol",
        sortable: true,
        render: (row: ScreenerRow) => (
          <div className="min-w-0">
            <div className="font-medium">{row.symbol}</div>
            {row.name ? (
              <div className="truncate text-xs text-muted-foreground">{row.name}</div>
            ) : null}
          </div>
        ),
      },
      {
        key: "price",
        header: "Price",
        align: "end" as const,
        sortable: true,
        render: (row: ScreenerRow) => (
          <span className="font-mono">{formatPrice(row.price, { currency: "USD" })}</span>
        ),
      },
      {
        key: "change",
        header: "Change",
        align: "end" as const,
        sortable: true,
        render: (row: ScreenerRow) => (
          <PriceChange value={row.change} percent={row.changePercent} size="sm" />
        ),
      },
      {
        key: "volume",
        header: "Volume",
        align: "end" as const,
        sortable: true,
        render: (row: ScreenerRow) => (
          <span className="font-mono text-muted-foreground">{formatVolume(row.volume)}</span>
        ),
      },
      {
        key: "marketCap",
        header: "Mkt cap",
        align: "end" as const,
        sortable: true,
        render: (row: ScreenerRow) => (
          <span className="font-mono text-muted-foreground">{formatCompact(row.marketCap)}</span>
        ),
      },
      {
        key: "spark",
        header: "Trend",
        render: (row: ScreenerRow) => (
          <Sparkline
            data={row.spark ?? [row.price, row.price + row.change]}
            width={72}
            height={24}
            aria-label={`${row.symbol} trend`}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div
      data-slot="screener-table"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <IndexFilters
        views={FILTER_VIEWS}
        view={view}
        onViewChange={handleViewChange}
      />
      <IndexTable
        columns={columns}
        rows={filteredRows}
        getRowId={(row) => row.symbol}
        sort={sort}
        onSortChange={handleSortChange}
        onRowClick={(row) => onSelect?.(row.symbol)}
        density="condensed"
      />
    </div>
  )
}

export { ScreenerTable }
export type { ScreenerTableProps }
