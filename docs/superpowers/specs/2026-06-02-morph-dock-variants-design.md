# MorphDock — variant expansion & built-in feature additions

**Date:** 2026-06-02
**Status:** Draft for review
**Component:** `registry/ui/morph-dock.tsx` (+ `registry/lib/use-chrome-morph.ts`, foundation tokens, examples, tests, AI rule)

## Background

`MorphDock` is a config-driven morphing navigation dock: a pill of nav items that
blooms a consumer panel out of itself (via `useChromeMorph`) and shrinks back. It
already supports `items`, a trailing `action` pill, `cluster`, `children` panel,
`panelTitle`, `onSave`, `placement`, `origin`, `tone` (dock/surface), `draggable`,
and `resizable`.

It was extracted from SignalRoute's dashboard dock system. SignalRoute has richer
dock patterns we want to bring into the design system as **built-in features**.

A separate, already-landed fix (close-glitch): `useChromeMorph` now **settles the
morph box at the collapsed bar size on close** instead of clearing its inline
width — eliminating the one-frame snap-to-full-width flash. This spec builds on
that fixed hook.

## Goals

Add four built-in capabilities to `MorphDock`, ported from SignalRoute, and grow
the docs gallery from prop-demos into a curated-but-generous set of variants that
showcase real-world usage.

## Non-goals (explicitly out of scope)

- **Responsive auto-collapse mode machine** (`selectDockMode`: split → combined →
  icons → hamburger). Decision: declarative layouts only. Consumers compose their
  own responsiveness; the design system ships the building blocks. May be revisited
  as an opt-in later.

## Decisions (locked)

1. **Declarative layouts**, not a measured responsive state machine.
2. **Generous gallery**: keep the promising existing demos, add the new structural
   variants, and expand further (see Variant Gallery).
3. New variants are **built-in features** (props/slots on `MorphDock`), which means
   touching the component, foundation tokens, the shipped AI rule
   (`registry/rules/byronwade-ui.mdc`), examples, and tests.

## API additions

### 1. Two-tone tool zone — `tools`

A trailing **tool zone** rendered with a lighter `bg-dock-tool` fill that spans the
full pill height (`self-stretch`), beside the `bg-dock` nav — the visible "split
color" of a combined nav + toolbar in one pill.

```ts
export interface MorphDockAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
  href?: string;
  /** Accented (brand-filled) primary action. */
  primary?: boolean;
  /** Group key — a separator seam is drawn between adjacent differing groups. */
  group?: string;
}

tools?: MorphDockAction[];
```

- Rendered between the nav row and the existing `action`/cluster, inside the pill,
  clipped to the pill radius. The zone cancels the bar's `p-[3px]` with a negative
  margin so the fill reaches the pill edge.
- `primary` actions get `bg-brand text-brand-foreground`; quiet actions are
  text-only until hover (`hover:bg-dock-active`), matching the nav family.
- Surface tone (`tone="surface"`) uses the surface-tone equivalent fill.

### 2. Separators between groups — `group`

Add `group?: string` to **both** `MorphDockItem` and `MorphDockAction`. When two
adjacent rendered entries have different `group` values, insert a seam:
`mx-0.5 h-5 w-px shrink-0 self-center bg-dock-muted` (surface tone: `bg-border`).
This is the "separator version" and it applies to the nav row and the tool zone.

### 3. Breadcrumb region — `breadcrumb`

A leading crumb-trail region, an alternative/companion to the icon-tab nav.

```ts
breadcrumb?: { label: string; href?: string }[];
```

- Rendered as `Crumb / Crumb / Crumb` with chevron separators
  (`ChevronRight`, `text-dock-foreground/40`), last crumb is current
  (`text-dock-active-foreground`, `aria-current="page"`).
- Lives at the pill's leading edge; coexists with `items` (crumbs first) or stands
  alone. Tokens only; truncates with `mask-fade-x` when overflowing.

### 4. Save → status bloom — `status`

Generalize today's `onSave` into a save-then-status flow. When `status` is set, the
panel **blooms into a status body** (same morph), tone-styled:

```ts
export type MorphDockStatusTone = "success" | "error" | "info";
export interface MorphDockStatus {
  tone: MorphDockStatusTone;
  title: string;
  message?: string;
}

status?: MorphDockStatus | null;
onStatusDismiss?: () => void;
/** ms before success/info auto-dismiss; errors never auto-dismiss. Default 4000. */
statusDismissMs?: number;
```

- Status body: tinted `size-9` circle — `success → bg-brand text-brand-foreground`,
  `error → bg-destructive text-destructive-foreground`, `info → bg-muted` (dock
  tone: a translucent `bg-dock-active`) — with Check / X / Info icon + title
  (`text-dock-active-foreground`) + optional message + a dismiss button.
- **success/info auto-dismiss** after `statusDismissMs`; **errors persist** until
  dismissed. Dismiss calls `onStatusDismiss`.
- `error` must resolve to `--destructive` (token), never a literal red.

## Foundation token addition

Add `--dock-tool` (and `--dock-tool-foreground` if needed) to the `foundation` item
in `registry.json`, for both light and dark, plus the `surface`-tone counterpart.
It must read as a subtle step off `--dock` (a lighter shelf), and dark mode comes
free from tokens. Update `registry/rules/byronwade-ui.mdc` to document `dock-tool`
alongside the other `dock-*` tokens so downstream AI output stays in sync.

## Variant gallery (`content/examples/morph-dock/`)

Replace the flat prop-demo list with a curated-but-generous gallery. Final list
(subject to spec-review tweaks):

**Structural / new built-ins**

- `split-toolbar` — two-tone nav + `tools` (combined nav+toolbar)
- `tools-primary` — tool zone with a brand `primary` action + grouped seams
- `breadcrumb` — leading crumb trail
- `separators` — grouped `items` with seams
- `save-status` — Save → success / error / info status bloom

**Real-world bloom panels (kept / promising)**

- `default` — nav + search bloom
- `command` — command palette
- `dialer` — phone dialer
- `launcher` — app launcher
- `notifications` — notifications panel
- `help` — help / shortcuts panel

**Layout & config**

- `expand` — compact ↔ full toggle (core behavior)
- `orientations` — placement top / bottom / left / right
- `origins` — start / center / end bloom origin
- `tones` — dock vs surface
- `panel` — draggable + resizable (consolidated)

**Dropped:** `sizes` (low value), old `save` (superseded by `save-status`).

Each example needs a `content/examples/morph-dock/<slug>.tsx` default export, wired
into `content/examples/registry.ts` via `npm run gen:examples`.

## Testing (mandatory — see AGENTS.md)

`tests/components/morph-dock.test.tsx` must extend to cover, for every new prop:

- `tools` renders, `primary` styling, `onSelect`/`href` behavior, `More` overflow
  (if ported) — and group seams appear between differing groups.
- `breadcrumb` renders crumbs, last is `aria-current="page"`, links navigate.
- `status` renders each tone; success/info auto-dismiss (fake timers), error
  persists; dismiss fires `onStatusDismiss`.
- separators render between groups in both nav and tool zone.
- axe (vitest-axe) clean for each new variant.
- Coverage thresholds (statements ≥ 99 %, branches ≥ 96 %, functions ≥ 100 %,
  lines ≥ 99 %) must stay green: `npm run test:ci`.

## Registry & pipeline

- Update `registry.json` if any new dependency (e.g. additional lucide icons) is
  introduced; `morph-dock` item `files`/deps stay otherwise stable.
- `npm run update:registry` (gen all → sync → build → validate).
- `npm run check:examples` — every variant has a default example.
- Update the props table in `content/components.ts` for the new props.

## Risks / open questions

- **Tool-zone clipping vs `p-[3px]`** — the full-height fill must reach the pill
  edge without breaking the rounded corners; needs careful negative-margin +
  `overflow-hidden` on the pill. Validate visually.
- **`status` vs `children`** — when both are present, status takes over the panel
  body for its duration; confirm the precedence reads well.
- **Breadcrumb + morph** — does the dock still bloom a panel when leading content is
  a breadcrumb, or is breadcrumb purely a resting-state nav? Assume it can still
  bloom via `action`/`tools`.
- Final variant list may be trimmed/extended at spec review.
