"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Search } from "lucide-react"

import type { BrowseItem, BrowseTypeFilter } from "@/content/browse"
import { type SurfaceFilter } from "@/content/catalog-surfaces"
import { SurfaceFilterControl } from "@/app/(docs)/_components/surface-filter"
import { SurfaceBadge } from "@/app/_components/gallery-parts"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Sort = "featured" | "az"

function useDesktopPreview() {
  const [enabled, setEnabled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(min-width: 640px)")
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return enabled
}

/** Component card — a static 4:3 thumbnail (with a seeded sigil fallback). */
function ComponentCard({ item }: { item: BrowseItem }) {
  const [error, setError] = React.useState(false)
  const showThumbnail = item.thumbnailAvailable !== false && !error

  return (
    <Link
      href={item.href}
      aria-label={item.name}
      className="group flex flex-col gap-3 rounded-2xl edge bg-card p-3 outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl edge bg-background">
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/thumbs/${item.slug}.png`}
            alt=""
            loading="lazy"
            onError={() => setError(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <GradientAvatar
              seed={item.name}
              size="lg"
              className="rounded-xl opacity-60"
            />
          </div>
        )}
      </div>
      <div className="flex items-start gap-2.5 px-1">
        <GradientAvatar
          seed={item.name}
          size="sm"
          className="mt-0.5 shrink-0 rounded-md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-medium tracking-tight group-hover:text-foreground">
              {item.name}
            </span>
            {item.variantCount != null && (
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {item.variantCount} variant{item.variantCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <SurfaceBadge surface={item.surface} />
            <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {item.group}
            </span>
          </div>
          {item.description && (
            <p className="mt-1 truncate text-[13px] leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

/** Layout card — a live, scaled preview iframe with an Inspect affordance. */
function LayoutCard({ item }: { item: BrowseItem }) {
  const showLivePreview = useDesktopPreview()

  return (
    <Link
      href={item.href}
      aria-label={item.name}
      className="group flex flex-col gap-3 rounded-2xl outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl edge bg-background transition-all group-hover:-translate-y-0.5 group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <div className="grid size-full place-items-center sm:hidden">
          <GradientAvatar
            seed={item.name}
            size="lg"
            className="rounded-xl opacity-70"
          />
        </div>
        {item.previewSrc && showLivePreview && (
          <iframe
            src={item.previewSrc}
            title={`${item.name} preview`}
            aria-hidden
            tabIndex={-1}
            loading="lazy"
            className="pointer-events-none absolute top-0 left-0 hidden h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0 sm:block"
          />
        )}
        <span className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex translate-y-1 items-center gap-1 rounded-full edge bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Inspect
          <ArrowRight className="size-3" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <GradientAvatar seed={item.name} size="sm" className="rounded-md" />
          <span className="truncate text-sm font-medium tracking-tight group-hover:text-foreground">
            {item.name}
          </span>
        </div>
        <SurfaceBadge surface={item.surface} />
      </div>
    </Link>
  )
}

const TYPE_OPTIONS: { label: string; value: BrowseTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Components", value: "component" },
  { label: "Layouts", value: "layout" },
]

/**
 * The merged Browse grid — components and full-page layouts in one place, with a
 * Type segmented control, the shared Surface filter, free-text search, and sort.
 * `?type=` and `?surface=` stay in the URL so any view is deep-linkable (the old
 * /layouts route redirects to `/catalog?type=layouts`).
 */
export function BrowseGallery({
  items,
  initialType = "all",
  initialSurface = "all",
}: {
  items: BrowseItem[]
  initialType?: BrowseTypeFilter
  initialSurface?: SurfaceFilter
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [type, setType] = React.useState<BrowseTypeFilter>(initialType)
  const [surface, setSurface] = React.useState<SurfaceFilter>(initialSurface)
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<Sort>("featured")

  // Sync the URL-derived props into state during render (no effect), so a deep
  // link / back-forward nav that changes ?type= or ?surface= updates the filters.
  const [prevType, setPrevType] = React.useState(initialType)
  if (initialType !== prevType) {
    setPrevType(initialType)
    setType(initialType)
  }
  const [prevSurface, setPrevSurface] = React.useState(initialSurface)
  if (initialSurface !== prevSurface) {
    setPrevSurface(initialSurface)
    setSurface(initialSurface)
  }

  const syncUrl = (next: {
    type?: BrowseTypeFilter
    surface?: SurfaceFilter
  }) => {
    const params = new URLSearchParams(searchParams.toString())
    const t = next.type ?? type
    const s = next.surface ?? surface
    if (t === "all") params.delete("type")
    else params.set("type", t)
    if (s === "all") params.delete("surface")
    else params.set("surface", s)
    const qs = params.toString()
    router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false })
  }

  const setTypeFilter = (next: BrowseTypeFilter) => {
    setType(next)
    syncUrl({ type: next })
  }
  const setSurfaceFilter = (next: SurfaceFilter) => {
    setSurface(next)
    syncUrl({ surface: next })
  }

  const typeScoped = React.useMemo(
    () => (type === "all" ? items : items.filter((i) => i.kind === type)),
    [items, type],
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const r = typeScoped.filter(
      (i) =>
        (surface === "all" || i.surface === surface) &&
        (q === "" || i.search.includes(q)),
    )
    return sort === "az"
      ? [...r].sort((a, b) => a.name.localeCompare(b.name))
      : r
  }, [typeScoped, surface, query, sort])

  const typeCounts = React.useMemo(
    () => ({
      all: items.length,
      component: items.filter((i) => i.kind === "component").length,
      layout: items.filter((i) => i.kind === "layout").length,
    }),
    [items],
  )

  // Surface counts reflect the current Type scope so the numbers stay honest.
  const surfaceCounts = React.useMemo(
    () => ({
      all: typeScoped.length,
      app: typeScoped.filter((i) => i.surface === "app").length,
      marketing: typeScoped.filter((i) => i.surface === "marketing").length,
    }),
    [typeScoped],
  )

  const clearAll = () => {
    setQuery("")
    setType("all")
    setSurface("all")
    syncUrl({ type: "all", surface: "all" })
  }

  return (
    <div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <SegmentedControl
          options={TYPE_OPTIONS.map((o) => ({
            label: `${o.label} (${typeCounts[o.value]})`,
            value: o.value,
          }))}
          value={type}
          onValueChange={setTypeFilter}
        />
        <SurfaceFilterControl
          value={surface}
          onValueChange={setSurfaceFilter}
          counts={surfaceCounts}
        />
      </div>

      <div className="relative mt-4 mb-4">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components, layouts, tags…"
          aria-label="Search the catalog"
          className="h-10 w-full rounded-lg edge bg-input pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <p className="text-sm text-muted-foreground">
          <span className="tabular-nums text-foreground">
            {filtered.length}
          </span>{" "}
          result{filtered.length === 1 ? "" : "s"}
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

      {filtered.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <p className="text-sm font-medium">Nothing matches these filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 text-sm text-brand underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <li key={`${item.kind}-${item.slug}`}>
              {item.kind === "layout" ? (
                <LayoutCard item={item} />
              ) : (
                <ComponentCard item={item} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
