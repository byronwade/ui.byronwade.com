# Demo context toggles — surface × viewport on component docs

**Date:** 2026-06-05  
**Status:** Approved

## Problem

Component docs (`/docs/[slug]`) render a single static preview with no way to inspect how a
component reads in **application vs marketing** composition or at **desktop / tablet / mobile**
widths. Templates and layouts already have viewport toggles; component pages do not. Consumers
and authors need to see the same component in all six contexts without maintaining six separate
doc pages.

## Goals

1. Add **two independent filters** on every component docs page: surface (app | marketing) and
   viewport (desktop | tablet | mobile).
2. **Hybrid resolution:** always apply surface wrapper + inline width constraint; optionally swap
   to authored variant examples tagged by context.
3. **All 227 catalog components** must render in all six contexts on day one via fallback
   resolution — no empty previews.
4. **Inline resize** in the docs DOM (no iframe) — reuse template widths (834 / 390 / full).
5. URL-sync toggles for shareable links: `?surface=app&viewport=mobile`.

## Non-goals (v1)

- Iframe previews (`/preview/components/...`).
- Auto-generating ~1,300 example files (6 × 227).
- Exporting `DemoViewportProvider` to registry consumers.
- System-wide migration of components to container queries.
- Catalog gallery card previews (deferred to Phase 4).

## Decisions

| Question                  | Decision                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| Surface behavior          | Hybrid — wrapper by default + optional tagged example overrides                                      |
| Viewport mechanism        | Inline `max-width` on preview box (not iframe)                                                       |
| Foundation / Libraries    | **Hide toggles** — no meaningful demo surface; show preview only                                     |
| Default viewport          | **Desktop** on first visit; **persist last choice** in `localStorage` (`demo-viewport`)              |
| Default surface           | `getSurface(doc)` from `catalog-surfaces.ts`; persist in `localStorage` (`demo-surface`) per session |
| Responsive CSS limitation | Document honestly; mitigate via `useIsMobile` hook override + phased authored overrides              |

## Technical constraint — viewport breakpoints

Tailwind viewport breakpoints (`sm:`, `md:`, …) and `useIsMobile()` (768px on `window`) respond to
the **browser window**, not a nested preview box. Inline resize therefore:

- **Always works:** physical width, text wrap, overflow, fixed-width examples (`w-[360px]`).
- **Partially works:** `useIsMobile` when preview is wrapped in `DemoViewportProvider` (docs-only).
- **Does not work without overrides:** `md:grid-cols-3` etc. inside a 390px box on a wide monitor.

Mitigation: viewport-tagged example overrides for layout-heavy components; optional future
container-query variants on high-traffic media components.

---

## Architecture

### 1. User-facing controls

Placement: above every preview in `ExampleTabs` and each block in `VariantBrowser`.

```
[ Application | Marketing ]     [ Desktop | Tablet | Mobile ]
```

- Segmented controls (reuse `SegmentedControl`).
- Surface labels match `catalogSurfaces` short labels.
- Viewport widths from templates/layouts:

```ts
const demoViewportWidths = {
  desktop: null,
  tablet: 834,
  mobile: 390,
} as const
```

### 2. `DemoPreviewFrame` (new docs chrome)

Client component at `app/(docs)/_components/demo-preview-frame.tsx`.

Responsibilities:

- Render surface + viewport toggles.
- Sync state ↔ URL search params (`surface`, `viewport`).
- Persist viewport + surface to `localStorage`.
- Wrap preview in surface wrapper + width-constrained box.
- Provide `DemoViewportProvider` to preview subtree.

Structure:

```
DemoPreviewFrame
├── toggle bar (hidden when demoContext.hidden)
├── surface wrapper (skipped when demoContext.skipSurfaceWrapper)
│   └── viewport box (max-width + transition)
│       └── DemoViewportProvider
│           └── {children}
```

**Surface wrappers:**

| Surface     | Wrapper                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `app`       | `data-demo-surface="app"` — `w-full rounded-lg p-6 bg-background` (compact UI lane)                                |
| `marketing` | `data-demo-surface="marketing"` — `data-demo-surface="marketing" w-full rounded-lg p-6 reading-ui reading-measure` |

**Skip surface wrapper** when the component _is_ the surface scaffold. Metadata on `ComponentDoc`:

```ts
demoContext?: {
  /** Do not wrap — example already includes app-shell / marketing-layout / hero. */
  skipSurfaceWrapper?: boolean
  /** Override catalog default surface for toggle initial value. */
  defaultSurface?: "app" | "marketing"
  /** Hide surface/viewport toggles (Foundation, Libraries, utils). */
  hidden?: boolean
}
```

Initial skip list: `app-shell`, `marketing-layout`, `hero-section`, `foundation`, `utils`,
`identity`, and other Foundation/Libraries slugs (`hidden: true`).

### 3. Example resolution — `content/demo-contexts.ts`

```ts
export type DemoSurface = "app" | "marketing"
export type DemoViewport = "desktop" | "tablet" | "mobile"

export type DemoContext = { surface: DemoSurface; viewport: DemoViewport }

export function parseDemoContextParams(searchParams): DemoContext
export function resolveDemoExample(
  doc: ComponentDoc,
  variant: Variant,
  context: DemoContext,
  examples: ExampleEntry[],
): { example: string; fallbackLevel: number }
```

**Tag convention** (extends existing variant `tags`):

```
surface:app | surface:marketing
viewport:desktop | viewport:tablet | viewport:mobile
```

**Fallback chain** (first match wins; always resolves):

1. Tags include requested `surface:X` **and** `viewport:Y`
2. Tags include requested `surface:X` only
3. Tags include requested `viewport:Y` only
4. Synthetic `default` variant (`example: "default"`)
5. First registered example file for slug (safety net)

`fallbackLevel` exposed in dev-only badge (optional) to help authors know when an override is
missing.

Integration: `app/(docs)/docs/[slug]/page.tsx` passes slug + doc metadata; client components
call resolver when toggles change and re-mount the matching `Component`.

### 4. `DemoViewportProvider` + hook override

New files:

- `app/(docs)/_components/demo-viewport-context.tsx` — React context (`DemoViewport`)
- `lib/demo-viewport.ts` — `useDemoViewport()`, `isDemoMobile(viewport)`

Update `lib/use-mobile.ts`:

```ts
const demoViewport = useDemoViewport() // null outside docs preview
if (demoViewport === "mobile") return true
if (demoViewport === "desktop" || demoViewport === "tablet") return false
// … existing window.matchMedia logic
```

Provider only wraps preview subtree inside `DemoPreviewFrame` — zero consumer impact.

### 5. Integration points

| File                                               | Change                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `app/(docs)/_components/demo-preview-frame.tsx`    | **New** — toggles, wrapper, provider, URL + localStorage         |
| `app/(docs)/_components/demo-viewport-context.tsx` | **New** — context + hook                                         |
| `content/demo-contexts.ts`                         | **New** — types, widths, parser, resolver                        |
| `app/(docs)/_components/example-tabs.tsx`          | Wrap preview in `DemoPreviewFrame`; accept `slug`, `demoContext` |
| `app/(docs)/_components/variant-browser.tsx`       | Pass slug + demoContext; frame per variant                       |
| `app/(docs)/docs/[slug]/page.tsx`                  | Pass `doc.slug`, `doc.demoContext`, `getSurface(doc)`            |
| `content/components.ts`                            | Extend `ComponentDoc` with optional `demoContext`                |
| `lib/use-mobile.ts`                                | Read demo viewport context when present                          |
| `tests/content/demo-contexts.test.ts`              | **New** — resolver fallback chain + param parsing                |
| `tests/components/use-mobile.test.tsx`             | Extend — demo context override cases                             |

### 6. Rollout phases

**Phase 1 — Infrastructure (ship first)**

- All files above except CI gate and catalog parity.
- Every component page shows toggles (except `hidden` slugs).
- All six contexts render via fallback chain.
- URL + localStorage persistence.

**Phase 2 — High-value overrides (~30 components)**

Author tagged variants + example files where composition genuinely differs:

- Video: `video-card`, `video-shelf`, `channel-header`, `shorts-player`, `mini-player`
- Media: `hero-section`, `description-box`, album/audio patterns
- Layout: `sidebar` (mobile sheet), `app-shell`, `marketing-layout`
- Commerce: product/collection cards

Example: `content/examples/video-card/marketing-wide.tsx` with tags
`["surface:marketing", "viewport:desktop"]`.

**Phase 3 — CI gate**

`scripts/check-demo-contexts.mjs` + `npm run check:demo-contexts`:

- Every `registry:ui` / `registry:component` slug resolves for all 6 contexts.
- Warn on Video/Media/Commerce slugs using fallback level ≥ 4 for opposite surface (later: fail).

**Phase 4 — Catalog parity (optional)**

Apply same frame to `/catalog` gallery iframe previews or inline card demos.

---

## Testing

| Area                 | Coverage                                                             |
| -------------------- | -------------------------------------------------------------------- |
| `resolveDemoExample` | Unit tests for all fallback levels, tag matching, param parsing      |
| `useIsMobile`        | Demo context returns true for mobile viewport without window resize  |
| Component docs       | Manual: toggle all six contexts on `video-card`, `button`, `sidebar` |
| CI                   | `npm run test:ci` green; Phase 3 adds `check:demo-contexts`          |

No new registry component → no per-component axe test mandate for docs chrome.

---

## Success criteria

- [ ] Every `/docs/[slug]` page (except hidden slugs) has dual toggles.
- [ ] All six `{surface × viewport}` combinations render without error for all 227 components.
- [ ] URL `?surface=marketing&viewport=mobile` restores toggle state on load.
- [ ] `sidebar` preview shows mobile sheet behavior when viewport = mobile (hook override).
- [ ] Phase 2: ≥30 components have authored context overrides where layout differs.
- [ ] Phase 3: `check:demo-contexts` passes in CI.

---

## References

- Existing surface model: `content/catalog-surfaces.ts`
- Template viewport pattern: `app/templates/[slug]/page.tsx` (widths only — we use inline, not iframe)
- Variant tag system: `content/components.ts` (`Variant.tags`)
- Surfaces doc: `app/(docs)/docs/surfaces/page.tsx`
