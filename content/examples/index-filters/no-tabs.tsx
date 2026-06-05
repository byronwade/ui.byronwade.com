"use client"

import * as React from "react"
import { IndexFilters } from "@/components/index-filters"

const SORT_OPTIONS = [
  { id: "name", label: "Customer name" },
  { id: "orders", label: "Order count" },
  { id: "spent", label: "Amount spent" },
]

export default function Example() {
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState("name")

  return (
    <IndexFilters
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search customers"
      sortOptions={SORT_OPTIONS}
      sort={sort}
      onSortChange={setSort}
      onAddFilter={() => {}}
    />
  )
}
