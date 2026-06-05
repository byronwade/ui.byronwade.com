"use client"

import * as React from "react"
import { IndexFilters } from "@/components/index-filters"

const VIEWS = [
  { id: "all", label: "All" },
  { id: "unfulfilled", label: "Unfulfilled" },
  { id: "open", label: "Open" },
]

export default function Example() {
  const [view, setView] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [applied, setApplied] = React.useState([
    { key: "payment", label: "Payment: Paid" },
    { key: "fulfillment", label: "Fulfillment: Unfulfilled" },
    { key: "tag", label: "Tag: VIP" },
  ])

  return (
    <IndexFilters
      views={VIEWS}
      view={view}
      onViewChange={setView}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search orders"
      appliedFilters={applied.map((filter) => ({
        ...filter,
        onRemove: () =>
          setApplied((prev) => prev.filter((f) => f.key !== filter.key)),
      }))}
      onAddFilter={() => {}}
    />
  )
}
