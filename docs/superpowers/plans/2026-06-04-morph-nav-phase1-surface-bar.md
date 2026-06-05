# Morph Nav — Phase 1 (MorphSurface + MorphBar) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the agnostic `MorphSurface` primitive (the morph technique made reusable) and prove it with one navigation style, `MorphBar` (a full-width top bar that blooms a panel down).

**Architecture:** `MorphSurface` wraps the existing, untouched `useChromeMorph` hook — it holds open state's refs (`morphRef`/`restRef`/`panelRef`), cross-fades collapsed↔panel, sizes the box per `grow`, and closes on Esc + outside-click. It carries **zero visual styling**; the consumer passes `className`, `placement`, `grow`, `collapsed`, `panel`. `MorphBar` composes it with a top-bar layout. Phase 1 fully exercises `placement="top"` / `grow="height"`; other placements render but are refined in Phase 2.

**Tech Stack:** React, `@base-ui/react` (not needed here), `useChromeMorph`, lucide icons, Vitest + Testing Library + vitest-axe. Repo registry pipeline.

**Reference spec:** `docs/superpowers/specs/2026-06-04-morph-nav-styles-design.md`.

---

## Pre-flight facts (verified)

- `useChromeMorph` (`@/lib/use-chrome-morph`) signature: `{ morphRef, restRef?, panelRef?, open, growHeight, width: () => number, height?: () => number, collapsedFrom?, durationMs?, deps? }`. It animates the `morphRef` box's `width`/`height`/`border-radius`, fading `restRef` out + `panelRef` in when `growHeight` is true. `growHeight: true` animates width+height; `false` is width-only.
- Registry consumer import paths: `@/lib/use-chrome-morph`, `@/lib/utils` (`cn`), `@/components/ui/...`. New UI source lives at `registry/ui/<slug>.tsx`.
- A new `registry:ui` item requires: a `registry.json` entry, `content/examples/<slug>/default.tsx` (registered via `npm run gen:examples`), a `tests/components/<slug>.test.tsx`, and the component name listed in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`). Coverage gate: `components/**` (the synced copy) — run `npm run sync` before coverage; `npm run test:run` runs the suite.
- Test stubs: jsdom lacks `matchMedia`/`ResizeObserver`; stub them per `tests/components/morph-dock.test.tsx`.
- `registry.json` UI item shape: `{ name, type: "registry:ui", title, description, dependencies: [npm], registryDependencies: [@byronwade/...], files: [{ path, type: "registry:ui", target }] }`.

---

## File map

| File | Responsibility | Task |
|---|---|---|
| `registry/ui/morph-surface.tsx` (new) | Agnostic morph primitive: refs, cross-fade, sizing, Esc/outside-close | 1 |
| `tests/components/morph-surface.test.tsx` (new) | Render, open/aria, Esc, outside-click, all placements | 1 |
| `registry.json` (modify) | `morph-surface` + `morph-bar` items | 2, 4 |
| `registry/rules/byronwade-ui.mdc` (modify) | List both component names | 2, 4 |
| `content/examples/morph-surface/default.tsx` (new) | Example | 2 |
| `registry/ui/morph-bar.tsx` (new) | Full-width top bar composing MorphSurface | 3 |
| `tests/components/morph-bar.test.tsx` (new) | Items, active, open/close, axe | 3 |
| `content/examples/morph-bar/default.tsx` (new) | Example | 4 |

---

## Task 1: `MorphSurface` primitive

**Files:**
- Create: `registry/ui/morph-surface.tsx`
- Test: `tests/components/morph-surface.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/morph-surface.test.tsx`:

```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphSurface, type MorphPlacement } from "@/components/ui/morph-surface";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

function Harness({ placement = "top" as MorphPlacement }) {
  const [open, setOpen] = React.useState(false);
  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      grow="height"
      navLabel="Demo nav"
      collapsed={<button onClick={() => setOpen(true)}>open</button>}
      panel={<div>panel body</div>}
    />
  );
}

describe("MorphSurface", () => {
  it("renders the collapsed content inside a labeled nav landmark", () => {
    render(<Harness />);
    const nav = screen.getByRole("navigation", { name: "Demo nav" });
    expect(nav).toHaveAttribute("data-slot", "morph-surface");
    expect(screen.getByRole("button", { name: "open" })).toBeInTheDocument();
  });

  it("toggles aria-hidden on rest/panel when opened", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const rest = container.querySelector('[data-slot="morph-rest"]')!;
    const panel = container.querySelector('[data-slot="morph-panel"]')!;
    expect(rest).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(rest).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open" }));
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("closes on outside pointer-down", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Harness />
        <div data-testid="outside">outside</div>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "false");
    await user.pointer({ keys: "[MouseLeft]", target: screen.getByTestId("outside") });
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "true");
  });

  it("renders for every placement and reflects it via data-placement", () => {
    for (const p of ["top", "bottom", "left", "right"] as MorphPlacement[]) {
      const { container, unmount } = render(<Harness placement={p} />);
      expect(container.querySelector('[data-slot="morph-surface"]')).toHaveAttribute("data-placement", p);
      unmount();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, verify it FAILS**

Run: `npm run sync && npx vitest run tests/components/morph-surface.test.tsx`
Expected: FAIL — `@/components/ui/morph-surface` does not exist. (`npm run sync` copies `registry/` → `components/` so the `@/components/ui/...` import resolves.)

- [ ] **Step 3: Create `registry/ui/morph-surface.tsx`**

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useChromeMorph } from "@/lib/use-chrome-morph";

export type MorphPlacement = "top" | "bottom" | "left" | "right";
export type MorphGrow = "height" | "width" | "both";

/** Anchor the morphing box so it grows the right direction (top edge fixed →
 *  grows down, bottom edge fixed → grows up, etc.). `top` stays in normal flow. */
const ANCHOR: Record<MorphPlacement, string> = {
  top: "",
  bottom: "absolute inset-x-0 bottom-0",
  left: "absolute inset-y-0 left-0",
  right: "absolute inset-y-0 right-0",
};

export interface MorphSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Grow direction (sets the box's anchoring). */
  placement?: MorphPlacement;
  /** Which axes animate. The non-growing axis holds the box's current size. */
  grow?: MorphGrow;
  /** Resting nav content; fades OUT as the panel blooms. */
  collapsed: React.ReactNode;
  /** Bloomed panel; fades IN. */
  panel: React.ReactNode;
  /** Open-box target in px; the growing axis falls back to measuring the panel. */
  size?: { w?: number; h?: number };
  /** Accessible name for the nav landmark. */
  navLabel?: string;
  /** Consumer styles the vessel (bg, radius, shadow, border). Applied to the box. */
  className?: string;
}

/**
 * The morph technique, made agnostic. Wraps `useChromeMorph` with the common
 * orchestration — open state's refs, the rest↔panel cross-fade, box sizing per
 * `grow`, and Esc + outside-click close — and NO visual style of its own. Nav
 * styles (bar, sidebar, tabs, menubar, rail) compose it with their layout.
 */
export function MorphSurface({
  open,
  onOpenChange,
  placement = "top",
  grow = "height",
  collapsed,
  panel,
  size,
  navLabel = "Navigation",
  className,
}: MorphSurfaceProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const morphRef = React.useRef<HTMLDivElement>(null);
  const restRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  useChromeMorph({
    morphRef,
    restRef,
    panelRef,
    open,
    growHeight: grow !== "width",
    // Non-growing axis holds current size; growing axis uses `size` or measures the panel.
    width: () =>
      grow === "height"
        ? (morphRef.current?.offsetWidth ?? 0)
        : (size?.w ?? panelRef.current?.offsetWidth ?? 0),
    height:
      grow === "width" ? undefined : () => size?.h ?? panelRef.current?.offsetHeight ?? 0,
    deps: [grow, placement, size?.w, size?.h],
  });

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, onOpenChange]);

  return (
    <nav
      ref={rootRef}
      data-slot="morph-surface"
      data-placement={placement}
      data-open={open || undefined}
      aria-label={navLabel}
      className={cn(
        "relative",
        placement === "left" || placement === "right" ? "h-full" : "w-full",
      )}
    >
      <div
        ref={morphRef}
        data-slot="morph-box"
        className={cn("relative overflow-hidden", ANCHOR[placement], className)}
      >
        <div ref={restRef} data-slot="morph-rest" aria-hidden={open}>
          {collapsed}
        </div>
        <div
          ref={panelRef}
          data-slot="morph-panel"
          aria-hidden={!open}
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-150",
            !open && "pointer-events-none",
          )}
        >
          {panel}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run the test, verify it PASSES**

Run: `npm run sync && npx vitest run tests/components/morph-surface.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-surface.tsx tests/components/morph-surface.test.tsx
git commit -m "feat(ui): add MorphSurface — agnostic morph primitive"
```

---

## Task 2: Register `MorphSurface`

**Files:**
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`
- Create: `content/examples/morph-surface/default.tsx`

- [ ] **Step 1: Add the registry.json item**

In `registry.json`, in the `items` array (next to the existing `morph-dock` item), add:

```json
{
  "name": "morph-surface",
  "type": "registry:ui",
  "title": "Morph Surface",
  "description": "Agnostic morph primitive — open-state orchestration (refs, cross-fade, Esc/outside-close, box sizing) with no visual style. Navigation styles compose it.",
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/use-chrome-morph"],
  "files": [
    { "path": "registry/ui/morph-surface.tsx", "type": "registry:ui", "target": "components/ui/morph-surface.tsx" }
  ]
}
```

- [ ] **Step 2: List it in the AI rule**

In `registry/rules/byronwade-ui.mdc`, find the line that lists Morph components (it includes `MorphDock` / `useChromeMorph`) and add `MorphSurface` to that list (keep the existing formatting/separators).

- [ ] **Step 3: Create the example**

Create `content/examples/morph-surface/default.tsx`:

```tsx
"use client";

import * as React from "react";
import { MorphSurface } from "@/components/ui/morph-surface";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid w-full max-w-md gap-3 p-6">
      <MorphSurface
        open={open}
        onOpenChange={setOpen}
        placement="top"
        grow="height"
        navLabel="Demo"
        className="rounded-xl edge bg-card shadow-float"
        collapsed={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium outline-none"
          >
            Open panel
            <span className="font-mono text-xs text-muted-foreground">⌄</span>
          </button>
        }
        panel={
          <div className="p-4">
            <p className="px-1 pb-2 text-sm font-medium">Panel</p>
            <p className="px-1 text-[13px] leading-relaxed text-muted-foreground">
              The morph box bloomed open. Press Esc or click outside to close.
            </p>
          </div>
        }
      />
    </div>
  );
}
```

- [ ] **Step 4: Generate the example registry + build**

Run: `npm run gen:examples && npm run update:registry`
Expected: both succeed; `check:rule` (run inside `update:registry`'s `validate`) passes now that `MorphSurface` is listed.

- [ ] **Step 5: Commit**

```bash
git add registry.json registry/rules/byronwade-ui.mdc content/examples/morph-surface content/examples/registry.ts
git commit -m "feat(ui): register MorphSurface (item, rule, example)"
```

---

## Task 3: `MorphBar` style

**Files:**
- Create: `registry/ui/morph-bar.tsx`
- Test: `tests/components/morph-bar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/morph-bar.test.tsx`:

```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphBar } from "@/components/ui/morph-bar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", active: true },
  { id: "docs", label: "Docs" },
  { id: "pricing", label: "Pricing" },
];

describe("MorphBar", () => {
  it("renders the brand and every item, marking the active one", () => {
    render(<MorphBar brand="Acme" items={items} panel={<div>mega</div>} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    for (const i of items) expect(screen.getByRole("link", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("blooms the panel when the menu trigger is clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphBar brand="Acme" items={items} panel={<div>mega menu body</div>} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /menu/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphBar brand="Acme" items={[{ id: "docs", label: "Docs", onSelect }]} panel={<div />} />);
    await user.click(screen.getByRole("link", { name: "Docs" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphBar brand="Acme" items={items} panel={<div>mega</div>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, verify it FAILS**

Run: `npm run sync && npx vitest run tests/components/morph-bar.test.tsx`
Expected: FAIL — `@/components/ui/morph-bar` does not exist.

- [ ] **Step 3: Create `registry/ui/morph-bar.tsx`**

```tsx
"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphBarItem {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
}

export interface MorphBarProps {
  brand: React.ReactNode;
  items: MorphBarItem[];
  /** Content bloomed below the bar (mega-menu / search / command). */
  panel: React.ReactNode;
  /** Open height in px (the bloomed bar + panel). */
  panelHeight?: number;
  navLabel?: string;
  className?: string;
}

/** A full-width top navigation bar that blooms a panel DOWN via the morph
 *  technique (`placement="top"`, `grow="height"`). */
export function MorphBar({
  brand,
  items,
  panel,
  panelHeight = 320,
  navLabel = "Primary",
  className,
}: MorphBarProps) {
  const [open, setOpen] = React.useState(false);

  const links = (
    <ul className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href ?? "#"}
            aria-current={item.active ? "page" : undefined}
            onClick={(e) => {
              if (item.onSelect) {
                e.preventDefault();
                item.onSelect();
              }
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  const Row = (
    <div className="flex h-14 items-center justify-between gap-4 px-4">
      <span className="text-sm font-medium tracking-tight">{brand}</span>
      <div className="flex items-center gap-2">
        {links}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-4" />
        </button>
      </div>
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement="top"
      grow="height"
      navLabel={navLabel}
      size={{ h: panelHeight }}
      className={cn("border-b border-border bg-card", className)}
      collapsed={Row}
      panel={
        <div className="flex h-full flex-col">
          {Row}
          <div className="min-h-0 flex-1 overflow-auto border-t border-border p-4">{panel}</div>
        </div>
      }
    />
  );
}
```

- [ ] **Step 4: Run the test, verify it PASSES**

Run: `npm run sync && npx vitest run tests/components/morph-bar.test.tsx`
Expected: PASS (4 tests). (`aria-current="page"` on the active link; the panel re-renders the same `Row` so the bloom is seamless.)

- [ ] **Step 5: Commit**

```bash
git add registry/ui/morph-bar.tsx tests/components/morph-bar.test.tsx
git commit -m "feat(ui): add MorphBar — full-width top nav on MorphSurface"
```

---

## Task 4: Register `MorphBar`

**Files:**
- Modify: `registry.json`
- Modify: `registry/rules/byronwade-ui.mdc`
- Create: `content/examples/morph-bar/default.tsx`

- [ ] **Step 1: Add the registry.json item**

In `registry.json` `items`, add:

```json
{
  "name": "morph-bar",
  "type": "registry:ui",
  "title": "Morph Bar",
  "description": "Full-width top navigation bar that blooms a panel down via the morph technique.",
  "dependencies": ["lucide-react"],
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/morph-surface"],
  "files": [
    { "path": "registry/ui/morph-bar.tsx", "type": "registry:ui", "target": "components/ui/morph-bar.tsx" }
  ]
}
```

- [ ] **Step 2: List it in the AI rule**

In `registry/rules/byronwade-ui.mdc`, add `MorphBar` to the Morph components list (alongside `MorphSurface`, `MorphDock`).

- [ ] **Step 3: Create the example**

Create `content/examples/morph-bar/default.tsx`:

```tsx
"use client";

import { MorphBar } from "@/components/ui/morph-bar";

export default function Example() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl edge">
      <MorphBar
        brand="byronwade/ui"
        items={[
          { id: "home", label: "Home", active: true },
          { id: "docs", label: "Docs" },
          { id: "catalog", label: "Catalog" },
          { id: "pricing", label: "Pricing" },
        ]}
        panel={
          <div className="grid grid-cols-3 gap-4">
            {["Primitives", "Composites", "Patterns"].map((g) => (
              <div key={g} className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{g}</p>
                <p className="text-[13px] text-muted-foreground">Browse {g.toLowerCase()} →</p>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
```

- [ ] **Step 4: Generate + build**

Run: `npm run gen:examples && npm run update:registry`
Expected: succeeds; `check:rule` passes with `MorphBar` listed.

- [ ] **Step 5: Commit**

```bash
git add registry.json registry/rules/byronwade-ui.mdc content/examples/morph-bar content/examples/registry.ts
git commit -m "feat(ui): register MorphBar (item, rule, example)"
```

---

## Task 5: Phase 1 verification

**Files:** none.

- [ ] **Step 1: Full registry + example + rule gates**

Run: `npm run validate`
Expected: all checks pass (registry manifest, examples present, rule covers both new components, mcp/llms gates). If `check:examples` complains, ensure both `content/examples/morph-surface/default.tsx` and `morph-bar/default.tsx` exist.

- [ ] **Step 2: Test suite + coverage**

Run: `npm run test:ci`
Expected: PASS — `check:tests` finds tests for both new `registry:ui` items, the full suite (incl. the new morph tests) is green, and coverage thresholds hold.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "morph-surface|morph-bar" | grep -v toHaveNoViolations || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Phase 1 exit checklist**

- [ ] `MorphSurface` exists, is style-agnostic (no bg/radius of its own), wraps `useChromeMorph`, closes on Esc + outside-click, and renders for all four placements.
- [ ] `MorphBar` composes `MorphSurface` (`placement="top"`, `grow="height"`) and blooms a panel down.
- [ ] Both registered (item + rule + example + test); `npm run validate` and `npm run test:ci` green.
- [ ] The `MorphSurface` props (`open`, `onOpenChange`, `placement`, `grow`, `collapsed`, `panel`, `size`, `navLabel`, `className`) are the **frozen API** for Phase 2.

---

## Self-review notes

- **Spec coverage:** §2 architecture → Tasks 1, 3 (primitive + Bar). §4 conventions → Tasks 2, 4, 5 (registry, rule, example, test, gates). §3 decomposition → this is Phase 1 (MorphSurface + Bar); Sidebar/Tabs/Menubar/Rail are the Phase 2 plan.
- **`grow` / non-growing axis** (spec §2): handled in `MorphSurface` — `grow="height"` holds `width` at the box's current width; `grow="width"` is width-only; `grow="both"` measures/uses both.
- **Frozen API:** Phase 2 styles consume `MorphSurface` unchanged; only its internal anchoring CSS for `bottom`/`left`/`right` may be refined as Tabs/Sidebar/Rail exercise them — the props don't change.
- **No placeholders:** all component/test/example code is complete; registry JSON is literal.
```
