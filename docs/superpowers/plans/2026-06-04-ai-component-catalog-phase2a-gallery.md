# AI Component Catalog — Phase 2a: ComponentGallery catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/docs` editorial catalog index with a faceted, searchable **ComponentGallery** — the "navigation as easy as /templates and /layouts" win — reading the Phase-1 data model without editing it.

**Architecture:** A new pure-data adapter `content/catalog.ts` turns `components` (+ `getVariants`) into `CatalogItem[]` and owns the pure `filterCatalog()` logic (unit-tested, no DOM). A new client component `app/(docs)/_components/component-gallery.tsx` renders the search box + Group/Tag facets + card grid, calling `filterCatalog`. `app/(docs)/docs/page.tsx` swaps its editorial `#catalog` section for the gallery while keeping the editorial masthead. No iframe/thumbnail previews yet (Phase 2b) — cards show identity + group + variant count + tags, so no per-card perf wall.

**Tech Stack:** TypeScript, Next.js App Router (RSC page → client gallery), Base UI dropdowns, Vitest + Testing Library + vitest-axe.

**Reference spec:** `docs/superpowers/specs/2026-06-04-ai-component-catalog-design.md` (§5 subsystem B). **Phase 1 (data model) is committed and green.**

---

## Pre-flight facts (verified)

- `content/components.ts` exports `components: ComponentDoc[]`, `getVariants(doc)`, `bySlug`, `byCategory`, `categories`, and types `ComponentDoc`/`Variant`. It still uses the field name **`category`** (not `group`). A user is editing this file concurrently — **do not modify `content/components.ts`**; only import from it.
- `getVariants(doc)` returns authored `doc.variants` or a single synthetic default; `doc.tags` is the clean type-level facet array (e.g. button → `["interactive","action","form","cta"]`); variant tags are namespaced (`variant:ghost`, `size:sm`, …).
- Reusable primitives (import from `@/components/ui/...`): `GradientAvatar` (`seed`, `size`, `className`), `FilterPill` (children → used as a `DropdownMenuTrigger render={...}`), `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/`DropdownMenuCheckboxItem` (supports `closeOnClick={false}`)/`DropdownMenuRadioGroup`/`DropdownMenuRadioItem`. The existing `app/_components/gallery.tsx` is the established pattern to mirror.
- House utilities/tokens: `edge`, `bg-card`, `shadow-card`, `bg-input`, `bg-muted`, `text-brand`, `ring-ring`, `font-mono`. Tokens only — no raw colors (AGENTS.md Design DNA).
- `app/(docs)/docs/page.tsx` imports `{ categories, byCategory, components }` and renders a `<section id="catalog">` that maps `categories`→`byCategory`. The masthead above it uses `components.length` and `archetypes.length` — keep those.
- Vitest coverage only includes `components/**`; new tests under `tests/content/` and `tests/app/` run but don't affect coverage thresholds. `check-test-coverage.mjs` only requires tests for registry items, so the gallery (an app component) needs no entry there.
- ⚠️ `npm run validate` currently fails on **pre-existing untracked orphan files** (`registry/ui/{color-picker,editor,gantt,kanban,video-player}.tsx` not in `registry.json`) from concurrent work — NOT caused by this plan. Use `npx vitest run` + `npx tsc` filtered to your files for verification; don't expect a green full `validate` while those orphans exist.

---

## File map

| File | Responsibility | Task |
|---|---|---|
| `content/catalog.ts` (new) | `CatalogItem` type, `catalogItems()` adapter, `CatalogFilter` + pure `filterCatalog()` | 1 |
| `tests/content/catalog.test.ts` (new) | Unit-test the adapter + filter logic | 1 |
| `app/(docs)/_components/component-gallery.tsx` (new) | Client gallery: search + Group/Tag facets + card grid | 2 |
| `tests/app/component-gallery.test.tsx` (new) | Render, search-filter, empty-state, axe | 2 |
| `app/(docs)/docs/page.tsx` (modify) | Swap `#catalog` editorial index for `<ComponentGallery>` | 3 |

---

## Task 1: `content/catalog.ts` adapter + filter logic

**Files:**
- Create: `content/catalog.ts`
- Test: `tests/content/catalog.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/content/catalog.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { catalogItems, filterCatalog, type CatalogItem } from "@/content/catalog";
import { components } from "@/content/components";

describe("catalogItems", () => {
  const items = catalogItems();

  it("returns one item per component, sorted A–Z by name", () => {
    expect(items.length).toBe(components.length);
    const names = items.map((i) => i.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("button item carries group, variant count, facet tags, and a searchable haystack", () => {
    const button = items.find((i) => i.slug === "button")!;
    expect(button.group).toBe("Primitives");
    expect(button.variantCount).toBeGreaterThanOrEqual(18);
    expect(button.tags).toContain("interactive");
    expect(button.href).toBe("/docs/button");
    expect(button.search).toContain("ghost"); // sourced from variant tags
    expect(button.search).toBe(button.search.toLowerCase());
  });
});

describe("filterCatalog", () => {
  const items: CatalogItem[] = [
    { slug: "button", name: "Button", group: "Primitives", description: "A button.", tags: ["interactive", "action"], variantCount: 18, href: "/docs/button", search: "button primitives a button interactive action ghost solid" },
    { slug: "card", name: "Card", group: "Primitives", description: "A card.", tags: ["layout"], variantCount: 1, href: "/docs/card", search: "card primitives a card layout" },
    { slug: "alert", name: "Alert", group: "Feedback", description: "An alert.", tags: ["status"], variantCount: 1, href: "/docs/alert", search: "alert feedback an alert status" },
  ];
  const base = { query: "", groups: [], tags: [], sort: "featured" as const };

  it("returns all items with no filters", () => {
    expect(filterCatalog(items, base)).toHaveLength(3);
  });
  it("free-text query matches the haystack (incl. variant tokens)", () => {
    const r = filterCatalog(items, { ...base, query: "GHOST" });
    expect(r.map((i) => i.slug)).toEqual(["button"]);
  });
  it("group facet narrows to matching groups", () => {
    expect(filterCatalog(items, { ...base, groups: ["Feedback"] }).map((i) => i.slug)).toEqual(["alert"]);
  });
  it("tag facet matches any selected tag", () => {
    expect(filterCatalog(items, { ...base, tags: ["layout"] }).map((i) => i.slug)).toEqual(["card"]);
  });
  it("az sort orders by name", () => {
    expect(filterCatalog(items, { ...base, sort: "az" }).map((i) => i.name)).toEqual(["Alert", "Button", "Card"]);
  });
  it("returns empty when nothing matches", () => {
    expect(filterCatalog(items, { ...base, query: "zzz" })).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/catalog.test.ts`
Expected: FAIL — `@/content/catalog` does not exist.

- [ ] **Step 3: Create `content/catalog.ts`**

```ts
import { components, getVariants, type ComponentDoc } from "@/content/components";

export type CatalogItem = {
  slug: string;
  name: string;
  /** Primary group — the component's `category`. */
  group: string;
  description: string;
  /** Clean type-level facet tags (`doc.tags`). */
  tags: string[];
  /** Authored (or synthesized) variant count. */
  variantCount: number;
  href: string;
  /** Precomputed lowercased haystack for free-text search (name, slug, group, description, type tags, variant names + tags). */
  search: string;
};

const toItem = (doc: ComponentDoc): CatalogItem => {
  const variants = getVariants(doc);
  const tags = doc.tags ?? [];
  const variantTokens = variants.flatMap((v) => [v.name, ...v.tags]);
  return {
    slug: doc.slug,
    name: doc.name,
    group: doc.category,
    description: doc.description,
    tags,
    variantCount: variants.length,
    href: `/docs/${doc.slug}`,
    search: [doc.name, doc.slug.replace(/-/g, " "), doc.category, doc.description, ...tags, ...variantTokens]
      .join(" ")
      .toLowerCase(),
  };
};

export const catalogItems = (): CatalogItem[] =>
  components.map(toItem).sort((a, b) => a.name.localeCompare(b.name));

export type CatalogFilter = {
  query: string;
  groups: string[];
  tags: string[];
  sort: "featured" | "az";
};

export function filterCatalog(items: CatalogItem[], f: CatalogFilter): CatalogItem[] {
  const q = f.query.trim().toLowerCase();
  const r = items.filter(
    (i) =>
      (q === "" || i.search.includes(q)) &&
      (f.groups.length === 0 || f.groups.includes(i.group)) &&
      (f.tags.length === 0 || f.tags.some((t) => i.tags.includes(t))),
  );
  return f.sort === "az" ? [...r].sort((a, b) => a.name.localeCompare(b.name)) : r;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/content/catalog.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add content/catalog.ts tests/content/catalog.test.ts
git commit -m "feat(catalog): add catalog adapter + pure filter logic"
```

---

## Task 2: `ComponentGallery` client component

**Files:**
- Create: `app/(docs)/_components/component-gallery.tsx`
- Test: `tests/app/component-gallery.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/app/component-gallery.test.tsx`:

```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ComponentGallery } from "@/app/(docs)/_components/component-gallery";
import type { CatalogItem } from "@/content/catalog";

const items: CatalogItem[] = [
  { slug: "button", name: "Button", group: "Primitives", description: "A button.", tags: ["interactive", "action"], variantCount: 18, href: "/docs/button", search: "button primitives a button interactive action ghost solid" },
  { slug: "card", name: "Card", group: "Primitives", description: "A card.", tags: ["layout"], variantCount: 1, href: "/docs/card", search: "card primitives a card layout" },
  { slug: "alert", name: "Alert", group: "Feedback", description: "An alert.", tags: ["status"], variantCount: 1, href: "/docs/alert", search: "alert feedback an alert status" },
];

describe("ComponentGallery", () => {
  it("renders a linked card per item with group + variant count", () => {
    render(<ComponentGallery items={items} />);
    expect(screen.getByRole("link", { name: /Button/ })).toHaveAttribute("href", "/docs/button");
    expect(screen.getByText("18 variants")).toBeInTheDocument();
    expect(screen.getAllByText("1 variant")).toHaveLength(2);
  });

  it("free-text search filters the grid (matches variant tokens in the haystack)", async () => {
    const user = userEvent.setup();
    render(<ComponentGallery items={items} />);
    await user.type(screen.getByRole("searchbox", { name: /search components/i }), "ghost");
    expect(screen.getByRole("link", { name: /Button/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Card/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Alert/ })).not.toBeInTheDocument();
  });

  it("shows an empty state and clears it", async () => {
    const user = userEvent.setup();
    render(<ComponentGallery items={items} />);
    const box = screen.getByRole("searchbox", { name: /search components/i });
    await user.type(box, "zzzznomatch");
    expect(screen.getByText(/No components match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Clear all filters/i }));
    expect(screen.getByRole("link", { name: /Button/ })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ComponentGallery items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/component-gallery.test.tsx`
Expected: FAIL — the component module does not exist.

- [ ] **Step 3: Create `app/(docs)/_components/component-gallery.tsx`**

```tsx
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
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                className={cn(
                  "group flex h-full flex-col gap-3 rounded-2xl edge bg-card p-4 outline-none transition-all",
                  "hover:-translate-y-0.5 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <GradientAvatar seed={item.name} size="sm" className="rounded-md" />
                    <span className="truncate text-sm font-medium tracking-tight">{item.name}</span>
                  </div>
                  <span className="shrink-0 rounded-full edge px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {item.group}
                  </span>
                </div>
                <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1">
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/component-gallery.test.tsx`
Expected: PASS (4 tests). If the axe test flags the `<input type="search">`, confirm it has its `aria-label` — it does.

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/component-gallery.tsx" tests/app/component-gallery.test.tsx
git commit -m "feat(catalog): add searchable, faceted ComponentGallery"
```

---

## Task 3: Wire the gallery into `/docs`

**Files:**
- Modify: `app/(docs)/docs/page.tsx`

- [ ] **Step 1: Update imports**

In `app/(docs)/docs/page.tsx`, replace the components import line:

```ts
import { categories, byCategory, components } from "@/content/components";
```

with:

```ts
import { components } from "@/content/components";
import { catalogItems } from "@/content/catalog";
import { ComponentGallery } from "@/app/(docs)/_components/component-gallery";
```

(`components` stays — the masthead uses `components.length`. `categories`/`byCategory` are no longer needed once the catalog section is swapped below.)

- [ ] **Step 2: Replace the editorial catalog index with the gallery**

Find the `<section id="catalog" …>` block. Keep the heading row (the `<h2>The catalog</h2>` + the total count). Replace the `<div>` that does `{categories.map((cat) => { … })}` (the editorial index list) with the gallery. The resulting section should read:

```tsx
      {/* ============================ CATALOG INDEX =================== */}
      <section id="catalog" className="scroll-mt-24">
        <div className="flex items-baseline justify-between gap-4 border-b border-foreground/20 pb-3">
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] font-normal tracking-tight text-foreground">
            The catalog
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {components.length} total
          </span>
        </div>

        <div className="mt-8">
          <ComponentGallery items={catalogItems()} />
        </div>
      </section>
```

Leave the masthead, meta+install, principles, install one-liner, and footer nav sections unchanged.

- [ ] **Step 3: Verify the page compiles and renders**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "docs/page\.tsx|component-gallery|content/catalog" || echo "no type errors in Phase-2a files"`
Expected: `no type errors in Phase-2a files`.

Then sanity-render via the existing test runner (no new test needed — Task 2 covers the gallery; this step only confirms the page wires up):
Run: `npx vitest run tests/app/component-gallery.test.tsx tests/content/catalog.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add "app/(docs)/docs/page.tsx"
git commit -m "feat(catalog): replace editorial /docs index with ComponentGallery"
```

---

## Task 4: Verification (Phase 2a exit)

**Files:** none.

- [ ] **Step 1: Run all new tests**

Run: `npx vitest run tests/content/catalog.test.ts tests/app/component-gallery.test.tsx`
Expected: PASS.

- [ ] **Step 2: Confirm no regressions in the broader suite**

Run: `npx vitest run tests/content tests/app`
Expected: PASS (Phase-1 content tests + Phase-2a tests).

- [ ] **Step 3: Type-check the Phase-2a files**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "content/catalog|component-gallery|docs/page\.tsx" || echo "clean"`
Expected: `clean`. (The repo has a pre-existing global `tsc` backlog unrelated to this work; only your files must be clean.)

- [ ] **Step 4: Manual confirmation (optional but recommended)**

If a dev server is available: `npm run dev`, open `/docs`, confirm the catalog renders as a searchable card grid, typing "ghost" surfaces Button, the Group/Tag facets filter, and the masthead is unchanged. (Not required to pass — the tests cover the logic.)

- [ ] **Step 5: Phase 2a exit checklist**

- [ ] `content/catalog.ts` adapter + `filterCatalog` exist and are unit-tested.
- [ ] `ComponentGallery` renders search + Group/Tag facets + card grid (identity, group, variant count, tags) with an empty state, and passes axe.
- [ ] `/docs` shows the gallery in place of the editorial index, masthead preserved.
- [ ] New tests green; no new type errors; `content/components.ts` was NOT modified.

---

## Remaining Phase 2 sub-plans (roadmap — not this plan)

- **2b — Static thumbnails + windowed grid:** component preview route, `gen-thumbs` (gitignored output), swap card identity-mark for thumbnails, virtualize the grid for the hundreds/thousands case.
- **2c — Detail page + level-2 variant gallery:** per-variant anchors (`#<id>`) + tag chips + per-variant install on `/docs/[slug]`; the variant-grid view; the contextual rail; simplify/retire the exhaustive `SiteNav` sidebar (gallery-first).
- **2d — Full migration:** author `tags`/`variants` across the other ~118 components (best run when `content/components.ts` is not being edited concurrently). Then index all variants in search + llms.txt.
```
