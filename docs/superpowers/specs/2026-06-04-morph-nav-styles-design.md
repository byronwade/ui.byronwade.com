# Morph navigation styles — design

**Date:** 2026-06-04
**Status:** Design approved, ready for implementation plan
**Topic:** Add 5 navigation _styles_ (Bar, Sidebar, Tabs, Menubar, Rail) that reuse the existing
morph technique, with the morph engine kept fully agnostic to the visual style.

---

## 1. Problem & framing

`MorphDock` (`registry/ui/morph-dock.tsx`, ~900 lines) is one navigation **style** — a floating
**pill** that blooms a panel. We want the _normal_ navigation form-factors (full-width bar, sidebar,
bottom tabs, menubar, icon rail) as additional morph-driven styles. The morph **technique** must stay
agnostic to the style.

The engine is already agnostic: `useChromeMorph` (`registry/lib/use-chrome-morph.ts`) only animates a
container's `width`/`height`/`border-radius` and cross-fades a resting node (`restRef`) ↔ a panel node
(`panelRef`). It is position-agnostic ("the container's CSS anchoring picks the grow direction; the
hook only sizes"). What is NOT shared today is the _orchestration_ around it — open state, the
ref wiring, Esc + click-away, reduced-motion, the rest/panel cross-fade structure — which `MorphDock`
implements inline. The 5 new styles must not each re-implement that.

---

## 2. Architecture

A shared **agnostic primitive** + thin **style components**:

```
useChromeMorph (existing hook — UNCHANGED)        the sizing engine
      ▲
MorphSurface (NEW — agnostic orchestration)        open state · refs · cross-fade · Esc · click-away
      ▲
MorphBar · MorphSidebar · MorphTabs · MorphMenubar · MorphRail   (NEW — layout + tokens only)
```

- `MorphDock` (the pill) stays as-is — fully-featured, standalone. We do NOT refactor it onto
  `MorphSurface` (out of scope, and it carries features the new styles don't need).
- `MorphSurface` carries **zero visual styling** — placement, sizing, and `className` come from the
  consumer. It is "the morph technique, made reusable."

### `MorphSurface` interface

```tsx
type Placement = "top" | "bottom" | "left" | "right"
type Grow = "height" | "width" | "both"

interface MorphSurfaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Grow direction; sets the container's CSS anchoring so it blooms the right way. */
  placement: Placement
  /** Which axes the box animates. */
  grow: Grow
  /** Resting content (the collapsed nav). Fades out as the panel blooms. */
  collapsed: React.ReactNode
  /** The bloomed panel. Fades in. */
  panel: React.ReactNode
  /** Open-box target in px. Omitted axes auto-measure the panel. */
  size?: { w?: number; h?: number }
  /** Consumer styles the vessel (bg, radius, shadow, border). */
  className?: string
  /** Accessible name for the nav landmark. */
  navLabel?: string
  /** data-slot="morph-surface" on the container. */
}
```

Responsibilities (and ONLY these):

- Render `morphRef` container (the box that morphs) anchored per `placement`, with the consumer's
  `className`; inside it, `restRef` wrapping `collapsed` and `panelRef` wrapping `panel`.
- Drive `useChromeMorph({ morphRef, restRef, panelRef, open, growHeight: grow!=="width", width, height, ... })`.
  Only the **growing** axis/axes use `size` (or measure `panelRef`); the **non-growing** axis holds the
  container's current size. So `grow="height"` (Bar) keeps full width and only animates height;
  `grow="width"` (Sidebar) animates width only; `grow="both"` animates both.
- Close on Esc and on outside click (`useOutsideClick` already exists in the registry).
- Respect reduced motion (the hook already does; nothing extra needed).
- Set `data-slot`, `role="navigation"` + `aria-label={navLabel}`, manage `aria-expanded` on the
  collapsed trigger region.

It does NOT know about items, icons, badges, or any nav semantics — those live in the style
components.

### The 5 style components

Each composes `MorphSurface` with its layout + tokens. All tokens-only, Base UI patterns where
applicable, `data-slot` on parts, `cn()` + `className` passthrough.

| Component      | placement | grow     | Collapsed form                                           | Panel bloom                                                            |
| -------------- | --------- | -------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `MorphBar`     | `top`     | `height` | Full-width top bar: brand + nav items + trailing actions | Blooms a panel **down** beneath the bar (mega-menu / command / search) |
| `MorphSidebar` | `left`    | `width`  | Vertical icon rail (collapsed)                           | Morphs **wider** to the labeled sidebar; items can bloom flyout panels |
| `MorphTabs`    | `bottom`  | `height` | Mobile bottom tab bar                                    | A tab blooms a **sheet up** (height morph from the bottom edge)        |
| `MorphMenubar` | `top`     | `height` | Slim horizontal menubar (File / Edit / View …)           | The active item blooms its dropdown in place                           |
| `MorphRail`    | `right`   | `width`  | Compact icon rail (activity-bar style)                   | Blooms a wide labeled panel to the side                                |

> **Corrected during implementation (Phase 2):** Menubar and Rail were originally sketched as
> `grow="both"`. Tracing the geometry against `MorphSurface`'s `ANCHOR` map showed `both` betrays the
> intended form-factor: `placement="right"` already pins `inset-y-0` (full height), so a Rail must only
> grow **width** (`both` would drop the bottom anchor and make a top-right corner widget); and a
> full-width Menubar must only grow **height** (`both` shrinks the bar to the panel width and clips the
> File/Edit/View row under `overflow-hidden`). Both now match their proven analogs — Rail mirrors
> Sidebar, Menubar mirrors Bar. **Two further constraints, true for every style:** (1) `MorphSurface`'s
> `panelRef` is `absolute inset-0`, so measuring it for the growing axis is circular — each style passes
> an explicit `size` on its growing axis (as `MorphBar` does). (2) Menubar's "dropdown in place" is
> resolved **inside `MorphMenubar`** (a trigger-ref map positions the dropdown via `offsetLeft`), so the
> frozen `MorphSurface` API is not touched.

Common item shape (shared type, per component as needed):

```tsx
type MorphNavItem = {
  id: string
  label: string
  icon?: LucideIcon
  href?: string
  onSelect?: () => void
  active?: boolean
  badge?: React.ReactNode
}
```

---

## 3. Decomposition (build order)

- **Phase 1 — primitive + proving ground:** `MorphSurface` + **`MorphBar`**. Build the primitive and
  one real style, so the `MorphSurface` API is proven (placement/grow/size, cross-fade, Esc/click-away)
  before the other 4 ride on it. Freeze the API at the end of Phase 1.
- **Phase 2 — the rest:** `MorphSidebar`, `MorphTabs`, `MorphMenubar`, `MorphRail` on the frozen
  primitive.

This spec covers the whole feature; Phase 1 is the first implementation plan.

---

## 4. Per-repo conventions (mandatory)

For every new `registry:ui` item (`MorphSurface` + the 5 styles):

1. Source under `registry/ui/<slug>.tsx`; `MorphSurface` registry-depends on `use-chrome-morph`,
   `utils`, `use-outside-click`; styles registry-depend on `morph-surface`.
2. `registry.json` item (type, files, deps, registryDependencies).
3. `content/examples/<slug>/default.tsx` (+ `npm run gen:examples`).
4. `tests/components/<slug>.test.tsx` — default render, every variant/placement/grow + size prop,
   open/close interaction (trigger, Esc, outside-click), and `axe`.
5. List the component name in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).
6. `npm run update:registry` + `npm run test:ci` green before commit.

Design DNA: tokens only (no raw colors), hierarchy from size/tracking not weight, `font-mono` for
data, `data-slot` parts, radius scale, `focus-visible:ring-ring`, dark mode free from tokens.
`MorphSurface` is unstyled chrome; the 5 styles supply token surfaces (`bg-card`/`bg-popover`/
`bg-dock`/`edge`/`shadow-float`).

---

## 5. Testing notes

- `MorphSurface` tests: stub `matchMedia` + `ResizeObserver` (per `tests/components/morph-dock.test.tsx`
  pattern). Assert: collapsed renders; opening sets `aria-expanded`/shows panel; Esc + outside-click
  close; each `placement`/`grow` renders without crashing; `data-slot="morph-surface"` present.
- Style components: cover their item rendering, active state, the morph open/close path, and axe.

---

## 6. Risks & mitigations

| Risk                                                                 | Mitigation                                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `MorphSurface` API guessed wrong → 4 styles built on a bad interface | Phase 1 proves it on `MorphBar` first; freeze before Phase 2                                                       |
| Re-implementing `MorphDock`'s orchestration (drift)                  | `MorphSurface` extracts the _common_ orchestration only; `MorphDock` left untouched                                |
| Morph mechanics coupling to a style                                  | `MorphSurface` stays zero-visual; all style/placement via props — enforced by the table in §2                      |
| jsdom can't measure sizes                                            | Tests stub `matchMedia`/`ResizeObserver` and assert structure/behavior, not pixel sizes (mirrors morph-dock tests) |
