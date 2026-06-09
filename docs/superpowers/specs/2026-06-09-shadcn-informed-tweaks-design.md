# shadcn-informed tweaks — design

Research-backed, DNA-compatible improvements to byronwade/ui, derived from a deep audit of
shadcn/ui's current (late-2025 / early-2026) state. **The headline finding: byronwade/ui already
matches or exceeds shadcn on most axes** (data-slot + cn() + CVA, OKLCH tokens, `aria-invalid` on all
form controls, textarea `field-sizing`, input iOS zoom-guard, modern focus rings on core primitives,
Field/ButtonGroup/Kbd/Spinner/InputGroup shipped, correct Dialog/Command sr-only a11y,
`prefers-reduced-motion` in 6 components vs shadcn's zero, 117 components vs ~55). Our denser `h-8`
default, Base UI foundation, and tokens-only rule are **deliberate divergences**, not gaps.

This spec covers only the genuine, surgical improvements the audit surfaced. Three tiers, approved for
implementation.

## Tier 1 — Auto-aria-wire the `field` primitive (accessibility)

**Problem.** `registry/ui/field.tsx` is currently a hand-rolled layout wrapper (plain `<div>`/`<p>` +
cva). It does **no** accessibility wiring: consumers must manually set `htmlFor`/`id` on label↔control,
`aria-describedby` to chain description + error, and `aria-invalid`. This is the same regression
shadcn's newer `Field` has (their research flagged that their older `Form`/`useFormField` was the
better a11y reference). For us it's avoidable.

**Fix.** Rebuild the field parts on **Base UI's `Field` primitive** (`@base-ui/react/field`, installed
at 1.5.0 — `Field.Root/Label/Description/Error/Control/Validity`). Base UI auto-wires:

- label ↔ control association (generated `id` + `htmlFor`) via internal control registration,
- `aria-describedby` chaining description **and** error onto the control,
- `aria-invalid` driven from Base UI's validity state.

**Constraints.**

- **Preserve the public API**: `FieldSet, FieldLegend, FieldGroup, Field, FieldContent, FieldLabel,
FieldTitle, FieldDescription, FieldSeparator, FieldError` keep their names, props, cva styling,
  `data-slot`, and the `orientation` variants. Only the internals change (back them with Base UI
  `Field.*` via the `render` prop so our token styling is preserved).
- The consumer's control (`<Input>`, `<Textarea>`, etc.) becomes the registered control — provide it
  through `Field.Control`'s `render` prop, or a thin `FieldControl` wrapper, so association is
  automatic without the consumer wiring ids.
- Keep the `data-[invalid=true]` visual channel; let it derive from Base UI validity where possible.
- Only one example consumes `field` today (`content/examples/field/default.tsx`) — update it to the
  auto-wired shape and assert the wiring in the test.

**Verification.** Fully testable without a browser: extend `tests/components/field.test.tsx` to assert
`htmlFor`/`id` association, `aria-describedby` includes both description and error ids when invalid,
`aria-invalid` reflects validity, plus `axe`. No visual spot-check needed.

## Tier 2 — Focus-ring + icon-sizing polish (surgical, visual)

**2a. Unify focus ring on genuinely-interactive holdouts.** Our core primitives already use the modern
`focus-visible:ring-3 focus-visible:ring-ring/50`. A few **interactive form-like** controls still use
the legacy `ring-2` (+ `ring-offset-2`):

- `registry/ui/tag-input.tsx` — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
  → migrate to `focus-visible:ring-3 focus-visible:ring-ring/50` (drop the offset), matching our
  input/select convention.
- `registry/ui/rating.tsx` — `focus-visible:ring-2 focus-visible:ring-ring/50` → `ring-3`.
- Any other true form-like control discovered during implementation (scan, name each).

**Explicitly out of scope**: the `morph-*`, chart (`order-book`, `heatmap-grid`, `gantt`,
`sector-rotation`), and media (`audio-player`, `video-player`, `now-playing-bar`, `track-list`,
`lyrics`, `album-cover`, `audio-waveform`) composites keep their current rings — those are intentional,
internal, and not form controls. No blanket 24-file rewrite.

**2b. Icon auto-size escape hatch.** Add the `[&_svg:not([class*='size-'])]:size-N` pattern (auto-size
child SVGs, but let an explicit `size-*` on the icon win) to primitives that currently hard-pin icon
sizes without the hatch. Enumerate exact files during implementation; touch only those.

**Verification.** These are **visual** changes (the recurring browser-unavailable constraint): after
implementing, the user spot-checks the named components in light + dark. Tests assert the class
fragments are present/updated.

## Tier 3 — Ship an `Empty` composite (new component, full gate)

**Motivation.** We just wired empty states across 85 examples using a **docs-only** helper
(`app/(docs)/_components/demo-state-bits` → `DemoEmptyState`). shadcn ships a real, structured `Empty`
primitive. Promote ours into a shippable registry item so consumers get the same.

**Anatomy** (token-only, `data-slot` per part, `cn()` passthrough, DNA radius + `edge` hairline):

- `Empty` — centered container.
- `EmptyHeader` — groups media/title/description.
- `EmptyMedia` — `variant="default" | "icon"` (icon variant = a muted rounded token chip).
- `EmptyTitle` — `font-medium` (per editorial-typography DNA, never `font-bold`).
- `EmptyDescription` — `text-muted-foreground`, reading-friendly.
- `EmptyContent` — CTA slot (buttons/links).

**Full component-author flow** (per AGENTS.md checklist): source in `registry/ui/empty.tsx` →
`registry.json` item (`registry:ui`) → name added to `registry/rules/byronwade-ui.mdc` (so
`check:rule` passes) → `npm run update:registry` → `content/examples/empty/default.tsx` (+
`gen:examples`) → `tests/components/empty.test.tsx` covering every part/variant + `axe` → `npm run
test:ci` green. Keep the docs `DemoEmptyState` as-is (different, docs-internal shape); the new `Empty`
is the consumer primitive.

**Verification.** `npm run test:ci` (95%+ statements / 90% branches / 99% functions / 96% lines) +
`npm run validate` + `npm run build`. One example surface for the user to eyeball.

## Sequencing

1. **Tier 1** first — pure a11y, fully test-verified, no visual dependency.
2. **Tier 2** — surgical, named files; batch for one user spot-check.
3. **Tier 3** — new component, its own gate.

Each tier is independently committable and green before the next. Nothing here touches the foundation
token system, the Base UI foundation, or our deliberate sizing/color divergences.

## Explicitly NOT doing

- `data-variant`/`data-size` DOM mirroring (marginal existing usage; YAGNI).
- skeleton `bg-muted` → `bg-accent` (debatable; `bg-muted` is fine).
- shadcn's looser `h-9` default sizing, Base UI → Radix, or raw colors (`bg-black/50`, `text-white`,
  `bg-white` thumbs, tooltip `bg-foreground`) — all conflict with the DNA on purpose.
