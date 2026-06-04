"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { filterCatalog, type CatalogItem, type CatalogFilter } from "@/content/catalog";
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

/** FNV-1a hash → deterministic per-string number for the generative cover. */
function fnv(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const COVER_COLS = 9;
const COVER_ROWS = 6;
// Weighted toward empty → a sparse "constellation". Single accent (brand) so it
// re-skins with --brand; the GradientAvatar carries the per-component color.
const DOT_TONES = ["bg-brand/0", "bg-brand/0", "bg-brand/0", "bg-brand/15", "bg-brand/35", "bg-brand/70"];

/**
 * A generative "fingerprint" cover — a deterministic brand constellation unique
 * to each component, with the seeded GradientAvatar as the focal mark. No live
 * render or iframe: fast, consistent, and distinctive per component.
 */
function CatalogCover({ seed }: { seed: string }) {
  const dots = React.useMemo(
    () =>
      Array.from(
        { length: COVER_COLS * COVER_ROWS },
        (_, i) => DOT_TONES[fnv(`${seed}:${i}`) % DOT_TONES.length],
      ),
    [seed],
  );
  return (
    <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-xl edge bg-card transition-all group-hover:-translate-y-0.5 group-hover:shadow-card">
      <div aria-hidden className="absolute inset-0 grid place-items-center p-7 opacity-80">
        <div
          className="grid w-full max-w-[15rem] gap-2"
          style={{ gridTemplateColumns: `repeat(${COVER_COLS}, minmax(0, 1fr))` }}
        >
          {dots.map((tone, i) => (
            <span key={i} className={cn("aspect-square rounded-full", tone)} />
          ))}
        </div>
      </div>
      <GradientAvatar
        seed={seed}
        size="lg"
        className="relative rounded-2xl shadow-card ring-4 ring-card transition-transform duration-300 group-hover:scale-105"
      />
    </div>
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
                <CatalogCover seed={item.name} />
                <div className="flex items-center justify-between gap-3 px-0.5">
                  <span className="truncate text-sm font-medium tracking-tight group-hover:text-foreground">
                    {item.name}
                  </span>
                  <span className="shrink-0 rounded-full edge px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {item.group}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-0.5">
                  <div className="flex min-w-0 flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {item.variantCount} variant{item.variantCount === 1 ? "" : "s"}
                    {item.depCount > 0 ? ` · ${item.depCount} dep${item.depCount === 1 ? "" : "s"}` : ""}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
