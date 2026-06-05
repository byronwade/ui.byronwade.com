# Rating — kibo-ui variants, half-stars, and form support

**Date:** 2026-06-05
**Status:** Approved design, pending spec review
**Branch:** `feat/rating-variants` (worktree)
**Goal:** Finish porting the kibo-ui `rating` variants we never added — fill out the example/demo
coverage, add interactive **half-star** support (display + select), and add native **form** support —
all additive and backward-compatible with the shipped `Rating` / `RatingButton` / `RatingBadge`.

## Why

`registry/ui/rating.tsx` already ships the consolidated component (interactive integer stars +
read-only `RatingBadge`), but only has one example (`content/examples/rating/default.tsx`). kibo-ui's
rating page shows custom-color / custom-size / custom-icon / controlled variants and lists read-only

- form-input + fractional features. Two of those are genuine capability gaps in our component:
  **half/fractional stars** and **hidden form input**. The rest are demos achievable with today's API.

## Non-goals

- No breaking changes to the existing API. Integer-mode `Rating` (radiogroup of `role="radio"`
  stars), `RatingButton`, and `RatingBadge` keep their current behavior, props, and a11y.
- Not switching the whole component to a slider model. Slider semantics apply **only** in half mode
  (see a11y decision).
- No new runtime deps (continue using `lucide-react` for icons).

## Component changes — `registry/ui/rating.tsx`

All additive.

### 1. Fractional value model

`value` / `defaultValue` / `hoverValue` / `focusedStar` are treated as real numbers. Per star
(0-based `index`), fill = `clamp(current − index, 0, 1)` where `current = hoverValue ?? focusedStar ??
value`. This makes **fractional display free**: a read-only `value={3.7}` renders a 70%-filled 4th
star. Integer values yield 0/1 fills exactly as today.

### 2. Partial-fill rendering in `RatingButton`

Replace the single `fill-current`-when-active icon with two stacked layers inside a
`relative inline-block` wrapper:

- **base**: the outline icon (unfilled — `text-muted-foreground/40` or current stroke).
- **fill**: a copy of the icon, `fill-current`, wrapped in an `absolute inset-0 overflow-hidden` span
  whose `style={{ width: `${fill \* 100}%` }}` clips it.

`data-slot` additions: `rating-button-base`, `rating-button-fill`. Integer mode renders 0%/100% so it
is visually identical to today.

### 3. Interactive half-select — `allowHalf` prop on `Rating` (default `false`)

When `allowHalf`:

- `onMouseMove` on a star maps pointer X to that star's half: `(e.clientX − rect.left) / rect.width <
0.5 ? index + 0.5 : index + 1`, updating `hoverValue`.
- `onClick` commits the hovered half.
- Arrow keys step by `0.5` (Shift/Meta still jump to min/max).
- Default (`allowHalf=false`) keeps today's whole-star pointer + integer keyboard behavior.

### 4. Form support — `name` prop on `Rating` (optional)

When `name` is set, render a hidden `<input type="hidden" name={name} value={value}>` inside the
group so `<Rating name="score">` submits its numeric value (possibly fractional) in a native `<form>`.

### 5. Accessibility decision (the one architectural call)

A `role="radio"` group is binary per star and cannot represent 3.5. Therefore:

- **Integer mode (default):** unchanged — `role="radiogroup"` container, `role="radio"` star buttons,
  `aria-checked`, arrow-key roving. Backward compatible.
- **Half mode (`allowHalf`):** the container takes **slider semantics** — `role="slider"`,
  `aria-valuemin={0}`, `aria-valuemax={count}`, `aria-valuenow={value}`,
  `aria-valuetext={`${value} of ${count} stars`}`, `tabIndex=0`, arrow keys handled at the container.
  Star buttons become presentational (`aria-hidden`, pointer targets only).

_(Rejected alternative: keep radios in half mode with a half-aware `aria-label`. Simpler, but a
screen reader would announce a binary checked state for a fractional value — semantically wrong.)_

## Examples — `content/examples/rating/`

Add (each a hidden catalog demo, like the other components'): `read-only`, `custom-color`
(token, e.g. `text-warning`), `custom-size`, `custom-icon` (lucide `HeartIcon`), `controlled`
(`useState`), `half` (interactive `allowHalf`), `fractional` (read-only `value={3.7}`), `with-form`
(`name` inside a `<form>`), `badge` (`RatingBadge`). `default` already exists. Run `gen:examples`.

## Tests — `tests/components/rating.test.tsx`

Extend (keep existing cases) to cover:

- Partial-fill rendering: the fill span width reflects fractional value (0/50/100%).
- `allowHalf` interactive: pointer over left vs right half selects `x.5` vs `x.0`; click commits;
  arrow keys step 0.5; Shift jumps to bounds.
- Half-mode a11y: container is `role="slider"` with correct `aria-valuenow`/`valuetext`; integer mode
  stays `role="radiogroup"`/`radio`.
- Form: hidden input present with `name` + numeric `value`; absent without `name`.
- Read-only fractional render; custom icon swap; `RatingBadge` unchanged.
- `axe` on a representative render of each mode.
  Coverage thresholds (`vitest.config.ts`: stmts 95 / branch 90 / funcs 99 / lines 96) must stay green.

## Process / verification

- Worktree off local `main` HEAD (`d019272`); branch `feat/rating-variants`.
- Follow AGENTS.md edit checklist: `rating` is already named in `byronwade-ui.mdc`; new `data-slot`s
  are internal (no rule change). No `registry.json` item change (examples don't need one).
- Run `npm run update:registry` (or `sync` + `registry:build`), `npm run gen:examples`,
  `npm run validate`, `npm run test:ci`, and `npm run build` (real `node_modules` for the build, per
  the Turbopack-symlink gotcha). All must be green before commit.
- Integration into `main` deferred to a quiet window (shared-branch hazard); merge when asked.

## Risks

- **Half-mode a11y dual model** adds branching — covered by tests asserting both role models.
- **Pointer math in jsdom**: `getBoundingClientRect` returns zeros in jsdom, so half-select pointer
  tests must stub rect (or assert via the keyboard path + a mocked rect) rather than rely on layout.
- **Coverage**: new branches (allowHalf, name) need tests or coverage dips; write them alongside.
