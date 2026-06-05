"use client"

import * as React from "react"
import { IndexFilters } from "@/components/index-filters"

export default function Example() {
  const [query, setQuery] = React.useState("")

  return (
    <IndexFilters
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search orders"
    />
  )
}
