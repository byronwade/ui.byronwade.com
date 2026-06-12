"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { CaretDown, CaretUp, Tray } from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  BulkActionBar,
  type BulkAction,
} from "@/components/ui/bulk-action-bar"
import { EmptyState } from "@/components/empty-state"

type SortDirection = "asc" | "desc"

type IndexTableSort = {
  key: string
  direction: SortDirection
}

type IndexTableColumn<Row> = {
  key: string
  header: React.ReactNode
  sortable?: boolean
  align?: "start" | "end"
  width?: string | number
  render?: (row: Row) => React.ReactNode
}

type OffsetPagination = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

type CursorPagination = {
  hasPrev?: boolean
  hasNext?: boolean
  onPrev?: () => void
  onNext?: () => void
  rangeLabel?: React.ReactNode
}

type IndexTablePagination = OffsetPagination | CursorPagination

type IndexTableProps<Row> = {
  columns: IndexTableColumn<Row>[]
  rows: Row[]
  getRowId?: (row: Row) => string
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sort?: IndexTableSort
  onSortChange?: (sort: IndexTableSort) => void
  bulkActions?: BulkAction[]
  loading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  pagination?: IndexTablePagination
  density?: "comfortable" | "condensed"
  onRowClick?: (row: Row) => void
  caption?: React.ReactNode
  className?: string
}

const rowVariants = cva("", {
  variants: {
    density: {
      comfortable: "[&>td]:py-3",
      condensed: "[&>td]:py-1.5",
    },
  },
  defaultVariants: { density: "comfortable" },
})

function isOffsetPagination(
  pagination: IndexTablePagination,
): pagination is OffsetPagination {
  return "total" in pagination && "onPageChange" in pagination
}

function alignClass(align: IndexTableColumn<unknown>["align"]) {
  return align === "end" ? "text-right" : "text-left"
}

function IndexTable<Row>({
  columns,
  rows,
  getRowId = (row: Row) => (row as { id: string }).id,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sort,
  onSortChange,
  bulkActions = [],
  loading = false,
  loadingRowCount = 5,
  emptyState,
  pagination,
  density = "comfortable",
  onRowClick,
  caption,
  className,
}: IndexTableProps<Row>) {
  const selected = new Set(selectedIds)
  const colCount = columns.length + (selectable ? 1 : 0)
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(getRowId(row)))
  const someSelected = selectedIds.length > 0 && !allSelected

  function toggleAll(checked: boolean) {
    onSelectionChange?.(checked ? rows.map((row) => getRowId(row)) : [])
  }

  function toggleRow(id: string, checked: boolean) {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    onSelectionChange?.(Array.from(next))
  }

  function handleSort(key: string) {
    const direction: SortDirection =
      sort?.key === key && sort?.direction === "asc" ? "desc" : "asc"
    onSortChange?.({ key, direction })
  }

  function handleRowKeyDown(event: React.KeyboardEvent, row: Row) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onRowClick?.(row)
    }
  }

  const showBulkBar = selectable && selectedIds.length > 0
  const showEmpty = !loading && rows.length === 0

  return (
    <div data-slot="index-table" className={cn("relative w-full", className)}>
      {showBulkBar ? (
        <div data-slot="index-table-bulk" className="sticky top-0 z-20 mb-2">
          <BulkActionBar
            selectedCount={selectedIds.length}
            actions={bulkActions}
            onClearSelection={() => onSelectionChange?.([])}
          />
        </div>
      ) : null}

      <Table data-slot="index-table-table">
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader data-slot="index-table-header" className="sticky top-0 z-10 bg-background">
          <TableRow>
            {selectable ? (
              <TableHead data-slot="index-table-select-all-cell" className="w-10">
                <Checkbox
                  data-slot="index-table-select-all"
                  aria-label="Select all"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={(value) => toggleAll(value === true)}
                />
              </TableHead>
            ) : null}
            {columns.map((column) => {
              const isActive = sort?.key === column.key
              return (
                <TableHead
                  key={column.key}
                  data-slot="index-table-head"
                  style={column.width != null ? { width: column.width } : undefined}
                  className={alignClass(column.align)}
                >
                  {column.sortable ? (
                    <Button
                      data-slot="index-table-sort"
                      variant="ghost"
                      size="sm"
                      aria-label={`Sort by ${column.key}`}
                      aria-pressed={isActive}
                      className={cn(
                        "-mx-2 h-auto px-2 font-medium",
                        column.align === "end" && "ml-auto",
                      )}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {isActive ? (
                        sort?.direction === "asc" ? (
                          <CaretUp data-slot="index-table-sort-asc" aria-hidden />
                        ) : (
                          <CaretDown data-slot="index-table-sort-desc" aria-hidden />
                        )
                      ) : null}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody data-slot="index-table-body">
          {loading ? (
            Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} data-slot="index-table-skeleton-row">
                {selectable ? (
                  <TableCell className="w-10">
                    <Skeleton className="size-4" />
                  </TableCell>
                ) : null}
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : showEmpty ? (
            <TableRow data-slot="index-table-empty-row">
              <TableCell colSpan={colCount} className="p-0">
                {emptyState ?? (
                  <EmptyState
                    icon={Tray}
                    title="Nothing here yet"
                    description="Rows will appear here once there is data to show."
                    className="border-0"
                  />
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const id = getRowId(row)
              const isSelected = selected.has(id)
              return (
                <TableRow
                  key={id}
                  data-slot="index-table-row"
                  data-state={isSelected ? "selected" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={cn(
                    rowVariants({ density }),
                    onRowClick && "cursor-pointer outline-none focus-visible:bg-muted/50",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick ? (event) => handleRowKeyDown(event, row) : undefined
                  }
                >
                  {selectable ? (
                    <TableCell
                      data-slot="index-table-select-cell"
                      className="w-10"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        data-slot="index-table-select-row"
                        aria-label={`Select row ${id}`}
                        checked={isSelected}
                        onCheckedChange={(value) => toggleRow(id, value === true)}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      data-slot="index-table-cell"
                      className={alignClass(column.align)}
                    >
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, React.ReactNode>)[column.key] ?? null)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {pagination ? (
        <IndexTablePaginationFooter pagination={pagination} />
      ) : null}
    </div>
  )
}

function IndexTablePaginationFooter({
  pagination,
}: {
  pagination: IndexTablePagination
}) {
  if (isOffsetPagination(pagination)) {
    const { page, pageSize, total, onPageChange } = pagination
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)
    const hasPrev = page > 1
    const hasNext = end < total
    return (
      <PaginationFooterShell
        rangeLabel={`${start}–${end} of ${total}`}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => onPageChange(page - 1)}
        onNext={() => onPageChange(page + 1)}
      />
    )
  }

  const { hasPrev = false, hasNext = false, onPrev, onNext, rangeLabel } = pagination
  return (
    <PaginationFooterShell
      rangeLabel={rangeLabel}
      hasPrev={hasPrev}
      hasNext={hasNext}
      onPrev={onPrev}
      onNext={onNext}
    />
  )
}

function PaginationFooterShell({
  rangeLabel,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  rangeLabel?: React.ReactNode
  hasPrev: boolean
  hasNext: boolean
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <div
      data-slot="index-table-pagination"
      className="flex items-center justify-between gap-3 border-t border-border px-2 py-3"
    >
      <span
        data-slot="index-table-range"
        className="font-mono text-xs tabular-nums text-muted-foreground"
      >
        {rangeLabel}
      </span>
      <div data-slot="index-table-pagination-controls" className="flex items-center gap-2">
        <Button
          data-slot="index-table-prev"
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onPrev?.()}
        >
          Previous
        </Button>
        <Button
          data-slot="index-table-next"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onNext?.()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export { IndexTable }
export type {
  IndexTableColumn,
  IndexTableProps,
  IndexTableSort,
  IndexTablePagination,
}
