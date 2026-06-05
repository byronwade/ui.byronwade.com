# Activity Ring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reduced-motion + a11y to the existing `Gauge`, and add a new generalized, interactive, tokenized `activity-ring` (`registry:ui`) component — the registry port of signalroute's `NumberActivityRing`.

**Architecture:** `Gauge` stays a server component and gains a pure-CSS `motion-reduce` arc + a `role="img"`/`aria-label` wrapper. `activity-ring` is a `"use client"` SVG donut with N tonal segments, mount draw-in (rAF) that respects `prefers-reduced-motion`, hover/pin emphasis with a dynamic center figure, a tokenized dark tooltip, and keyboard-focusable legend chips. All colors come from existing token utilities (`stroke-brand`, `stroke-success`, `stroke-muted-foreground/40`, `bg-foreground`, `shadow-float`); navigation is framework-agnostic via an `onSegmentClick` callback.

**Tech Stack:** React 19, TypeScript, Tailwind v4 token utilities, `@/lib/utils` `cn()`, `@/components/ui/status-dot`, Vitest + Testing Library + vitest-axe. Registry tooling: `npm run update:registry`, `gen:examples`, `test:ci`.

**Reference spec:** `docs/superpowers/specs/2026-06-03-activity-ring-design.md`

---

## File Structure

- **Modify** `registry/ui/gauge.tsx` — add `aria-label` prop, `role="img"` wrapper, `motion-reduce:transition-none` on the arc.
- **Modify** `tests/components/gauge.test.tsx` — add 3 tests (default aria-label, override, motion-reduce class).
- **Create** `registry/ui/activity-ring.tsx` — the new component (`ActivityRing`, `RingSegment`).
- **Create** `tests/components/activity-ring.test.tsx` — exhaustive suite.
- **Create** `content/examples/activity-ring/default.tsx` — example.
- **Modify** `registry.json` — append the `activity-ring` item.
- **Generated (do not hand-edit):** `components/ui/*`, `public/r/*`, `content/examples/registry.ts` — produced by `npm run update:registry` / `gen:examples`.

> **Edit registry source under `registry/`, never the generated `components/` copies.** `npm run sync` (inside `update:registry`) copies `registry/ui/*` → `components/ui/*`; tests import from `@/components/ui/*`, so you must run sync before tests see your changes.

---

## Task 1: Gauge — reduced-motion + accessible label

**Files:**

- Modify: `registry/ui/gauge.tsx`
- Test: `tests/components/gauge.test.tsx`
- Sync target (generated): `components/ui/gauge.tsx`

- [ ] **Step 1: Edit the component.** Replace the `Gauge` function in `registry/ui/gauge.tsx` (lines 19-58) with this version. Changes vs. current: new `"aria-label"` prop, `role="img"` + `aria-label` on the wrapper, and `motion-reduce:transition-none` appended to the arc className. Everything else is byte-identical.

```tsx
/** Circular ring gauge: big centered number + optional status word. AGENTS.md "Gauge hero". */
export function Gauge({
  value,
  label,
  tone,
  size = 160,
  thickness = 10,
  className,
  "aria-label": ariaLabel,
}: {
  value: number
  label?: string
  tone?: StatusTone
  size?: number
  thickness?: number
  className?: string
  "aria-label"?: string
}) {
  const t = tone ?? scoreTone(value)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  return (
    <div
      role="img"
      aria-label={
        ariaLabel ?? `${Math.round(value)}${label ? ` ${label}` : ""}`
      }
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className={cn(
            "transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none",
            stroke[t],
          )}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold tracking-tight tabular-nums">
            {Math.round(value)}
          </div>
          {label && (
            <div className="text-xs text-muted-foreground">{label}</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Sync so tests see the change.**

Run: `npm run sync`
Expected: copies `registry/ui/gauge.tsx` → `components/ui/gauge.tsx` (no errors).

- [ ] **Step 3: Add the three new tests.** Append this block to the end of `tests/components/gauge.test.tsx` (after the final `describe` block, before EOF).

```tsx
// ---------------------------------------------------------------------------
// Accessible label + reduced motion (added with activity-ring work)
// ---------------------------------------------------------------------------

describe("Gauge component – accessible label + reduced motion", () => {
  it("wrapper has role='img'", () => {
    const { container } = render(<Gauge value={78} />)
    expect(container.firstChild).toHaveAttribute("role", "img")
  })

  it("default aria-label is the rounded value + label", () => {
    const { container } = render(<Gauge value={78.6} label="Performance" />)
    expect(container.firstChild).toHaveAttribute("aria-label", "79 Performance")
  })

  it("default aria-label omits label segment when label absent", () => {
    const { container } = render(<Gauge value={42} />)
    expect(container.firstChild).toHaveAttribute("aria-label", "42")
  })

  it("explicit aria-label overrides the default", () => {
    const { container } = render(
      <Gauge
        value={78}
        label="Performance"
        aria-label="Overall health 78 of 100"
      />,
    )
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Overall health 78 of 100",
    )
  })

  it("progress arc carries motion-reduce:transition-none", () => {
    const { container } = render(<Gauge value={78} />)
    const progressCircle = getProgressCircle(container)
    expect(cls(progressCircle)).toContain("motion-reduce:transition-none")
  })

  it("has no axe violations with default aria-label (no wrapping region needed)", async () => {
    const { container } = render(<Gauge value={78} label="Performance" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

- [ ] **Step 4: Run the Gauge tests.**

Run: `npx vitest run tests/components/gauge.test.tsx`
Expected: PASS — all existing tests plus the 6 new assertions green. (The existing "SVG is aria-hidden" and geometry tests must still pass; the SVG is unchanged, only the wrapper gained role/aria-label and the arc gained a CSS-only class.)

- [ ] **Step 5: Commit.**

```bash
git add registry/ui/gauge.tsx components/ui/gauge.tsx tests/components/gauge.test.tsx
git commit -m "feat(gauge): reduced-motion arc + accessible role/aria-label"
```

---

## Task 2: Create the `activity-ring` component

**Files:**

- Create: `registry/ui/activity-ring.tsx`
- Sync target (generated): `components/ui/activity-ring.tsx`

- [ ] **Step 1: Write the component file** `registry/ui/activity-ring.tsx` with this exact content.

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"

/**
 * Per-segment stroke utility — same token map as Gauge, with the neutral tone
 * softened (tone-with-opacity) so a brand segment stays the clear accent rather
 * than being swamped by a heavy mid-gray.
 */
const segmentStroke: Record<StatusTone, string> = {
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-destructive",
  info: "stroke-brand",
  neutral: "stroke-muted-foreground/40",
}

/**
 * Default tone per segment index when a segment omits `tone` — brand first, then
 * soft neutral, so a two-segment ring reads as brand + neutral by default.
 */
const toneCycle: StatusTone[] = [
  "info",
  "neutral",
  "success",
  "warning",
  "danger",
]

export type RingSegment = {
  value: number
  label: string
  /** Stroke tone; defaults by position via `toneCycle`. */
  tone?: StatusTone
  /** Optional drill-down metadata passed back through `onSegmentClick`. */
  href?: string
}

/** Respect the OS "reduce motion" setting — skips the draw-in animation. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return reduced
}

/**
 * Segmented activity ring: an interactive donut split into tonal segments.
 *
 * Hovering a segment (or its legend chip) lifts it and dims the others; the
 * centre figure follows the active segment and a dark tooltip shows its share.
 * Clicking a legend chip pins that emphasis. Supplying `onSegmentClick` makes
 * the segments actionable (e.g. drill-down) — framework-agnostic, no router.
 * The ring draws itself in on mount, respecting `prefers-reduced-motion`.
 */
export function ActivityRing({
  segments,
  size = 168,
  thickness = 12,
  gap = 18,
  centerLabel = "total",
  formatValue = (n) => n.toLocaleString(),
  onSegmentClick,
  className,
}: {
  segments: RingSegment[]
  size?: number
  thickness?: number
  gap?: number
  centerLabel?: string
  formatValue?: (n: number) => string
  onSegmentClick?: (segment: RingSegment, index: number) => void
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  const [hovered, setHovered] = React.useState<number | null>(null)
  const [pinned, setPinned] = React.useState<number | null>(null)
  const active = hovered ?? pinned

  // Draw-in: segments start collapsed, then expand to their share on mount.
  const [drawn, setDrawn] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  const show = drawn || reduced

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  // Geometry
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  // Resolve tone + share for each segment.
  const resolved = segments.map((seg, i) => {
    const tone = seg.tone ?? toneCycle[i % toneCycle.length]
    const share = total > 0 ? seg.value / total : 0
    const pct = Math.round(share * 100)
    return { seg, i, tone, share, pct }
  })

  // Cumulative arc placement. A gap at each junction so segments read as
  // distinct pills rather than a hard seam. Rounded caps eat ~stroke/2 per end,
  // so keep gap > stroke.
  let cursor = 0
  const arcs = resolved.map((r) => {
    const start = cursor
    cursor += r.share
    const len = circumference * r.share
    const visible = show ? Math.max(len - gap, 0) : 0
    const offset = -(circumference * start + gap / 2)
    return { ...r, visible, offset }
  })

  const togglePin = (i: number) => setPinned((p) => (p === i ? null : i))

  const onSegment = (i: number) => {
    if (onSegmentClick) onSegmentClick(segments[i], i)
    else togglePin(i)
  }

  // Centre figure follows the active segment, else shows the total.
  const centre =
    active !== null
      ? { value: segments[active].value, label: segments[active].label }
      : { value: total, label: centerLabel }

  const activeArc = active !== null ? arcs[active] : null

  // Per-segment presentation derived from the active state.
  const segProps = (i: number) => {
    const isActive = active === i
    const dim = active !== null && !isActive
    return {
      strokeWidth: isActive ? thickness + 3 : thickness,
      opacity: dim ? 0.4 : 1,
      // Draw-in (dasharray) is slow; hover feedback (width/opacity) is snappy —
      // separate properties so the two animations never fight.
      style: {
        transition: reduced
          ? undefined
          : "stroke-dasharray 700ms ease-out, stroke-width 200ms ease, opacity 200ms ease",
        cursor: total > 0 ? "pointer" : "default",
      } as React.CSSProperties,
      onMouseEnter: () => total > 0 && setHovered(i),
      onMouseLeave: () => setHovered(null),
      onClick: () => total > 0 && onSegment(i),
    }
  }

  return (
    <div
      data-slot="activity-ring"
      className={cn("flex flex-col items-center gap-4 text-center", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Dark inverse tooltip (design-system "popover over light UI") */}
        {activeArc && (
          <div
            data-slot="activity-ring-tooltip"
            role="status"
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-xl bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-float"
          >
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone={activeArc.tone} />
              {activeArc.seg.label} · {formatValue(activeArc.seg.value)} ·{" "}
              {activeArc.pct}%
            </span>
          </div>
        )}

        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          {/* track */}
          <circle
            data-slot="activity-ring-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-muted"
          />
          {total > 0 &&
            arcs.map((a) => (
              <circle
                key={a.i}
                data-slot="activity-ring-segment"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeLinecap="round"
                className={segmentStroke[a.tone]}
                strokeDasharray={`${a.visible} ${circumference - a.visible}`}
                strokeDashoffset={a.offset}
                {...segProps(a.i)}
              />
            ))}
        </svg>

        <div
          data-slot="activity-ring-center"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatValue(centre.value)}
          </span>
          <span className="text-xs text-muted-foreground">{centre.label}</span>
        </div>
      </div>

      <div
        data-slot="activity-ring-legend"
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {resolved.map((r) => (
          <LegendChip
            key={r.i}
            tone={r.tone}
            label={r.seg.label}
            active={active === r.i}
            pinned={pinned === r.i}
            disabled={total === 0}
            onEnter={() => setHovered(r.i)}
            onLeave={() => setHovered(null)}
            onClick={() => togglePin(r.i)}
          />
        ))}
      </div>
    </div>
  )
}

function LegendChip({
  tone,
  label,
  active,
  pinned,
  disabled,
  onEnter,
  onLeave,
  onClick,
}: {
  tone: StatusTone
  label: string
  active: boolean
  pinned: boolean
  disabled?: boolean
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-slot="activity-ring-legend-chip"
      disabled={disabled}
      aria-pressed={pinned}
      onMouseEnter={disabled ? undefined : onEnter}
      onMouseLeave={disabled ? undefined : onLeave}
      onFocus={disabled ? undefined : onEnter}
      onBlur={disabled ? undefined : onLeave}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-default disabled:opacity-60",
        active
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <StatusDot
        tone={tone}
        size="md"
        className={cn("transition-transform", active && "scale-125")}
      />
      {label}
    </button>
  )
}
```

- [ ] **Step 2: Sync the component into `components/`.**

Run: `npm run sync`
Expected: `components/ui/activity-ring.tsx` now exists (copied from `registry/ui/`). No errors.

> Note: `sync` only copies files that the registry knows about via `registry.json` OR mirrors the whole `registry/ui` tree depending on the script. If `components/ui/activity-ring.tsx` is NOT created by this step, it will be created in Task 4 after the manifest entry is added and `npm run update:registry` runs. Either way, Task 3's tests are run after Task 4's sync. Proceed.

- [ ] **Step 3: Commit the component.**

```bash
git add registry/ui/activity-ring.tsx
git commit -m "feat(activity-ring): tokenized interactive segmented ring component"
```

---

## Task 3: Exhaustive tests for `activity-ring`

**Files:**

- Create: `tests/components/activity-ring.test.tsx`

This test file is written to exercise every branch and function (coverage gates: functions ≥ 99, branches ≥ 90 global). It stubs `window.matchMedia` per the established `morph-dock.test.tsx` pattern. Geometry assertions run under `reduce: true` so segments render full-length synchronously; one test exercises the animated (`reduce: false`) draw-in branch via `waitFor`.

- [ ] **Step 1: Write the test file** `tests/components/activity-ring.test.tsx` with this exact content.

```tsx
/**
 * Exhaustive tests for ActivityRing.
 *
 * Component: @/components/ui/activity-ring
 * Exports:   ActivityRing (component), RingSegment (type)
 *
 * jsdom notes:
 *   - window.matchMedia is NOT polyfilled (see tests/setup.ts) — stub it per
 *     test, mirroring tests/components/morph-dock.test.tsx.
 *   - Under prefers-reduced-motion the draw-in is skipped, so segments render at
 *     full length on first synchronous render — geometry is assertable without
 *     flushing requestAnimationFrame.
 *   - SVG camelCase props serialize to kebab-case attrs (stroke-dasharray, etc.).
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { expect, describe, it, vi, beforeEach } from "vitest"
import { axe } from "vitest-axe"
import { ActivityRing, type RingSegment } from "@/components/ui/activity-ring"

// ---------------------------------------------------------------------------
// matchMedia stub (mirrors morph-dock.test.tsx)
// ---------------------------------------------------------------------------

function stubMatchMedia({ reduce = false }: { reduce?: boolean } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

beforeEach(() => {
  // Default to reduced motion so segments are full-length synchronously.
  stubMatchMedia({ reduce: true })
})

const SEGMENTS: RingSegment[] = [
  { value: 120, label: "Inbound" },
  { value: 80, label: "Outbound" },
]

function segmentCircles(container: HTMLElement): Element[] {
  return Array.from(
    container.querySelectorAll('[data-slot="activity-ring-segment"]'),
  )
}
function cls(el: Element): string {
  return el.getAttribute("class") ?? ""
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("ActivityRing – rendering", () => {
  it("renders the root wrapper with data-slot", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    expect(
      container.querySelector('[data-slot="activity-ring"]'),
    ).toBeInTheDocument()
  })

  it("renders an SVG with a track circle", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="activity-ring-track"]'),
    ).toHaveClass("stroke-muted")
  })

  it("renders one segment circle per segment", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    expect(segmentCircles(container)).toHaveLength(2)
  })

  it("renders three segments when given three", () => {
    const three: RingSegment[] = [
      { value: 1, label: "A" },
      { value: 1, label: "B" },
      { value: 1, label: "C" },
    ]
    const { container } = render(<ActivityRing segments={three} />)
    expect(segmentCircles(container)).toHaveLength(3)
  })

  it("shows the total in the centre by default", () => {
    render(<ActivityRing segments={SEGMENTS} centerLabel="interactions" />)
    expect(screen.getByText("200")).toBeInTheDocument()
    expect(screen.getByText("interactions")).toBeInTheDocument()
  })

  it("defaults centerLabel to 'total'", () => {
    render(<ActivityRing segments={SEGMENTS} />)
    expect(screen.getByText("total")).toBeInTheDocument()
  })

  it("applies custom className to the root", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} className="my-ring" />,
    )
    expect(container.querySelector('[data-slot="activity-ring"]')).toHaveClass(
      "my-ring",
    )
  })

  it("applies size to the ring box", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} size={200} />,
    )
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "200")
    expect(svg).toHaveAttribute("height", "200")
  })
})

// ---------------------------------------------------------------------------
// Tone mapping
// ---------------------------------------------------------------------------

describe("ActivityRing – tone mapping", () => {
  it("cycles default tones: segment 0 = stroke-brand, segment 1 = stroke-muted-foreground/40", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [a, b] = segmentCircles(container)
    expect(cls(a)).toContain("stroke-brand")
    expect(cls(b)).toContain("stroke-muted-foreground/40")
  })

  it("honours explicit tones", () => {
    const segs: RingSegment[] = [
      { value: 1, label: "Up", tone: "success" },
      { value: 1, label: "Down", tone: "danger" },
    ]
    const { container } = render(<ActivityRing segments={segs} />)
    const [a, b] = segmentCircles(container)
    expect(cls(a)).toContain("stroke-success")
    expect(cls(b)).toContain("stroke-destructive")
  })

  it("wraps the tone cycle past 5 segments", () => {
    const segs: RingSegment[] = Array.from({ length: 6 }, (_, i) => ({
      value: 1,
      label: `S${i}`,
    }))
    const { container } = render(<ActivityRing segments={segs} />)
    const circles = segmentCircles(container)
    // index 5 wraps back to toneCycle[0] = info = stroke-brand
    expect(cls(circles[5])).toContain("stroke-brand")
  })
})

// ---------------------------------------------------------------------------
// Geometry (reduced motion → full-length synchronously)
// ---------------------------------------------------------------------------

describe("ActivityRing – geometry", () => {
  const size = 168
  const thickness = 12
  const gap = 18
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  it("segment visible length = share*circumference - gap", () => {
    const { container } = render(
      <ActivityRing
        segments={SEGMENTS}
        size={size}
        thickness={thickness}
        gap={gap}
      />,
    )
    const [a] = segmentCircles(container)
    const share = 120 / 200
    const expected = circumference * share - gap
    const dasharray = a.getAttribute("stroke-dasharray") ?? ""
    const visible = Number(dasharray.split(" ")[0])
    expect(visible).toBeCloseTo(expected, 2)
  })

  it("first segment offset = -(gap/2)", () => {
    const { container } = render(
      <ActivityRing
        segments={SEGMENTS}
        size={size}
        thickness={thickness}
        gap={gap}
      />,
    )
    const [a] = segmentCircles(container)
    expect(Number(a.getAttribute("stroke-dashoffset"))).toBeCloseTo(
      -(gap / 2),
      2,
    )
  })

  it("second segment offset accounts for the first segment length", () => {
    const { container } = render(
      <ActivityRing
        segments={SEGMENTS}
        size={size}
        thickness={thickness}
        gap={gap}
      />,
    )
    const [, b] = segmentCircles(container)
    const firstShare = 120 / 200
    const expected = -(circumference * firstShare + gap / 2)
    expect(Number(b.getAttribute("stroke-dashoffset"))).toBeCloseTo(expected, 2)
  })

  it("default thickness drives stroke-width 12 on the track", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    expect(
      container.querySelector('[data-slot="activity-ring-track"]'),
    ).toHaveAttribute("stroke-width", "12")
  })
})

// ---------------------------------------------------------------------------
// Quiet state (total === 0)
// ---------------------------------------------------------------------------

describe("ActivityRing – quiet state", () => {
  const QUIET: RingSegment[] = [
    { value: 0, label: "Inbound" },
    { value: 0, label: "Outbound" },
  ]

  it("renders no segment circles when total is 0", () => {
    const { container } = render(<ActivityRing segments={QUIET} />)
    expect(segmentCircles(container)).toHaveLength(0)
  })

  it("still renders the track when total is 0", () => {
    const { container } = render(<ActivityRing segments={QUIET} />)
    expect(
      container.querySelector('[data-slot="activity-ring-track"]'),
    ).toBeInTheDocument()
  })

  it("centre shows 0 total", () => {
    render(<ActivityRing segments={QUIET} centerLabel="calls" />)
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("calls")).toBeInTheDocument()
  })

  it("legend chips are disabled when total is 0", () => {
    render(<ActivityRing segments={QUIET} />)
    const chips = screen.getAllByRole("button")
    chips.forEach((c) => expect(c).toBeDisabled())
  })

  it("disabled legend chip click does not change the centre", () => {
    render(<ActivityRing segments={QUIET} centerLabel="calls" />)
    fireEvent.click(screen.getByRole("button", { name: /Inbound/ }))
    // still showing the idle total label
    expect(screen.getByText("calls")).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Hover / pin emphasis + tooltip
// ---------------------------------------------------------------------------

describe("ActivityRing – hover/pin + tooltip", () => {
  it("hovering a segment shows the tooltip and swaps the centre figure", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [a] = segmentCircles(container)
    fireEvent.mouseEnter(a)
    // tooltip appears
    const tooltip = container.querySelector(
      '[data-slot="activity-ring-tooltip"]',
    )
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent("Inbound")
    expect(tooltip).toHaveTextContent("60%") // 120/200
    // centre swaps to the active segment value
    expect(screen.getByText("120")).toBeInTheDocument()
  })

  it("mouseLeave clears the tooltip", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [a] = segmentCircles(container)
    fireEvent.mouseEnter(a)
    expect(
      container.querySelector('[data-slot="activity-ring-tooltip"]'),
    ).toBeInTheDocument()
    fireEvent.mouseLeave(a)
    expect(
      container.querySelector('[data-slot="activity-ring-tooltip"]'),
    ).not.toBeInTheDocument()
  })

  it("active segment gets a thicker stroke; the other dims", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} thickness={12} />,
    )
    const [a, b] = segmentCircles(container)
    fireEvent.mouseEnter(a)
    expect(a).toHaveAttribute("stroke-width", "15") // thickness + 3
    expect(b).toHaveAttribute("stroke-width", "12")
    expect(Number((b as SVGElement).style.opacity)).toBeCloseTo(0.4, 5)
  })

  it("clicking a legend chip pins emphasis (aria-pressed) and swaps centre", () => {
    render(<ActivityRing segments={SEGMENTS} />)
    const chip = screen.getByRole("button", { name: /Outbound/ })
    fireEvent.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("80")).toBeInTheDocument()
  })

  it("clicking a pinned legend chip again unpins it", () => {
    render(<ActivityRing segments={SEGMENTS} centerLabel="total" />)
    const chip = screen.getByRole("button", { name: /Outbound/ })
    fireEvent.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("total")).toBeInTheDocument()
  })

  it("legend chip focus/blur drives hover emphasis", () => {
    render(<ActivityRing segments={SEGMENTS} />)
    const chip = screen.getByRole("button", { name: /Inbound/ })
    fireEvent.focus(chip)
    expect(screen.getByText("120")).toBeInTheDocument() // centre follows
    fireEvent.blur(chip)
    expect(screen.getByText("200")).toBeInTheDocument() // back to total
  })
})

// ---------------------------------------------------------------------------
// Click behavior: callback vs pin
// ---------------------------------------------------------------------------

describe("ActivityRing – segment click", () => {
  it("calls onSegmentClick with the segment and index", () => {
    const onSegmentClick = vi.fn()
    const { container } = render(
      <ActivityRing segments={SEGMENTS} onSegmentClick={onSegmentClick} />,
    )
    const [a] = segmentCircles(container)
    fireEvent.click(a)
    expect(onSegmentClick).toHaveBeenCalledWith(SEGMENTS[0], 0)
  })

  it("without onSegmentClick, clicking a segment pins emphasis", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [, b] = segmentCircles(container)
    fireEvent.click(b)
    // legend chip for that segment is now pinned
    expect(screen.getByRole("button", { name: /Outbound/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})

// ---------------------------------------------------------------------------
// formatValue
// ---------------------------------------------------------------------------

describe("ActivityRing – formatValue", () => {
  it("default formatter uses toLocaleString (thousands separator)", () => {
    const big: RingSegment[] = [
      { value: 1200, label: "A" },
      { value: 800, label: "B" },
    ]
    render(<ActivityRing segments={big} />)
    expect(screen.getByText("2,000")).toBeInTheDocument()
  })

  it("custom formatter is applied to the centre", () => {
    render(<ActivityRing segments={SEGMENTS} formatValue={(n) => `$${n}`} />)
    expect(screen.getByText("$200")).toBeInTheDocument()
  })

  it("custom formatter is applied in the tooltip", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} formatValue={(n) => `${n} pcs`} />,
    )
    fireEvent.mouseEnter(segmentCircles(container)[0])
    expect(
      container.querySelector('[data-slot="activity-ring-tooltip"]'),
    ).toHaveTextContent("120 pcs")
  })
})

// ---------------------------------------------------------------------------
// Animation branch (reduce: false) + cleanup
// ---------------------------------------------------------------------------

describe("ActivityRing – draw-in animation", () => {
  it("animated branch: segments start collapsed then draw in via rAF", async () => {
    stubMatchMedia({ reduce: false })
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [a] = segmentCircles(container)
    // On first render (drawn=false, reduced=false) the visible length is 0.
    const initial = Number(
      (a.getAttribute("stroke-dasharray") ?? "").split(" ")[0],
    )
    expect(initial).toBe(0)
    // After the rAF fires, it expands to its share length.
    await waitFor(() => {
      const after = Number(
        (a.getAttribute("stroke-dasharray") ?? "").split(" ")[0],
      )
      expect(after).toBeGreaterThan(0)
    })
  })

  it("animated branch attaches the multi-property transition to segments", () => {
    stubMatchMedia({ reduce: false })
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    const [a] = segmentCircles(container) as unknown as SVGElement[]
    expect(a.style.transition).toContain("stroke-dasharray")
  })

  it("unmounts cleanly (cancels rAF + removes matchMedia listener)", () => {
    const { unmount } = render(<ActivityRing segments={SEGMENTS} />)
    expect(() => unmount()).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("ActivityRing – accessibility", () => {
  it("legend entries are real buttons with aria-pressed", () => {
    render(<ActivityRing segments={SEGMENTS} />)
    const chips = screen.getAllByRole("button")
    expect(chips).toHaveLength(2)
    chips.forEach((c) => expect(c).toHaveAttribute("aria-pressed"))
  })

  it("decorative SVG is aria-hidden", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden")
  })

  it("has no axe violations – default", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing segments={SEGMENTS} />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations – quiet state", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing
          segments={[
            { value: 0, label: "Inbound" },
            { value: 0, label: "Outbound" },
          ]}
        />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations – pinned/active state", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing segments={SEGMENTS} />
      </div>,
    )
    fireEvent.click(screen.getByRole("button", { name: /Inbound/ }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run the activity-ring tests** (requires the component to be synced into `components/` — if Task 2 Step 2 did not create it, run Task 4 first, then return here).

Run: `npx vitest run tests/components/activity-ring.test.tsx`
Expected: PASS — all describe blocks green.

- [ ] **Step 3: Commit the tests.**

```bash
git add tests/components/activity-ring.test.tsx
git commit -m "test(activity-ring): exhaustive suite (geometry, hover/pin, tooltip, legend, a11y)"
```

---

## Task 4: Registry manifest + example + build

**Files:**

- Modify: `registry.json`
- Create: `content/examples/activity-ring/default.tsx`

- [ ] **Step 1: Add the manifest item.** In `registry.json`, append this object to the `items` array, immediately after the existing `gauge` item (match the surrounding formatting/indentation).

```json
{
  "name": "activity-ring",
  "type": "registry:ui",
  "title": "Activity ring",
  "description": "Interactive segmented donut: tonal segments, hover/pin emphasis, tooltip, legend, draw-in.",
  "registryDependencies": [
    "@byronwade/foundation",
    "@byronwade/status-dot",
    "@byronwade/utils"
  ],
  "files": [
    {
      "path": "registry/ui/activity-ring.tsx",
      "type": "registry:ui",
      "target": "components/ui/activity-ring.tsx"
    }
  ]
}
```

- [ ] **Step 2: Create the example** `content/examples/activity-ring/default.tsx`.

```tsx
import { ActivityRing } from "@/components/ui/activity-ring"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        segments={[
          { value: 1280, label: "Inbound" },
          { value: 740, label: "Outbound" },
        ]}
        centerLabel="interactions"
      />
    </div>
  )
}
```

- [ ] **Step 3: Run the full registry pipeline.**

Run: `npm run update:registry`
Expected: generates the `all` item, syncs `registry/ui/activity-ring.tsx` → `components/ui/activity-ring.tsx`, rebuilds `public/r/activity-ring.json`, and validates the manifest with no errors.

- [ ] **Step 4: Regenerate the examples registry.**

Run: `npm run gen:examples`
Expected: updates `content/examples/registry.ts` to include `activity-ring/default`. No errors.

- [ ] **Step 5: Validate manifest + examples + test presence.**

Run: `npm run validate`
Expected: PASS — `check-registry`, `check-examples`, and `check:tests` all green (the new component now has a manifest entry, an example, and a test file).

- [ ] **Step 6: Commit the wiring.**

```bash
git add registry.json content/examples/activity-ring/default.tsx content/examples/registry.ts components/ui/activity-ring.tsx public/r/activity-ring.json public/r/registry.json
git commit -m "feat(activity-ring): register manifest item + example, build registry"
```

> If `public/r/` is git-ignored (per AGENTS.md it is generated and may be ignored), `git add` will skip it harmlessly — only the tracked files commit. That is expected.

---

## Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite with coverage.**

Run: `npm run test:ci`
Expected: PASS — `check:tests` green, full Vitest suite green, coverage thresholds held (functions ≥ 99, branches ≥ 90, statements ≥ 95, lines ≥ 96). If coverage dips, inspect the `text` reporter output for uncovered lines in `components/ui/activity-ring.tsx` and add the missing-branch test (most likely candidates: an unhit handler — ensure hover, leave, click, focus, blur, pin-toggle-off, callback path, quiet-state, and the animated branch are all exercised).

- [ ] **Step 2: Typecheck / lint (if the repo exposes one).**

Run: `npm run lint` (skip if the script does not exist)
Expected: no new errors in `registry/ui/activity-ring.tsx`, `registry/ui/gauge.tsx`, or the test files.

- [ ] **Step 3: Final review of the diff.**

Run: `git log --oneline -6` and `git diff main --stat`
Expected: commits for gauge enhancement, component, tests, and wiring; only the intended files changed.

---

## Self-Review (completed by plan author)

- **Spec coverage:** Gauge reduced-motion + a11y → Task 1. New `activity-ring` API/behaviors (N segments, tone cycle incl. softened neutral, draw-in + reduced-motion, hover/pin, tooltip, legend, `onSegmentClick`, quiet state, center treatment) → Tasks 2-3. Tokens-only translation (`stroke-brand`, `stroke-muted-foreground/40`, `bg-foreground`, `shadow-float`, `StatusDot`) → Task 2. Wiring (manifest, example, build, validate) → Task 4. Coverage/test strategy (stubMatchMedia, reduced-path geometry, animated branch) → Task 3 + Task 5. `VerificationProgress` excluded — no task, by design.
- **Placeholder scan:** none — every code step contains full source.
- **Type consistency:** `RingSegment`, `ActivityRing`, `StatusTone`, `segmentStroke`, `toneCycle`, `usePrefersReducedMotion`, `LegendChip`, and the `data-slot` names are used identically across the component and its tests. `onSegmentClick(segment, index)` signature matches between definition and the test assertion `toHaveBeenCalledWith(SEGMENTS[0], 0)`.
