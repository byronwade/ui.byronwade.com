"use client"

import { useState } from "react"
import { MagnifyingGlass } from "@/lib/icons"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ALL_ITEMS = [
  "Dashboard",
  "Analytics",
  "Reports",
  "Settings",
  "Team",
  "Billing",
]

export default function Example() {
  const [query, setQuery] = useState("webhooks")

  const results = ALL_ITEMS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-0 bg-background p-8 gap-4">
      <div className="w-full max-w-md">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />
        {results.length === 0 ? (
          <EmptyState
            icon={MagnifyingGlass}
            title={`No results for "${query}"`}
            description="Try adjusting your search or check for typos."
            action={
              <Button size="sm" variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <ul className="rounded-2xl edge divide-y text-sm">
            {results.map((item) => (
              <li key={item} className="px-4 py-3 text-foreground">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
