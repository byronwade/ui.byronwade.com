# Aceternity → byronwade/ui adaptations (batch)

**Date:** 2026-06-03
**Status:** Approved (design)

## Summary

Adapt five Aceternity UI components into the byronwade/ui registry as
token-driven, DNA-compliant primitives. Each is credited to **Aceternity UI**
for the original code, concept, and design. A sixth (3D globe) is **deferred**
(heavyweight `three`/r3f/drei deps + WebGL is un-renderable in jsdom, which would
break the repo's global coverage gates).

Source of truth for each: `https://ui.aceternity.com/registry/<name>.json`.

## Scope

Five new `registry:ui` items:

1. **canvas-text** — animated bezier lines clipped to text via canvas compositing.
2. **apple-cards-carousel** — horizontal card carousel with expand-to-modal cards.
3. **floating-dock** — macOS-style magnify-on-hover dock (desktop) + collapsible mobile dock.
4. **world-map** — dotted SVG world map with animated great-circle connection arcs.
5. **pixelated-canvas** — image rendered as interactive distortable dot grid.

Deferred (not in this batch): **3d-globe**.

## Credit

Every adapted file carries a header comment:

```
/**
 * Adapted for byronwade/ui from Aceternity UI.
 * Original code, concept, and design © Aceternity UI — https://ui.aceternity.com
 * Reworked to the byronwade/ui design system (semantic tokens, dark mode, a11y).
 */
```

The registry.json `description` for each item ends with `Adapted from Aceternity UI.`

## New dependencies (approved)

- `motion` — carousel, floating-dock, world-map (animation).
- `dotted-map` — world-map (dotted SVG generation).
- `lucide-react` (already installed) replaces `@tabler/icons-react` in carousel + floating-dock.
- `next/image` is dropped from carousel (only `ImageProps` was used; renders a plain `<img>`).

These are added to the relevant `registry.json` item `dependencies` arrays and to
root `package.json` so tests resolve.

## Design DNA adaptations (the law: tokens only, no raw color)

Common rules applied to all five:

- **No raw color.** Every `#hex` / `bg-white` / `dark:bg-neutral-900` / `text-gray-500`
  becomes a semantic token utility (`bg-background`, `bg-card`, `bg-muted`,
  `text-foreground`, `text-muted-foreground`, `border-border`, `bg-popover`, etc.).
  Dark mode then comes for free from tokens — never branch on a hardcoded color.
- **Accent derives from `--brand`.** Single-accent colors (world-map arcs, pixelated
  tint, floating-dock active) resolve to `--brand`. Multi-color decoration
  (canvas-text default lines) uses the sanctioned `--chart-1…5` ramp.
- **`data-slot` attributes** on each part; **`cn()` + `className` passthrough** preserved.
- **Radius scale** (`rounded-*` from `--radius`) instead of pixel radii.
- **Accessibility:** icon-only buttons get `aria-label`; `role="img"` + `aria-label`
  on canvases preserved; keyboard/`focus-visible:ring-ring` retained.
- **Mobile responsive:** keep/honor the existing responsive breakpoints; carousel and
  floating-dock already branch desktop/mobile — verified and tokenized, not removed.

### Per-component specifics

**canvas-text** (`registry/ui/canvas-text.tsx`)

- Keep the canvas masking technique verbatim (`source-in`/`source-atop`), DPR scaling,
  ResizeObserver font sync, MutationObserver dark-mode re-resolve, `var(--token)` resolution.
- Internal `#000`/`#fff` fills are the _mask mechanism_, NOT styling — leave them.
- Default `colors` → `["var(--chart-1)" … "var(--chart-5)"]`. Default
  `backgroundClassName` → `bg-background`. Initial `bgColor` transient → harmless neutral.
- Props/API unchanged (drop-in vs Aceternity docs).

**apple-cards-carousel** (`registry/ui/apple-cards-carousel.tsx`)

- `@tabler/icons-react` → `lucide-react` (`ArrowLeft`, `ArrowRight`, `X`).
- Drop `next/image`; type `BlurImage` as `React.ImgHTMLAttributes<HTMLImageElement>`
  and drop the leaking `fill`/`blurDataURL` props.
- `JSX.Element[]` → `React.ReactElement[]` (no global JSX namespace under React 19).
- `useOutsideClick` lives in **`registry/lib/use-outside-click.ts`** as its own
  `registry:lib` item (repo has no `hooks/` dir; mirrors `use-chrome-morph`); the
  carousel item lists it under `registryDependencies` as `@byronwade/use-outside-click`;
  import path `@/lib/use-outside-click`. Typed `RefObject<HTMLElement | null>` +
  `(e: MouseEvent | TouchEvent) => void` (no `Function`/`any`).
- Tokenize: `bg-gray-100`→`bg-muted`, `text-gray-500`→`text-muted-foreground`,
  modal `bg-white dark:bg-neutral-900`→`bg-card`, close button `bg-black dark:bg-white`→
  `bg-foreground` with `text-background`, overlay `bg-black/80`→`bg-foreground/80` or
  `bg-background/80 backdrop-blur`, gradient scrims kept (token-based).
- Add `aria-label` to prev/next buttons.

**floating-dock** (`registry/ui/floating-dock.tsx`)

- `IconLayoutNavbarCollapse` → lucide `ChevronUp` (or `LayoutPanelTop`); tokenize all
  `bg-gray-*` / `bg-neutral-*` / `text-neutral-*` → `bg-muted`/`bg-accent`/
  `text-muted-foreground`, tooltip → `bg-popover text-popover-foreground border-border`.
- Magnify springs/transforms unchanged. Add `aria-label` to the mobile toggle button.
- Coexists with `morph-dock` as a separate primitive.

**world-map** (`registry/ui/world-map.tsx`)

- `useTheme()` retained for dotted-map fg/bg; replace literal dot colors with
  token-derived values read at runtime (or keep the documented theme branch but source
  from CSS vars). Container `dark:bg-black bg-white` → `bg-background`.
- Default `lineColor` → `var(--brand)`; gradient stops `white`→`transparent` kept
  (transparent edge fade), mid stops use the brand color. Ping circles use brand.
- Export stays default export (matches Aceternity) — registry target
  `components/ui/world-map.tsx`.

**pixelated-canvas** (`registry/ui/pixelated-canvas.tsx`)

- Default `backgroundColor`/`tintColor` hex → token-resolved values; the per-pixel RGB
  fills are sampled image data (not styling) and stay numeric.
- Keep all distortion modes/objectFit/shape branches; `role="img"` + `aria-label` kept.

## Per-component deliverables (AGENTS.md checklist ×5)

For each component:

1. Source in `registry/ui/<slug>.tsx` (+ `registry/lib/use-outside-click.ts` for carousel).
2. `registry.json` item: `type: registry:ui`, `files`, `dependencies`, `registryDependencies`
   (`@byronwade/utils`; `@byronwade/foundation` where tokens/chart ramp used).
3. Component name added to `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).
4. `content/examples/<slug>/default.tsx`.
5. `tests/components/<slug>.test.tsx` — default render, every variant/prop branch, all
   interactions, axe. Canvas/Image/RAF/matchMedia/ResizeObserver/MutationObserver mocked
   in-test (jsdom has none). Coverage must keep global gates green
   (functions ≥99, lines ≥96, statements ≥95, branches ≥90).
6. `npm run update:registry` then `npm run test:ci` green before commit.

## Testing strategy notes

- **canvas-text / pixelated-canvas:** stub `HTMLCanvasElement.prototype.getContext` →
  a 2D-context spy (with `measureText`, `getImageData`→typed array, `fillRect`, `arc`,
  `bezierCurveTo`, transforms); stub `getBoundingClientRect`, `devicePixelRatio`, RAF
  (invoke callback once so the animation fn executes), and `window.Image` (manually fire
  `onload`). Exercise both `resolveColor`/tint `var()` and non-`var()` paths, every
  `objectFit`/`distortionMode`/`shape`/`grayscale`/`sampleAverage`/`fadeOnLeave` branch.
- **carousel / floating-dock:** `motion` runs in jsdom; stub `matchMedia` and
  `getBoundingClientRect`. Drive open/close, scroll buttons (mock `scrollBy`/`scrollTo`),
  Escape key, outside-click. Assert markup/state/a11y, never animation visuals.
- **world-map:** SVG renders in jsdom; wrap in `ThemeProvider` or stub `useTheme`.
  Assert path/circle counts from `dots`, gradient defs, alt text.

## Ordering

Build in increasing test difficulty so coverage stays green incrementally:
world-map → floating-dock → apple-cards-carousel → canvas-text → pixelated-canvas.
Each is its own commit (source + registry + rule + example + test, `test:ci` green).

## Out of scope

- 3d-globe (deferred).
- Docs site pages for the new components (existing docs generation picks them up; no
  bespoke MDX authored here unless requested).
