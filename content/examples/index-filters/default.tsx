"use client"

import * as React from "react"
import { IndexFilters } from "@/components/index-filters"

const VIEWS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
]

const SORT_OPTIONS = [
  { id: "title-asc", label: "Product title A–Z" },
  { id: "title-desc", label: "Product title Z–A" },
  { id: "created", label: "Created date" },
  { id: "updated", label: "Last updated" },
]

export default function Example() {
  const [view, setView] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState("title-asc")
  const [applied, setApplied] = React.useState([
    { key: "status", label: "Status: Active" },
    { key: "vendor", label: "Vendor: Acme" },
  ])

  return (
    <IndexFilters
      views={VIEWS}
      view={view}
      onViewChange={setView}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search products"
      sortOptions={SORT_OPTIONS}
      sort={sort}
      onSortChange={setSort}
      appliedFilters={applied.map((filter) => ({
        ...filter,
        onRemove: () =>
          setApplied((prev) => prev.filter((f) => f.key !== filter.key)),
      }))}
      onAddFilter={() => {}}
    />
  )
}
