# AI Component Catalog — Phase 2c-nav: Gallery-first sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the exhaustive component list from the docs sidebar (desktop + mobile) — replacing it with Get Started guides, a "Browse all components" link to the gallery, and a contextual "On this page" variant jump-list — so navigation is gallery-first + ⌘K, not a hundreds-item tree.

**Architecture:** A shared pure helper `docs-nav-data.ts` derives the contextual variant jumps for the current path. Both `SiteNav` (desktop `<aside>`) and `DocsNavDock` (mobile MorphDock) consume it: each renders guides + a single "Browse all components" link + (on a component page with authored variants) an "On this page" section deep-linking to the variant anchors. The exhaustive `categories.map(byCategory)` blocks are removed from both.

**Tech Stack:** TypeScript, Next.js App Router (`usePathname`), Vitest + Testing Library.

**Reference spec:** `docs/superpowers/specs/2026-06-04-ai-component-catalog-design.md` (§5 — "retire the exhaustive sidebar; contextual rail only"). Phases 1, 2a, 2c committed and green.

---

## Pre-flight facts (verified)

- `app/(docs)/_components/site-nav.tsx` (desktop, `"use client"`): `usePathname`; renders a `Group("Get Started", guides)` then `categories.filter(c=>c!=="Foundation").map(cat => Group(cat, byCategory(cat).map(...)))`. Has a local `Group({label,children})` and `item(href,label)` (active when `pathname === href`, brand left-border). Imports `{ categories, byCategory } from "@/content/components"` + `{ guides } from "@/content/guides"`.
- `app/(docs)/_components/docs-nav-dock.tsx` (mobile, `"use client"`): a `MorphDock` whose panel renders `section("Get Started", guides...)` then `categories.map(cat => section(cat, byCategory(cat)...))`. Has local `row(href,label)` + `section(label,children)`. Same imports.
- `getVariants`/`bySlug` are exported from `@/content/components` (pure data, client-safe). `doc.variants` entries are `{ id, name, tags, example, install? }`.
- `guides` (`@/content/guides`) = the Get Started pages (Introduction `/docs`, Philosophy, Installation, Foundation, Theming, Typography, AI rules).
- The catalog gallery section on `/docs` has `id="catalog"` (Phase 2a) — so `/docs#catalog` is a valid jump.
- `categories`/`byCategory` will become unused by these two files; they remain exported from `components.ts` (other code/tests may reference them) — that's fine, do not remove the exports.
- ⚠️ Do NOT modify `content/components.ts` (edited concurrently). `npm run validate` is pre-existingly red on untracked orphan files; verify via `npx vitest run` + filtered `npx tsc`.
- Test mocking pattern for `usePathname`: `vi.mock("next/navigation", () => ({ usePathname: vi.fn() }))`, then `vi.mocked(usePathname).mockReturnValue("/docs/button")` per test.

---

## File map

| File                                                 | Responsibility                                                                     | Task |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ---- |
| `app/(docs)/_components/docs-nav-data.ts` (new)      | Pure `variantJumps(pathname)` helper                                               | 1    |
| `tests/app/docs-nav-data.test.ts` (new)              | Unit-test the helper                                                               | 1    |
| `app/(docs)/_components/site-nav.tsx` (rewrite)      | Guides + Browse link + contextual variant jumps; drop exhaustive list              | 2    |
| `tests/app/site-nav.test.tsx` (new)                  | Render: guides, browse link, no exhaustive list, variant jumps on a component path | 2    |
| `app/(docs)/_components/docs-nav-dock.tsx` (rewrite) | Same trim for the mobile dock                                                      | 3    |

---

## Task 1: Shared `variantJumps` helper

**Files:**

- Create: `app/(docs)/_components/docs-nav-data.ts`
- Test: `tests/app/docs-nav-data.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/docs-nav-data.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { variantJumps } from "@/app/(docs)/_components/docs-nav-data"

describe("variantJumps", () => {
  it("returns the authored variants for a component page", () => {
    const r = variantJumps("/docs/button")
    expect(r).not.toBeNull()
    expect(r!.slug).toBe("button")
    expect(r!.jumps.length).toBeGreaterThanOrEqual(18)
    expect(r!.jumps[0]).toHaveProperty("id")
    expect(r!.jumps[0]).toHaveProperty("name")
  })

  it("returns null for the catalog index and guide pages", () => {
    expect(variantJumps("/docs")).toBeNull()
    expect(variantJumps("/docs/installation")).toBeNull()
  })

  it("returns null for a component without authored variants", () => {
    // accordion has examples but no authored `variants`
    expect(variantJumps("/docs/accordion")).toBeNull()
  })

  it("returns null for an unknown slug", () => {
    expect(variantJumps("/docs/not-a-real-component")).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/docs-nav-data.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `app/(docs)/_components/docs-nav-data.ts`**

```ts
import { bySlug } from "@/content/components"

export type VariantJump = { id: string; name: string }

/**
 * Contextual "On this page" jumps for the docs sidebar. Returns the authored
 * variants of the component at `/docs/<slug>` (so they can deep-link to the
 * VariantBrowser anchors), or null on the catalog index, guide pages, unknown
 * slugs, or components without authored variants.
 */
export function variantJumps(
  pathname: string,
): { slug: string; jumps: VariantJump[] } | null {
  const match = pathname.match(/^\/docs\/([^/#?]+)$/)
  if (!match) return null
  const slug = match[1]
  const doc = bySlug(slug)
  if (!doc?.variants?.length) return null
  return { slug, jumps: doc.variants.map((v) => ({ id: v.id, name: v.name })) }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/docs-nav-data.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/docs-nav-data.ts" tests/app/docs-nav-data.test.ts
git commit -m "feat(catalog): add variantJumps helper for contextual docs nav"
```

---

## Task 2: Trim the desktop sidebar (`SiteNav`)

**Files:**

- Rewrite: `app/(docs)/_components/site-nav.tsx`
- Test: `tests/app/site-nav.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/app/site-nav.test.tsx`:

```tsx
import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { usePathname } from "next/navigation"
import { SiteNav } from "@/app/(docs)/_components/site-nav"

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }))

describe("SiteNav", () => {
  beforeEach(() => vi.mocked(usePathname).mockReturnValue("/docs"))

  it("shows Get Started guides and a single Browse-all link, not an exhaustive component list", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "/docs",
    )
    const browse = screen.getByRole("link", { name: /Browse all components/i })
    expect(browse).toHaveAttribute("href", "/docs#catalog")
    // The exhaustive per-component links must be gone (e.g. no direct "Badge" item on the index).
    expect(screen.queryByRole("link", { name: "Badge" })).toBeNull()
  })

  it("shows an 'On this page' variant jump-list on a component page with variants", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/button")
    render(<SiteNav />)
    expect(screen.getByText(/On this page/i)).toBeInTheDocument()
    const ghost = screen.getByRole("link", { name: "Ghost" })
    expect(ghost).toHaveAttribute("href", "/docs/button#ghost")
  })

  it("omits 'On this page' on pages without authored variants", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/accordion")
    render(<SiteNav />)
    expect(screen.queryByText(/On this page/i)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/site-nav.test.tsx`
Expected: FAIL (current SiteNav renders the exhaustive list and no "Browse all components" link / "On this page").

- [ ] **Step 3: Rewrite `app/(docs)/_components/site-nav.tsx`**

```tsx
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { guides } from "@/content/guides"
import { variantJumps } from "@/app/(docs)/_components/docs-nav-data"

/** A section header + its items, grouped under a vertical rail. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-2 text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </div>
      <div className="flex flex-col border-l border-border">{children}</div>
    </div>
  )
}

export function SiteNav() {
  const pathname = usePathname()

  const item = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "-ml-px border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          active
            ? "border-brand text-foreground"
            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        {label}
      </Link>
    )
  }

  const onPage = variantJumps(pathname)

  return (
    <nav className="flex flex-col gap-7">
      <Group label="Get Started">
        {guides.map((g) => item(g.href, g.label))}
      </Group>

      <Group label="Components">
        {item("/docs#catalog", "Browse all components")}
      </Group>

      {onPage && (
        <Group label="On this page">
          {onPage.jumps.map((j) =>
            item(`/docs/${onPage.slug}#${j.id}`, j.name),
          )}
        </Group>
      )}
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/site-nav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/site-nav.tsx" tests/app/site-nav.test.tsx
git commit -m "feat(catalog): trim docs sidebar to guides + browse + contextual variants"
```

---

## Task 3: Trim the mobile dock (`DocsNavDock`)

**Files:**

- Rewrite (the panel body only): `app/(docs)/_components/docs-nav-dock.tsx`
- Test: `tests/app/docs-nav-dock.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/app/docs-nav-dock.test.tsx` (a mount smoke — the dock's nav content lives inside a _closed_ MorphDock panel, so it isn't in the DOM until opened; content correctness is covered by the `variantJumps` unit test + tsc, so this test only proves the dock mounts on both a guide and a component path without crashing):

```tsx
import * as React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { usePathname } from "next/navigation"
import { DocsNavDock } from "@/app/(docs)/_components/docs-nav-dock"

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }))

describe("DocsNavDock", () => {
  it("mounts on the catalog index without crashing", () => {
    vi.mocked(usePathname).mockReturnValue("/docs")
    expect(() => render(<DocsNavDock />)).not.toThrow()
  })

  it("mounts on a component page with authored variants without crashing", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/button")
    const { container } = render(<DocsNavDock />)
    expect(container).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it passes against the current (pre-rewrite) dock**

Run: `npx vitest run tests/app/docs-nav-dock.test.tsx`
Expected: PASS (the current dock mounts). This locks "mounts without crashing" so the rewrite can't regress it; the behavior change (trimmed content) is verified by Task 1's `variantJumps` test + tsc.

- [ ] **Step 3: Rewrite the panel body of `app/(docs)/_components/docs-nav-dock.tsx`**

Change the imports — replace:

```ts
import { categories, byCategory } from "@/content/components"
import { guides } from "@/content/guides"
```

with:

```ts
import { guides } from "@/content/guides"
import { variantJumps } from "@/app/(docs)/_components/docs-nav-data"
```

Inside the component, after `const pathname = usePathname();`, add:

```tsx
const onPage = variantJumps(pathname)
```

Replace the MorphDock panel body (the `<div className="p-1.5">…</div>` that currently maps `categories`) with:

```tsx
<div className="p-1.5">
  {section(
    "Get Started",
    guides.map((g) => row(g.href, g.label)),
  )}
  {section("Components", row("/docs#catalog", "Browse all components"))}
  {onPage &&
    section(
      "On this page",
      onPage.jumps.map((j) => row(`/docs/${onPage.slug}#${j.id}`, j.name)),
    )}
</div>
```

(`section` accepts `ReactNode` children, so passing a single `row(...)` for "Components" is fine. Leave the `row`/`section` helpers and all MorphDock props unchanged.)

- [ ] **Step 4: Run tests + types**

Run: `npx vitest run tests/app/docs-nav-dock.test.tsx`
Expected: PASS.

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "docs-nav-dock|site-nav|docs-nav-data" | grep -v toHaveNoViolations || echo "clean"`
Expected: `clean`.

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/docs-nav-dock.tsx" tests/app/docs-nav-dock.test.tsx
git commit -m "feat(catalog): trim mobile docs dock to guides + browse + contextual variants"
```

---

## Task 4: Verification (Phase 2c-nav exit)

**Files:** none.

- [ ] **Step 1: All app + content tests green**

Run: `npx vitest run tests/app tests/content`
Expected: PASS (Phase 2a/2c/2c-nav app tests + content tests).

- [ ] **Step 2: Phase-2c-nav files type-clean**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "site-nav|docs-nav-dock|docs-nav-data" | grep -v toHaveNoViolations || echo "clean"`
Expected: `clean`.

- [ ] **Step 3: Manual confirmation (recommended)**

If a dev server is available: `npm run dev`. On `/docs`, the left sidebar shows **Get Started** + **Browse all components** (no hundreds-item list); the gallery is the browse surface. On `/docs/button`, the sidebar adds an **On this page** jump-list (Ghost → scrolls to `#ghost`). On mobile (< lg), the hamburger dock mirrors this.

- [ ] **Step 4: Phase 2c-nav exit checklist**

- [ ] `variantJumps` is pure + unit-tested.
- [ ] `SiteNav` shows guides + a single Browse-all link + contextual "On this page" variants; the exhaustive `categories.map` list is gone.
- [ ] `DocsNavDock` mirrors the same structure.
- [ ] New tests green; type-clean; `content/components.ts` NOT modified.

---

## Remaining Phase 2 (roadmap)

- **2b — Thumbnails + windowed grid** for catalog cards.
- **2d — Full migration** of `tags`/`variants` across the other ~118 components (run when `content/components.ts` is not edited concurrently); then index all variants in search + llms.txt, and every type page automatically gains the VariantBrowser + contextual jumps.
