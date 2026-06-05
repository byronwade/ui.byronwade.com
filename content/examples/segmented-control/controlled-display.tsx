"use client"

import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"

type SortOption = "popular" | "recent" | "az"

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Popular", value: "popular" },
  { label: "Recent", value: "recent" },
  { label: "A → Z", value: "az" },
]

const items = [
  { name: "Accessibility Guide", date: "2 hours ago", downloads: 4820 },
  { name: "Color System", date: "1 day ago", downloads: 3110 },
  { name: "Typography Scale", date: "3 days ago", downloads: 1890 },
  { name: "Motion Tokens", date: "5 days ago", downloads: 720 },
]

function sortItems(data: typeof items, sort: SortOption) {
  const copy = [...data]
  if (sort === "popular") return copy.sort((a, b) => b.downloads - a.downloads)
  if (sort === "recent") return copy // already in recency order
  if (sort === "az") return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy
}

export default function Example() {
  const [sort, setSort] = useState<SortOption>("popular")
  const sorted = sortItems(items, sort)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Resources</span>
        <SegmentedControl
          options={sortOptions}
          value={sort}
          onValueChange={setSort}
        />
      </div>

      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {sorted.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {item.downloads.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
