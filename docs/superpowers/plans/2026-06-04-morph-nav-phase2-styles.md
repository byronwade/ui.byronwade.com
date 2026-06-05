# Morph Nav — Phase 2 (Sidebar · Tabs · Menubar · Rail) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the remaining four morph navigation styles — `MorphSidebar`, `MorphTabs`, `MorphMenubar`, `MorphRail` — on the now-frozen `MorphSurface` primitive, each with registry item, rule line, example, and tests.

**Architecture:** Every style is a thin component that composes `MorphSurface` (the agnostic morph orchestration from Phase 1) with its own layout + tokens. `MorphSurface` is NOT modified. Each style passes an explicit `size` on its growing axis (the panel is `absolute inset-0`, so auto-measuring the growing axis is circular). `MorphMenubar` resolves "dropdown in place" internally via a per-trigger `offsetLeft` read — the frozen API is untouched.

**Tech Stack:** React 19, `@base-ui` patterns where applicable, Tailwind v4 token utilities, `lucide-react`, Vitest + Testing Library + vitest-axe.

**Frozen `MorphSurface` API (do not change):**
```tsx
<MorphSurface
  open onOpenChange
  placement="top"|"bottom"|"left"|"right"
  grow="height"|"width"|"both"
  collapsed={ReactNode}      // resting nav; fades OUT
  panel={ReactNode}          // bloomed; fades IN
  size={{ w?: number; h?: number }}  // explicit target on the GROWING axis
  navLabel="…"               // nav landmark name
  className="…"              // styles the morph box (bg/border/radius)
/>
```
Corrected grow axes (see spec §2 correction note): Sidebar `left`/`width`, Tabs `bottom`/`height`, Menubar `top`/`height`, Rail `right`/`width`. None use `both`.

**Conventions every task follows** (from AGENTS.md):
- Source: `registry/ui/<slug>.tsx` — `"use client"`, named export at bottom is fine but these files export inline `export function`. `cn()` from `@/lib/utils`, import `MorphSurface` from `@/components/ui/morph-surface`. Tokens only — no raw color. `data-slot` is carried by MorphSurface's parts; style components add their own where they own a structural element. `focus-visible:ring-2 focus-visible:ring-ring` on every control. Icon-only controls MUST have `aria-label`.
- Register in `registry.json` (item object below). Add the name to the Morph bullet in `registry/rules/byronwade-ui.mdc`.
- `content/examples/<slug>/default.tsx`, then `npm run gen:examples`.
- `tests/components/<slug>.test.tsx` — stub `matchMedia` + `ResizeObserver` (jsdom can't size), cover render / open+Esc / onSelect / axe.
- `npm run update:registry` then `npm run test:ci` must be green before commit.
- **Do NOT edit `content/components.ts`** (user edits it concurrently). Catalog/docs routing is out of scope for this plan.

---

### Task 1: MorphSidebar (left · width)

A vertical icon rail (resting) that morphs **wider** into a labeled sidebar. A toggle button blooms/collapses it.

**Files:**
- Create: `registry/ui/morph-sidebar.tsx`
- Modify: `registry.json` (add item)
- Modify: `registry/rules/byronwade-ui.mdc` (Morph bullet)
- Create: `content/examples/morph-sidebar/default.tsx`
- Test: `tests/components/morph-sidebar.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/components/morph-sidebar.test.tsx`:
```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, Inbox, Settings } from "lucide-react";
import { MorphSidebar } from "@/components/ui/morph-sidebar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", icon: Home, active: true },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "settings", label: "Settings", icon: Settings },
];

describe("MorphSidebar", () => {
  it("renders every item in the resting rail, marking the active one", () => {
    render(<MorphSidebar items={items} />);
    for (const i of items) expect(screen.getByRole("link", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("expands when the toggle is clicked and collapses on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphSidebar items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /expand sidebar/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphSidebar items={[{ id: "home", label: "Home", icon: Home, onSelect }]} />);
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphSidebar items={items} brand={<span>UI</span>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/morph-sidebar.test.tsx`
Expected: FAIL — cannot resolve `@/components/ui/morph-sidebar`.

- [ ] **Step 3: Write the component**

`registry/ui/morph-sidebar.tsx`:
```tsx
"use client";

import * as React from "react";
import { PanelLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphSidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
}

export interface MorphSidebarProps {
  items: MorphSidebarItem[];
  /** Brand/logo shown at the top of the rail. */
  brand?: React.ReactNode;
  /** Expanded sidebar width in px. */
  expandedWidth?: number;
  navLabel?: string;
  className?: string;
}

/** A left icon rail that morphs WIDER into a labeled sidebar via the morph
 *  technique (`placement="left"`, `grow="width"`). The rail is the resting
 *  state; a toggle blooms the labeled panel. */
export function MorphSidebar({
  items,
  brand,
  expandedWidth = 240,
  navLabel = "Sidebar",
  className,
}: MorphSidebarProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (
    <button
      type="button"
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className="grid size-9 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <PanelLeft className="size-4" />
    </button>
  );

  const link = (item: MorphSidebarItem, expanded: boolean) => {
    const Icon = item.icon;
    return (
      <a
        key={item.id}
        href={item.href ?? "#"}
        aria-current={item.active ? "page" : undefined}
        aria-label={expanded ? undefined : item.label}
        onClick={(e) => {
          if (item.onSelect) {
            e.preventDefault();
            item.onSelect();
          }
        }}
        className={cn(
          "flex h-9 items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          expanded ? "gap-3 px-2.5 text-sm" : "w-9 justify-center",
          item.active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="size-4 shrink-0" />
        {expanded ? <span className="truncate">{item.label}</span> : null}
      </a>
    );
  };

  const Rail = (
    <div className="flex h-full w-14 flex-col gap-1 p-2">
      {brand ? <div className="mb-2 grid h-9 place-items-center">{brand}</div> : null}
      {items.map((item) => link(item, false))}
      <div className="mt-auto">{toggle}</div>
    </div>
  );

  const Expanded = (
    <div className="flex h-full flex-col gap-1 p-2" style={{ width: expandedWidth }}>
      {brand ? (
        <div className="mb-2 flex h-9 items-center px-1 text-sm font-medium tracking-tight">{brand}</div>
      ) : null}
      {items.map((item) => link(item, true))}
      <div className="mt-auto">{toggle}</div>
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement="left"
      grow="width"
      navLabel={navLabel}
      size={{ w: expandedWidth }}
      className={cn("h-full border-r border-border bg-card", className)}
      collapsed={Rail}
      panel={Expanded}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/morph-sidebar.test.tsx`
Expected: PASS (4/4).

- [ ] **Step 5: Register the item in `registry.json`**

Add this object to the `items` array (e.g. immediately after the `morph-bar` item):
```json
{
  "name": "morph-sidebar",
  "type": "registry:ui",
  "title": "Morph Sidebar",
  "description": "Left icon rail that morphs wider into a labeled sidebar via the morph technique.",
  "dependencies": ["lucide-react"],
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/morph-surface"],
  "files": [
    { "path": "registry/ui/morph-sidebar.tsx", "type": "registry:ui", "target": "components/ui/morph-sidebar.tsx" }
  ]
}
```

- [ ] **Step 6: Add the name to the rule**

In `registry/rules/byronwade-ui.mdc`, extend the Morph bullet (the one listing `use-chrome-morph`, `morph-dock`, `morph-surface`, `morph-bar`) to also name `morph-sidebar`. (You may add all four Phase 2 names here in one edit if doing the tasks back-to-back — `morph-sidebar`, `morph-tabs`, `morph-menubar`, `morph-rail` — but at minimum this task must add `morph-sidebar`.) Keep the descriptive parentheticals brief and tokens-accurate.

- [ ] **Step 7: Add the example**

`content/examples/morph-sidebar/default.tsx`:
```tsx
"use client";

import { Home, Inbox, BarChart3, Settings } from "lucide-react";
import { MorphSidebar } from "@/components/ui/morph-sidebar";

export default function Example() {
  return (
    <div className="flex h-80 overflow-hidden rounded-xl edge">
      <MorphSidebar
        brand="UI"
        items={[
          { id: "home", label: "Home", icon: Home, active: true },
          { id: "inbox", label: "Inbox", icon: Inbox },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ]}
      />
      <div className="flex-1 bg-background" />
    </div>
  );
}
```

- [ ] **Step 8: Build registry + run full gate**

Run: `npm run gen:examples && npm run update:registry && npm run test:ci`
Expected: all green (registry valid, examples present, rule sync, tests + coverage).

- [ ] **Step 9: Commit**

```bash
git add registry/ui/morph-sidebar.tsx registry.json registry/rules/byronwade-ui.mdc content/examples/morph-sidebar tests/components/morph-sidebar.test.tsx
git commit -m "feat(ui): add morph-sidebar (Morph Nav Phase 2, left/width on MorphSurface)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: MorphTabs (bottom · height)

A mobile bottom tab bar (resting) where a trailing handle blooms a **sheet up**; the tab row stays pinned to the bottom edge.

**Files:**
- Create: `registry/ui/morph-tabs.tsx`
- Modify: `registry.json`, `registry/rules/byronwade-ui.mdc`
- Create: `content/examples/morph-tabs/default.tsx`
- Test: `tests/components/morph-tabs.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/components/morph-tabs.test.tsx`:
```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, Search, Bell } from "lucide-react";
import { MorphTabs } from "@/components/ui/morph-tabs";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", icon: Home, active: true },
  { id: "search", label: "Search", icon: Search },
  { id: "alerts", label: "Alerts", icon: Bell },
];

describe("MorphTabs", () => {
  it("renders every tab, marking the active one", () => {
    render(<MorphTabs items={items} sheet={<div>sheet</div>} />);
    for (const i of items) expect(screen.getByRole("button", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("blooms the sheet when the handle is clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphTabs items={items} sheet={<div>sheet body</div>} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /open sheet/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when a tab is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphTabs items={[{ id: "home", label: "Home", icon: Home, onSelect }]} sheet={<div />} />);
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphTabs items={items} sheet={<div>sheet</div>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/morph-tabs.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Write the component**

`registry/ui/morph-tabs.tsx`:
```tsx
"use client";

import * as React from "react";
import { ChevronUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphTabsItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
  active?: boolean;
}

export interface MorphTabsProps {
  items: MorphTabsItem[];
  /** Content bloomed UP above the tab row. */
  sheet: React.ReactNode;
  /** Open height in px (sheet + tab row). */
  sheetHeight?: number;
  navLabel?: string;
  className?: string;
}

/** A bottom tab bar that blooms a sheet UP via the morph technique
 *  (`placement="bottom"`, `grow="height"`). The tab row is the resting state and
 *  re-appears pinned to the bottom of the bloomed panel. */
export function MorphTabs({
  items,
  sheet,
  sheetHeight = 320,
  navLabel = "Tabs",
  className,
}: MorphTabsProps) {
  const [open, setOpen] = React.useState(false);

  const Row = (
    <div className="flex h-16 items-stretch justify-around gap-1 px-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={item.active ? "page" : undefined}
            onClick={() => item.onSelect?.()}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[11px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="font-mono">{item.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="Open sheet"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid w-10 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronUp className="size-4" />
      </button>
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      grow="height"
      navLabel={navLabel}
      size={{ h: sheetHeight }}
      className={cn("border-t border-border bg-card", className)}
      collapsed={Row}
      panel={
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1 overflow-auto p-4">{sheet}</div>
          <div className="border-t border-border">{Row}</div>
        </div>
      }
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/morph-tabs.test.tsx`
Expected: PASS (4/4).

- [ ] **Step 5: Register the item in `registry.json`**
```json
{
  "name": "morph-tabs",
  "type": "registry:ui",
  "title": "Morph Tabs",
  "description": "Bottom tab bar that blooms a sheet up via the morph technique.",
  "dependencies": ["lucide-react"],
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/morph-surface"],
  "files": [
    { "path": "registry/ui/morph-tabs.tsx", "type": "registry:ui", "target": "components/ui/morph-tabs.tsx" }
  ]
}
```

- [ ] **Step 6: Add `morph-tabs` to the Morph bullet in `registry/rules/byronwade-ui.mdc`** (if not already added in Task 1's Step 6).

- [ ] **Step 7: Add the example**

`content/examples/morph-tabs/default.tsx`:
```tsx
"use client";

import { Home, Search, Bell, User } from "lucide-react";
import { MorphTabs } from "@/components/ui/morph-tabs";

export default function Example() {
  return (
    <div className="relative h-96 w-full max-w-sm overflow-hidden rounded-xl edge bg-background">
      <div className="absolute inset-x-0 bottom-0">
        <MorphTabs
          items={[
            { id: "home", label: "Home", icon: Home, active: true },
            { id: "search", label: "Search", icon: Search },
            { id: "alerts", label: "Alerts", icon: Bell },
            { id: "you", label: "You", icon: User },
          ]}
          sheet={
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-tight">Quick actions</p>
              <p className="text-[13px] text-muted-foreground">Pull up the sheet for more.</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Build registry + run full gate**

Run: `npm run gen:examples && npm run update:registry && npm run test:ci`
Expected: all green.

- [ ] **Step 9: Commit**
```bash
git add registry/ui/morph-tabs.tsx registry.json registry/rules/byronwade-ui.mdc content/examples/morph-tabs tests/components/morph-tabs.test.tsx
git commit -m "feat(ui): add morph-tabs (Morph Nav Phase 2, bottom/height sheet on MorphSurface)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: MorphMenubar (top · height) — dropdown in place

A slim horizontal menubar (File / Edit / View). Clicking a menu blooms its dropdown **positioned under that trigger** (measured via `offsetLeft` inside the component — `MorphSurface` is untouched). Box height is the bar + the active menu's dropdown.

**Files:**
- Create: `registry/ui/morph-menubar.tsx`
- Modify: `registry.json`, `registry/rules/byronwade-ui.mdc`
- Create: `content/examples/morph-menubar/default.tsx`
- Test: `tests/components/morph-menubar.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/components/morph-menubar.test.tsx`:
```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphMenubar } from "@/components/ui/morph-menubar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const menus = [
  { id: "file", label: "File", items: [{ id: "new", label: "New" }, { id: "open", label: "Open" }] },
  { id: "edit", label: "Edit", items: [{ id: "undo", label: "Undo" }] },
];

describe("MorphMenubar", () => {
  it("renders every top-level menu", () => {
    render(<MorphMenubar menus={menus} />);
    for (const m of menus) expect(screen.getByRole("button", { name: m.label })).toBeInTheDocument();
  });

  it("blooms a menu's dropdown when clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphMenubar menus={menus} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "File" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("menuitem", { name: "New" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect and closes when a menu item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphMenubar menus={[{ id: "file", label: "File", items: [{ id: "new", label: "New", onSelect }] }]} />);
    await user.click(screen.getByRole("button", { name: "File" }));
    await user.click(screen.getByRole("menuitem", { name: "New" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphMenubar menus={menus} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/morph-menubar.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Write the component**

`registry/ui/morph-menubar.tsx`:
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphMenubarMenuItem {
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface MorphMenubarMenu {
  id: string;
  label: string;
  items: MorphMenubarMenuItem[];
}

export interface MorphMenubarProps {
  menus: MorphMenubarMenu[];
  navLabel?: string;
  className?: string;
}

const BAR_H = 40; // px — slim menubar row
const ITEM_H = 32; // px — one dropdown item

/** A slim menubar that blooms the active menu's dropdown IN PLACE — positioned
 *  under its trigger — via the morph technique (`placement="top"`,
 *  `grow="height"`). The dropdown offset is measured inside this component, so
 *  the agnostic MorphSurface primitive stays untouched. */
export function MorphMenubar({ menus, navLabel = "Menubar", className }: MorphMenubarProps) {
  const [active, setActive] = React.useState<{ id: string; left: number } | null>(null);
  const open = active !== null;
  const activeMenu = active ? (menus.find((m) => m.id === active.id) ?? null) : null;
  const dropdownH = activeMenu ? activeMenu.items.length * ITEM_H + 8 : 0;

  const close = () => setActive(null);

  const Bar = (
    <div className="flex items-center gap-0.5 px-2" style={{ height: BAR_H }}>
      {menus.map((menu) => (
        <button
          key={menu.id}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open && active?.id === menu.id}
          onClick={(e) => {
            const left = e.currentTarget.offsetLeft;
            setActive((cur) => (cur?.id === menu.id ? null : { id: menu.id, left }));
          }}
          className={cn(
            "rounded px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            open && active?.id === menu.id
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {menu.label}
        </button>
      ))}
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
      }}
      placement="top"
      grow="height"
      navLabel={navLabel}
      size={{ h: BAR_H + dropdownH }}
      className={cn("border-b border-border bg-card", className)}
      collapsed={Bar}
      panel={
        <div className="relative h-full">
          {Bar}
          {activeMenu ? (
            <div
              role="menu"
              aria-label={activeMenu.label}
              style={{ left: active!.left, top: BAR_H }}
              className="absolute min-w-40 rounded-lg bg-popover p-1 text-popover-foreground edge"
            >
              {activeMenu.items.map((mi) => (
                <button
                  key={mi.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    mi.onSelect?.();
                    close();
                  }}
                  className="flex h-8 w-full items-center rounded-md px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                >
                  {mi.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      }
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/morph-menubar.test.tsx`
Expected: PASS (4/4).

Note on the dropdown duplication: when closed, the panel (and its `role="menu"`) is `aria-hidden`, so role queries only see the collapsed `Bar`. When open, the rest `Bar` is `aria-hidden` and the panel's menu items are queryable. `getByRole("menuitem", …)` therefore resolves to exactly one element. If `getByRole` reports multiple matches, that is the bug to fix (likely a stray duplicate), not the test.

- [ ] **Step 5: Register the item in `registry.json`**
```json
{
  "name": "morph-menubar",
  "type": "registry:ui",
  "title": "Morph Menubar",
  "description": "Slim menubar that blooms the active menu's dropdown in place via the morph technique.",
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/morph-surface"],
  "files": [
    { "path": "registry/ui/morph-menubar.tsx", "type": "registry:ui", "target": "components/ui/morph-menubar.tsx" }
  ]
}
```
(No `dependencies` — this component imports no third-party package; it uses only React + MorphSurface.)

- [ ] **Step 6: Add `morph-menubar` to the Morph bullet in `registry/rules/byronwade-ui.mdc`** (if not already added).

- [ ] **Step 7: Add the example**

`content/examples/morph-menubar/default.tsx`:
```tsx
"use client";

import { MorphMenubar } from "@/components/ui/morph-menubar";

export default function Example() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl edge">
      <MorphMenubar
        menus={[
          { id: "file", label: "File", items: [{ id: "new", label: "New File" }, { id: "open", label: "Open…" }, { id: "save", label: "Save" }] },
          { id: "edit", label: "Edit", items: [{ id: "undo", label: "Undo" }, { id: "redo", label: "Redo" }] },
          { id: "view", label: "View", items: [{ id: "zoom-in", label: "Zoom In" }, { id: "zoom-out", label: "Zoom Out" }] },
        ]}
      />
    </div>
  );
}
```

- [ ] **Step 8: Build registry + run full gate**

Run: `npm run gen:examples && npm run update:registry && npm run test:ci`
Expected: all green.

- [ ] **Step 9: Commit**
```bash
git add registry/ui/morph-menubar.tsx registry.json registry/rules/byronwade-ui.mdc content/examples/morph-menubar tests/components/morph-menubar.test.tsx
git commit -m "feat(ui): add morph-menubar (Morph Nav Phase 2, top/height dropdown-in-place on MorphSurface)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: MorphRail (right · width)

A compact icon rail on the right (activity-bar style). Clicking an icon blooms a wide labeled panel to its left; the rail re-appears pinned to the right edge. Mirror of MorphSidebar, right-anchored.

**Files:**
- Create: `registry/ui/morph-rail.tsx`
- Modify: `registry.json`, `registry/rules/byronwade-ui.mdc`
- Create: `content/examples/morph-rail/default.tsx`
- Test: `tests/components/morph-rail.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/components/morph-rail.test.tsx`:
```tsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Files, Search, GitBranch } from "lucide-react";
import { MorphRail } from "@/components/ui/morph-rail";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "files", label: "Files", icon: Files, panel: <div>files panel</div> },
  { id: "search", label: "Search", icon: Search, panel: <div>search panel</div> },
  { id: "git", label: "Source Control", icon: GitBranch, panel: <div>git panel</div> },
];

describe("MorphRail", () => {
  it("renders every rail item", () => {
    render(<MorphRail items={items} />);
    for (const i of items) expect(screen.getByRole("button", { name: i.label })).toBeInTheDocument();
  });

  it("blooms an item's panel when clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphRail items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("toggles the panel closed when the active item is clicked again", async () => {
    const user = userEvent.setup();
    render(<MorphRail items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphRail items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/morph-rail.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Write the component**

`registry/ui/morph-rail.tsx`:
```tsx
"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphRailItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Content shown when this item is active. */
  panel: React.ReactNode;
}

export interface MorphRailProps {
  items: MorphRailItem[];
  /** Expanded width in px (content panel + rail). */
  expandedWidth?: number;
  navLabel?: string;
  className?: string;
}

/** A right icon rail (activity-bar style) that blooms a wide labeled panel to
 *  its left via the morph technique (`placement="right"`, `grow="width"`). The
 *  rail re-appears pinned to the right edge of the bloomed panel. */
export function MorphRail({
  items,
  expandedWidth = 360,
  navLabel = "Activity rail",
  className,
}: MorphRailProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const open = activeId !== null;
  const activeItem = items.find((i) => i.id === activeId) ?? null;

  const Rail = (
    <div className="flex h-full w-14 flex-col items-center gap-1 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-expanded={open && activeId === item.id}
            onClick={() => setActiveId((cur) => (cur === item.id ? null : item.id))}
            className={cn(
              "grid size-9 place-items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              open && activeId === item.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={(o) => {
        if (!o) setActiveId(null);
      }}
      placement="right"
      grow="width"
      navLabel={navLabel}
      size={{ w: expandedWidth }}
      className={cn("h-full border-l border-border bg-card", className)}
      collapsed={Rail}
      panel={
        <div className="flex h-full" style={{ width: expandedWidth }}>
          <div className="min-w-0 flex-1 overflow-auto border-r border-border p-4">
            {activeItem ? (
              <>
                <p className="mb-2 text-sm font-medium tracking-tight">{activeItem.label}</p>
                {activeItem.panel}
              </>
            ) : null}
          </div>
          {Rail}
        </div>
      }
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/morph-rail.test.tsx`
Expected: PASS (4/4).

- [ ] **Step 5: Register the item in `registry.json`**
```json
{
  "name": "morph-rail",
  "type": "registry:ui",
  "title": "Morph Rail",
  "description": "Right icon rail that blooms a wide labeled panel to the side via the morph technique.",
  "dependencies": ["lucide-react"],
  "registryDependencies": ["@byronwade/foundation", "@byronwade/utils", "@byronwade/morph-surface"],
  "files": [
    { "path": "registry/ui/morph-rail.tsx", "type": "registry:ui", "target": "components/ui/morph-rail.tsx" }
  ]
}
```

- [ ] **Step 6: Ensure all four Phase 2 names are in the Morph bullet in `registry/rules/byronwade-ui.mdc`** — `morph-sidebar`, `morph-tabs`, `morph-menubar`, `morph-rail`.

- [ ] **Step 7: Add the example**

`content/examples/morph-rail/default.tsx`:
```tsx
"use client";

import { Files, Search, GitBranch, Bug } from "lucide-react";
import { MorphRail } from "@/components/ui/morph-rail";

export default function Example() {
  return (
    <div className="flex h-80 overflow-hidden rounded-xl edge">
      <div className="flex-1 bg-background" />
      <MorphRail
        items={[
          { id: "files", label: "Files", icon: Files, panel: <p className="text-[13px] text-muted-foreground">Explorer tree…</p> },
          { id: "search", label: "Search", icon: Search, panel: <p className="text-[13px] text-muted-foreground">Search results…</p> },
          { id: "git", label: "Source Control", icon: GitBranch, panel: <p className="text-[13px] text-muted-foreground">Changes…</p> },
          { id: "debug", label: "Run & Debug", icon: Bug, panel: <p className="text-[13px] text-muted-foreground">Breakpoints…</p> },
        ]}
      />
    </div>
  );
}
```

- [ ] **Step 8: Build registry + run full gate**

Run: `npm run gen:examples && npm run update:registry && npm run test:ci`
Expected: all green.

- [ ] **Step 9: Commit**
```bash
git add registry/ui/morph-rail.tsx registry.json registry/rules/byronwade-ui.mdc content/examples/morph-rail tests/components/morph-rail.test.tsx
git commit -m "feat(ui): add morph-rail (Morph Nav Phase 2, right/width on MorphSurface)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Phase 2 verification sweep

**Files:** none (verification only).

- [ ] **Step 1: Full validate + tests**

Run: `npm run validate && npm run test:ci`
Expected: both exit 0. `validate` covers registry integrity, examples present, rule sync (all four names listed, no ghost install refs, accent tokens intact). `test:ci` covers test-file presence + suite + coverage thresholds.

- [ ] **Step 2: Typecheck the new files**

Run: `npx tsc --noEmit -p tsconfig.json` (or `npm run build` if that is the canonical typecheck — see the `build vs test:ci typecheck` note: `test:ci` does NOT typecheck).
Expected: no errors in any `registry/ui/morph-*.tsx`.

- [ ] **Step 3: Confirm the four items built**

Run: `ls public/r/morph-sidebar.json public/r/morph-tabs.json public/r/morph-menubar.json public/r/morph-rail.json`
Expected: all four exist (regenerated by `registry:build`).

---

## Self-Review (author)

**Spec coverage:** All four §2 styles implemented with the corrected grow axes (Sidebar left/width, Tabs bottom/height, Menubar top/height, Rail right/width). Each has source + registry item + rule line + example + tests (render, open+Esc, onSelect/active, axe) per §4/§5. Menubar's "dropdown in place" resolved in-component (§2 correction note). ✓

**Placeholder scan:** No TBD/TODO. Every component, test, example, and registry object is complete code. Shadow utilities avoided (`shadow-float`/`shadow-card` don't exist); dropdown uses the canonical `rounded-lg bg-popover p-1 text-popover-foreground edge` surface from `dropdown-menu.tsx`. ✓

**Type consistency:** Item prop names consistent within each component. All four pass explicit `size` on their growing axis (matches `MorphSurface`'s circular-measure constraint). `MorphSurface` props (`open`, `onOpenChange`, `placement`, `grow`, `collapsed`, `panel`, `size`, `navLabel`, `className`) used exactly as frozen. ✓

**Convention check:** `"use client"`, `cn()` + `className` passthrough, tokens only, `focus-visible:ring-ring` on all controls, `aria-label` on all icon-only controls, `aria-current`/`aria-expanded`/`aria-haspopup` where semantically due. `content/components.ts` untouched. ✓
