"use client";

// Shared Mobbin-style gallery shell — used by both /templates and /layouts.
// A minimal filter bar (Category + Component facets, live client-side filtering,
// removable active pills, count + sort) over a generous preview-first card grid.
// Pure tokens; the per-item "logo" is a seeded GradientAvatar so every card has a
// unique mark without bespoke art.
import * as React from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { FilterPill } from "@/components/ui/filter-pill";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type GalleryItem = {
  slug: string;
  name: string;
  /** Coarse grouping; powers the Category facet + the card's tag. */
  category: string;
  /** Registry items composed; powers the Component facet. */
  uses: string[];
  /** Detail / inspector route. */
  href: string;
  /** Full-bleed preview route rendered (scaled) inside the card iframe. */
  previewSrc: string;
  /** Optional price marker (templates are paid; layouts are free). */
  price?: string;
};

type Sort = "featured" | "az";

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

/** A removable active-filter chip (Mobbin's "Hero ✕"). */
function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-muted pl-3 pr-1.5 text-sm font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="grid size-5 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

export function Gallery({ items, noun }: { items: GalleryItem[]; noun: string }) {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [comps, setComps] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<Sort>("featured");

  const allCategories = React.useMemo(() => uniqueSorted(items.map((i) => i.category)), [items]);
  const allComponents = React.useMemo(() => uniqueSorted(items.flatMap((i) => i.uses)), [items]);

  const filtered = React.useMemo(() => {
    const r = items.filter(
      (i) =>
        (categories.length === 0 || categories.includes(i.category)) &&
        (comps.length === 0 || comps.some((c) => i.uses.includes(c))),
    );
    return sort === "az" ? [...r].sort((a, b) => a.name.localeCompare(b.name)) : r;
  }, [items, categories, comps, sort]);

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
    set((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const hasFilters = categories.length > 0 || comps.length > 0;
  const clearAll = () => {
    setCategories([]);
    setComps([]);
  };

  return (
    <div>
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
            <ActivePill key={`cat-${c}`} label={c} onRemove={() => toggle(setCategories, c)} />
          ))}
          {comps.map((c) => (
            <ActivePill key={`comp-${c}`} label={c} onRemove={() => toggle(setComps, c)} />
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
            Showing <span className="tabular-nums text-foreground">{filtered.length}</span>{" "}
            {noun}
            {filtered.length === 1 ? "" : "s"}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<FilterPill>{sort === "featured" ? "Featured" : "A–Z"}</FilterPill>}
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
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
        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex flex-col gap-3 rounded-2xl outline-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-background shadow-card transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
                <iframe
                  src={item.previewSrc}
                  title={`${item.name} preview`}
                  aria-hidden
                  tabIndex={-1}
                  loading="lazy"
                  className="pointer-events-none absolute left-0 top-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0"
                />
                {item.price && (
                  <span className="absolute right-2.5 top-2.5 rounded-full border border-border bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-card backdrop-blur">
                    {item.price}
                  </span>
                )}
                {/* Reveal-on-hover affordance — ours, not Mobbin's static thumbnail. */}
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex translate-y-1 items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-card backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  Inspect
                  <ArrowRight className="size-3" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  <GradientAvatar seed={item.name} size="sm" className="rounded-md" />
                  <span className="truncate text-sm font-medium tracking-tight group-hover:text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
