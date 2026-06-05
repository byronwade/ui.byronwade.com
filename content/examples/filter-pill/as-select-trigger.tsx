"use client"

import * as React from "react"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CalendarDays, Tag } from "lucide-react"

const DATE_OPTIONS = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Custom range",
]
const CATEGORY_OPTIONS = [
  "All categories",
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Research",
]

export default function Example() {
  const [dateRange, setDateRange] = React.useState("Last 7 days")
  const [category, setCategory] = React.useState("All categories")

  return (
    <div className="flex flex-wrap items-center gap-2 p-6">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <FilterPill
              icon={<CalendarDays className="size-3.5 text-muted-foreground" />}
            >
              {dateRange}
            </FilterPill>
          }
        />

        <DropdownMenuContent align="start">
          {DATE_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setDateRange(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <FilterPill
              icon={<Tag className="size-3.5 text-muted-foreground" />}
            >
              {category}
            </FilterPill>
          }
        />

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setCategory("All categories")}>
            All categories
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {CATEGORY_OPTIONS.slice(1).map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setCategory(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
