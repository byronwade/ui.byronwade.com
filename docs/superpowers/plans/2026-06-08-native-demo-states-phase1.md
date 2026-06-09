# Native demo states — Phase 1 (foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `empty` state, make the docs STATE control opt-in (only shown when an example calls `useDemoState`), delete the generic state fallback, and migrate two exemplars (data-table, event-timeline) to native states — establishing the pattern and the first shared helpers.

**Architecture:** The demo frame currently forces the STATE control on every example and wraps non-native examples in a generic `DemoStateFallback`. We invert this: an example opts in by calling `useDemoState()`; otherwise the STATE control is disabled and no fallback renders. `DemoState` gains `empty`. Two data exemplars get bespoke, component-appropriate state rendering; common low-level pieces (skeleton block, empty block, error block, status badge) are extracted into a docs-only helper module after the migrations reveal what actually repeats.

**Tech Stack:** Next.js (this repo's vendored fork — read `node_modules/next/dist/docs/` before touching framework APIs), React, Tailwind v4 foundation tokens, Base UI primitives, Vitest + Testing Library + vitest-axe. Prettier `semi: false`.

**Scope note:** This is Phase 1 only. Phase 2+ (migrating the rest of the stateful component set category-by-category) is a separate plan to be written once this phase ships the helper kit. Spec: `docs/superpowers/specs/2026-06-08-native-demo-states-design.md`.

**Concurrency caution:** A second session has been editing this branch live. Stage files explicitly by path in every commit (never `git add -A` / `git add .`); verify `git status` before each commit so you don't sweep in another session's staged work.

---

## File map

- `content/demo-contexts.ts` — `DemoState` type (line 8) + `parseDemoState` (line 60). Source of truth for the docs app.
- `registry/lib/demo-viewport.ts` — `DemoState` type (line 10). Shipped registry item; re-synced to `lib/demo-viewport.ts` by `npm run sync`.
- `app/(docs)/_components/demo-preview-frame.tsx` — `STATE_OPTIONS` (~123), inline URL validation (~192), `DemoStateFallback` component (~212), `stateFallback` prop + `fallbackState` branch (~209, ~323), lucide imports (~4).
- `app/(docs)/_components/docs-demo-preview.tsx` — `getDisabledDemoControlsForSource` (~30), `stateFallback` wiring (~92).
- `app/(docs)/_components/demo-state-bits.tsx` — **new**, docs-only shared low-level state helpers (Task 6).
- `content/examples/data-table/default.tsx` — table exemplar migration.
- `content/examples/event-timeline/default.tsx` — feed exemplar migration.
- Tests: `tests/content/demo-contexts.test.ts`, `tests/app/docs-demo-preview.test.ts`, `tests/app/demo-preview-frame.test.tsx`, `tests/content/activity-grid-examples.test.ts`, and new `tests/content/demo-state-examples.test.ts`.

---

## Task 1: Add `empty` to the state model

**Files:**
- Modify: `content/demo-contexts.ts:8`, `content/demo-contexts.ts:60-64`
- Modify: `registry/lib/demo-viewport.ts:10`
- Modify: `app/(docs)/_components/demo-preview-frame.tsx` (imports ~4-19, `STATE_OPTIONS` ~121-151, URL validation ~192-197)
- Test: `tests/content/demo-contexts.test.ts`

- [ ] **Step 1: Write the failing test** — add to the `parseDemoContextParams` describe block in `tests/content/demo-contexts.test.ts`:

```ts
  it("parses the empty state param", () => {
    expect(parseDemoContextParams({ state: "empty" })).toEqual({
      surface: "app",
      viewport: "desktop",
      density: "default",
      frame: "default",
      depth: "none",
      state: "empty",
    })
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/demo-contexts.test.ts -t "parses the empty state param"`
Expected: FAIL — received `state: "default"` (empty not yet accepted).

- [ ] **Step 3: Add `empty` to both type definitions**

In `content/demo-contexts.ts` line 8:

```ts
export type DemoState = "default" | "loading" | "empty" | "success" | "error"
```

In `registry/lib/demo-viewport.ts` line 10:

```ts
type DemoState = "default" | "loading" | "empty" | "success" | "error"
```

- [ ] **Step 4: Accept `empty` in both validators**

In `content/demo-contexts.ts`, replace `parseDemoState`:

```ts
export function parseDemoState(value: unknown): DemoState {
  if (
    value === "loading" ||
    value === "empty" ||
    value === "success" ||
    value === "error"
  )
    return value
  return "default"
}
```

In `app/(docs)/_components/demo-preview-frame.tsx`, replace the inline `state` block (~192-197):

```ts
  const state =
    stateParam === "loading" ||
    stateParam === "empty" ||
    stateParam === "success" ||
    stateParam === "error"
      ? stateParam
      : "default"
```

- [ ] **Step 5: Add the `empty` toolbar option with the Inbox icon**

In `app/(docs)/_components/demo-preview-frame.tsx`, add `Inbox` to the lucide import block (~4-19), keeping the list alphabetized:

```ts
  Eye,
  Inbox,
  Layers,
```

Replace `STATE_OPTIONS` (~121-151) so the order is default → loading → empty → success → error:

```ts
const STATE_OPTIONS: {
  label: string
  value: DemoState
  icon: LucideIcon
  tooltip: string
}[] = [
  {
    label: "Default state",
    value: "default",
    icon: CircleOff,
    tooltip: "Default state",
  },
  {
    label: "Loading",
    value: "loading",
    icon: LoaderCircle,
    tooltip: "Loading state",
  },
  {
    label: "Empty",
    value: "empty",
    icon: Inbox,
    tooltip: "Empty state",
  },
  {
    label: "Success",
    value: "success",
    icon: CheckCircle,
    tooltip: "Success state",
  },
  {
    label: "Error",
    value: "error",
    icon: XCircle,
    tooltip: "Error state",
  },
]
```

- [ ] **Step 6: Sync the registry lib to the app**

Run: `npm run sync`
Expected: `sync-registry: copied … files + app/foundation.generated.css`. Confirm `lib/demo-viewport.ts` now contains `"empty"` in the `DemoState` union (`grep -n empty lib/demo-viewport.ts`).

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run tests/content/demo-contexts.test.ts`
Expected: PASS (all cases, including the new empty case).

- [ ] **Step 8: Commit**

```bash
git add content/demo-contexts.ts registry/lib/demo-viewport.ts lib/demo-viewport.ts \
  app/\(docs\)/_components/demo-preview-frame.tsx tests/content/demo-contexts.test.ts \
  public/r/demo-viewport.json
git commit -m "feat(demo): add empty state to the demo state model and toolbar"
```
(`public/r/demo-viewport.json` only if `npm run sync`/`registry:build` regenerated it; check `git status` first and include it only if present.)

---

## Task 2: Make the STATE control opt-in

**Files:**
- Modify: `app/(docs)/_components/docs-demo-preview.tsx:30-37` (`getDisabledDemoControlsForSource`), `:92-101` (`stateFallback` wiring)
- Test: `tests/app/docs-demo-preview.test.ts`

- [ ] **Step 1: Update the failing test** — in `tests/app/docs-demo-preview.test.ts`, change the first case's expectation so a source without `useDemoState` now **disables** state:

```ts
  it("disables the state control when an example does not consume it", () => {
    expect(
      getDisabledDemoControlsForSource(`
        import { ActivityGrid } from "@/components/ui/activity-grid"
        export default function Example() {
          return <ActivityGrid data={[1]} />
        }
      `),
    ).toEqual({ frame: true, depth: true, state: true })
  })
```

(The second test — all three hooks present → all `false` — stays as-is and now also asserts the state-enables-on-opt-in behavior.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/docs-demo-preview.test.ts`
Expected: FAIL — received `state: false`.

- [ ] **Step 3: Gate state on `useDemoState`**

In `app/(docs)/_components/docs-demo-preview.tsx`, replace `getDisabledDemoControlsForSource`:

```ts
export function getDisabledDemoControlsForSource(
  source: string,
): DemoToolbarDisabledControls {
  return {
    frame: !source.includes("useDemoFrame"),
    depth: !source.includes("useDemoDepth"),
    state: !source.includes("useDemoState"),
  }
}
```

- [ ] **Step 4: Remove the `stateFallback` wiring**

In `app/(docs)/_components/docs-demo-preview.tsx`, delete the entire `stateFallback={(frameCtx) => { … }}` prop passed to `<DemoPreviewFrame>` (~92-101). (The `<DemoPreviewFrame>` prop itself is removed in Task 3.)

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/app/docs-demo-preview.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/\(docs\)/_components/docs-demo-preview.tsx tests/app/docs-demo-preview.test.ts
git commit -m "feat(demo): show the STATE control only when an example opts in"
```

---

## Task 3: Delete the generic `DemoStateFallback`

**Files:**
- Modify: `app/(docs)/_components/demo-preview-frame.tsx` — remove `DemoStateFallback` (~212-279), the `stateFallback` prop on `DemoPreviewFrameProps` (~209), the `fallbackState` prop threaded into `DemoPreviewContent` (~288, ~298, ~323-329), and any now-unused `Skeleton` import if nothing else uses it (grep first).
- Test: `tests/app/demo-preview-frame.test.tsx`

- [ ] **Step 1: Update the failing tests** — in `tests/app/demo-preview-frame.test.tsx`:
  - Delete the test `"keeps state controls active when only frame and depth are unsupported"` (~392-408) — it relies on `stateFallback`.
  - Delete the test `"renders a skeleton fallback for loading when an example has no native state handling"` (~415-427) — the fallback no longer exists.
  - Leave the `"State is not available for this example."` disabled-message test (~141-167) intact — that is now the correct behavior for non-opted-in examples.

- [ ] **Step 2: Run the suite to verify those tests fail / reference removed API**

Run: `npx vitest run tests/app/demo-preview-frame.test.tsx`
Expected: After deleting the two tests, the remaining suite still references no removed symbols. If you haven't yet edited the component, the two deleted tests are simply gone; run to confirm the file still compiles. (It will still pass here because the component is unchanged — the real check is Step 4.)

- [ ] **Step 3: Remove the fallback from the component**

In `app/(docs)/_components/demo-preview-frame.tsx`:
- Delete the `DemoStateFallback` function (~212-279).
- Remove `stateFallback?: (ctx: DemoContext) => boolean` from `DemoPreviewFrameProps` (~209).
- In `DemoPreviewContent`, remove the `fallbackState` prop from the param type and replace the render branch (~323-329) with the direct children call:

```tsx
      <DemoViewportProvider
        surface={surface}
        viewport={viewport}
        density={ctx.density}
        frame={ctx.frame}
        depth={ctx.depth}
        state={ctx.state}
      >
        {children(ctx)}
      </DemoViewportProvider>
```
- Remove the `stateFallback` prop wherever `DemoPreviewFrame` forwards it to `DemoPreviewContent`, and the `fallbackState={…}` argument.
- Run `grep -n "Skeleton" app/\(docs\)/_components/demo-preview-frame.tsx`; if no remaining uses, remove the `import { Skeleton } …` line.

- [ ] **Step 4: Run the suite to verify it passes**

Run: `npx vitest run tests/app/demo-preview-frame.test.tsx`
Expected: PASS, no references to `demo-state-fallback` or `stateFallback`.

- [ ] **Step 5: Commit**

```bash
git add app/\(docs\)/_components/demo-preview-frame.tsx tests/app/demo-preview-frame.test.tsx
git commit -m "refactor(demo): delete the generic DemoStateFallback wrapper"
```

---

## Task 4: Migrate the table exemplar (data-table)

**Files:**
- Modify: `content/examples/data-table/default.tsx`
- Test: `tests/content/demo-state-examples.test.ts` (new)

State mapping for a table: `loading` → `DataTable loading`; `empty` → `rows={[]}` with `emptyState`; `error` → inline error panel instead of the table; `success` → falls through to the normal table; `default` → normal table.

- [ ] **Step 1: Write the failing test** — create `tests/content/demo-state-examples.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), "utf8")

describe("native demo-state exemplars", () => {
  it("data-table default example drives all five states from useDemoState", () => {
    const source = read("content/examples/data-table/default.tsx")
    expect(source).toContain("useDemoState")
    expect(source).toContain('state === "loading"')
    expect(source).toContain('state === "empty"')
    expect(source).toContain('state === "error"')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/demo-state-examples.test.ts`
Expected: FAIL — `useDemoState` not present in `data-table/default.tsx`.

- [ ] **Step 3: Make `data-table/default.tsx` state-aware**

Add the import near the other imports:

```tsx
import { useDemoState } from "@/lib/demo-viewport"
```

Inside `export default function Example()`, after the existing hooks, read the state:

```tsx
  const demoState = useDemoState() ?? "default"
```

Compute the rows/loading the table receives based on state (place just before the `return`):

```tsx
  const isLoading = demoState === "loading"
  const isEmpty = demoState === "empty"
  const tableRows = isEmpty ? [] : pageRows
```

Replace the table's `rows={pageRows}` with `rows={tableRows}`, add `loading={isLoading}`, and add an `emptyState` prop:

```tsx
        rows={tableRows}
        loading={isLoading}
        emptyState={
          <div className="py-10 text-center text-sm text-muted-foreground">
            No products match these filters yet.
          </div>
        }
```

Wrap the returned table so the `error` state replaces it with an inline panel. Change the top of the `return` from the bare `<div className="rounded-xl bg-muted/40 p-1">` wrapper to:

```tsx
  if (demoState === "error") {
    return (
      <div className="rounded-xl bg-muted/40 p-1">
        <div className="rounded-lg bg-destructive/5 p-10 text-center ring-1 ring-destructive/30">
          <span className="mb-2 inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            Error
          </span>
          <p className="text-sm text-muted-foreground">
            Couldn’t load products. Retry in a moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-muted/40 p-1">
      <DataTable
        {/* …existing props with rows={tableRows} loading={isLoading} emptyState={…}… */}
      />
    </div>
  )
```

(Keep every existing `DataTable` prop; only `rows`, `loading`, and `emptyState` change/are added.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/content/demo-state-examples.test.ts`
Expected: PASS.

- [ ] **Step 5: Verify the data-table component test still passes**

Run: `npx vitest run tests/components/data-table.test.tsx`
Expected: PASS (the component is unchanged; only the example consumes more props).

- [ ] **Step 6: Commit**

```bash
git add content/examples/data-table/default.tsx tests/content/demo-state-examples.test.ts
git commit -m "feat(demo): drive data-table example states from useDemoState"
```

---

## Task 5: Migrate the feed exemplar (event-timeline)

**Files:**
- Modify: `content/examples/event-timeline/default.tsx`
- Test: `tests/content/demo-state-examples.test.ts` (extend)

State mapping for a feed: `loading` → skeleton rows; `empty` → empty block; `error` → error block; `success`/`default` → the event list. Note the file is currently a server component — it must become a client component (`"use client"`) to call the hook.

- [ ] **Step 1: Extend the failing test** — add to `tests/content/demo-state-examples.test.ts` inside the same describe:

```ts
  it("event-timeline default example drives states from useDemoState", () => {
    const source = read("content/examples/event-timeline/default.tsx")
    expect(source).toContain('"use client"')
    expect(source).toContain("useDemoState")
    expect(source).toContain('state === "loading"')
    expect(source).toContain('state === "empty"')
    expect(source).toContain('state === "error"')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/demo-state-examples.test.ts -t "event-timeline"`
Expected: FAIL — source lacks `useDemoState` / `"use client"`.

- [ ] **Step 3: Make `event-timeline/default.tsx` state-aware**

Replace the file with (keeping the existing `events` array verbatim):

```tsx
"use client"

import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const events: TimelineEvent[] = [
  // …unchanged from the current file…
]

export default function Example() {
  const state = useDemoState() ?? "default"

  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">Deployment Events</h2>
      {state === "loading" ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-2.5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      ) : state === "empty" ? (
        <div className="rounded-lg border border-border/70 py-10 text-center text-sm text-muted-foreground">
          No deployment events yet.
        </div>
      ) : state === "error" ? (
        <div className="rounded-lg bg-destructive/5 py-10 text-center ring-1 ring-destructive/30">
          <span className="mb-2 inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            Error
          </span>
          <p className="text-sm text-muted-foreground">
            Couldn’t load the event feed.
          </p>
        </div>
      ) : (
        <EventTimeline events={events} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/content/demo-state-examples.test.ts`
Expected: PASS (both exemplars).

- [ ] **Step 5: Commit**

```bash
git add content/examples/event-timeline/default.tsx tests/content/demo-state-examples.test.ts
git commit -m "feat(demo): drive event-timeline example states from useDemoState"
```

---

## Task 6: Extract shared low-level state helpers

**Files:**
- Create: `app/(docs)/_components/demo-state-bits.tsx`
- Modify: `content/examples/data-table/default.tsx`, `content/examples/event-timeline/default.tsx`
- Test: `tests/content/demo-state-examples.test.ts` (extend)

The two migrations both render an **empty block** and an **error block** with the same chrome. Extract exactly those two (the repeating pieces) — not a high-level wrapper. The loading treatments differ per component (skeleton grid vs skeleton rows), so they stay inline.

> Import-path note: example files import from consumer paths (`@/components/…`, `@/lib/…`) and **may also import from `@/app/…`** — confirmed: `content/examples/sidebar/trading-desk.tsx` imports `@/app/layouts/_components/…`. These helpers are docs-only (not shipped in the registry), so examples import them from `@/app/(docs)/_components/demo-state-bits`. No registry sync needed for this file.

- [ ] **Step 1: Write the failing test** — add to `tests/content/demo-state-examples.test.ts`:

```ts
  it("exemplars use the shared empty/error state helpers", () => {
    const table = read("content/examples/data-table/default.tsx")
    const feed = read("content/examples/event-timeline/default.tsx")
    expect(table).toContain("DemoEmptyState")
    expect(table).toContain("DemoErrorState")
    expect(feed).toContain("DemoEmptyState")
    expect(feed).toContain("DemoErrorState")
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/demo-state-examples.test.ts -t "shared empty/error"`
Expected: FAIL — helpers not referenced.

- [ ] **Step 3: Create the helper module**

`app/(docs)/_components/demo-state-bits.tsx`:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function DemoEmptyState({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="demo-empty-state"
      className={cn(
        "rounded-lg border border-border/70 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

function DemoErrorState({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="demo-error-state"
      className={cn(
        "rounded-lg bg-destructive/5 py-10 text-center ring-1 ring-destructive/30",
        className,
      )}
    >
      <span className="mb-2 inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
        Error
      </span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

export { DemoEmptyState, DemoErrorState }
```

- [ ] **Step 4: Refactor both exemplars to use the helpers**

In `event-timeline/default.tsx`, import and replace the empty/error JSX:

```tsx
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
```
```tsx
      ) : state === "empty" ? (
        <DemoEmptyState>No deployment events yet.</DemoEmptyState>
      ) : state === "error" ? (
        <DemoErrorState>Couldn’t load the event feed.</DemoErrorState>
      ) : (
```

In `data-table/default.tsx`, import the same and replace the `error` branch body and the `emptyState` prop:

```tsx
  if (demoState === "error") {
    return (
      <div className="rounded-xl bg-muted/40 p-1">
        <DemoErrorState>Couldn’t load products. Retry in a moment.</DemoErrorState>
      </div>
    )
  }
```
```tsx
        emptyState={
          <DemoEmptyState className="border-0">
            No products match these filters yet.
          </DemoEmptyState>
        }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/content/demo-state-examples.test.ts`
Expected: PASS (all cases).

- [ ] **Step 6: Commit**

```bash
git add app/\(docs\)/_components/demo-state-bits.tsx \
  content/examples/data-table/default.tsx content/examples/event-timeline/default.tsx \
  tests/content/demo-state-examples.test.ts
git commit -m "refactor(demo): extract shared DemoEmptyState/DemoErrorState helpers"
```

---

## Task 7: Full verification

**Files:** none (gates only).

- [ ] **Step 1: Sync + validate**

Run: `npm run sync && npm run validate`
Expected: sync copies files; `validate` (registry + examples + rule + test presence) passes. If `check:examples` complains about `data-table`/`event-timeline`, confirm `default.tsx` still default-exports a component.

- [ ] **Step 2: Typecheck via build**

Run: `npm run build`
Expected: compiles with no type errors (test:ci skips types; `build` is the only gate that catches the client/server boundary — `event-timeline` becoming `"use client"` is the risk to confirm).

- [ ] **Step 3: Full test suite + coverage**

Run: `npm run test:ci`
Expected: green; coverage thresholds hold. (Exclude worktree contamination is already configured.)

- [ ] **Step 4: Visual verification (requires browser extension connected)**

Open `http://localhost:3000/docs/data-table` and `http://localhost:3000/docs/event-timeline`. For each, toggle the STATE control through default / loading / empty / success / error in **both light and dark mode** and confirm each renders a meaningful, component-appropriate treatment (success falls through to the normal view by design). Also open a primitive (e.g. `/docs/button`) and confirm the STATE control is **absent**. If the extension is not connected, hand this step to the user — do not claim visual success without it.

- [ ] **Step 5: Final commit (only if Steps 1-3 produced generated changes)**

```bash
git status   # inspect; stage only generated demo-state files you own
git commit -m "chore(demo): sync generated output for native demo states"
```

---

## Self-review notes

- **Spec coverage:** opt-in gating (Task 2), delete fallback (Task 3), add `empty` to model + toolbar (Task 1), migrated examples own all five states with default fall-through (Tasks 4-5), low-level helpers extracted from real migrations (Task 6), verification incl. visual + tests (Task 7). Classification list and Phase 2 category migration are explicitly deferred to the Phase 2 plan.
- **Type consistency:** `DemoState` union identical in both source files; `useDemoState()` returns `DemoState | null`, so every consumer uses `?? "default"`. Helper names `DemoEmptyState`/`DemoErrorState` used consistently in Tasks 6 and tests.
- **Known risk:** `event-timeline` server→client conversion — only `npm run build` catches a boundary mistake (Task 7 Step 2). The `app/(docs)` import path for examples is flagged in Task 6 with a fallback if the convention forbids it.
