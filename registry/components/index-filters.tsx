"use client"

import * as React from "react"
import { MagnifyingGlass, Plus, X } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterPill } from "@/components/ui/filter-pill"
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
  actions?: React.ReactNode
  className?: string
}

function IndexFilters({
  views,
  view,
  onViewChange,
  query,
  onQueryChange,
  searchPlaceholder = "Search and filter",
  sortOptions,
  sort,
  onSortChange,
  appliedFilters,
  onAddFilter,
  actions,
  className,
}: IndexFiltersProps) {
  const hasTabs = views != null && views.length > 0
  const hasSearch = onQueryChange != null
  const hasSort = sortOptions != null && sortOptions.length > 0
  const activeSort = sortOptions?.find((option) => option.id === sort)
  const activeView = view ?? views?.[0]?.id
  const showBar =
    hasTabs || hasSearch || hasSort || onAddFilter != null || actions != null

  return (
    <div data-slot="index-filters" className={cn("flex flex-col", className)}>
      {showBar ? (
        <div
          data-slot="index-filters-bar"
          className="flex min-h-10 items-stretch border-b border-border"
        >
          {hasTabs ? (
            <div
              data-slot="index-filters-tabs"
              role="tablist"
              aria-label="Saved views"
              className="flex shrink-0 items-end border-r border-border"
            >
              {views.map((item) => {
                const active = item.id === activeView
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    data-slot="index-filters-tab"
                    data-active={active}
                    aria-selected={active}
                    onClick={() => onViewChange?.(item.id)}
                    className={cn(
                      "relative px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active
                        ? "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div
            data-slot="index-filters-controls"
            className="flex min-w-0 flex-1 items-center gap-2 px-2"
          >
            {hasSearch ? (
              <div
                data-slot="index-filters-search"
                className="relative flex min-w-0 flex-1 items-center"
              >
                <MagnifyingGlass
                  aria-hidden
                  className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                />
                <Input
                  type="search"
                  aria-label={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  value={query ?? ""}
                  onChange={(event) => onQueryChange!(event.target.value)}
                  className="h-8 border-0 bg-transparent pl-9 text-[13px] shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                  <button
                    type="button"
                    data-slot="index-filters-search-clear"
                    aria-label="Clear search"
                    onClick={() => onQueryChange!("")}
                    className="absolute right-1 grid size-6 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
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
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 px-2 text-muted-foreground"
                onClick={onAddFilter}
              >
                <Plus />
                Add filter
              </Button>
            ) : null}

            {actions ? (
              <div
                data-slot="index-filters-actions"
                className="ml-auto flex shrink-0 items-center gap-0.5 border-l border-border pl-1"
              >
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {appliedFilters != null && appliedFilters.length > 0 ? (
        <div
          data-slot="index-filters-applied"
          className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2"
        >
          {appliedFilters.map((filter) => (
            <span
              key={filter.key}
              data-slot="index-filters-applied-filter"
              className="inline-flex h-7 items-center gap-1 rounded-lg edge bg-background pr-1 pl-2.5 text-xs text-foreground"
            >
              {filter.label}
              <button
                type="button"
                data-slot="index-filters-applied-remove"
                aria-label={`Remove ${filter.label}`}
                onClick={() => filter.onRemove?.()}
                className="grid size-5 place-items-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-3" />
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
