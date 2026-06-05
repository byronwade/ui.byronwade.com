# AI Component Catalog — Phase 2c: Variant Browser (detail page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every authored variant individually addressable and browsable on `/docs/[slug]` — each rendered with a stable `#<id>` anchor, tag chips, its preview/code, and a per-variant install, behind an inline search + tag filter (the level-2 variant gallery).

**Architecture:** A new client component `VariantBrowser` owns the filter UI + anchored variant blocks and a pure, unit-tested `filterVariants()`. The `/docs/[slug]` RSC builds a `VariantView[]` (id, name, tags, install, server-rendered `preview`, `code`) by matching each authored `doc.variants` entry to its example demo, and renders `VariantBrowser` **only when variants are authored** — un-authored components keep today's examples section unchanged (no regression). The `#<id>` anchors match the Phase-1 ⌘K search hrefs (`/docs/button#solid`), closing the search→deep-link loop.

**Tech Stack:** TypeScript, Next.js App Router (RSC → client), Base UI dropdowns, Vitest + Testing Library + vitest-axe.

**Reference spec:** `docs/superpowers/specs/2026-06-04-ai-component-catalog-design.md` (§5 subsystem C). Phase 1 + 2a are committed and green.

---

## Pre-flight facts (verified)

- `app/(docs)/docs/[slug]/page.tsx` is an async RSC. It: `bySlug(slug)`; reads `examples[slug]` from `@/content/examples/registry` (each entry `{ name, file, Component }`, `file` is relative to `content/examples/`, e.g. `"button/solid.tsx"`); builds `rendered = demos.map(d => ({ name: d.name, Component: d.Component, code: readFileSync(join(process.cwd(),"content/examples",d.file)).trimEnd() }))`; renders header → Examples (`ExampleTabs` per demo) → Installation (`InstallCommand`) → Props table.
- `getVariants(doc)` returns authored `doc.variants` or one synthetic default. `doc.variants` entries are `{ id, name, tags: string[], example: string, install?: string }` — `example` is the demo base name (e.g. `"solid"` ↔ `content/examples/button/solid.tsx`).
- `ExampleTabs({ title, preview, code })` (client) — preview/code toggle. `CodeBlock({ code, lang? })` (`@/app/(docs)/_components/code-block`).
- Reuse from `@/components/ui/...`: `FilterPill`, `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/`DropdownMenuCheckboxItem` (`closeOnClick={false}`). `cn` from `@/lib/utils`. Mirror the facet idiom in `app/(docs)/_components/component-gallery.tsx` (Phase 2a).
- Design DNA: tokens only (`edge`, `bg-card`, `bg-input`, `bg-muted`, `text-brand`, `text-muted-foreground`, `border-border`, `ring-ring`, `font-mono`), headings `font-normal`/`font-medium` never bold, `scroll-mt-24` for anchor offset under the floating chrome.
- ⚠️ A user edits `content/components.ts` concurrently — **do not modify it**. `npm run validate` is pre-existingly red on untracked orphan `registry/ui/*.tsx`; verify with `npx vitest run` + filtered `npx tsc` instead.
- Passing server-rendered `preview: React.ReactNode` inside an array prop from the RSC to the client `VariantBrowser` is supported (the element is part of the RSC payload).

---

## File map

| File                                               | Responsibility                                                                                                               | Task |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---- |
| `app/(docs)/_components/variant-browser.tsx` (new) | `VariantView`/`VariantFilter` types, pure `filterVariants()`, client `VariantBrowser` (search + tag facet + anchored blocks) | 1    |
| `tests/app/variant-browser.test.tsx` (new)         | filter unit tests + render/filter/anchor/axe                                                                                 | 1    |
| `app/(docs)/docs/[slug]/page.tsx` (modify)         | Build `VariantView[]`; render `VariantBrowser` when variants authored, else keep examples                                    | 2    |

---

## Task 1: `VariantBrowser` component + `filterVariants`

**Files:**

- Create: `app/(docs)/_components/variant-browser.tsx`
- Test: `tests/app/variant-browser.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/app/variant-browser.test.tsx`:

```tsx
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  VariantBrowser,
  filterVariants,
  type VariantView,
} from "@/app/(docs)/_components/variant-browser"

const variants: VariantView[] = [
  {
    id: "solid",
    name: "Solid",
    tags: ["variant:default", "emphasis:high"],
    install: "npx shadcn@latest add @byronwade/button",
    preview: <button>Solid</button>,
    code: "<Button>Save</Button>",
  },
  {
    id: "ghost",
    name: "Ghost",
    tags: ["variant:ghost", "emphasis:low"],
    install: "npx shadcn@latest add @byronwade/button",
    preview: <button>Ghost</button>,
    code: '<Button variant="ghost">Learn</Button>',
  },
  {
    id: "icon",
    name: "Icon only",
    tags: ["shape:icon"],
    install: "npx shadcn@latest add @byronwade/button",
    preview: <button>Icon</button>,
    code: '<Button size="icon" />',
  },
]

describe("filterVariants", () => {
  const base = { query: "", tags: [] }
  it("returns all with no filter", () => {
    expect(filterVariants(variants, base)).toHaveLength(3)
  })
  it("query matches name / id / tags", () => {
    expect(
      filterVariants(variants, { ...base, query: "GHOST" }).map((v) => v.id),
    ).toEqual(["ghost"])
    expect(
      filterVariants(variants, { ...base, query: "shape:icon" }).map(
        (v) => v.id,
      ),
    ).toEqual(["icon"])
  })
  it("tag facet matches any selected tag", () => {
    expect(
      filterVariants(variants, { ...base, tags: ["emphasis:low"] }).map(
        (v) => v.id,
      ),
    ).toEqual(["ghost"])
  })
  it("empty when nothing matches", () => {
    expect(filterVariants(variants, { ...base, query: "zzz" })).toHaveLength(0)
  })
})

describe("VariantBrowser", () => {
  it("renders an anchored block per variant with name, tags, and install", () => {
    const { container } = render(<VariantBrowser variants={variants} />)
    expect(container.querySelector("#solid")).not.toBeNull()
    expect(container.querySelector("#ghost")).not.toBeNull()
    expect(screen.getByText("Solid")).toBeInTheDocument()
    expect(screen.getByText("variant:ghost")).toBeInTheDocument()
    // per-variant install appears (at least once per variant)
    expect(
      screen.getAllByText(/add @byronwade\/button/).length,
    ).toBeGreaterThanOrEqual(3)
  })

  it("free-text search filters the rendered blocks", async () => {
    const user = userEvent.setup()
    const { container } = render(<VariantBrowser variants={variants} />)
    await user.type(
      screen.getByRole("searchbox", { name: /search variants/i }),
      "ghost",
    )
    expect(container.querySelector("#ghost")).not.toBeNull()
    expect(container.querySelector("#solid")).toBeNull()
  })

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup()
    render(<VariantBrowser variants={variants} />)
    await user.type(
      screen.getByRole("searchbox", { name: /search variants/i }),
      "zzz",
    )
    expect(screen.getByText(/No variants match/i)).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(<VariantBrowser variants={variants} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/variant-browser.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `app/(docs)/_components/variant-browser.tsx`**

```tsx
"use client"

import * as React from "react"
import { Search } from "lucide-react"

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
  preview: React.ReactNode
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

export function VariantBrowser({ variants }: { variants: VariantView[] }) {
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
            className="h-9 w-full rounded-lg edge bg-input pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="group/anchor font-mono text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {v.name}
                  <span className="ml-1.5 text-muted-foreground opacity-0 transition-opacity group-hover/anchor:opacity-100">
                    #
                  </span>
                </a>
                <div className="flex flex-wrap gap-1">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ExampleTabs title={v.name} preview={v.preview} code={v.code} />
              <CodeBlock lang="bash" code={v.install} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/variant-browser.test.tsx`
Expected: PASS (filterVariants cases + 4 component tests). If `ExampleTabs`/`CodeBlock` produce duplicate text matches, the asserts use `getAllByText`/`querySelector` which tolerate that.

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/variant-browser.tsx" tests/app/variant-browser.test.tsx
git commit -m "feat(catalog): add VariantBrowser (filterable, anchored variant specimens)"
```

---

## Task 2: Render the VariantBrowser on the detail page

**Files:**

- Modify: `app/(docs)/docs/[slug]/page.tsx`

- [ ] **Step 1: Read the current page**

Read `app/(docs)/docs/[slug]/page.tsx`. Note: it imports `bySlug, components`; reads `examples[slug]`; builds `rendered`; and renders an Examples `<section>` mapping `rendered` to `ExampleTabs`.

- [ ] **Step 2: Add the VariantBrowser import**

The page already imports `{ bySlug, components }` from `@/content/components` and `readFileSync`/`join` (used by the existing `rendered` builder). Add ONE new import line (the builder branches on `doc.variants` directly — no `getVariants` needed):

```ts
import {
  VariantBrowser,
  type VariantView,
} from "@/app/(docs)/_components/variant-browser"
```

- [ ] **Step 3: Build `VariantView[]` and branch the Examples section**

After `const rendered = demos.map(...)` (the existing array), add a base→demo lookup and the authored-variant view builder:

```tsx
const byBase = new Map(
  demos.map((d) => [
    d.file
      .split("/")
      .pop()!
      .replace(/\.tsx$/, ""),
    d,
  ]),
)
const authoredVariants = doc.variants ?? []
const variantViews: VariantView[] = authoredVariants.map((v) => {
  const demo = byBase.get(v.example)
  const Comp = demo?.Component
  return {
    id: v.id,
    name: v.name,
    tags: v.tags,
    install: v.install ?? `npx shadcn@latest add @byronwade/${doc.slug}`,
    preview: Comp ? <Comp /> : null,
    code: demo
      ? readFileSync(
          join(process.cwd(), "content/examples", demo.file),
          "utf8",
        ).trimEnd()
      : "",
  }
})
```

Then, in the JSX, replace the existing Examples `<section>` (the one with `<Label>{rendered.length > 1 ? "Examples" : "Example"}</Label>` and the `rendered.map(...)`) so it branches:

```tsx
{
  variantViews.length > 0 ? (
    <section className="space-y-6">
      <Label>Variants</Label>
      <VariantBrowser variants={variantViews} />
    </section>
  ) : (
    rendered.length > 0 && (
      <section className="space-y-6">
        <Label>{rendered.length > 1 ? "Examples" : "Example"}</Label>
        <div className="space-y-8">
          {rendered.map(({ name, Component, code }) => (
            <ExampleTabs
              key={name}
              title={name}
              preview={<Component />}
              code={code}
            />
          ))}
        </div>
      </section>
    )
  )
}
```

Leave the Installation and Props sections unchanged.

- [ ] **Step 4: Verify types + tests**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "docs/\[slug\]/page\.tsx|variant-browser" | grep -v "toHaveNoViolations" || echo "no type errors in Phase-2c files"`
Expected: `no type errors in Phase-2c files`.

Run: `npx vitest run tests/app/variant-browser.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/docs/[slug]/page.tsx"
git commit -m "feat(catalog): render VariantBrowser on type pages when variants are authored"
```

---

## Task 3: Verification (Phase 2c exit)

**Files:** none.

- [ ] **Step 1: All Phase-2 tests green**

Run: `npx vitest run tests/app tests/content`
Expected: PASS (Phase 2a + 2c app tests + content tests).

- [ ] **Step 2: Phase-2c files type-clean**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "variant-browser|docs/\[slug\]/page\.tsx" | grep -v "toHaveNoViolations" || echo "clean"`
Expected: `clean`.

- [ ] **Step 3: Deep-link loop check (manual, recommended)**

If a dev server is available: `npm run dev`, open `/docs/button`, confirm: a "Variants" section with a search box + Tag filter; each variant has its name, tag chips, a preview/code toggle, and an install line; the URL `/docs/button#ghost` scrolls to the Ghost block; an un-authored component (e.g. `/docs/accordion`) still shows its normal "Examples" section.

- [ ] **Step 4: Phase 2c exit checklist**

- [ ] `filterVariants` is pure + unit-tested; `VariantBrowser` renders anchored, tagged, individually-installable variant blocks behind a search + tag filter, with an empty state, axe-clean.
- [ ] `/docs/[slug]` renders `VariantBrowser` for authored components (button) and the unchanged Examples section otherwise.
- [ ] `#<id>` anchors match the Phase-1 ⌘K search hrefs (`/docs/button#solid`).
- [ ] New tests green; Phase-2c files type-clean; `content/components.ts` NOT modified.

---

## Remaining Phase 2 (roadmap — not this plan)

- **2b — Thumbnails + windowed grid** for the catalog cards.
- **2c-nav — Retire the exhaustive `SiteNav` sidebar** in favor of gallery-first + a light contextual rail (deferred from 2c to keep this plan focused on the variant experience).
- **2d — Full migration** of `tags`/`variants` across the other ~118 components (run when `content/components.ts` is not being edited concurrently), then index all variants in search + llms.txt.

```

```
