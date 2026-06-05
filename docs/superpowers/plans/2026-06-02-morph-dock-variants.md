# MorphDock Variant Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four declarative built-in features to `MorphDock` (two-tone tool zone, group separators, breadcrumb region, save/error status bloom) and expand the docs gallery, all token-driven and fully tested.

**Architecture:** Extend `registry/ui/morph-dock.tsx` with new props (`tools`, `breadcrumb`, `status`, `group` on items/actions) rendered declaratively — no responsive mode machine. Add one foundation token `--dock-tool`. Mirror to `components/` via `npm run sync`; keep registry manifest, AI rule, props table, examples, and tests in lockstep.

**Tech Stack:** React 19 + Base UI, Tailwind v4 token utilities, CVA conventions, vitest + jsdom + vitest-axe, shadcn registry pipeline.

**Spec:** `docs/superpowers/specs/2026-06-02-morph-dock-variants-design.md`

---

## Conventions for every task

- Edit **source** under `registry/` only. After each source change run `npm run sync` so `components/` + foundation CSS update before tests.
- Run a single test file fast with: `npx vitest run tests/components/morph-dock.test.tsx`.
- Tests live in `tests/components/morph-dock.test.tsx` (extend the existing `describe("MorphDock", …)`).
- Commit after each task (frequent commits). Branch off `main` first (see Task 1, Step 0).

---

## Task 0 (DONE): Close-glitch fix

Already applied in `registry/lib/use-chrome-morph.ts`: the close branch **settles the
morph box at the collapsed bar size** instead of clearing the inline width (no more
one-frame snap to full panel width). `npx vitest run tests/components/morph-dock.test.tsx` → 23/23 pass. Visual confirm pending on http://localhost:3002/docs/morph-dock.

---

## Task 1: Foundation token `--dock-tool`

**Files:**

- Modify: `registry.json` (foundation `cssVars`: `theme`, `light`, `dark`)
- Modify: `registry/rules/byronwade-ui.mdc` (token list)

- [ ] **Step 0: Branch**

```bash
git checkout -b morph-dock-variants
```

- [ ] **Step 1: Add the theme mapping** in `registry.json` after `"color-dock-active-foreground": "var(--dock-active-foreground)",`:

```json
          "color-dock-tool": "var(--dock-tool)",
```

- [ ] **Step 2: Add the light value** in the `light` block after `"dock-active-foreground": "oklch(0.99 0 0)",`:

```json
          "dock-tool": "oklch(0.27 0.006 72)",
```

- [ ] **Step 3: Add the dark value** in the `dark` block after `"dock-active-foreground": "oklch(0.99 0 0)",`:

```json
          "dock-tool": "oklch(0.245 0.007 70)",
```

- [ ] **Step 4: Document the token** in `registry/rules/byronwade-ui.mdc` — wherever `dock-*` tokens are listed, add `dock-tool` (the lighter "tool zone" shelf for two-tone combined nav+toolbar).

- [ ] **Step 5: Sync + verify the utility resolves**

Run: `npm run sync && grep -n "dock-tool" app/foundation.generated.css`
Expected: `--color-dock-tool` and `--dock-tool` present (light + dark).

- [ ] **Step 6: Commit**

```bash
git add registry.json registry/rules/byronwade-ui.mdc components lib app/foundation.generated.css
git commit -m "feat(foundation): add --dock-tool token for two-tone dock"
```

---

## Task 2: Group separators in the nav row

Adds `group?: string` to `MorphDockItem`; a seam is drawn between adjacent rendered
items whose `group` differs.

**Files:**

- Modify: `registry/ui/morph-dock.tsx`
- Test: `tests/components/morph-dock.test.tsx`

- [ ] **Step 1: Write the failing test** (add inside the `describe`):

```tsx
it("draws a separator between adjacent items of different groups", () => {
  render(
    <MorphDock
      items={[
        { id: "a", label: "A", icon: Home, core: true, group: "nav" },
        { id: "b", label: "B", icon: Inbox, core: true, group: "nav" },
        { id: "c", label: "C", icon: Search, core: true, group: "tools" },
      ]}
    />,
  )
  // exactly one group boundary (nav -> tools)
  expect(
    document.querySelectorAll('[data-slot="morph-dock-seam"]'),
  ).toHaveLength(1)
})
```

(Ensure `Search` is imported in the test file's lucide import; it already imports `Home`, `Inbox`, `BarChart3`, `Settings` — add `Search` if missing.)

- [ ] **Step 2: Run test, expect FAIL**

Run: `npx vitest run tests/components/morph-dock.test.tsx -t "separator between adjacent"`
Expected: FAIL (no `morph-dock-seam` nodes).

- [ ] **Step 3: Implement.** In `registry/ui/morph-dock.tsx`:

Add `group?: string;` to `interface MorphDockItem`.

Add a seam constant near `PILL`:

```tsx
const SEAM = "mx-0.5 h-5 w-px shrink-0 self-center"
```

Add to the `TONES` map a `seam` key: `dock` → `"bg-dock-muted"`, `surface` → `"bg-border"`.

Replace the nav `mainItems.map(...)`/`pinnedItems.map(...)` with a helper that interleaves seams. Add above the return:

```tsx
const renderItems = (list: MorphDockItem[]) =>
  list.map((item, i) => {
    const prev = list[i - 1]
    const boundary = prev && prev.group !== item.group
    return (
      <React.Fragment key={item.id}>
        {boundary ? (
          <span
            aria-hidden
            data-slot="morph-dock-seam"
            className={cn(SEAM, t.seam)}
          />
        ) : null}
        <DockItem item={item} collapsed={!isVisible(item, expanded)} t={t} />
      </React.Fragment>
    )
  })
```

Use `{renderItems(mainItems)}` and `{renderItems(pinnedItems)}` in the `<nav>`.

- [ ] **Step 4: Run test, expect PASS**

Run: `npm run sync && npx vitest run tests/components/morph-dock.test.tsx`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-dock.tsx tests/components/morph-dock.test.tsx components
git commit -m "feat(morph-dock): group separators via item.group"
```

---

## Task 3: Two-tone tool zone (`tools`)

**Files:**

- Modify: `registry/ui/morph-dock.tsx`
- Test: `tests/components/morph-dock.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
it("renders the tool zone with a brand primary and group seams", async () => {
  const onSelect = vi.fn()
  render(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      tools={[
        {
          id: "save",
          label: "Save",
          icon: Settings,
          primary: true,
          onSelect,
          group: "a",
        },
        { id: "share", label: "Share", icon: Search, group: "b" },
      ]}
    />,
  )
  const zone = document.querySelector('[data-slot="morph-dock-tools"]')
  expect(zone).toBeInTheDocument()
  expect(zone).toHaveClass("bg-dock-tool")
  // primary carries brand fill
  expect(screen.getByRole("button", { name: "Save" })).toHaveClass("bg-brand")
  // one seam between the two differing groups
  expect(zone?.querySelectorAll('[data-slot="morph-dock-seam"]')).toHaveLength(
    1,
  )
  await userEvent.click(screen.getByRole("button", { name: "Save" }))
  expect(onSelect).toHaveBeenCalledOnce()
})

it("renders tool-zone nav entries as links", () => {
  render(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      tools={[{ id: "docs", label: "Docs", icon: Search, href: "/docs" }]}
    />,
  )
  expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
    "href",
    "/docs",
  )
})
```

- [ ] **Step 2: Run, expect FAIL**

Run: `npx vitest run tests/components/morph-dock.test.tsx -t "tool zone"`
Expected: FAIL.

- [ ] **Step 3: Implement.** In `registry/ui/morph-dock.tsx`:

Add the action type + prop:

```tsx
export interface MorphDockAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onSelect?: () => void
  href?: string
  primary?: boolean
  group?: string
}
```

In `MorphDockProps`: `tools?: MorphDockAction[];`. Destructure `tools` in the component signature.

Add tone keys to `TONES`: `tool` (zone fill) → dock `"bg-dock-tool"`, surface `"bg-muted/60"`; `toolPrimary` → both tones `"bg-brand text-brand-foreground"`; `toolQuiet` → dock `"text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground"`, surface `"text-muted-foreground hover:bg-accent hover:text-foreground"`.

Add a `ToolAction` sub-component (mirrors `DockItem`'s link/button split):

```tsx
function ToolAction({
  action,
  t,
}: {
  action: MorphDockAction
  t: (typeof TONES)[MorphDockTone]
}) {
  const Icon = action.icon
  const cls = cn(
    "flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2",
    t.ring,
    action.primary ? t.toolPrimary : t.toolQuiet,
  )
  const inner = (
    <>
      <Icon className="size-4 shrink-0" />
      {action.label}
    </>
  )
  return action.href !== undefined ? (
    <a href={action.href} aria-label={action.label} className={cls}>
      {inner}
    </a>
  ) : (
    <button
      type="button"
      aria-label={action.label}
      onClick={(e) => {
        e.stopPropagation()
        action.onSelect?.()
      }}
      className={cls}
    >
      {inner}
    </button>
  )
}
```

Render the zone inside the pill, after the `<nav>` (and before `cluster`/`action`). Round its right corners only when it is the trailing element (no `cluster`/`action`):

```tsx
{
  tools && tools.length > 0 ? (
    <div
      data-slot="morph-dock-tools"
      className={cn(
        "-my-[3px] flex shrink-0 items-center gap-1 self-stretch px-1.5",
        t.tool,
        !cluster && !action ? "-mr-[3px] rounded-r-3xl pr-[7px]" : "rounded-xl",
      )}
    >
      {tools.map((a, i) => {
        const prev = tools[i - 1]
        const boundary = prev && prev.group !== a.group
        return (
          <React.Fragment key={a.id}>
            {boundary ? (
              <span
                aria-hidden
                data-slot="morph-dock-seam"
                className={cn(SEAM, t.seam)}
              />
            ) : null}
            <ToolAction action={a} t={t} />
          </React.Fragment>
        )
      })}
    </div>
  ) : null
}
```

- [ ] **Step 4: Run, expect PASS**

Run: `npm run sync && npx vitest run tests/components/morph-dock.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-dock.tsx tests/components/morph-dock.test.tsx components
git commit -m "feat(morph-dock): two-tone tool zone via tools prop"
```

---

## Task 4: Breadcrumb region (`breadcrumb`)

**Files:**

- Modify: `registry/ui/morph-dock.tsx`
- Test: `tests/components/morph-dock.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
it("renders a breadcrumb trail with the last crumb as current", () => {
  render(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Reports", href: "/reports" },
        { label: "Q2" },
      ]}
    />,
  )
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  )
  const current = screen.getByText("Q2")
  expect(current).toHaveAttribute("aria-current", "page")
})
```

- [ ] **Step 2: Run, expect FAIL**

Run: `npx vitest run tests/components/morph-dock.test.tsx -t "breadcrumb trail"`
Expected: FAIL.

- [ ] **Step 3: Implement.** Add `import { ChevronRight } from "lucide-react";` to the existing lucide import line. Add to `MorphDockProps`: `breadcrumb?: { label: string; href?: string }[];` and destructure it.

Add tone key `crumb` → dock `"text-dock-foreground/60"`, surface `"text-muted-foreground"`; reuse `t.title` for the current crumb.

Render at the leading edge of the `<nav>` (before items), only when `breadcrumb?.length`:

```tsx
{
  breadcrumb && breadcrumb.length > 0 ? (
    <div
      data-slot="morph-dock-breadcrumb"
      className="flex min-w-0 items-center gap-1 px-2"
    >
      {breadcrumb.map((c, i) => {
        const last = i === breadcrumb.length - 1
        return (
          <React.Fragment key={`${c.label}-${i}`}>
            {i > 0 ? (
              <ChevronRight
                aria-hidden
                className={cn("size-3.5 shrink-0", t.crumb)}
              />
            ) : null}
            {last || !c.href ? (
              <span
                aria-current={last ? "page" : undefined}
                className={cn(
                  "truncate text-[13px] font-semibold",
                  last ? t.title : t.crumb,
                )}
              >
                {c.label}
              </span>
            ) : (
              <a
                href={c.href}
                className={cn(
                  "truncate text-[13px] font-medium hover:underline",
                  t.crumb,
                )}
              >
                {c.label}
              </a>
            )}
          </React.Fragment>
        )
      })}
    </div>
  ) : null
}
```

- [ ] **Step 4: Run, expect PASS**

Run: `npm run sync && npx vitest run tests/components/morph-dock.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-dock.tsx tests/components/morph-dock.test.tsx components
git commit -m "feat(morph-dock): leading breadcrumb region"
```

---

## Task 5: Save → status bloom (`status`)

When `status` is set, the panel blooms into a tone-styled status body; success/info
auto-dismiss after `statusDismissMs` (default 4000), errors persist.

**Files:**

- Modify: `registry/ui/morph-dock.tsx`
- Test: `tests/components/morph-dock.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
it("blooms a status body and shows the tone title/message", () => {
  render(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      status={{ tone: "error", title: "Save failed", message: "Network error" }}
    />,
  )
  const dialog = screen.getByRole("dialog")
  expect(within(dialog).getByText("Save failed")).toBeInTheDocument()
  expect(within(dialog).getByText("Network error")).toBeInTheDocument()
})

it("auto-dismisses success but keeps errors", () => {
  vi.useFakeTimers()
  const onStatusDismiss = vi.fn()
  const { rerender } = render(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      status={{ tone: "success", title: "Saved" }}
      statusDismissMs={1000}
      onStatusDismiss={onStatusDismiss}
    />,
  )
  act(() => {
    vi.advanceTimersByTime(1000)
  })
  expect(onStatusDismiss).toHaveBeenCalledOnce()

  onStatusDismiss.mockClear()
  rerender(
    <MorphDock
      items={[{ id: "h", label: "Home", icon: Home, core: true }]}
      status={{ tone: "error", title: "Nope" }}
      statusDismissMs={1000}
      onStatusDismiss={onStatusDismiss}
    />,
  )
  act(() => {
    vi.advanceTimersByTime(5000)
  })
  expect(onStatusDismiss).not.toHaveBeenCalled()
  vi.useRealTimers()
})
```

Ensure the test file imports `within` and `act` from `@testing-library/react` (add to the existing import).

- [ ] **Step 2: Run, expect FAIL**

Run: `npx vitest run tests/components/morph-dock.test.tsx -t "status body"`
Expected: FAIL.

- [ ] **Step 3: Implement.** Add to the lucide import: `Check, Info` (X already imported). Add types + props:

```tsx
export type MorphDockStatusTone = "success" | "error" | "info"
export interface MorphDockStatus {
  tone: MorphDockStatusTone
  title: string
  message?: string
}
```

In `MorphDockProps`: `status?: MorphDockStatus | null; onStatusDismiss?: () => void; statusDismissMs?: number;`
Destructure with `statusDismissMs = 4000`.

Compute: `const hasStatus = status != null;` and change `const morphOpen = (open && hasPanel) || hasStatus;` Keep `inPlace = morphOpen && !detached;` `hasPanel` for the overlay test becomes `children != null || hasStatus`.

Auto-dismiss effect:

```tsx
React.useEffect(() => {
  if (!status || status.tone === "error") return
  const id = window.setTimeout(() => onStatusDismiss?.(), statusDismissMs)
  return () => window.clearTimeout(id)
}, [status, statusDismissMs, onStatusDismiss])
```

A status-body sub-component (token-only tones):

```tsx
function StatusBody({
  status,
  t,
  onClose,
}: {
  status: MorphDockStatus
  t: (typeof TONES)[MorphDockTone]
  onClose: () => void
}) {
  return (
    <div className="flex w-full items-start gap-3 p-3.5">
      <span
        className={cn(
          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
          status.tone === "success" && "bg-brand text-brand-foreground",
          status.tone === "error" &&
            "bg-destructive text-destructive-foreground",
          status.tone === "info" && t.statusInfo,
        )}
      >
        {status.tone === "error" ? (
          <X className="size-4.5" />
        ) : status.tone === "info" ? (
          <Info className="size-4.5" />
        ) : (
          <Check className="size-4.5" />
        )}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className={cn("text-[13px] font-semibold", t.title)}>
          {status.title}
        </div>
        {status.message ? (
          <p className={cn("mt-0.5 text-[12px] leading-snug", t.crumb)}>
            {status.message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className={cn(
          "-mr-0.5 -mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg transition-colors",
          t.close,
        )}
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
```

Add tone key `statusInfo` → dock `"bg-dock-active text-dock-active-foreground"`, surface `"bg-muted text-foreground"`.

In the panel body, render the status body when present, else children:

```tsx
<div className={cn(panelH != null && "min-h-0 flex-1 overflow-auto")}>
  {hasStatus ? (
    <StatusBody status={status!} t={t} onClose={() => onStatusDismiss?.()} />
  ) : (
    children
  )}
</div>
```

Header: keep `hasHeader` only for non-status (status carries its own dismiss): `const hasHeader = !hasStatus && (draggable || panelTitle != null || onSave != null);`

- [ ] **Step 4: Run, expect PASS**

Run: `npm run sync && npx vitest run tests/components/morph-dock.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-dock.tsx tests/components/morph-dock.test.tsx components
git commit -m "feat(morph-dock): save/error status bloom via status prop"
```

---

## Task 6: Example gallery

**Files:**

- Delete: `content/examples/morph-dock/sizes.tsx`, `content/examples/morph-dock/save.tsx`
- Create: `split-toolbar.tsx`, `tools-primary.tsx`, `breadcrumb.tsx`, `separators.tsx`, `save-status.tsx` under `content/examples/morph-dock/`
- Modify: `content/examples/registry.ts` (regenerated)

- [ ] **Step 1: Delete superseded demos**

```bash
git rm content/examples/morph-dock/sizes.tsx content/examples/morph-dock/save.tsx
```

- [ ] **Step 2: Create the new example files.** Each is a `"use client"` default-export `Example()` using `@/components/ui/morph-dock`, token utilities only. Write:

`split-toolbar.tsx` — `items` nav + `tools={[{id:'call',label:'Call',icon:Phone},{id:'text',label:'Text',icon:MessageSquare},{id:'new',label:'New',icon:Plus,primary:true}]}` showing the two-tone zone.

`tools-primary.tsx` — `tools` with a `primary` action plus two `group`s to show seams.

`breadcrumb.tsx` — `breadcrumb={[{label:'Home',href:'#'},{label:'Reports',href:'#'},{label:'Q2'}]}` + an `action` that blooms a small panel.

`separators.tsx` — `items` with `group` values producing seams (e.g. `nav` / `tools` / `account`).

`save-status.tsx` — local state cycling `status` through success/error/info via a `tools` "Save" action; wires `onStatusDismiss` to clear.

(Follow the shape of `content/examples/morph-dock/default.tsx`. Import icons from `lucide-react`.)

- [ ] **Step 3: Regenerate the examples registry**

Run: `npm run gen:examples`
Expected: `content/examples/registry.ts` updated; the `"morph-dock"` array now lists the new files and drops `sizes`/`save`.

- [ ] **Step 4: Verify examples gate**

Run: `npm run check:examples`
Expected: pass (every component has a default; new files valid).

- [ ] **Step 5: Commit**

```bash
git add content/examples/morph-dock content/examples/registry.ts
git commit -m "docs(morph-dock): expand variant gallery, drop sizes/save demos"
```

---

## Task 7: Props table, registry validation, full gate

**Files:**

- Modify: `content/components.ts` (morph-dock `props`)
- Modify: `registry.json` (only if a new dep is needed — none expected)

- [ ] **Step 1: Add prop rows** in `content/components.ts` for the morph-dock entry, after the existing `items` row:

```ts
      { name: "tools", type: "MorphDockAction[]", description: "Trailing two-tone tool zone (bg-dock-tool): id, label, icon, optional onSelect/href, primary, group." },
      { name: "breadcrumb", type: "{ label: string; href?: string }[]", description: "Leading crumb trail; last crumb is aria-current." },
      { name: "status", type: "MorphDockStatus | null", description: "Blooms a tone-styled status body (success/error/info). Success/info auto-dismiss; errors persist." },
      { name: "onStatusDismiss", type: "() => void", description: "Called when the status is dismissed (auto or manual)." },
      { name: "statusDismissMs", type: "number", default: "4000", description: "Auto-dismiss delay for success/info status." },
```

Also extend the existing `items` row description to mention `group`.

- [ ] **Step 2: Run the full registry + examples validation**

Run: `npm run update:registry`
Expected: gen all → sync → shadcn build → validate, all green.

- [ ] **Step 3: Run the full test suite with coverage**

Run: `npm run test:ci`
Expected: `check:tests` pass + suite green + coverage ≥ thresholds (statements 99 / branches 96 / functions 100 / lines 99).

- [ ] **Step 4: Commit**

```bash
git add content/components.ts registry.json public/r components
git commit -m "chore(morph-dock): props table + registry rebuild for variants"
```

---

## Self-review (completed)

- **Spec coverage:** tool zone (T3), separators (T2), breadcrumb (T4), status/save (T5), `--dock-tool` token (T1), AI rule (T1), gallery (T6), props table + registry + tests (T7), close-glitch (T0). ✓ All spec sections mapped.
- **Type consistency:** `MorphDockAction`, `MorphDockStatus`, `MorphDockStatusTone`, prop names (`tools`, `breadcrumb`, `status`, `onStatusDismiss`, `statusDismissMs`, `group`) used identically across tasks and the props table. ✓
- **Token consistency:** new `dock-tool` token + `t.tool/toolPrimary/toolQuiet/seam/crumb/statusInfo` tone keys defined once (T1/T3/T4/T5), referenced thereafter. ✓
- **No raw colors:** error → `bg-destructive text-destructive-foreground`; info → token tone keys; no hex/`text-white`. ✓
- **Open risk to validate during build:** tool-zone `-my-[3px]/-mr-[3px]/rounded-r-3xl` fill against the pill corner — confirm visually at http://localhost:3002/docs/morph-dock.

```

```
