# Native demo states for components — design

**Date:** 2026-06-08
**Status:** Approved (design); pending spec review

## Problem

The docs demo frame exposes a **STATE** control (currently default / success / error /
loading) on every example. But only `content/examples/activity-grid/in-card.tsx` handles state
**natively** — rendering a meaningful, component-appropriate treatment (a "Sync failed" badge, a
skeleton grid, a success ring). Every other component falls through to a generic
`DemoStateFallback` wrapper: a one-size-fits-all skeleton card for `loading`, and a plain
success/error ring + badge for the others, regardless of what the component actually is. The
result is misleading — e.g. a Button wrapped in a skeleton-card "loading" treatment.

We want components to demonstrate states the way activity-grid does — **but only where states are
genuinely meaningful**, and without re-creating a generic fallback.

## Goals

- States rendered **natively and component-appropriately** for data/async components.
- Components where loading/empty/success/error don't apply (primitives) **drop the STATE control
  entirely** rather than faking states.
- Add an **`empty`** state (no-data / no-results) — one of the most common real states for data
  components — to the model and to the STATE toolbar.

## Non-goals

- Per-component dynamic state sets (user rejected this — the enum stays fixed at five).
- Migrating every one of the ~678 example files. Coverage is **one canonical example per
  meaningful component**, plus any variant example that clearly warrants it.
- A new high-level state-wrapper component (that would just re-create the fallback we're deleting).

## Core mechanism — opt-in gating

Invert today's behavior:

- An example **opts into states by calling `useDemoState()`**. Only then does the STATE control
  appear for it.
- The generic `DemoStateFallback` component and its wiring are **deleted**.
- A component that has not opted in shows **no STATE control** — honest, not a misleading generic
  skeleton.

This ties "shows states" directly to "the example handles states," and delivers "only where
meaningful" automatically: primitives never opt in, so the control is simply absent.

### Wiring changes (`app/(docs)/_components/`)

- `docs-demo-preview.tsx` `getDisabledDemoControlsForSource`: change
  `state: false` → `state: !source.includes("useDemoState")` so the control is disabled when the
  example doesn't opt in. Remove the `stateFallback` prop wiring.
- `demo-preview-frame.tsx`: delete the `DemoStateFallback` component, the `stateFallback` prop,
  and the `fallbackState` branch in `DemoPreviewContent`.

## State model — add `empty`

New enum: **default / loading / empty / success / error**.

Four-point edit (each easy to half-do):

1. `registry/lib/demo-viewport.ts` — add `"empty"` to the `DemoState` type. Re-sync to `lib/`.
2. `demo-preview-frame.tsx` `STATE_OPTIONS` — add an `empty` entry. Icon: `Inbox` (lucide), the
   conventional empty-state glyph. Order: `default, loading, empty, success, error`.
3. `demo-preview-frame.tsx` URL-param validation (currently only accepts
   `success | error | loading`) — add `empty`, or it is silently dropped.
4. `demo-viewport` is a **published registry item** → re-syncs to `public/r/`. Additive public-API
   change, safe.

### Contract for a migrated example

Once an example calls `useDemoState()`, it **owns all five states**:

- Handle the states that are meaningful for that component.
- For states that don't apply, **render the normal default appearance** — never blank.

Most data components naturally cover default / loading / empty / error. `success` is the rare one
and usually falls through to default.

## Helper strategy

Helpers stay **low-level primitives** — skeleton shapes, an empty-state block, a status badge —
that each example **composes** into a component-appropriate layout. The bespoke layout is the
point; helpers only remove boilerplate. We do **not** build a high-level wrapper (that recreates
the deleted fallback).

Helpers are **extracted from real migrations, not designed upfront**: migrate 2–3 exemplars (one
table, one feed, one form), observe what repeats, then generalize. Likely landing spot for shared
demo helpers: alongside `lib/demo-viewport.ts` or a new `_components/demo-state-bits.tsx` in the
docs app (docs-only, not a shipped registry item).

## Classification — the contract

The stateful-vs-primitive split is a concrete, reviewable per-component list (written in the
implementation plan, not decided ad hoc). First cut by category:

**Stateful (gets native states):** Data display, Forms, AI, Market, Commerce, Media, Video,
Feedback, and the data-bearing members of Composites / Overlays.

**Primitive (drops STATE — no opt-in):** Primitives, most UI, House components, Libraries,
Foundation, and Charts that are foundational rather than data-bound.

The exact per-component assignment is produced in Phase 1 and reviewed before migration.

## Phasing

**Phase 1 — Foundation**

- Add `empty` to the enum, toolbar, and URL validation; re-sync.
- Flip the gating mechanism; delete `DemoStateFallback`.
- Write the classification list (every component → stateful or primitive).
- Migrate 2–3 exemplars (table, feed, form) natively.
- Extract the first shared low-level helpers from those migrations.
- Fix any demo-state tests broken by the fallback deletion.

**Rollout caveat (accepted):** Phase 1 alone temporarily _removes_ the STATE control from
everything except `activity-grid` (nothing else has opted in yet). Coverage dips before it
climbs. The user approved this.

**Phase 2+ — Migration by category**

Roll through the stateful set in reviewable batches: Data display → Forms → AI →
Market/Commerce → Media/Video → Feedback/Composites. Each batch is its own chunk.

## Verification

- Run the demo-state-related tests after the enum change + fallback deletion (these may break).
- Visual verification requires the browser extension (was not connected earlier in this session) —
  confirm each migrated example renders all five states meaningfully in light **and** dark mode.
- Gates: `npm run sync`, `npm run validate`, `npm run test:ci` green before committing each phase.
