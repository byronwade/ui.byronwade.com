"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

type StudioSortKey = "date" | "views" | "comments" | "likes"
type StudioSortDirection = "asc" | "desc"

type StudioVideoSort = {
  key: StudioSortKey
  direction: StudioSortDirection
}

type StudioVideoTableProps = {
  children: React.ReactNode
  /** Controlled select-all state. */
  allSelected?: boolean
  defaultAllSelected?: boolean
  onSelectAllChange?: (next: boolean) => void
  /** Controlled sort — pair with `onSortChange`. */
  sort?: StudioVideoSort
  defaultSort?: StudioVideoSort
  onSortChange?: (next: StudioVideoSort) => void
  className?: string
}

const columns: Array<{ key: StudioSortKey; label: string; className: string }> =
  [
    { key: "date", label: "Date", className: "hidden w-28 md:flex" },
    { key: "views", label: "Views", className: "hidden w-16 justify-end sm:flex" },
    {
      key: "comments",
      label: "Comments",
      className: "hidden w-16 justify-end sm:flex",
    },
    { key: "likes", label: "Likes", className: "hidden w-16 justify-end sm:flex" },
  ]

function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction: StudioSortDirection
}) {
  if (!active) return <ArrowsDownUp className="size-3.5 opacity-50" aria-hidden />
  return direction === "asc" ? (
    <ArrowUp className="size-3.5" aria-hidden />
  ) : (
    <ArrowDown className="size-3.5" aria-hidden />
  )
}

function StudioVideoTable({
  children,
  allSelected,
  defaultAllSelected = false,
  onSelectAllChange,
  sort,
  defaultSort,
  onSortChange,
  className,
}: StudioVideoTableProps) {
  const isSelectControlled = allSelected !== undefined
  const isSortControlled = sort !== undefined

  const [internalSelected, setInternalSelected] = React.useState(
    defaultAllSelected,
  )
  const [internalSort, setInternalSort] = React.useState<
    StudioVideoSort | undefined
  >(defaultSort)

  const selectedOn = isSelectControlled ? allSelected! : internalSelected
  const activeSort = isSortControlled ? sort : internalSort

  function handleSelectAll(value: boolean | "indeterminate") {
    const next = value === true
    if (!isSelectControlled) setInternalSelected(next)
    onSelectAllChange?.(next)
  }

  function handleSort(key: StudioSortKey) {
    const direction: StudioSortDirection =
      activeSort?.key === key && activeSort.direction === "asc" ? "desc" : "asc"
    const next = { key, direction }
    if (!isSortControlled) setInternalSort(next)
    onSortChange?.(next)
  }

  return (
    <div
      data-slot="studio-video-table"
      className={cn("overflow-hidden rounded-2xl edge", className)}
    >
      <div
        data-slot="studio-video-table-header"
        className="flex items-center gap-4 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground"
      >
        <div className="shrink-0">
          <Checkbox
            data-slot="studio-video-table-select-all"
            aria-label="Select all videos"
            checked={selectedOn}
            onCheckedChange={handleSelectAll}
          />
        </div>

        <span className="min-w-0 flex-1">Video</span>

        <span className="hidden w-28 shrink-0 sm:inline">Visibility</span>

        {columns.map((column) => {
          const isActive = activeSort?.key === column.key
          return (
            <button
              key={column.key}
              type="button"
              data-slot="studio-video-table-sort"
              data-active={isActive || undefined}
              aria-label={`Sort by ${column.label}`}
              onClick={() => handleSort(column.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                column.className,
                isActive && "text-brand",
              )}
            >
              {column.label}
              <SortIcon
                active={isActive}
                direction={activeSort?.direction ?? "desc"}
              />
            </button>
          )
        })}

        <span className="hidden w-7 shrink-0 sm:inline" aria-hidden />
      </div>

      <div data-slot="studio-video-table-body">{children}</div>
    </div>
  )
}

export { StudioVideoTable }
export type {
  StudioVideoTableProps,
  StudioVideoSort,
  StudioSortKey,
  StudioSortDirection,
}
