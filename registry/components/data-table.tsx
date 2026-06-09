"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Inbox,
  Rows3,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  useDemoDensity,
  useDemoFrame,
  useDemoDepth,
} from "@/lib/demo-viewport"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableDensity,
  type TableLayout,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  BulkActionBar,
  type BulkAction,
} from "@/components/ui/bulk-action-bar"
import { EmptyState } from "@/components/empty-state"
import {
  IndexFilters,
  type AppliedFilter,
  type IndexFiltersView,
  type SortOption,
} from "@/components/index-filters"

type SortDirection = "asc" | "desc"

type DataTableSort = {
  key: string
  direction: SortDirection
}

type DataTableColumnPrimary<Row> = {
  title: (row: Row) => React.ReactNode
  media?: (row: Row) => React.ReactNode
  description?: (row: Row) => React.ReactNode
}

type DataTableColumn<Row> = {
  key: string
  header: React.ReactNode
  sortable?: boolean
  align?: "start" | "end"
  width?: string | number
  primary?: DataTableColumnPrimary<Row>
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

type DataTablePagination = OffsetPagination | CursorPagination
type DataTableFrame = "default" | "inset"
type DataTableDepth = "none" | "soft" | "raised"

type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  getRowId?: (row: Row) => string
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sort?: DataTableSort
  onSortChange?: (sort: DataTableSort) => void
  bulkActions?: BulkAction[]
  loading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  pagination?: DataTablePagination
  density?: TableDensity
  onDensityChange?: (density: TableDensity) => void
  layout?: TableLayout
  onRowClick?: (row: Row) => void
  caption?: React.ReactNode
  className?: string
  embedded?: boolean
  frame?: DataTableFrame
  depth?: DataTableDepth
  showDensityToggle?: boolean
  filterActions?: React.ReactNode
  searchPlaceholder?: string
  views?: IndexFiltersView[]
  view?: string
  onViewChange?: (view: string) => void
  query?: string
  onQueryChange?: (query: string) => void
  sortOptions?: SortOption[]
  listSort?: string
  onListSortChange?: (sort: string) => void
  appliedFilters?: AppliedFilter[]
  onAddFilter?: () => void
}

function isOffsetPagination(
  pagination: DataTablePagination,
): pagination is OffsetPagination {
  return "total" in pagination && "onPageChange" in pagination
}

function alignClass(align: DataTableColumn<unknown>["align"]) {
  return align === "end" ? "text-right" : "text-left"
}

function renderCell<Row>(
  row: Row,
  column: DataTableColumn<Row>,
  density: TableDensity,
) {
  if (column.render) return column.render(row)
  if (column.primary) {
    return (
      <div
        data-slot="data-table-primary"
        className={cn(
          "flex min-w-0 items-center",
          density === "condensed" && "gap-2",
          density === "comfortable" && "gap-2.5",
          density === "spacious" && "gap-3",
        )}
      >
        {column.primary.media ? (
          <span
            data-slot="data-table-primary-media"
            className={cn(
              "flex shrink-0 overflow-hidden rounded-md bg-muted",
              density === "condensed" && "size-7",
              density === "comfortable" && "size-8",
              density === "spacious" && "size-10",
            )}
          >
            {column.primary.media(row)}
          </span>
        ) : null}
        <div className="min-w-0">
          <div
            data-slot="data-table-primary-title"
            className={cn(
              "truncate leading-4 text-foreground",
              density === "condensed" && "text-xs",
              density === "comfortable" && "text-[13px]",
              density === "spacious" && "text-sm",
            )}
          >
            {column.primary.title(row)}
          </div>
          {column.primary.description ? (
            <div
              data-slot="data-table-primary-description"
              className="truncate text-xs leading-4 text-muted-foreground"
            >
              {column.primary.description(row)}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
  return (row as Record<string, React.ReactNode>)[column.key] ?? null
}

function mapDemoDensity(density: ReturnType<typeof useDemoDensity>): TableDensity | null {
  if (density === "compact") return "condensed"
  if (density === "comfortable") return "spacious"
  if (density === "default") return "comfortable"
  return null
}

function DataTable<Row>({
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
  density: densityProp,
  onDensityChange,
  layout = "sticky-header",
  onRowClick,
  caption,
  className,
  embedded = false,
  frame: frameProp,
  depth: depthProp,
  showDensityToggle = false,
  filterActions,
  searchPlaceholder = "Search and filter",
  views,
  view,
  onViewChange,
  query,
  onQueryChange,
  sortOptions,
  listSort,
  onListSortChange,
  appliedFilters,
  onAddFilter,
}: DataTableProps<Row>) {
  const demoDensity = useDemoDensity()
  const demoFrame = useDemoFrame()
  const demoDepth = useDemoDepth()
  const [internalDensity, setInternalDensity] =
    React.useState<TableDensity>("condensed")
  const density = densityProp ?? mapDemoDensity(demoDensity) ?? internalDensity
  const frame = frameProp ?? demoFrame ?? "default"
  const depth = depthProp ?? demoDepth ?? "none"

  const setDensity = (next: TableDensity) => {
    onDensityChange?.(next)
    if (densityProp === undefined) setInternalDensity(next)
  }

  const selected = new Set(selectedIds)
  const colCount = columns.length + (selectable ? 1 : 0)
  const allSelected =
    rows.length > 0 && rows.every((row) => selected.has(getRowId(row)))
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

  const showBulk = selectable && selectedIds.length > 0
  const showEmpty = !loading && rows.length === 0
  const rootSlot = embedded ? "index-table" : "data-table"

  const hasFilterChrome =
    !embedded &&
    (views != null ||
      onQueryChange != null ||
      (sortOptions != null && sortOptions.length > 0) ||
      (appliedFilters != null && appliedFilters.length > 0) ||
      onAddFilter != null ||
      showDensityToggle ||
      filterActions != null)

  const filterToolbarActions =
    showDensityToggle || filterActions ? (
      <>
        {showDensityToggle ? (
          <Button
            type="button"
            data-slot="data-table-density-toggle"
            variant="ghost"
            size="icon-sm"
            aria-label={
              density === "condensed"
                ? "Use comfortable row density"
                : "Use condensed row density"
            }
            aria-pressed={density === "condensed"}
            onClick={() =>
              setDensity(density === "condensed" ? "comfortable" : "condensed")
            }
          >
            <Rows3 />
          </Button>
        ) : null}
        {filterActions}
      </>
    ) : null

  const tableSection = (
    <>
      <div
        data-slot={`${rootSlot}-table`}
        className={cn(
          !embedded &&
            frame === "inset" &&
            "overflow-hidden rounded-lg bg-card ring-1 ring-border/50",
        )}
      >
        <Table
          data-slot="data-table-table"
          density={density}
          layout={layout}
          className="text-[13px]"
        >
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader
            data-slot={`${rootSlot}-header`}
            className="relative bg-muted/35 [&_tr]:border-border/80"
          >
            <TableRow
              data-slot={`${rootSlot}-head-row`}
              className="h-8 hover:bg-transparent"
            >
              {selectable ? (
                <TableHead
                  data-slot={`${rootSlot}-select-all-cell`}
                  className="w-10 pl-3"
                  aria-hidden={showBulk}
                >
                  <span className={cn(showBulk && "invisible")}>
                    <Checkbox
                      data-slot={`${rootSlot}-select-all`}
                      aria-label="Select all"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={(value) => toggleAll(value === true)}
                    />
                  </span>
                </TableHead>
              ) : null}
              {columns.map((column) => {
                const isActive = sort?.key === column.key
                return (
                  <TableHead
                    key={column.key}
                    data-slot={`${rootSlot}-head`}
                    style={
                      column.width != null ? { width: column.width } : undefined
                    }
                    aria-hidden={showBulk}
                    className={cn(
                      "text-xs font-medium text-muted-foreground first:pl-3",
                      alignClass(column.align),
                      showBulk && "[&_*]:invisible",
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        data-slot={`${rootSlot}-sort`}
                        aria-label={`Sort by ${column.key}`}
                        aria-pressed={isActive}
                        onClick={() => handleSort(column.key)}
                        className={cn(
                          "inline-flex items-center gap-1 transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                          column.align === "end" && "ml-auto",
                          isActive && "text-foreground",
                        )}
                      >
                        {column.header}
                        {isActive ? (
                          sort?.direction === "asc" ? (
                            <ChevronUp
                              data-slot={`${rootSlot}-sort-asc`}
                              aria-hidden
                              className="size-3.5"
                            />
                          ) : (
                            <ChevronDown
                              data-slot={`${rootSlot}-sort-desc`}
                              aria-hidden
                              className="size-3.5"
                            />
                          )
                        ) : null}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
            {showBulk ? (
              <TableRow
                data-slot={`${rootSlot}-bulk-row`}
                className="absolute inset-x-0 top-0 z-10 h-8 border-0 hover:bg-transparent"
              >
                <TableHead colSpan={colCount} className="h-8 p-0 align-middle">
                  <div data-slot={`${rootSlot}-bulk`}>
                    <BulkActionBar
                      variant={embedded ? "default" : "index"}
                      selectedCount={selectedIds.length}
                      totalCount={selectable ? rows.length : undefined}
                      actions={bulkActions}
                      onClearSelection={() => onSelectionChange?.([])}
                      selectAllChecked={allSelected}
                      onSelectAllChange={(checked) =>
                        toggleAll(checked === true)
                      }
                      className={cn(
                        embedded
                          ? "h-8 min-h-8 rounded-none border-x-0 border-t-0 py-0"
                          : "rounded-none",
                      )}
                    />
                  </div>
                </TableHead>
              </TableRow>
            ) : null}
          </TableHeader>

          <TableBody data-slot={`${rootSlot}-body`}>
            {loading ? (
              Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  data-slot={`${rootSlot}-skeleton-row`}
                >
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
              <TableRow data-slot={`${rootSlot}-empty-row`}>
                <TableCell colSpan={colCount} className="p-0">
                  {emptyState ?? (
                    <EmptyState
                      icon={Inbox}
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
                    data-slot={`${embedded ? "index-table-row" : "data-table-row"}`}
                    data-state={isSelected ? "selected" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    className={cn(
                      "group/data-table-row border-border/80 bg-card hover:bg-muted/20 data-[state=selected]:bg-brand/5",
                      onRowClick &&
                        "cursor-pointer outline-none focus-visible:bg-muted/30",
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => handleRowKeyDown(event, row)
                        : undefined
                    }
                  >
                    {selectable ? (
                      <TableCell
                        data-slot={`${rootSlot}-select-cell`}
                        className="w-10 pl-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox
                          data-slot={`${rootSlot}-select-row`}
                          aria-label={`Select row ${id}`}
                          checked={isSelected}
                          onCheckedChange={(value) =>
                            toggleRow(id, value === true)
                          }
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        data-slot={`${rootSlot}-cell`}
                        className={cn(
                          "px-2 text-[13px] first:pl-3",
                          alignClass(column.align),
                        )}
                      >
                        {renderCell(row, column, density)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination ? (
        <DataTablePaginationFooter
          pagination={pagination}
          rootSlot={rootSlot}
        />
      ) : null}
    </>
  )

  if (embedded) {
    return (
      <div
        data-slot={rootSlot}
        data-density={density}
        data-frame={frame}
        data-depth={depth}
        className={cn("relative w-full", className)}
      >
        {tableSection}
      </div>
    )
  }

  return (
    <div
      data-slot={rootSlot}
      data-density={density}
      data-frame={frame}
      data-depth={depth}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl text-card-foreground shadow-none",
        frame === "inset"
          ? "edge bg-muted/20 p-1.5 ring-1 ring-border/70"
          : "edge bg-card",
        depth === "none" && "shadow-none",
        depth === "soft" && "depth-soft",
        depth === "raised" && "depth-raised",
        className,
      )}
    >
      {hasFilterChrome ? (
        <div data-slot="data-table-filters">
          <IndexFilters
            views={views}
            view={view}
            onViewChange={onViewChange}
            query={query}
            onQueryChange={onQueryChange}
            searchPlaceholder={searchPlaceholder}
            sortOptions={sortOptions}
            sort={listSort}
            onSortChange={onListSortChange}
            appliedFilters={appliedFilters}
            onAddFilter={onAddFilter}
            actions={filterToolbarActions}
          />
        </div>
      ) : null}

      {tableSection}
    </div>
  )
}

function DataTablePaginationFooter({
  pagination,
  rootSlot,
}: {
  pagination: DataTablePagination
  rootSlot: string
}) {
  if (isOffsetPagination(pagination)) {
    const { page, pageSize, total, onPageChange } = pagination
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)
    const hasPrev = page > 1
    const hasNext = end < total
    return (
      <PaginationFooterShell
        rootSlot={rootSlot}
        rangeLabel={`${start}–${end} of ${total}`}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => onPageChange(page - 1)}
        onNext={() => onPageChange(page + 1)}
      />
    )
  }

  const {
    hasPrev = false,
    hasNext = false,
    onPrev,
    onNext,
    rangeLabel,
  } = pagination
  return (
    <PaginationFooterShell
      rootSlot={rootSlot}
      rangeLabel={rangeLabel}
      hasPrev={hasPrev}
      hasNext={hasNext}
      onPrev={onPrev}
      onNext={onNext}
    />
  )
}

function PaginationFooterShell({
  rootSlot,
  rangeLabel,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  rootSlot: string
  rangeLabel?: React.ReactNode
  hasPrev: boolean
  hasNext: boolean
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <div
      data-slot={`${rootSlot}-pagination`}
      className="flex items-center gap-2 border-t border-border/80 px-3 py-2"
    >
      <div
        data-slot={`${rootSlot}-pagination-controls`}
        className="flex items-center"
      >
        <Button
          data-slot={`${rootSlot}-prev`}
          variant="ghost"
          size="icon-sm"
          disabled={!hasPrev}
          aria-label="Previous page"
          onClick={() => onPrev?.()}
        >
          <ChevronLeft />
        </Button>
        <Button
          data-slot={`${rootSlot}-next`}
          variant="ghost"
          size="icon-sm"
          disabled={!hasNext}
          aria-label="Next page"
          onClick={() => onNext?.()}
        >
          <ChevronRight />
        </Button>
      </div>
      <span
        data-slot={`${rootSlot}-range`}
        className="text-[13px] text-muted-foreground"
      >
        {rangeLabel}
      </span>
    </div>
  )
}

export { DataTable }
export type {
  DataTableColumn,
  DataTableColumnPrimary,
  DataTableProps,
  DataTableSort,
  DataTablePagination,
  DataTableFrame,
  DataTableDepth,
  SortDirection,
}
