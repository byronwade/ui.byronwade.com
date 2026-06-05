# Governance audit report — existing registry

**Date:** 2026-06-04
**Phase:** B (audit only — no code changed)
**Inputs:** `check:conventions`, `prettier --check`, `lint:on-system`
**Gate this blocks:** Phase C (fix to conformance) — do not start until this report is reviewed.

This is the violations inventory the new Phase-A gates surface against the existing tree. Nothing
here failed CI: formatting and the `data-slot` / `export default` rules are report-only ratchets, and
the on-system lint is a separate command. Phase C clears these in reviewed batches, then promotes
each ratchet to hard-fail.

## Summary

| Area                                             | Count           | Severity | Nature                           |
| ------------------------------------------------ | --------------- | -------- | -------------------------------- |
| Formatting (Prettier) — registry source          | 77 files        | Low      | Mechanical (`prettier --write`)  |
| Formatting — `content/` (examples)               | 468 files       | Low      | Mechanical                       |
| Formatting — `app` / `scripts` / `tests` / `lib` | 62 / 16 / 9 / 4 | Low      | Mechanical                       |
| Missing `data-slot`                              | 18 components   | Medium   | Per-file edit + test             |
| `export default` on a component                  | 3 components    | Medium   | Rename to named export           |
| On-system lint — errors                          | 4 (2 files)     | **High** | Raw color / hand-rolled gradient |
| On-system lint — warnings                        | 9 (6 files)     | Medium   | Arbitrary px radius/spacing      |

## High — on-system DNA violations (fix first; some need a judgment call)

From `npm run lint:on-system` (4 errors, 9 warnings, 7 files):

**Errors**

- `registry/ui/color-picker.tsx` — raw color `#FF0000` + two hand-rolled gradients (the hue
  spectrum). **Judgment call:** a color picker legitimately renders a literal spectrum; tokens can't
  express a rainbow. Options: (a) keep but isolate the raw spectrum behind a documented, lint-ignored
  constant; (b) move the gradient to a CSS var in foundation. Decide before "fixing".
- `registry/ui/apple-cards-carousel.tsx` — hand-rolled `bg-gradient-to-b`. Replace with a house
  utility (`mask-fade-y`/`glow-brand`) or a documented foundation gradient.

**Warnings — arbitrary px values** (replace with the `--radius`/spacing scale):

- `chart.tsx` (`rounded-[2px]` ×2), `checkbox.tsx` (`rounded-[4px]`), `gantt.tsx` (`rounded-[2px]`),
  `tooltip.tsx` (`rounded-[2px]`), `morph-dock.tsx` (`p-[3px]`, `-my-[3px]`, `-mr-[3px]`, `pr-[7px]`).
  Some (e.g. `morph-dock` hairline insets) may be intentional sub-pixel chrome — confirm each.

## Medium — `export default` → named export (3)

Switch to a bottom named export (`export { X }`) and update any importers (`app/`, examples):

- `registry/ui/world-map.tsx`
- `registry/ui/morph-dock.tsx`
- `registry/components/conversation-list.tsx`

## Medium — missing `data-slot` (18)

Add `data-slot` to the rendered root (and notable parts). Note two judgment cases: `sonner.tsx`
wraps a third-party toaster (slot may belong on the wrapper only), and `status-dot`/`badge` are tiny
atoms (root slot is enough).

**UI primitives (6):** `status-dot`, `gradient-avatar`, `activity-grid`, `segmented-control`,
`badge`, `sonner`
**Composites (12):** `timeline-rail`, `split-with-rail`, `hero-section`, `metric-stat`,
`centered-focal`, `status-pill`, `page-header`, `stat-card`, `empty-state`, `detail-header`,
`section`, `event-timeline`

## Low — formatting (Prettier, `semi: false`)

636 files in `registry`/`app`/`content`/`scripts`/`tests`/`lib` differ from Prettier (**761
repo-wide** including `.md`/`.mdc`/`.css`, root, and `packages/`). Entirely mechanical — `prettier
--write` fixes all. Largest bucket is `content/` examples (468). No review needed per-file; review
the _diff shape_ once. Note: the Phase-A docs just written (`CONVENTIONS.md`, the two agent files,
this report) are in the repo-wide count and will reformat in Batch 0.

## Phase C status (branch `chore/governance-phase-c`)

**Batches 0–4 ALL done & green** (`validate` + `test:ci` + `npm run build` all exit 0;
`lint:on-system` 0 errors). All four structural checks (`check:conventions`) and `check:format` are
CI-enforced. Two issues surfaced during full validation and were fixed in-branch: `badge` needed a
type-safe `data-slot` cast (Base UI `mergeProps` object literal), and `registry.json` +
`content/examples/registry.ts` are now Prettier-ignored because their generators (`gen-all-item` /
`gen-examples`) own the format (Prettier was fighting them, making `check:format` flaky after every
build). **Integration into `feat/brand-reskin-hero` is deferred** until that branch (advanced ≥5
commits) is quiet — merge will conflict on co-touched files from the 761-file format sweep.

## Proposed Phase C batches (each ends green on `npm run test:ci`)

Ordered to keep every diff reviewable and coverage stable. Run in a **git worktree** (a concurrent
session edits this branch live). ✅ = done on `chore/governance-phase-c`.

- ✅ **Batch 0 — Format.** `npm run format` (whole tree). `check:format` added to `validate`.
- ✅ **Batch 1 — `export default` → named (3).** All three already had named exports; removed the
  dead defaults. `export default` check promoted to enforce.
- ✅ **Batch 2 — `data-slot`, primitives (6).**
- ✅ **Batch 3 — `data-slot`, composites (12).** `data-slot` check promoted to enforce.
- ✅ **Batch 4 — On-system DNA.** Cleared all 3 lint ERRORS: `color-picker` hue/alpha and
  `apple-cards-carousel` scrim now use new foundation utilities (`.color-picker-hue`,
  `.color-picker-alpha-fade`, `.scrim-top`); `morph-dock` insets kept as intentional chrome +
  comment. 9 non-blocking px warnings remain by design.

## Open decisions — all resolved

1. ✅ **color-picker raw spectrum** — moved to foundation utilities (`.color-picker-hue`,
   `.color-picker-alpha-fade`), documented in the rule.
2. ✅ **morph-dock sub-pixel insets** — kept as intentional chrome with an explanatory comment.
3. ✅ **`sonner` data-slot** — on the `<Sonner>` wrapper (declarative; doesn't forward to the DOM).
4. ⏳ **Add `lint:on-system` to `validate`/CI** — optional, not done: it requires building two
   workspaces (`build:lint`), a real per-run cost. It's green (0 errors) and can be wired into CI
   separately if desired. `check:format` is already in `validate`.
