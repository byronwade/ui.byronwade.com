"use client"

// Shared Mobbin-style gallery shell, used by both /templates and /layouts.
// A minimal filter bar (Category + Component facets, live client-side filtering,
// removable active pills, count + sort) over a generous preview-first card grid.
// Pure tokens; the per-item "logo" is a seeded GradientAvatar so every card has a
// unique mark without bespoke art.
import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"

import {
  surfaceShortLabel,
  type CatalogSurface,
  type SurfaceFilter,
} from "@/content/catalog-surfaces"
import { SurfaceFilterControl } from "@/app/(docs)/_components/surface-filter"
import { ActivePill } from "@/app/_components/gallery-parts"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type GalleryItem = {
  slug: string
  name: string
  /** Coarse grouping; powers the Category facet + the card's tag. */
  category: string
  /** Application vs marketing when the gallery spans both surfaces. */
  surface?: CatalogSurface
  /** Registry items composed; powers the Component facet. */
  uses: string[]
  /** Detail / inspector route. */
  href: string
  /** Full-bleed preview route rendered (scaled) inside the card iframe. */
  previewSrc: string
  /** Optional price marker (templates are paid; layouts are free). */
  price?: string
}

type Sort = "featured" | "az"

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function Gallery({
  items,
  noun,
  initialSurface = "all",
  syncSurfaceQuery = false,
}: {
  items: GalleryItem[]
  noun: string
  initialSurface?: SurfaceFilter
  /** When true, writes ?surface= to the URL (templates/layouts galleries). */
  syncSurfaceQuery?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasSurfaceFacet = items.some((i) => i.surface != null)
  const [categories, setCategories] = React.useState<string[]>([])
  const [comps, setComps] = React.useState<string[]>([])
  const [surface, setSurface] = React.useState<SurfaceFilter>(initialSurface)
  const [sort, setSort] = React.useState<Sort>("featured")

  // Sync the URL-derived prop into state during render (no effect), so a deep
  // link / back-forward nav that changes ?surface= updates the filter.
  const [prevSurface, setPrevSurface] = React.useState(initialSurface)
  if (initialSurface !== prevSurface) {
    setPrevSurface(initialSurface)
    setSurface(initialSurface)
  }

  const setSurfaceFilter = (next: SurfaceFilter) => {
    setSurface(next)
    if (!syncSurfaceQuery) return
    const params = new URLSearchParams(searchParams.toString())
    if (next === "all") params.delete("surface")
    else params.set("surface", next)
    const qs = params.toString()
    const base = window.location.pathname
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false })
  }

  const scopedItems = React.useMemo(() => {
    if (!hasSurfaceFacet || surface === "all") return items
    return items.filter((i) => i.surface === surface)
  }, [hasSurfaceFacet, items, surface])

  const allCategories = React.useMemo(
    () => uniqueSorted(scopedItems.map((i) => i.category)),
    [scopedItems],
  )
  const allComponents = React.useMemo(
    () => uniqueSorted(scopedItems.flatMap((i) => i.uses)),
    [scopedItems],
  )

  const filtered = React.useMemo(() => {
    const base =
      hasSurfaceFacet && surface !== "all"
        ? items.filter((i) => i.surface === surface)
        : items
    const r = base.filter(
      (i) =>
        (categories.length === 0 || categories.includes(i.category)) &&
        (comps.length === 0 || comps.some((c) => i.uses.includes(c))),
    )
    return sort === "az"
      ? [...r].sort((a, b) => a.name.localeCompare(b.name))
      : r
  }, [items, categories, comps, sort, hasSurfaceFacet, surface])

  const toggle = (
    set: React.Dispatch<React.SetStateAction<string[]>>,
    v: string,
  ) =>
    set((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )

  const hasFilters =
    categories.length > 0 || comps.length > 0 || surface !== "all"
  const clearAll = () => {
    setCategories([])
    setComps([])
    if (hasSurfaceFacet) setSurfaceFilter("all")
  }

  const surfaceCountsForGallery = React.useMemo(() => {
    if (!hasSurfaceFacet) return undefined
    return {
      all: items.length,
      app: items.filter((i) => i.surface === "app").length,
      marketing: items.filter((i) => i.surface === "marketing").length,
    } as Partial<Record<SurfaceFilter, number>>
  }, [hasSurfaceFacet, items])

  return (
    <div>
      {hasSurfaceFacet ? (
        <div className="mb-5">
          <SurfaceFilterControl
            value={surface}
            onValueChange={setSurfaceFilter}
            counts={surfaceCountsForGallery}
          />
        </div>
      ) : null}

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<FilterPill>Category</FilterPill>} />
            <DropdownMenuContent align="start" className="w-52">
              {allCategories.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c}
                  checked={categories.includes(c)}
                  onCheckedChange={() => toggle(setCategories, c)}
                  closeOnClick={false}
                >
                  {c}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<FilterPill>Component</FilterPill>} />
            <DropdownMenuContent align="start" className="max-h-72 w-56">
              {allComponents.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c}
                  checked={comps.includes(c)}
                  onCheckedChange={() => toggle(setComps, c)}
                  closeOnClick={false}
                >
                  {c}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {categories.map((c) => (
            <ActivePill
              key={`cat-${c}`}
              label={c}
              onRemove={() => toggle(setCategories, c)}
            />
          ))}
          {comps.map((c) => (
            <ActivePill
              key={`comp-${c}`}
              label={c}
              onRemove={() => toggle(setComps, c)}
            />
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="px-1 text-sm text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-muted-foreground sm:block">
            Showing{" "}
            <span className="tabular-nums text-foreground">
              {filtered.length}
            </span>{" "}
            {noun}
            {filtered.length === 1 ? "" : "s"}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <FilterPill>
                  {sort === "featured" ? "Featured" : "A–Z"}
                </FilterPill>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => setSort(v as Sort)}
              >
                <DropdownMenuRadioItem value="featured">
                  Featured
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="az">A–Z</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <p className="text-sm font-medium">No {noun}s match these filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 text-sm text-brand underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex flex-col gap-3 rounded-2xl outline-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl edge bg-background transition-all group-hover:-translate-y-0.5 group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
                <iframe
                  src={item.previewSrc}
                  title={`${item.name} preview`}
                  aria-hidden
                  tabIndex={-1}
                  loading="lazy"
                  className="pointer-events-none absolute left-0 top-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0"
                />
                {item.price && (
                  <span className="absolute right-2.5 top-2.5 rounded-full edge bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
                    {item.price}
                  </span>
                )}
                {/* Reveal-on-hover affordance, ours, not Mobbin's static thumbnail. */}
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex translate-y-1 items-center gap-1 rounded-full edge bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  Inspect
                  <ArrowRight className="size-3" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  <GradientAvatar
                    seed={item.name}
                    size="sm"
                    className="rounded-md"
                  />
                  <span className="truncate text-sm font-medium tracking-tight group-hover:text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full edge px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item.surface
                    ? surfaceShortLabel(item.surface)
                    : item.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
