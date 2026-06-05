# Activity Ring — design spec

**Date:** 2026-06-03
**Status:** Approved (brainstorming) → ready for implementation plan
**Source:** Generalize the ring enhancements built in `~/signalroute/` into the `byronwade/ui` registry.

## Background

The registry ships a `Gauge` (`registry/ui/gauge.tsx`) — a single-value circular score ring
(one number, tone derived from thresholds via `scoreTone`). signalroute consumes that `Gauge`
**unchanged** (its `components/ui/gauge.tsx` is byte-for-byte identical and still used as-is in
its styleguide and call-insights).

The actual "additions" the user referred to live in two bespoke signalroute components:

- `app/(dashboard)/app/numbers/[id]/_components/number-activity-ring.tsx` — a two-segment
  (inbound/outbound) **interactive donut**: mount draw-in animation, `prefers-reduced-motion`,
  hover/pin emphasis, dark tooltip, legend chips, optional drill-down navigation, dynamic
  center figure + verdict.
- `components/dashboard/verification-progress.tsx` — a small `conic-gradient` progress-ring chip
  linking to an onboarding flow.

Decision (confirmed with user): **port everything that generalizes cleanly** — make modest
additions to `Gauge`, and add a new generalized interactive ring component. `VerificationProgress`
is **excluded** (domain-specific onboarding coupling; its conic-gradient technique is inferior to
the SVG approach used here).

## Goals

1. Bring signalroute's ring refinements into the registry as reusable, framework-agnostic,
   Design-DNA-compliant components.
2. Do not regress `Gauge` or its exhaustive existing test suite.
3. Meet the registry's mandatory gates: tests + example for every new item, coverage thresholds
   (statements ≥ 99%, branches ≥ 96%, functions ≥ 100%, lines ≥ 99%).

## Non-goals

- Porting `VerificationProgress` or its conic-gradient technique.
- Coupling either component to `next/navigation` or any router.
- Forcing a mount draw-in into `Gauge` (would require making it a client component and rewriting
  its geometry tests for no real benefit on a single-value gauge).

---

## Deliverable A — `Gauge` enhancements (in place)

The only signalroute refinement that genuinely applies to a single-value score gauge is
reduced-motion. Keep the scope honest and non-breaking.

Changes to `registry/ui/gauge.tsx`:

- Add `motion-reduce:transition-none` to the progress arc's className. **Pure CSS** — `Gauge`
  stays a server component (no `"use client"`, no `matchMedia`, no behavioral test changes).
- Add `role="img"` and an `aria-label` to the wrapper `div`. Default label is
  `` `${Math.round(value)}${label ? ` ${label}` : ""}` ``; expose an optional `aria-label` prop
  (or `label`-derived default) so the gauge announces its value instead of relying on a wrapping
  `role="region"`.

Constraints:

- The existing suite (`tests/components/gauge.test.tsx`, 816 lines) must stay green: still exactly
  2 circles, geometry unchanged, SVG still `aria-hidden`.
- Add ~3 tests: default `aria-label`, overridden `aria-label`, presence of `motion-reduce:transition-none`.

---

## Deliverable B — `activity-ring` (new `registry:ui` component)

A generalized, tokenized port of `NumberActivityRing`. Client component (`"use client"`).

### Public API

```ts
type RingSegment = {
  value: number
  label: string
  tone?: StatusTone // from status-dot; maps to a stroke-<tone> utility
  href?: string // optional drill-down target (rendered/handled by consumer wiring)
}

function ActivityRing(props: {
  segments: RingSegment[] // 2+ segments supported
  size?: number // default 168
  thickness?: number // default 12
  gap?: number // arc gap between segments, default 18
  centerLabel?: string // label shown with the total when idle, default "total"
  formatValue?: (n: number) => string // default: n => n.toLocaleString()
  onSegmentClick?: (segment: RingSegment, index: number) => void
  className?: string
}): JSX.Element
```

Tone defaulting: segments without an explicit `tone` cycle through a deterministic order
(`info` → `neutral` → `success` → `warning` → `danger`) by index, so a 2-segment ring reads as
brand + soft-neutral like the signalroute original.

### Design-DNA / token translation

signalroute used raw CSS vars and `color-mix` inline. Translate to token utilities:

| signalroute                                                                | registry                                                                                                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `var(--brand)` (inbound)                                                   | `stroke-brand` (tone `info`)                                                                                                                                              |
| `color-mix(in oklch, var(--muted-foreground) 45%, var(--card))` (outbound) | `stroke-muted-foreground/40` — **preserves the deliberate "soften neutral so brand stays the accent" refinement** via tone-with-opacity (Design DNA), not full muted-gray |
| other tones                                                                | `stroke-success` / `stroke-warning` / `stroke-destructive` / `stroke-muted-foreground` (same map as `Gauge`)                                                              |
| track                                                                      | `stroke-muted`                                                                                                                                                            |
| dark tooltip                                                               | `bg-foreground text-background shadow-float` (already tokenized)                                                                                                          |
| legend dot color                                                           | reuse `StatusDot` tones (`bg-*` utilities)                                                                                                                                |

`data-slot` attributes on parts: `activity-ring`, `activity-ring-track`, `activity-ring-segment`,
`activity-ring-center`, `activity-ring-tooltip`, `activity-ring-legend`, `activity-ring-legend-chip`.

Radius scale / `cn()` / `className` passthrough per Design DNA. No raw color, no arbitrary values.

### Behaviors

- **Draw-in + reduced-motion:** segments start collapsed (zero length) and expand to their share
  on mount via `requestAnimationFrame`. An inline `usePrefersReducedMotion` hook (matchMedia,
  morph-dock precedent) skips the animation; under reduced motion segments render full-length
  immediately. Draw-in animates `stroke-dasharray`; hover feedback animates `stroke-width`/`opacity`
  on separate transition properties so the two never fight.
- **Hover/pin emphasis:** hovering a segment or its legend chip lifts it (thicker stroke) and dims
  the others; clicking a legend chip pins that emphasis (`aria-pressed`). The center figure follows
  the active segment; idle center shows the total + `centerLabel`.
- **Dark tooltip:** above the ring, showing the active segment's `label · formatValue(value) · pct%`
  with a tone dot. `pointer-events-none`, `role="status"`.
- **Legend chips:** below the ring, one per segment, tone dot + label, keyboard-focusable
  (`focus-visible:ring-ring`), drive the same hover/pin state. Disabled when total is 0.
- **Navigation:** `onSegmentClick(segment, index)` — framework-agnostic. If a segment has no
  `href` and there is no handler, clicking just toggles pin.
- **Quiet state:** when the segment total is 0, render the track only (no segments), disable
  legend chips, and show a neutral idle center.

### Center treatment

Big `tabular-nums tracking-tight` value + muted-foreground label, mirroring `Gauge`'s center, so
the two components read as a family.

---

## Testing strategy (the primary effort)

Reuse the `stubMatchMedia({ reduce })` helper pattern from `tests/components/morph-dock.test.tsx`
(`matchMedia` is **not** globally polyfilled in `tests/setup.ts`; jsdom lacks it, so each test that
mounts `ActivityRing` must stub it).

- **Geometry assertions run under `reduce: true`** → `reduced = true` → segments render at full
  length synchronously, no `requestAnimationFrame` flushing required.
- **A separate test exercises the animated branch** (`reduce: false`) to cover the draw-in code path.

Branch/state matrix to cover (for ≥ 96% branches / 100% functions):

- `active`/`dim` per segment; `hovered` vs `pinned`; toggling pin off.
- `href` present vs `onSegmentClick` present vs neither (pin-only).
- legend chip focus / blur / click; disabled (total 0) chips are inert.
- `total === 0` quiet ring (track only).
- reduced vs animated branch.
- tone cycling defaults + explicit tones → correct `stroke-*` classes.
- `formatValue` default vs custom; percent rounding.
- `className` passthrough; `data-slot` presence; SVG circle counts.

Accessibility: `axe` on default, quiet, and multi-tone renders; legend chips are real buttons with
`aria-pressed`; tooltip is `role="status"`.

---

## Wiring (AGENTS.md "Adding a new component" checklist)

1. Add `registry/ui/activity-ring.tsx`; edit `registry/ui/gauge.tsx`.
2. Append an `activity-ring` item to `registry.json`
   (`type: registry:ui`, `registryDependencies: ["@byronwade/foundation","@byronwade/status-dot","@byronwade/utils"]`,
   file target `components/ui/activity-ring.tsx`).
3. `npm run update:registry` (gen all → sync → build → validate).
4. Add `content/examples/activity-ring/default.tsx`; `npm run gen:examples`.
5. Add `tests/components/activity-ring.test.tsx` + the ~3 `Gauge` test additions.
6. `npm run test:ci` — must be green before committing.
7. Update `registry/rules/byronwade-ui.mdc` only if a new convention emerges (none expected — all
   colors come from existing tokens).

## Acceptance criteria

- `Gauge` gains reduced-motion + a11y label with no regression to its existing suite.
- `activity-ring` renders, animates (and respects reduced motion), supports hover/pin, tooltip, and
  legend, is fully tokenized (no raw color / arbitrary values), and is framework-agnostic.
- New example exists; `npm run validate` and `npm run test:ci` pass; coverage thresholds hold.
