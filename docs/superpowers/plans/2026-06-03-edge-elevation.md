# Edge-only Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace shadow-based elevation with the `edge` hairline across the registry; remove all drop shadows.

**Architecture:** Mechanical token swap (`shadow-float`/`shadow-card` → `edge`) + remove stray drop-shadow bumps + retire the two shadow utilities from the foundation + reverse the shipped elevation guidance. Single coordinated sweep, then one gate.

**Tech Stack:** Tailwind v4 token utilities, shadcn registry, vitest.

**Spec:** `docs/superpowers/specs/2026-06-03-edge-elevation-design.md`

---

## Task 1: Swap shadow-float/shadow-card → edge in components

**Files:** all of `registry/ui/*.tsx`, `registry/components/*.tsx` that use those classes.

- [ ] **Step 1: Bulk swap**

```bash
grep -rlE "shadow-(float|card)" registry/ui registry/components \
  | xargs sed -i '' 's/shadow-float/edge/g; s/shadow-card/edge/g'
```

- [ ] **Step 2: Remove the two stray drop-shadow bumps**

`registry/ui/chart.tsx:194` — delete the ` shadow-xl` token from that className.
`registry/ui/navigation-menu.tsx:153` — delete the ` shadow-md` token from that className.

- [ ] **Step 3: Fix morph-dock `bare`** (`registry/ui/morph-dock.tsx`)

```tsx
// bare now means truly nothing — no edge hairline, no bg
bare ? "" : t.shell,
```

(was `bare ? "shadow-none" : t.shell`)

- [ ] **Step 4: Verify no shadow-float/card left, and edge present**

```bash
grep -rnE "shadow-(float|card|xl|md)" registry/ui registry/components   # expect: none
```

(Leave the `shadow-none` resets in input-group.tsx / command.tsx — they reset
default form/input shadows, consistent with the no-shadow goal.)

## Task 2: Retire the shadow utilities from the foundation

**Files:** `registry.json` (`@layer utilities`)

- [ ] **Step 1:** Delete the `.shadow-float` and `.shadow-card` blocks (keep `.edge` and the `--edge` token).

- [ ] **Step 2: Verify**

```bash
grep -nE "shadow-float|shadow-card" registry.json   # expect: none
grep -n "\.edge" registry.json                       # expect: still present
```

## Task 3: Reverse the shipped guidance

**Files:** `registry/rules/byronwade-ui.mdc`, `AGENTS.md`

- [ ] **Step 1:** In `byronwade-ui.mdc`, change the elevation guidance — floating
      chrome and cards use the **`edge` hairline; no drop shadows**. Drop
      `shadow-float`/`shadow-card` from the house-utilities list; keep `edge`.
- [ ] **Step 2:** In `AGENTS.md` "House utilities", remove `shadow-float`,
      `shadow-card`; keep `edge`/`bg-grid`/etc.

## Task 4: Update tests

**Files:** `tests/components/{stat-card,dropdown-menu,centered-focal,popover,card,hover-card,section,filter-pill,select}.test.tsx`

- [ ] **Step 1: Swap assertions**

```bash
grep -rlE "shadow-(float|card)" tests/components \
  | xargs sed -i '' 's/shadow-float/edge/g; s/shadow-card/edge/g'
```

- [ ] **Step 2:** morph-dock `bare` test — it asserts `shadow-none` on the bare
      bar; with `bare ? ""`, change that assertion to expect the bar does NOT include
      `bg-dock` and does NOT include `edge` (truly bare):
      `expect(bareBar).not.toHaveClass("edge")`.

## Task 5: Sync, rebuild, gate, commit

- [ ] **Step 1:** `npm run sync`
- [ ] **Step 2:** `npm run update:registry` — expect clean (manifest + built output + examples).
- [ ] **Step 3:** `npm run test:ci` — expect exit 0; coverage ≥ thresholds (99/96/100/99).
- [ ] **Step 4:** Visual spot-check on the running server (cards, a dropdown/popover, morph-dock panel) — all defined by hairline, no drop shadow.
- [ ] **Step 5:** Commit (registry source + tests + rule + AGENTS + lib if synced-tracked).

## Self-review

- **Spec coverage:** swap (T1), remove bumps (T1), bare (T1), foundation retire
  (T2), rule + AGENTS (T3), tests (T4), gate (T5). ✓
- **No placeholders:** exact files/commands given. ✓
- **Consistency:** `edge` is the single replacement token throughout; `shadow-none`
  resets intentionally left. ✓
