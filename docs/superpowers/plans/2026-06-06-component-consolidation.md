# Component Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate overlapping registry components behind shared primitives while preserving existing public registry component names.

**Architecture:** Add focused primitives in `registry/ui`, then refactor current composites into compatibility adapters. The implementation proceeds by family so each phase can be tested and committed independently without breaking registry consumers.

**Tech Stack:** React 19, TypeScript, Tailwind v4 token utilities, class-variance-authority, Vitest, Testing Library, vitest-axe, shadcn registry manifest tooling.

---

## File Structure

- Create `registry/ui/metric.tsx`: shared metric and delta display primitive.
- Modify `registry/components/metric-stat.tsx`: compatibility exports wrapping `Metric`.
- Modify `registry/components/stat-card.tsx`: compatibility adapter wrapping `Metric`.
- Create `content/examples/metric/default.tsx`: registry example for the new primitive.
- Create `tests/components/metric.test.tsx`: primitive tests.
- Modify `registry.json`: add `metric` item and update dependencies for adapters.
- Modify `registry/rules/byronwade-ui.mdc`: mention `metric` if new public registry item is added.

- Create `registry/ui/entity-row.tsx`: generic leading/title/meta/actions row.
- Create `content/examples/entity-row/default.tsx`.
- Create `tests/components/entity-row.test.tsx`.
- Modify `registry/components/command-result.tsx`, `registry/components/resource-list.tsx`, and `registry/components/price-alert.tsx` to compose `EntityRow` where behavior remains equivalent.
- Modify `registry.json` and `registry/rules/byronwade-ui.mdc` for the new item.

- Create `registry/ui/media-item.tsx`: media-specific card/row primitive.
- Create `content/examples/media-item/default.tsx`.
- Create `tests/components/media-item.test.tsx`.
- Modify `registry/components/video-card.tsx`, `registry/components/up-next-item.tsx`, `registry/components/studio-video-row.tsx`, and `registry/components/upload-row.tsx` to compose `MediaItem` where the current API permits.
- Modify `registry.json` and `registry/rules/byronwade-ui.mdc`.

- Create `registry/ui/attachment-item.tsx`: visual attachment/file row and chip primitive.
- Create `content/examples/attachment-item/default.tsx`.
- Create `tests/components/attachment-item.test.tsx`.
- Modify `registry/components/upload-row.tsx` and `registry/components/ai-elements/attachments.tsx` to compose `AttachmentItem` for visual rendering only.
- Modify `registry.json` and `registry/rules/byronwade-ui.mdc`.

- Create `registry/components/trading-parts.tsx`: shared trading subparts.
- Create `content/examples/trading-parts/default.tsx`.
- Create `tests/components/trading-parts.test.tsx`.
- Modify `registry/components/quote-header.tsx`, `registry/components/market-depth.tsx`, `registry/components/symbol-details.tsx`, and `registry/components/chart-panel.tsx` only where shared subparts remove clear duplication.
- Modify `registry.json` and `registry/rules/byronwade-ui.mdc`.

- Modify `registry/ui/status-dot.tsx`, `registry/components/status-pill.tsx`, `registry/ui/live-badge.tsx`, `registry/ui/pill.tsx`, and `registry/ui/badge.tsx` only for naming/slot cleanup and composition hierarchy.
- Modify matching tests if public behavior remains the same but internals change.

- Modify `registry/ui/morph-surface.tsx` and selected `registry/ui/morph-*.tsx` files to share item/button helpers if duplication is localized.
- Avoid public API removal.

---

## Task 1: Baseline And Worktree Safety

**Files:**
- Read only: all touched files listed above.

- [ ] **Step 1: Detect isolation and dirty state**

Run:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
git rev-parse --show-superproject-working-tree 2>/dev/null || true
git branch --show-current
git status --short
```

Expected: record whether this is already a linked worktree. The current repository may have unrelated dirty files; do not revert them.

- [ ] **Step 2: Install or verify dependencies**

Run:

```bash
npm install
```

Expected: dependencies are present. If `package-lock.json` changes only because the workspace already had dependency drift, record it before continuing.

- [ ] **Step 3: Run focused baseline tests for first families**

Run:

```bash
npm run test:run -- tests/components/metric-stat.test.tsx tests/components/stat-card.test.tsx tests/components/video-card.test.tsx tests/components/thumbnail.test.tsx
```

Expected: PASS, or record pre-existing failures before implementation.

---

## Task 2: Metric Primitive

**Files:**
- Create: `registry/ui/metric.tsx`
- Create: `tests/components/metric.test.tsx`
- Create: `content/examples/metric/default.tsx`
- Modify: `registry/components/metric-stat.tsx`
- Modify: `registry/components/stat-card.tsx`
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Write failing tests for `Metric`**

Create `tests/components/metric.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import { TrendingUp } from "lucide-react"

import { DeltaPill, Metric } from "@/components/ui/metric"

describe("Metric", () => {
  it("renders label and value with data slots", () => {
    const { container } = render(<Metric label="Revenue" value="$42K" />)

    expect(container.querySelector("[data-slot='metric']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='metric-label']")).toHaveTextContent("Revenue")
    expect(container.querySelector("[data-slot='metric-value']")).toHaveTextContent("$42K")
  })

  it("renders the card variant with hint, icon, and delta", () => {
    const { container } = render(
      <Metric
        variant="card"
        label="Sessions"
        value="9,210"
        hint="last 30 days"
        icon={TrendingUp}
        delta={{ value: "+14.3%", direction: "up" }}
      />,
    )

    expect(container.querySelector("[data-slot='metric']")).toHaveAttribute("data-variant", "card")
    expect(container.querySelector("[data-slot='metric']")).toHaveClass("bg-card")
    expect(screen.getByText("last 30 days")).toBeInTheDocument()
    expect(screen.getByText("+14.3%")).toBeInTheDocument()
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders DeltaPill tones for up, down, and flat", () => {
    const { container, rerender } = render(
      <DeltaPill delta={{ value: "+1%", direction: "up" }} />,
    )
    expect(container.querySelector("[data-slot='metric-delta']")).toHaveClass("text-success")

    rerender(<DeltaPill delta={{ value: "-1%", direction: "down" }} />)
    expect(container.querySelector("[data-slot='metric-delta']")).toHaveClass("text-destructive")

    rerender(<DeltaPill delta={{ value: "0%", direction: "flat" }} />)
    expect(container.querySelector("[data-slot='metric-delta']")).toHaveClass("text-muted-foreground")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Metric label="Latency" value="124ms" delta={{ value: "-8ms", direction: "down" }} />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:run -- tests/components/metric.test.tsx
```

Expected: FAIL because `@/components/ui/metric` does not exist.

- [ ] **Step 3: Implement `Metric`**

Create `registry/ui/metric.tsx`:

```tsx
import type { LucideIcon } from "lucide-react"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Delta = { value: string; direction: "up" | "down" | "flat" }

type MetricVariant = "inline" | "card" | "compact"

type MetricProps = {
  label: ReactNode
  value: ReactNode
  delta?: Delta
  icon?: LucideIcon
  hint?: ReactNode
  variant?: MetricVariant
  className?: string
}

function DeltaPill({ delta, className }: { delta: Delta; className?: string }) {
  const tone =
    delta.direction === "up"
      ? "bg-success/10 text-success"
      : delta.direction === "down"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground"
  const Icon = delta.direction === "up" ? ArrowUp : delta.direction === "down" ? ArrowDown : null

  return (
    <span
      data-slot="metric-delta"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
        tone,
        className,
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden />}
      {delta.value}
    </span>
  )
}

function Metric({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  variant = "inline",
  className,
}: MetricProps) {
  return (
    <div
      data-slot="metric"
      data-variant={variant}
      className={cn(
        "flex flex-col gap-1",
        variant === "card" && "rounded-2xl bg-card p-5 edge",
        variant === "compact" && "gap-0.5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          data-slot="metric-label"
          className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
        >
          {Icon && <Icon className="size-3.5" aria-hidden />}
          {label}
        </span>
      </div>
      <div data-slot="metric-body" className="flex items-center gap-2">
        <span
          data-slot="metric-value"
          className={cn(
            "font-semibold tracking-tight tabular-nums",
            variant === "compact" ? "text-lg" : "text-2xl",
          )}
        >
          {value}
        </span>
        {delta && <DeltaPill delta={delta} />}
      </div>
      {hint && (
        <div data-slot="metric-hint" className="text-xs text-muted-foreground">
          {hint}
        </div>
      )}
    </div>
  )
}

export { DeltaPill, Metric }
export type { Delta, MetricProps, MetricVariant }
```

- [ ] **Step 4: Run green for primitive**

Run:

```bash
npm run test:run -- tests/components/metric.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Refactor compatibility adapters**

Modify `registry/components/metric-stat.tsx` so `MetricStat` delegates to `Metric` and still exports `DeltaPill` and `Delta`.

Modify `registry/components/stat-card.tsx` so `StatCard` delegates to `Metric variant="card"` and preserves `hint`, `icon`, `delta`, and `className`.

- [ ] **Step 6: Verify existing metric tests**

Run:

```bash
npm run test:run -- tests/components/metric.test.tsx tests/components/metric-stat.test.tsx tests/components/stat-card.test.tsx
```

Expected: PASS. If old tests assert exact internal classes that changed, preserve those compatibility classes on wrappers instead of weakening behavior.

- [ ] **Step 7: Registry docs**

Add `content/examples/metric/default.tsx`:

```tsx
import { TrendingUp } from "lucide-react"

import { Metric } from "@/components/ui/metric"

export default function MetricExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Metric label="Revenue" value="$48.2K" delta={{ value: "+12%", direction: "up" }} />
      <Metric variant="card" label="Sessions" value="9,210" icon={TrendingUp} hint="last 30 days" />
      <Metric variant="compact" label="Latency" value="124ms" delta={{ value: "-8ms", direction: "down" }} />
    </div>
  )
}
```

Update `registry.json` with a `registry:ui` item for `metric` that depends on `@byronwade/foundation` and `@byronwade/utils`.

---

## Task 3: Entity Row Primitive

**Files:**
- Create: `registry/ui/entity-row.tsx`
- Create: `tests/components/entity-row.test.tsx`
- Create: `content/examples/entity-row/default.tsx`
- Modify: `registry/components/command-result.tsx`
- Modify: `registry/components/resource-list.tsx`
- Modify: `registry/components/price-alert.tsx`
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Write failing tests**

Create `tests/components/entity-row.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { EntityRow } from "@/components/ui/entity-row"

describe("EntityRow", () => {
  it("renders leading, title, description, meta, and actions slots", () => {
    const { container } = render(
      <EntityRow
        leading={<span>R</span>}
        title="Result title"
        description="Result description"
        meta={<span>2m ago</span>}
        actions={<button type="button">Open</button>}
      />,
    )

    expect(container.querySelector("[data-slot='entity-row']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='entity-row-leading']")).toHaveTextContent("R")
    expect(screen.getByText("Result title")).toBeInTheDocument()
    expect(screen.getByText("Result description")).toBeInTheDocument()
    expect(screen.getByText("2m ago")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument()
  })

  it("supports click and keyboard activation", async () => {
    const user = userEvent.setup()
    const onActivate = vi.fn()
    render(<EntityRow title="Open row" onActivate={onActivate} />)

    await user.click(screen.getByRole("button", { name: "Open row" }))
    await user.keyboard("{Enter}")

    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it("has no axe violations", async () => {
    const { container } = render(<EntityRow title="Accessible row" description="Body" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:run -- tests/components/entity-row.test.tsx
```

Expected: FAIL because `EntityRow` does not exist.

- [ ] **Step 3: Implement minimal `EntityRow`**

Create `registry/ui/entity-row.tsx` with:

- root `data-slot="entity-row"`
- `button` semantics when `onActivate` is passed
- inert `div` otherwise
- `leading`, `title`, `description`, `meta`, `status`, `actions` slots
- variants `default`, `card`, `compact`
- `cn()` class merge

- [ ] **Step 4: Run green**

Run:

```bash
npm run test:run -- tests/components/entity-row.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Compose adapters**

Refactor `CommandResult`, `ResourceItem`, and `PriceAlert` one at a time. After each file, run its focused test:

```bash
npm run test:run -- tests/components/command-result.test.tsx
npm run test:run -- tests/components/resource-list.test.tsx
npm run test:run -- tests/components/price-alert.test.tsx
```

Expected: PASS, or record if a listed test file does not exist yet and add one before changing that component.

---

## Task 4: Media Item Primitive

**Files:**
- Create: `registry/ui/media-item.tsx`
- Create: `tests/components/media-item.test.tsx`
- Create: `content/examples/media-item/default.tsx`
- Modify: `registry/components/video-card.tsx`
- Modify: `registry/components/up-next-item.tsx`
- Modify: `registry/components/studio-video-row.tsx`
- Modify: `registry/components/upload-row.tsx`
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Write failing tests**

Create `tests/components/media-item.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { MediaItem } from "@/components/ui/media-item"

describe("MediaItem", () => {
  it("renders media, title, byline, meta, and actions", () => {
    const { container } = render(
      <MediaItem
        media={<img src="/thumb.jpg" alt="Clip" />}
        title="Clip title"
        byline="Channel"
        meta="2.2M views"
        actions={<button type="button">Save</button>}
      />,
    )

    expect(container.querySelector("[data-slot='media-item']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='media-item-media']")).toBeInTheDocument()
    expect(screen.getByText("Clip title")).toBeInTheDocument()
    expect(screen.getByText("Channel")).toBeInTheDocument()
    expect(screen.getByText("2.2M views")).toBeInTheDocument()
  })

  it("supports horizontal and compact variants", () => {
    const { container, rerender } = render(<MediaItem variant="horizontal" title="A" />)
    expect(container.querySelector("[data-slot='media-item']")).toHaveAttribute("data-variant", "horizontal")

    rerender(<MediaItem variant="compact" title="A" />)
    expect(container.querySelector("[data-slot='media-item']")).toHaveAttribute("data-variant", "compact")
  })

  it("supports activation", async () => {
    const user = userEvent.setup()
    const onActivate = vi.fn()
    render(<MediaItem title="Playable" onActivate={onActivate} />)

    await user.click(screen.getByRole("button", { name: "Playable" }))
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it("has no axe violations", async () => {
    const { container } = render(<MediaItem title="Accessible media" byline="Creator" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:run -- tests/components/media-item.test.tsx
```

Expected: FAIL because `MediaItem` does not exist.

- [ ] **Step 3: Implement `MediaItem`**

Implement `MediaItem` as a reusable media surface with `data-slot` parts:

- `media-item`
- `media-item-media`
- `media-item-body`
- `media-item-title`
- `media-item-byline`
- `media-item-meta`
- `media-item-status`
- `media-item-actions`

It may compose `EntityRow` internally if that produces cleaner semantics.

- [ ] **Step 4: Run green**

Run:

```bash
npm run test:run -- tests/components/media-item.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Refactor media adapters**

Refactor one component at a time in this order:

1. `UpNextItem`
2. `VideoCard`
3. `StudioVideoRow`
4. `UploadRow`

After each file, run:

```bash
npm run test:run -- tests/components/up-next-item.test.tsx
npm run test:run -- tests/components/video-card.test.tsx
npm run test:run -- tests/components/studio-video-row.test.tsx
npm run test:run -- tests/components/upload-row.test.tsx
```

Expected: existing public behavior and data slots remain intact. Keep adapter-level slots such as `video-card-title` even if the shared primitive also has `media-item-title`.

---

## Task 5: Attachment Item Primitive

**Files:**
- Create: `registry/ui/attachment-item.tsx`
- Create: `tests/components/attachment-item.test.tsx`
- Create: `content/examples/attachment-item/default.tsx`
- Modify: `registry/components/upload-row.tsx`
- Modify: `registry/components/ai-elements/attachments.tsx`
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Write failing tests**

Create `tests/components/attachment-item.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { AttachmentItem } from "@/components/ui/attachment-item"

describe("AttachmentItem", () => {
  it("renders name, meta, progress, and actions", () => {
    const { container } = render(
      <AttachmentItem
        name="report.pdf"
        meta="2.4 MB"
        progress={42}
        actions={<button type="button">Remove</button>}
      />,
    )

    expect(container.querySelector("[data-slot='attachment-item']")).toBeInTheDocument()
    expect(screen.getByText("report.pdf")).toBeInTheDocument()
    expect(screen.getByText("2.4 MB")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='attachment-item-progress-fill']")).toHaveStyle({ width: "42%" })
  })

  it("supports image previews", () => {
    render(<AttachmentItem name="image.png" previewSrc="/image.png" previewAlt="Preview" />)
    expect(screen.getByAltText("Preview")).toHaveAttribute("src", "/image.png")
  })

  it("has no axe violations", async () => {
    const { container } = render(<AttachmentItem name="file.txt" meta="1 KB" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:run -- tests/components/attachment-item.test.tsx
```

Expected: FAIL because `AttachmentItem` does not exist.

- [ ] **Step 3: Implement and verify green**

Implement `AttachmentItem` with clamped progress, visual preview, icon fallback, and list/inline variants.

Run:

```bash
npm run test:run -- tests/components/attachment-item.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Refactor visual-only usages**

Update `UploadRow` and AI `Attachments` rendering only. Do not move upload, prompt, paste, or AI SDK state into `AttachmentItem`.

Run:

```bash
npm run test:run -- tests/components/upload-row.test.tsx tests/components/ai-attachments.test.tsx
```

Expected: PASS, or add missing focused tests before adapter changes.

---

## Task 6: Trading Parts

**Files:**
- Create: `registry/components/trading-parts.tsx`
- Create: `tests/components/trading-parts.test.tsx`
- Create: `content/examples/trading-parts/default.tsx`
- Modify: `registry/components/quote-header.tsx`
- Modify: `registry/components/market-depth.tsx`
- Modify: `registry/components/symbol-details.tsx`
- Modify: `registry/components/chart-panel.tsx`
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Write tests for shared trading parts**

Create `tests/components/trading-parts.test.tsx` to cover:

- `QuoteIdentity` renders symbol, name, and optional exchange.
- `QuoteMetricGrid` renders label/value rows using `Metric` compact styling.
- `TradingPanelHeader` renders title, subtitle, and actions.
- axe check.

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:run -- tests/components/trading-parts.test.tsx
```

Expected: FAIL because `trading-parts` does not exist.

- [ ] **Step 3: Implement shared parts**

Create `registry/components/trading-parts.tsx` with small exported components. Use `Metric` for compact metric rows and token-only classes.

- [ ] **Step 4: Refactor trading composites selectively**

Modify only repeated subparts in:

- `quote-header`
- `symbol-details`
- `market-depth`
- `chart-panel`

Run:

```bash
npm run test:run -- tests/components/trading-parts.test.tsx tests/components/quote-header.test.tsx tests/components/symbol-details.test.tsx tests/components/market-depth.test.tsx tests/components/chart-panel.test.tsx
```

Expected: PASS, or add missing focused tests before changing a component.

---

## Task 7: Status, Badge, Morph, Header, Timeline Cleanup

**Files:**
- Modify only files where duplication is local and tests exist or are added first.

- [ ] **Step 1: Status hierarchy cleanup**

Before changes, run:

```bash
npm run test:run -- tests/components/status-dot.test.tsx tests/components/status-pill.test.tsx tests/components/badge.test.tsx tests/components/pill.test.tsx tests/components/live-badge.test.tsx tests/components/verified-badge.test.tsx
```

Expected: PASS, or identify missing tests and add them before refactoring.

Refactor only to improve composition hierarchy:

- `StatusPill` composes `StatusDot`.
- `LiveBadge` keeps domain semantics.
- `VerifiedBadge` stays identity metadata.
- `Badge` and `Pill` remain generic primitives.

- [ ] **Step 2: Morph helper cleanup**

Before changes, run:

```bash
npm run test:run -- tests/components/morph-surface.test.tsx tests/components/morph-bar.test.tsx tests/components/morph-rail.test.tsx tests/components/morph-tabs.test.tsx
```

Expected: PASS, or identify missing tests and add them before refactoring.

Extract only local helpers that reduce repeated item button markup. Do not merge all morph public components.

- [ ] **Step 3: Headers, tables, timelines**

Inspect duplication. If no repeated behavior can be removed without API churn, leave these files unchanged and record them as intentionally separate. If changes are made, write failing tests first and run focused tests before and after.

---

## Task 8: Registry, Examples, Formatting, And Validation

**Files:**
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`
- Create/modify: `content/examples/*/default.tsx`
- Generated by command only: synced `components/`, `lib/`, `app/foundation.generated.css`, `public/r/` if applicable.

- [ ] **Step 1: Run registry update**

Run:

```bash
npm run update:registry
```

Expected: registry source sync/build/validate pipeline completes, or failures are fixed before continuing.

- [ ] **Step 2: Run focused test suite**

Run:

```bash
npm run test:run -- tests/components/metric.test.tsx tests/components/entity-row.test.tsx tests/components/media-item.test.tsx tests/components/attachment-item.test.tsx tests/components/trading-parts.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run affected adapter tests**

Run:

```bash
npm run test:run -- tests/components/metric-stat.test.tsx tests/components/stat-card.test.tsx tests/components/video-card.test.tsx tests/components/up-next-item.test.tsx tests/components/studio-video-row.test.tsx tests/components/upload-row.test.tsx tests/components/command-result.test.tsx tests/components/resource-list.test.tsx tests/components/price-alert.test.tsx tests/components/quote-header.test.tsx tests/components/market-depth.test.tsx tests/components/symbol-details.test.tsx tests/components/chart-panel.test.tsx
```

Expected: PASS for existing tests. If a listed test file is missing, add it before the related component refactor.

- [ ] **Step 4: Run full gates**

Run:

```bash
npm run validate
npm run test:ci
```

Expected: PASS, or clearly separate pre-existing failures from consolidation regressions.

- [ ] **Step 5: Review changed files**

Run:

```bash
git diff -- registry/ui registry/components registry/lib registry.json registry/rules/byronwade-ui.mdc content/examples tests/components
git status --short
```

Expected: changes are scoped to the consolidation. No unrelated dirty files are reverted or absorbed.

---

## Task 9: Commit Strategy

Commit in small checkpoints after passing focused tests:

```bash
git add registry/ui/metric.tsx registry/components/metric-stat.tsx registry/components/stat-card.tsx content/examples/metric/default.tsx tests/components/metric.test.tsx registry.json registry/rules/byronwade-ui.mdc
git commit -m "refactor: consolidate metric components"

git add registry/ui/entity-row.tsx registry/components/command-result.tsx registry/components/resource-list.tsx registry/components/price-alert.tsx content/examples/entity-row/default.tsx tests/components/entity-row.test.tsx registry.json registry/rules/byronwade-ui.mdc
git commit -m "refactor: add shared entity row"

git add registry/ui/media-item.tsx registry/components/video-card.tsx registry/components/up-next-item.tsx registry/components/studio-video-row.tsx registry/components/upload-row.tsx content/examples/media-item/default.tsx tests/components/media-item.test.tsx registry.json registry/rules/byronwade-ui.mdc
git commit -m "refactor: consolidate media item surfaces"

git add registry/ui/attachment-item.tsx registry/components/upload-row.tsx registry/components/ai-elements/attachments.tsx content/examples/attachment-item/default.tsx tests/components/attachment-item.test.tsx registry.json registry/rules/byronwade-ui.mdc
git commit -m "refactor: add shared attachment item"

git add registry/components/trading-parts.tsx registry/components/quote-header.tsx registry/components/market-depth.tsx registry/components/symbol-details.tsx registry/components/chart-panel.tsx content/examples/trading-parts/default.tsx tests/components/trading-parts.test.tsx registry.json registry/rules/byronwade-ui.mdc
git commit -m "refactor: share trading component parts"
```

Only run each commit after the related focused tests pass. If unrelated pre-existing changes are present in any listed file, inspect the diff and stage only the intended hunks.

---

## Self-Review

Spec coverage:

- Internal consolidation and public compatibility are covered by Tasks 2 through 7.
- Registry examples, tests, rule updates, and validation are covered by Task 8.
- Dirty workspace risk is covered by Task 1 and Task 9.
- TDD is covered by each implementation task requiring red before green.

Placeholder scan:

- No `TBD`, `TODO`, or "implement later" placeholders are used.
- Broad cleanup areas are explicitly constrained to files with tests and repeated behavior.

Type consistency:

- New public names are `Metric`, `EntityRow`, `MediaItem`, `AttachmentItem`, `QuoteIdentity`, `QuoteMetricGrid`, and `TradingPanelHeader`.
- Existing compatibility names remain `MetricStat`, `StatCard`, `VideoCard`, `UpNextItem`, `StudioVideoRow`, `UploadRow`, and other existing registry exports.
