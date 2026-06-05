"use client"

import * as React from "react"
import { Plus, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterPill } from "@/components/ui/filter-pill"
import { SegmentedControl } from "@/components/ui/segmented-control"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface IndexFiltersView {
  id: string
  label: string
}

interface AppliedFilter {
  key: string
  label: string
  onRemove?: () => void
}

interface SortOption {
  id: string
  label: string
}

interface IndexFiltersProps {
  views?: IndexFiltersView[]
  view?: string
  onViewChange?: (view: string) => void
  query?: string
  onQueryChange?: (query: string) => void
  searchPlaceholder?: string
  sortOptions?: SortOption[]
  sort?: string
  onSortChange?: (sort: string) => void
  appliedFilters?: AppliedFilter[]
  onAddFilter?: () => void
  className?: string
}

function IndexFilters({
  views,
  view,
  onViewChange,
  query,
  onQueryChange,
  searchPlaceholder = "Search",
  sortOptions,
  sort,
  onSortChange,
  appliedFilters,
  onAddFilter,
  className,
}: IndexFiltersProps) {
  const hasTabs = views != null && views.length > 0
  const hasSearch = onQueryChange != null
  const hasSort = sortOptions != null && sortOptions.length > 0
  const activeSort = sortOptions?.find((option) => option.id === sort)

  return (
    <div
      data-slot="index-filters"
      className={cn("flex flex-col gap-3", className)}
    >
      {hasTabs ? (
        <div data-slot="index-filters-tabs">
          <SegmentedControl
            options={views.map((v) => ({ label: v.label, value: v.id }))}
            value={view ?? views[0].id}
            onValueChange={(next) => onViewChange?.(next)}
          />
        </div>
      ) : null}

      <div
        data-slot="index-filters-controls"
        className="flex flex-wrap items-center gap-2"
      >
        {hasSearch ? (
          <div
            data-slot="index-filters-search"
            className="relative flex min-w-48 flex-1 items-center"
          >
            <Search
              aria-hidden
              className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={query ?? ""}
              onChange={(event) => onQueryChange!(event.target.value)}
              className="pl-8 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button
                type="button"
                data-slot="index-filters-search-clear"
                aria-label="Clear search"
                onClick={() => onQueryChange!("")}
                className="absolute right-1.5 grid size-5 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        ) : null}

        {hasSort ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              data-slot="index-filters-sort"
              render={<FilterPill>{activeSort?.label ?? "Sort"}</FilterPill>}
            />
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  data-slot="index-filters-sort-option"
                  data-active={option.id === sort}
                  onClick={() => onSortChange?.(option.id)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {onAddFilter != null ? (
          <Button
            type="button"
            data-slot="index-filters-add"
            variant="outline"
            size="sm"
            onClick={onAddFilter}
          >
            <Plus />
            Add filter
          </Button>
        ) : null}
      </div>

      {appliedFilters != null && appliedFilters.length > 0 ? (
        <div
          data-slot="index-filters-applied"
          className="flex flex-wrap items-center gap-2"
        >
          {appliedFilters.map((filter) => (
            <span
              key={filter.key}
              data-slot="index-filters-applied-filter"
              className="inline-flex h-8 items-center gap-1 rounded-full bg-brand/10 pr-1 pl-3 text-sm font-medium text-foreground edge"
            >
              {filter.label}
              <button
                type="button"
                data-slot="index-filters-applied-remove"
                aria-label={`Remove ${filter.label}`}
                onClick={() => filter.onRemove?.()}
                className="grid size-5 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-brand/15 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { IndexFilters }
export type {
  IndexFiltersProps,
  IndexFiltersView,
  AppliedFilter,
  SortOption,
}
