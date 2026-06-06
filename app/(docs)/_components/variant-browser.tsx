"use client"

import * as React from "react"
import { Search } from "lucide-react"

import type { ComponentDoc, Variant } from "@/content/components"
import type { DemoSurface } from "@/content/demo-contexts"
import { cn } from "@/lib/utils"
import { ExampleTabs } from "@/app/(docs)/_components/example-tabs"
import { CodeBlock } from "@/app/(docs)/_components/code-block"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type VariantView = {
  id: string
  name: string
  tags: string[]
  install: string
  variant: Variant
  code: string
}

export type VariantFilter = { query: string; tags: string[] }

export function filterVariants(
  variants: VariantView[],
  f: VariantFilter,
): VariantView[] {
  const q = f.query.trim().toLowerCase()
  return variants.filter(
    (v) =>
      (q === "" ||
        `${v.name} ${v.id} ${v.tags.join(" ")}`.toLowerCase().includes(q)) &&
      (f.tags.length === 0 || f.tags.some((t) => v.tags.includes(t))),
  )
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

type VariantBrowserProps = {
  slug: string
  defaultSurface: DemoSurface
  demoContext?: ComponentDoc["demoContext"]
  allVariants: Variant[]
  codeByExample: Record<string, string>
  docExamples: string[]
  variants: VariantView[]
}

export function VariantBrowser({
  slug,
  defaultSurface,
  demoContext,
  allVariants,
  codeByExample,
  docExamples,
  variants,
}: VariantBrowserProps) {
  const [query, setQuery] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])

  const allTags = React.useMemo(
    () => uniqueSorted(variants.flatMap((v) => v.tags)),
    [variants],
  )
  const filtered = React.useMemo(
    () => filterVariants(variants, { query, tags }),
    [variants, query, tags],
  )

  const toggleTag = (t: string) =>
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )

  return (
    <div className="space-y-6">
      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search variants…"
            aria-label="Search variants"
            className={cn(
              "h-9 w-full rounded-lg edge bg-input pl-9 pr-3 text-sm outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
        </div>
        <div className="flex items-center gap-3">
          {allTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<FilterPill>Tag</FilterPill>} />
              <DropdownMenuContent align="end" className="max-h-72 w-56">
                {allTags.map((t) => (
                  <DropdownMenuCheckboxItem
                    key={t}
                    checked={tags.includes(t)}
                    onCheckedChange={() => toggleTag(t)}
                    closeOnClick={false}
                  >
                    {t}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {filtered.length}/{variants.length}
          </p>
        </div>
      </div>

      {/* ── Variant blocks ──────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-xl edge py-16 text-center">
          <p className="text-sm font-medium">No variants match.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setTags([])
            }}
            className="mt-2 text-sm text-brand underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {filtered.map((v) => (
            <section key={v.id} id={v.id} className="scroll-mt-24 space-y-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <a
                  href={`#${v.id}`}
                  className="font-mono text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {v.name} <span aria-hidden="true">#</span>
                </a>
                <div className="flex flex-wrap gap-1">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ExampleTabs
                preview={null}
                code={v.code}
                demo={{
                  slug,
                  defaultSurface,
                  demoContext,
                  activeVariant: v.variant,
                  allVariants,
                  codeByExample,
                  docExamples,
                }}
              />
              <CodeBlock lang="bash" code={v.install} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
