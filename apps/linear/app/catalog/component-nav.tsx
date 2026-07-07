"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  CATALOG_COMPONENTS,
  COMPONENT_CATEGORIES,
  type ComponentCategory,
} from "@/lib/component-catalog"
import { cn } from "@/lib/utils"

export function ComponentNav({ className }: { className?: string }) {
  const [query, setQuery] = React.useState("")
  const normalized = query.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    if (!normalized) return CATALOG_COMPONENTS
    return CATALOG_COMPONENTS.filter(
      (item) =>
        item.slug.includes(normalized) ||
        item.name.toLowerCase().includes(normalized) ||
        item.category.includes(normalized),
    )
  }, [normalized])

  const byCategory = React.useMemo(() => {
    const map = new Map<ComponentCategory, typeof CATALOG_COMPONENTS>()
    for (const category of COMPONENT_CATEGORIES) {
      map.set(category.id, [])
    }
    for (const item of filtered) {
      map.get(item.category)?.push(item)
    }
    return map
  }, [filtered])

  return (
    <nav className={cn("space-y-4", className)} aria-label="Component catalog">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter components…"
        className="h-8 text-xs"
      />
      <p className="font-mono text-[10px] text-muted-foreground">
        {filtered.length} / {CATALOG_COMPONENTS.length} components
      </p>
      <div className="space-y-5">
        {COMPONENT_CATEGORIES.map((category) => {
          const items = byCategory.get(category.id) ?? []
          if (items.length === 0) return null
          return (
            <div key={category.id}>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {category.label}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={`#${item.slug}`}
                      className="block rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
