"use client"

import * as React from "react"
import * as Icons from "@/lib/icons"
import type { Icon } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

/**
 * Every icon the system ships, pulled straight from the `@/lib/icons` barrel so
 * the gallery can never drift from what components actually import. Each cell
 * renders in the duotone default; click to copy the component name.
 */
const ENTRIES: { name: string; Glyph: Icon }[] = Object.entries(Icons)
  .filter(
    ([name, value]) =>
      /^[A-Z]/.test(name) &&
      (typeof value === "object" || typeof value === "function"),
  )
  .map(([name, Glyph]) => ({ name, Glyph: Glyph as Icon }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function IconGallery() {
  const [query, setQuery] = React.useState("")
  const [copied, setCopied] = React.useState<string | null>(null)

  const needle = query.trim().toLowerCase()
  const results = needle
    ? ENTRIES.filter((e) => e.name.toLowerCase().includes(needle))
    : ENTRIES

  function copy(name: string) {
    void navigator.clipboard?.writeText(name)
    setCopied(name)
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <Icons.MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            aria-label="Search icons"
            className="pl-8"
          />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {results.length} / {ENTRIES.length}
        </span>
      </div>

      {results.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No icon matches “{query}”.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {results.map(({ name, Glyph }) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => copy(name)}
                title={`Copy “${name}”`}
                className={cn(
                  "flex aspect-square w-full flex-col items-center justify-center gap-2 bg-card p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Glyph className="size-6 text-foreground" aria-hidden />
                <span className="w-full truncate text-center font-mono text-[10px] leading-tight">
                  {copied === name ? "copied" : name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
