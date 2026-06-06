# Demo Context Toggles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add surface (app | marketing) and viewport (desktop | tablet | mobile) toggles to every component docs preview, with hybrid example resolution and inline width constraints.

**Architecture:** New `content/demo-contexts.ts` resolves which example file to render from variant tags + fallback chain. `DemoPreviewFrame` wraps all previews with toggles, surface wrapper, width box, and `DemoViewportProvider`. `useIsMobile` reads demo context so sidebar/mobile patterns respond in previews.

**Tech Stack:** Next.js App Router, React context, existing `SegmentedControl`, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-05-demo-context-toggles-design.md`

---

## File map

| File                                               | Responsibility                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `content/demo-contexts.ts`                         | Types, viewport widths, URL/localStorage parsing, example resolver |
| `tests/content/demo-contexts.test.ts`              | Resolver + parser unit tests                                       |
| `app/(docs)/_components/demo-viewport-context.tsx` | React context for active demo viewport                             |
| `lib/demo-viewport.ts`                             | `useDemoViewport()` hook (safe outside provider)                   |
| `lib/use-mobile.ts`                                | Check demo viewport before window media query                      |
| `app/(docs)/_components/demo-preview-frame.tsx`    | Toggles, wrappers, provider, URL sync                              |
| `app/(docs)/_components/example-tabs.tsx`          | Accept slug/demoContext; delegate to frame                         |
| `app/(docs)/_components/variant-browser.tsx`       | Pass metadata to ExampleTabs                                       |
| `app/(docs)/docs/[slug]/page.tsx`                  | Pass doc metadata to client wrappers                               |
| `content/components.ts`                            | `demoContext?` on `ComponentDoc` + skip/hidden slugs               |
| `tests/components/use-mobile.test.tsx`             | Demo context override cases                                        |

---

### Task 1: Demo context types and resolver

**Files:**

- Create: `content/demo-contexts.ts`
- Create: `tests/content/demo-contexts.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/content/demo-contexts.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import {
  demoViewportWidths,
  parseDemoContextParams,
  resolveDemoExample,
  type DemoContext,
} from "@/content/demo-contexts"
import type { ComponentDoc, Variant } from "@/content/components"

const doc = {
  slug: "video-card",
  name: "Video card",
  category: "Video",
  description: "",
  examples: ["default"],
} as ComponentDoc

const variants: Variant[] = [
  { id: "default", name: "Default", tags: [], example: "default" },
  {
    id: "marketing-mobile",
    name: "Marketing mobile",
    tags: ["surface:marketing", "viewport:mobile"],
    example: "marketing-mobile",
  },
  {
    id: "app-only",
    name: "App",
    tags: ["surface:app"],
    example: "app",
  },
]

describe("demoViewportWidths", () => {
  it("matches template gallery widths", () => {
    expect(demoViewportWidths.tablet).toBe(834)
    expect(demoViewportWidths.mobile).toBe(390)
    expect(demoViewportWidths.desktop).toBeNull()
  })
})

describe("parseDemoContextParams", () => {
  it("defaults to app + desktop", () => {
    expect(parseDemoContextParams({})).toEqual({
      surface: "app",
      viewport: "desktop",
    })
  })

  it("parses valid params", () => {
    expect(
      parseDemoContextParams({ surface: "marketing", viewport: "mobile" }),
    ).toEqual({ surface: "marketing", viewport: "mobile" })
  })

  it("ignores invalid values", () => {
    expect(
      parseDemoContextParams({ surface: "bogus", viewport: "tablet" }),
    ).toEqual({ surface: "app", viewport: "tablet" })
  })
})

describe("resolveDemoExample", () => {
  const ctx = (
    surface: DemoContext["surface"],
    viewport: DemoContext["viewport"],
  ) => ({ surface, viewport })

  it("prefers exact surface + viewport match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "mobile"),
      variants,
    )
    expect(r.example).toBe("marketing-mobile")
    expect(r.fallbackLevel).toBe(1)
  })

  it("falls back to surface-only match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("app", "mobile"),
      variants,
    )
    expect(r.example).toBe("app")
    expect(r.fallbackLevel).toBe(2)
  })

  it("falls back to default variant", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "desktop"),
      variants,
    )
    expect(r.example).toBe("default")
    expect(r.fallbackLevel).toBe(4)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- tests/content/demo-contexts.test.ts`  
Expected: FAIL — module `@/content/demo-contexts` not found

- [ ] **Step 3: Implement `content/demo-contexts.ts`**

```ts
import type { ComponentDoc, Variant } from "@/content/components"

export type DemoSurface = "app" | "marketing"
export type DemoViewport = "desktop" | "tablet" | "mobile"

export type DemoContext = {
  surface: DemoSurface
  viewport: DemoViewport
}

export const demoViewportWidths: Record<DemoViewport, number | null> = {
  desktop: null,
  tablet: 834,
  mobile: 390,
}

const SURFACE_TAG = /^surface:(app|marketing)$/
const VIEWPORT_TAG = /^viewport:(desktop|tablet|mobile)$/

export function parseDemoSurface(value: unknown): DemoSurface {
  return value === "marketing" ? "marketing" : "app"
}

export function parseDemoViewport(value: unknown): DemoViewport {
  if (value === "tablet" || value === "mobile") return value
  return "desktop"
}

export function parseDemoContextParams(
  params: Record<string, string | string[] | undefined>,
): DemoContext {
  const surfaceRaw = Array.isArray(params.surface)
    ? params.surface[0]
    : params.surface
  const viewportRaw = Array.isArray(params.viewport)
    ? params.viewport[0]
    : params.viewport
  return {
    surface: parseDemoSurface(surfaceRaw),
    viewport: parseDemoViewport(viewportRaw),
  }
}

export type DemoExampleResolution = {
  example: string
  fallbackLevel: 1 | 2 | 3 | 4 | 5
}

function tagSurface(tags: string[]): DemoSurface | null {
  for (const t of tags) {
    const m = t.match(SURFACE_TAG)
    if (m) return m[1] as DemoSurface
  }
  return null
}

function tagViewport(tags: string[]): DemoViewport | null {
  for (const t of tags) {
    const m = t.match(VIEWPORT_TAG)
    if (m) return m[1] as DemoViewport
  }
  return null
}

function matchesContext(
  variant: Variant,
  ctx: DemoContext,
  level: 1 | 2 | 3,
): boolean {
  const s = tagSurface(variant.tags)
  const v = tagViewport(variant.tags)
  if (level === 1) return s === ctx.surface && v === ctx.viewport
  if (level === 2) return s === ctx.surface && v == null
  return v === ctx.viewport && s == null
}

export function resolveDemoExample(
  doc: ComponentDoc,
  activeVariant: Variant,
  ctx: DemoContext,
  allVariants: Variant[],
): DemoExampleResolution {
  const pool = allVariants.length > 0 ? allVariants : [activeVariant]

  for (const level of [1, 2, 3] as const) {
    const hit = pool.find((v) => matchesContext(v, ctx, level))
    if (hit) return { example: hit.example, fallbackLevel: level }
  }

  if (activeVariant.example) {
    return { example: activeVariant.example, fallbackLevel: 4 }
  }

  const first = doc.examples[0] ?? "default"
  return {
    example:
      first
        .replace(/\.tsx$/, "")
        .split("/")
        .pop() ?? "default",
    fallbackLevel: 5,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- tests/content/demo-contexts.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content/demo-contexts.ts tests/content/demo-contexts.test.ts
git commit -m "feat(docs): add demo context resolver for surface and viewport"
```

---

### Task 2: Demo viewport context + useIsMobile override

**Files:**

- Create: `lib/demo-viewport.ts`
- Create: `app/(docs)/_components/demo-viewport-context.tsx`
- Modify: `lib/use-mobile.ts`
- Modify: `tests/components/use-mobile.test.tsx`

- [ ] **Step 1: Write failing test for demo override**

Add to `tests/components/use-mobile.test.tsx`:

```tsx
import { DemoViewportProvider } from "@/app/(docs)/_components/demo-viewport-context"

it("returns true when demo viewport is mobile regardless of window width", async () => {
  mockMatchMedia(false)
  render(
    <DemoViewportProvider viewport="mobile">
      <Probe />
    </DemoViewportProvider>,
  )
  await waitFor(() => {
    expect(screen.getByTestId("mobile")).toHaveTextContent("mobile")
  })
})

it("returns false when demo viewport is desktop on narrow window", async () => {
  mockMatchMedia(true)
  render(
    <DemoViewportProvider viewport="desktop">
      <Probe />
    </DemoViewportProvider>,
  )
  await waitFor(() => {
    expect(screen.getByTestId("mobile")).toHaveTextContent("desktop")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- tests/components/use-mobile.test.tsx`  
Expected: FAIL — `DemoViewportProvider` not found

- [ ] **Step 3: Implement context + hook override**

Create `lib/demo-viewport.ts`:

```ts
"use client"

import * as React from "react"

import type { DemoViewport } from "@/content/demo-contexts"

const DemoViewportContext = React.createContext<DemoViewport | null>(null)

export function DemoViewportProvider({
  viewport,
  children,
}: {
  viewport: DemoViewport
  children: React.ReactNode
}) {
  return (
    <DemoViewportContext.Provider value={viewport}>
      {children}
    </DemoViewportContext.Provider>
  )
}

export function useDemoViewport(): DemoViewport | null {
  return React.useContext(DemoViewportContext)
}

export function isDemoMobile(viewport: DemoViewport | null): boolean | null {
  if (viewport == null) return null
  return viewport === "mobile"
}
```

Re-export provider from `app/(docs)/_components/demo-viewport-context.tsx` (thin re-export file) OR put provider in demo-viewport.ts — pick one file; prefer `lib/demo-viewport.ts` for hook + `demo-preview-frame` importing provider.

Update `lib/use-mobile.ts`:

```ts
import { isDemoMobile, useDemoViewport } from "@/lib/demo-viewport"

export function useIsMobile() {
  const demoViewport = useDemoViewport()
  const demoMobile = isDemoMobile(demoViewport)
  // ... existing state/effect
  if (demoMobile != null) return demoMobile
  return !!isMobile
}
```

Note: `use-mobile` must remain `"use client"` compatible; `useDemoViewport` returns null outside provider.

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- tests/components/use-mobile.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/demo-viewport.ts lib/use-mobile.ts tests/components/use-mobile.test.tsx
git commit -m "feat(docs): override useIsMobile from demo viewport context"
```

---

### Task 3: DemoPreviewFrame component

**Files:**

- Create: `app/(docs)/_components/demo-preview-frame.tsx`

- [ ] **Step 1: Implement DemoPreviewFrame**

Key behaviors:

- Props: `slug`, `defaultSurface`, `skipSurfaceWrapper?`, `hidden?`, `children` as render prop `(ctx: DemoContext) => ReactNode` OR accept pre-resolved children
- State: `surface`, `viewport` initialized from URL → localStorage → defaults
- `useEffect` sync to `URLSearchParams` via `router.replace` (shallow)
- localStorage keys: `demo-surface`, `demo-viewport`
- When `hidden`, render children only (no toggles, no wrapper)

Surface wrapper classes:

- app: `"w-full rounded-lg border border-border/60 bg-background p-6"`
- marketing: `"w-full rounded-lg border border-border/60 bg-card p-6 reading-ui reading-measure mx-auto"`

Viewport box: `mx-auto w-full transition-[max-width] duration-300` + `style={{ maxWidth: width ? \`${width}px\` : undefined }}`

Wrap children in `<DemoViewportProvider viewport={viewport}>`.

Toggle UI: two `SegmentedControl`s matching templates page labels.

- [ ] **Step 2: Manual smoke test**

Run: `npm run dev` — not required in CI; verify visually after Task 5 wires it.

- [ ] **Step 3: Commit**

```bash
git add app/(docs)/_components/demo-preview-frame.tsx
git commit -m "feat(docs): add DemoPreviewFrame with surface and viewport toggles"
```

---

### Task 4: Wire ExampleTabs

**Files:**

- Modify: `app/(docs)/_components/example-tabs.tsx`

- [ ] **Step 1: Extend ExampleTabs props**

Add optional:

```ts
slug?: string
defaultSurface?: DemoSurface
demoContext?: ComponentDoc["demoContext"]
resolvePreview?: (ctx: DemoContext) => React.ReactNode
```

When `slug` provided, wrap preview pane in `DemoPreviewFrame` and call `resolvePreview(ctx)` inside frame.

When `slug` absent (legacy call sites), render preview unchanged.

- [ ] **Step 2: Commit**

```bash
git add app/(docs)/_components/example-tabs.tsx
git commit -m "feat(docs): wrap ExampleTabs preview in DemoPreviewFrame"
```

---

### Task 5: Wire component docs page + VariantBrowser

**Files:**

- Modify: `app/(docs)/docs/[slug]/page.tsx`
- Modify: `app/(docs)/_components/variant-browser.tsx`
- Modify: `content/components.ts` (demoContext metadata)

- [ ] **Step 1: Add demoContext to ComponentDoc type**

```ts
demoContext?: {
  skipSurfaceWrapper?: boolean
  defaultSurface?: "app" | "marketing"
  hidden?: boolean
}
```

Set on slugs: `foundation`, `utils`, `identity` → `{ hidden: true }`; `app-shell`, `marketing-layout`, `hero-section` → `{ skipSurfaceWrapper: true }`.

- [ ] **Step 2: Update `[slug]/page.tsx`**

Pass to `ExampleTabs` / `VariantBrowser`:

- `slug={doc.slug}`
- `defaultSurface={doc.demoContext?.defaultSurface ?? getSurface(doc)}`
- `demoContext={doc.demoContext}`

Build a client wrapper `DocsExamplePreview` if needed to map `DemoContext` → correct example `Component` via resolver + examples registry.

Resolver usage:

```ts
const allVariants = getVariants(doc)
const resolution = resolveDemoExample(doc, variant, ctx, allVariants)
const demo = byBase.get(resolution.example)
return demo ? <demo.Component /> : null
```

- [ ] **Step 3: Update VariantBrowser**

Pass same props through to `ExampleTabs` for each variant block.

- [ ] **Step 4: Run full test suite**

Run: `npm run test:ci`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(docs)/docs/[slug]/page.tsx app/(docs)/_components/variant-browser.tsx content/components.ts
git commit -m "feat(docs): connect component pages to demo context toggles"
```

---

### Task 6: Verification

- [ ] **Step 1: Manual checklist**

1. `/docs/button` — toggle all six contexts; preview resizes; no runtime errors
2. `/docs/sidebar` — mobile viewport shows sheet behavior (useIsMobile override)
3. `/docs/video-card` — marketing + mobile applies marketing wrapper + 390px width
4. `/docs/foundation` — toggles hidden
5. URL `?surface=marketing&viewport=tablet` restores state on reload

- [ ] **Step 2: Run gates**

Run: `npm run validate && npm run test:ci`  
Expected: PASS

---

## Deferred (Phase 2–4)

- Authored overrides for ~30 high-value components (tagged variants + example files)
- `scripts/check-demo-contexts.mjs` + `npm run check:demo-contexts`
- Catalog gallery parity

See spec for details.

---

## Plan self-review

| Spec requirement                | Task                      |
| ------------------------------- | ------------------------- |
| Dual toggles on docs pages      | Task 3, 4, 5              |
| Hybrid resolver                 | Task 1                    |
| Inline resize widths            | Task 3                    |
| URL sync                        | Task 3                    |
| localStorage persistence        | Task 3                    |
| useIsMobile override            | Task 2                    |
| Hidden for Foundation/Libraries | Task 5 (demoContext)      |
| skipSurfaceWrapper scaffolds    | Task 5                    |
| All 227 components fallback     | Task 1 resolver level 4–5 |
| Tests                           | Task 1, 2, 6              |

No placeholders remain.
