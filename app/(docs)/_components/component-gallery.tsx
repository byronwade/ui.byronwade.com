"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { filterCatalog, type CatalogItem, type CatalogFilter } from "@/content/catalog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { FilterPill } from "@/components/ui/filter-pill";
import { LazyPreview } from "@/app/(docs)/_components/lazy-preview";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

/** A removable active-filter chip. */
function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full edge bg-muted pl-3 pr-1.5 text-sm font-medium">
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

export function ComponentGallery({ items }: { items: CatalogItem[] }) {
  const [query, setQuery] = React.useState("");
  const [groups, setGroups] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<CatalogFilter["sort"]>("featured");

  const allGroups = React.useMemo(() => uniqueSorted(items.map((i) => i.group)), [items]);
  const allTags = React.useMemo(() => uniqueSorted(items.flatMap((i) => i.tags)), [items]);

  const filtered = React.useMemo(
    () => filterCatalog(items, { query, groups, tags, sort }),
    [items, query, groups, tags, sort],
  );

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
    set((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const hasFilters = groups.length > 0 || tags.length > 0 || query.trim() !== "";
  const clearAll = () => {
    setGroups([]);
    setTags([]);
    setQuery("");
  };

  return (
    <div>
      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components, variants, tags…"
          aria-label="Search components"
          className="h-10 w-full rounded-lg edge bg-input pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<FilterPill>Group</FilterPill>} />
            <DropdownMenuContent align="start" className="max-h-72 w-52">
              {allGroups.map((g) => (
                <DropdownMenuCheckboxItem
                  key={g}
                  checked={groups.includes(g)}
                  onCheckedChange={() => toggle(setGroups, g)}
                  closeOnClick={false}
                >
                  {g}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {allTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<FilterPill>Tag</FilterPill>} />
              <DropdownMenuContent align="start" className="max-h-72 w-52">
                {allTags.map((t) => (
                  <DropdownMenuCheckboxItem
                    key={t}
                    checked={tags.includes(t)}
                    onCheckedChange={() => toggle(setTags, t)}
                    closeOnClick={false}
                  >
                    {t}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {groups.map((g) => (
            <ActivePill key={`g-${g}`} label={g} onRemove={() => toggle(setGroups, g)} />
          ))}
          {tags.map((t) => (
            <ActivePill key={`t-${t}`} label={t} onRemove={() => toggle(setTags, t)} />
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
            <span className="tabular-nums text-foreground">{filtered.length}</span> component
            {filtered.length === 1 ? "" : "s"}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<FilterPill>{sort === "featured" ? "Featured" : "A–Z"}</FilterPill>}
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => setSort(v as CatalogFilter["sort"])}
              >
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
          <p className="text-sm font-medium">No components match.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 text-sm text-brand underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.href}
                aria-label={item.name}
                className="group flex flex-col gap-3 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <LazyPreview
                  src={`/preview/components/${item.slug}`}
                  title={`${item.name} preview`}
                  placeholder={
                    <div className="grid h-full place-items-center bg-card">
                      <GradientAvatar seed={item.name} size="lg" className="rounded-lg" />
                    </div>
                  }
                  className="aspect-[16/10] rounded-xl edge bg-background transition-all group-hover:-translate-y-0.5 group-hover:shadow-card"
                />
                <div className="flex items-center justify-between gap-3 px-0.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium tracking-tight">{item.name}</span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {item.variantCount} variant{item.variantCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full edge px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {item.group}
                  </span>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-0.5">
                    {item.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
