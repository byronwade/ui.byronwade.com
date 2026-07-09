"use client"

import * as React from "react"
import { FileText, FolderKanban, Search, SlidersHorizontal, Target, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchFilter = "all" | "issues" | "projects" | "documents"

type SearchResult = {
  id: string
  type: "initiative" | "project" | "issue" | "document"
  title: string
  meta?: string
  breadcrumb?: string
  time?: string
}

type SearchShellProps = {
  query: string
  onQueryChange: (value: string) => void
  filter: SearchFilter
  onFilterChange: (filter: SearchFilter) => void
  results: SearchResult[]
  onClose?: () => void
  className?: string
}

const FILTERS: { id: SearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "issues", label: "Issues" },
  { id: "projects", label: "Projects" },
  { id: "documents", label: "Documents" },
]

function SearchResultIcon({ type }: { type: SearchResult["type"] }) {
  if (type === "project") return <FolderKanban className="size-3.5" />
  if (type === "document") return <FileText className="size-3.5" />
  if (type === "initiative") return <Target className="size-3.5" />
  return (
    <span className="inline-flex size-3.5 items-center justify-center rounded-full border border-border" />
  )
}

function SearchShell({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  results,
  onClose,
  className,
}: SearchShellProps) {
  return (
    <div
      data-slot="linear-search-shell"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search issues, projects, and documents…"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          autoFocus
        />
        {onClose ? (
          <Button variant="ghost" size="icon-sm" aria-label="Close search" onClick={onClose}>
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-slot="linear-search-filter"
              data-active={filter === item.id ? "true" : undefined}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs transition-colors",
                filter === item.id
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
              onClick={() => onFilterChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Filter">
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {results.length === 0 ? (
          <p
            data-slot="linear-search-empty"
            className="px-4 py-16 text-center text-sm text-muted-foreground"
          >
            {query.trim()
              ? `No results found for '${query.trim()}'`
              : "Search issues, projects, and documents…"}
          </p>
        ) : (
          <ul data-slot="linear-search-results">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  data-slot="linear-search-result-row"
                  className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left hover:bg-muted/30"
                >
                  <span className="w-16 shrink-0 text-xs capitalize text-muted-foreground">
                    {result.type === "issue" ? result.id : result.type}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    <SearchResultIcon type={result.type} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {result.breadcrumb ? (
                      <>
                        <span className="text-muted-foreground">
                          {result.breadcrumb}
                        </span>
                        <span className="text-muted-foreground"> › </span>
                      </>
                    ) : null}
                    {result.title}
                  </span>
                  {result.time ? (
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {result.time}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export { SearchShell }
export type { SearchFilter, SearchResult, SearchShellProps }
