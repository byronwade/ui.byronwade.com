# AI Component Catalog — Phase 2b: Lazy card previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give catalog cards real visual previews — a `/preview/components/[slug]` route renders each component's default example, and gallery cards show a **viewport-lazy** iframe of it (only cards scrolled into view boot an iframe), with the GradientAvatar mark as the placeholder. No new dependencies, no build step, no windowing (YAGNI at ~119 cards).

**Architecture:** A new RSC route `app/preview/components/[slug]/page.tsx` renders the component's default example full-bleed (mirroring the existing `app/preview/[slug]` route). A new client `LazyPreview` mounts an `<iframe>` only when its container nears the viewport (IntersectionObserver), and **degrades to just the placeholder when IntersectionObserver is unavailable** (jsdom/SSR). The Phase-2a `ComponentGallery` card becomes preview-first: a `LazyPreview` box on top, metadata below.

**Tech Stack:** TypeScript, Next.js App Router (RSC route + client iframe), IntersectionObserver, Vitest + Testing Library.

**Reference spec:** `docs/superpowers/specs/2026-06-04-ai-component-catalog-design.md` (§5 subsystem E, "hover/lazy preview" variant). Phases 1, 2a, 2c, 2c-nav committed and green.

---

## Pre-flight facts (verified)

- The existing `app/preview/[slug]/page.tsx` renders archetypes/templates full-bleed and is consumed by `app/_components/gallery.tsx` as a scaled iframe: `<div className="aspect-[16/10] overflow-hidden rounded-xl border border-border bg-background">` containing `<iframe className="pointer-events-none absolute left-0 top-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0" loading="lazy" aria-hidden tabIndex={-1} />`. There is **no `app/preview/layout.tsx`** — preview routes use the root layout (same as the existing one; mirror it, do not add a preview layout).
- `examples` from `@/content/examples/registry` is `Record<string, Example[]>` with `Example = { name: string; file: string; Component: ComponentType }`. `file` is like `"button/solid.tsx"`. Every UI/composite has a `default.tsx` (enforced by `check:examples`); some Libraries items (e.g. `utils`) have no example dir → `examples[slug]` is `undefined`.
- `components` from `@/content/components` is the catalog (~119 entries). `getVariants` etc. already exist.
- `tests/setup.ts` does NOT stub `IntersectionObserver` (and intentionally not `ResizeObserver`). So `LazyPreview` must no-op (placeholder only) when `IntersectionObserver` is `undefined`, and its own test must install a stub.
- Phase-2a `ComponentGallery` (`app/(docs)/_components/component-gallery.tsx`) renders each `CatalogItem` as a `<Link href={item.href} aria-label={item.name}>` card with GradientAvatar + name + group chip + description + tag chips + "<n> variant(s)". Its test (`tests/app/component-gallery.test.tsx`) asserts: the Button link href, `"18 variants"`, two `"1 variant"`, search filtering, empty state, axe — it does NOT assert the description text, so the card may be restructured as long as name/group/variant-count/link remain.
- Design DNA: tokens only; `edge`, `bg-background`, `bg-card`, `shadow-card`, `ring-ring`. Reuse the existing scaled-iframe classes verbatim.
- ⚠️ Do NOT modify `content/components.ts` (edited concurrently). `npm run validate` is pre-existingly red on untracked orphans; verify with `npx vitest run` + filtered `npx tsc`.

---

## File map

| File                                                    | Responsibility                                              | Task |
| ------------------------------------------------------- | ----------------------------------------------------------- | ---- |
| `app/preview/components/[slug]/page.tsx` (new)          | RSC: render a component's default example full-bleed        | 1    |
| `tests/app/preview-components.test.ts` (new)            | `generateStaticParams` covers every component               | 1    |
| `app/(docs)/_components/lazy-preview.tsx` (new)         | Client: viewport-lazy iframe with placeholder, IO-degrading | 2    |
| `tests/app/lazy-preview.test.tsx` (new)                 | placeholder-only without IO; mounts iframe on intersection  | 2    |
| `app/(docs)/_components/component-gallery.tsx` (modify) | Preview-first card using `LazyPreview`                      | 3    |

---

## Task 1: `/preview/components/[slug]` route

**Files:**

- Create: `app/preview/components/[slug]/page.tsx`
- Test: `tests/app/preview-components.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/app/preview-components.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { generateStaticParams } from "@/app/preview/components/[slug]/page"

describe("/preview/components/[slug] generateStaticParams", () => {
  it("includes every catalog component slug", async () => {
    const params = await generateStaticParams()
    expect(params).toContainEqual({ slug: "button" })
    expect(params.length).toBeGreaterThan(100)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/preview-components.test.ts`
Expected: FAIL — route module does not exist.

- [ ] **Step 3: Create `app/preview/components/[slug]/page.tsx`**

```tsx
import { components } from "@/content/components"
import { examples } from "@/content/examples/registry"

// Component previews for the catalog gallery cards (scaled inside a lazy iframe).
// Mirrors app/preview/[slug] (archetypes/templates) but renders a component's
// DEFAULT example. Only known component slugs are valid.
export const dynamicParams = false

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }))
}

export default async function ComponentPreview({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const demos = examples[slug] ?? []
  const demo = demos.find((d) => d.file.endsWith("/default.tsx")) ?? demos[0]
  const Component = demo?.Component

  return (
    <div className="grid min-h-dvh place-items-center bg-background p-8">
      {Component ? (
        <Component />
      ) : (
        <span className="font-mono text-sm text-muted-foreground">{slug}</span>
      )}
    </div>
  )
}
```

(If `slug` is not a known component, `dynamicParams = false` + `generateStaticParams` make Next 404 it automatically — no `notFound()` call is needed, so it is intentionally not imported.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/preview-components.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/preview/components/[slug]/page.tsx" tests/app/preview-components.test.ts
git commit -m "feat(catalog): add /preview/components/[slug] route (default example)"
```

---

## Task 2: `LazyPreview` client component

**Files:**

- Create: `app/(docs)/_components/lazy-preview.tsx`
- Test: `tests/app/lazy-preview.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/app/lazy-preview.test.tsx`:

```tsx
import * as React from "react"
import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { LazyPreview } from "@/app/(docs)/_components/lazy-preview"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("LazyPreview", () => {
  it("shows only the placeholder when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined)
    render(
      <LazyPreview
        src="/preview/components/button"
        title="Button preview"
        placeholder={<span>mark</span>}
      />,
    )
    expect(screen.getByText("mark")).toBeInTheDocument()
    expect(document.querySelector("iframe")).toBeNull()
  })

  it("mounts the iframe once the container intersects the viewport", () => {
    let trigger:
      | ((entries: Array<{ isIntersecting: boolean }>) => void)
      | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
          trigger = cb
        }
        observe = observe
        disconnect = disconnect
        unobserve = vi.fn()
        takeRecords = vi.fn()
      },
    )

    render(
      <LazyPreview
        src="/preview/components/button"
        title="Button preview"
        placeholder={<span>mark</span>}
      />,
    )
    expect(document.querySelector("iframe")).toBeNull()
    expect(observe).toHaveBeenCalled()

    act(() => trigger!([{ isIntersecting: true }]))

    const iframe = document.querySelector("iframe")!
    expect(iframe).not.toBeNull()
    expect(iframe.getAttribute("src")).toBe("/preview/components/button")
    expect(iframe.getAttribute("title")).toBe("Button preview")
    expect(disconnect).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/lazy-preview.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `app/(docs)/_components/lazy-preview.tsx`**

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A viewport-lazy preview: renders `placeholder` immediately and mounts a scaled
 * `<iframe src>` only once the container nears the viewport. Degrades to the
 * placeholder alone when IntersectionObserver is unavailable (SSR / jsdom).
 */
export function LazyPreview({
  src,
  title,
  placeholder,
  className,
}: {
  src: string
  title: string
  placeholder?: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    if (show || typeof IntersectionObserver === "undefined") return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {placeholder}
      {show && (
        <iframe
          src={src}
          title={title}
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0 bg-background"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/lazy-preview.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add "app/(docs)/_components/lazy-preview.tsx" tests/app/lazy-preview.test.tsx
git commit -m "feat(catalog): add LazyPreview (viewport-lazy iframe with placeholder)"
```

---

## Task 3: Preview-first gallery cards

**Files:**

- Modify: `app/(docs)/_components/component-gallery.tsx`

- [ ] **Step 1: Add imports**

In `app/(docs)/_components/component-gallery.tsx`, add:

```ts
import { LazyPreview } from "@/app/(docs)/_components/lazy-preview"
```

(`GradientAvatar` is already imported.)

- [ ] **Step 2: Replace the card body with a preview-first layout**

Find the grid's `<li key={item.slug}>` → `<Link …>` card. Replace the Link's INNER content (keep the `<Link href={item.href} aria-label={item.name} className="group …">` wrapper, but you may simplify its className to a column flex without the card padding since the preview is now edge-to-edge) so the card is preview-first:

```tsx
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
        <span className="truncate text-sm font-medium tracking-tight">
          {item.name}
        </span>
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
```

Keep everything else (search, facets, sort, empty state, `filterCatalog`) unchanged. The card still renders the name, the `{variantCount} variant(s)` text, the group chip, and tags — so the existing gallery test stays green (in jsdom, `IntersectionObserver` is undefined, so `LazyPreview` shows only the placeholder — no iframe, no axe issues).

- [ ] **Step 3: Verify tests + types**

Run: `npx vitest run tests/app/component-gallery.test.tsx`
Expected: PASS (the `"18 variants"`, `"1 variant"` ×2, link, search, empty-state, axe assertions all still hold).

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "component-gallery|lazy-preview|preview/components" | grep -v toHaveNoViolations || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add "app/(docs)/_components/component-gallery.tsx"
git commit -m "feat(catalog): preview-first gallery cards via LazyPreview"
```

---

## Task 4: Verification (Phase 2b exit)

**Files:** none.

- [ ] **Step 1: All app + content tests green**

Run: `npx vitest run tests/app tests/content`
Expected: PASS.

- [ ] **Step 2: Phase-2b files type-clean**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "lazy-preview|component-gallery|preview/components" | grep -v toHaveNoViolations || echo "clean"`
Expected: `clean`.

- [ ] **Step 3: Manual confirmation (recommended)**

If a dev server is available: `npm run dev`, open `/docs`. Cards show the GradientAvatar placeholder, and as you scroll, in-view cards swap to a live scaled preview of the component's default example. Opening `/preview/components/button` directly renders the default Button example. Off-screen cards never boot an iframe.

- [ ] **Step 4: Phase 2b exit checklist**

- [ ] `/preview/components/[slug]` renders each component's default example; `generateStaticParams` covers the catalog.
- [ ] `LazyPreview` mounts an iframe only on intersection and degrades to the placeholder without IntersectionObserver.
- [ ] Gallery cards are preview-first; the existing gallery test remains green.
- [ ] New tests green; Phase-2b files type-clean; `content/components.ts` NOT modified.

---

## Remaining Phase 2 (roadmap)

- **2d — Full migration** of `tags`/`variants` across the other ~118 components (run when `content/components.ts` is not edited concurrently). Every migrated component then gains real variant counts on its card, the VariantBrowser on its page, contextual sidebar jumps, and full variant coverage in ⌘K + `llms.txt`.
- **Later** — windowing the catalog grid (only once the catalog reaches thousands), and optional build-time static thumbnails (Playwright) if iframe previews prove too heavy in production.
