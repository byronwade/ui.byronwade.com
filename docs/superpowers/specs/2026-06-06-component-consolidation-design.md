# Component Consolidation Design

## Goal

Consolidate overlapping registry UI and composite components by introducing cleaner shared primitives while preserving existing public registry component names for downstream compatibility.

## Scope

This project is a shadcn registry. Public component names are installable API, so this pass will not delete existing entries or break common imports. The work will add or deepen shared primitives, then update current components to compose those primitives.

The first pass covers these families:

- Media item surfaces: video cards, watch queue rows, studio rows, upload rows, thumbnails, playlist/music rows.
- Metrics and stats: inline metrics, stat cards, quote stats, session bars, compact market stats.
- Entity/result rows: command results, resource rows, alerts, queue rows, and other leading/title/meta/action rows.
- Attachment/file previews: drop zone previews, upload rows, AI attachments, prompt input attachments.
- Trading subparts: quote identity, metric grids, trading panel headers, shared formatters.
- Status and badges: generic badges/pills plus semantic status/live/verified badges.
- Morph chrome: morph surface, bar, rail, tabs, sidebar, menubar.
- Tables, timelines, and headers: helper extraction only where repeated behavior is clear.

## Non-Goals

- Do not collapse domain components into giant generic components.
- Do not remove existing registry entries in this pass.
- Do not change the visual system away from the Design DNA.
- Do not merge lifecycle-heavy controllers such as prompt input file handling, drop zone selection, and upload progress state.
- Do not introduce raw colors, hardcoded typography, or unrelated visual redesigns.

## Architecture

The consolidation will use a layered registry model:

1. Atomic primitives remain in `registry/ui`.
2. New shared shape primitives also live in `registry/ui` when they are generally reusable.
3. Domain composites remain in `registry/components`.
4. Domain-only shared pieces live near their domain composites, either as focused component files or small helper modules.
5. Existing public components become adapters that compose the shared primitives.

This keeps the registry ergonomic for consumers while making repeated code easier to maintain.

## Proposed Shared Primitives

### `registry/ui/metric.tsx`

Provides a unified metric display with variants for inline, card, compact, and row-like usage.

Core API:

- `label`
- `value`
- `delta`
- `icon`
- `hint`
- `tone`
- `variant`
- `className`

Existing `MetricStat`, `StatCard`, and compact stat layouts should compose this primitive where practical.

### `registry/ui/entity-row.tsx`

Provides a generic row or card row shape:

- leading visual
- title
- description or metadata
- status/progress slot
- trailing meta
- trailing actions
- optional interactive surface semantics

This should support `CommandResult`, `ResourceItem`, `PriceAlert`, queue items, and some upload/media row internals.

### `registry/ui/media-item.tsx`

Provides a media-specific surface built on `EntityRow` concepts:

- thumbnail/media
- title
- byline or metadata
- duration/status/progress
- action menu
- card/horizontal/compact variants
- optional `href`, `onClick`, and keyboard activation behavior

`VideoCard`, `UpNextItem`, `StudioVideoRow`, `UploadRow`, and related video/music surfaces should become adapters around this shape where the workflow fits.

### `registry/ui/attachment-item.tsx`

Provides a visual file/image attachment renderer:

- file or image preview
- name
- size/type metadata
- status/progress
- remove/retry/cancel actions
- grid, inline, and list variants if needed

It does not own file selection, upload lifecycle, paste handling, AI SDK conversion, or prompt input state.

### Trading Parts

Trading components stay public and separate, but share focused subparts:

- `QuoteIdentity`
- `QuoteMetricGrid`
- `TradingPanelHeader`
- shared market formatter helpers when duplication is visible

These parts can live in `registry/components/trading-parts.tsx` if they are broadly useful across trading composites, or in smaller files if the implementation grows.

## Component Family Decisions

### Media Surfaces

Consolidate internals aggressively, but keep public domain names. Media surfaces repeat thumbnail, title, metadata, action menu, clickable behavior, and selected/active states.

The shared primitive should avoid domain vocabulary such as "video" or "upload" unless the prop is genuinely media-specific.

### Metrics

Consolidate `MetricStat` and `StatCard` directly. Trading components should compose the shared metric primitive for compact label/value displays when it does not make formatting worse.

### Badges, Pills, Status

Do not merge everything into one public component. Keep this hierarchy:

- `Badge`: generic tokenized badge primitive.
- `Pill`: richer generic pill composition.
- `StatusDot`: atomic status indicator.
- `StatusPill`: semantic dot plus label composition.
- `LiveBadge` and `VerifiedBadge`: domain-specific semantic badges.

Cleanup should reduce duplication and clarify names, not erase semantics.

### Attachments and Uploads

Extract the visual file item, not the file controller. Upload rows, AI attachments, and prompt input attachments can share rendering but keep their different data contracts and lifecycle responsibilities.

### Tables

Keep `Table` primitive and domain tables. Extract reusable selectable/sortable/pagination helpers only if implementation duplication is high enough to justify it.

### Morph Chrome

Keep the morph family as separate public files. Consolidate common internals around `MorphSurface` and shared item/button helpers. Consider grouped exports, but do not force every morph layout into one component.

### Headers, Sections, Timelines

Extract only small helpers where repeated behavior is obvious. `PageHeader`, `DetailHeader`, `Section`, `EventTimeline`, `TimelineRail`, and `VerificationProgress` serve different scopes and should not become one generic component.

## Testing Strategy

Use TDD for implementation:

1. Add failing tests for each new primitive.
2. Verify failures are meaningful.
3. Implement minimal primitive behavior.
4. Update adapter components.
5. Run focused tests for changed components.
6. Run registry validation and CI test gates.

Test coverage should verify:

- new primitive default rendering
- variants and slots
- keyboard/click behavior for interactive media/entity surfaces
- adapter compatibility for existing public components
- axe checks where existing tests use accessibility validation

## Registry and Documentation Updates

For every new public registry item:

- add it to `registry.json`
- add example files under `content/examples/<slug>/`
- add tests under `tests/components/<slug>.test.tsx`
- update `registry/rules/byronwade-ui.mdc` if the new primitive is part of the consumer-facing rule
- run registry sync/build validation

If a new primitive is internal-only and not a registry item, keep it private to the relevant module and avoid docs churn.

## Compatibility

Existing public components should keep their current exports and prop behavior unless a breaking issue is discovered and explicitly approved. Clean names should be introduced additively.

Deprecation or removal of older public names belongs in a later migration pass after this consolidation is stable.

## Risks

- Over-generalizing can make components harder to use. Mitigation: extract shape primitives only where multiple components already share behavior.
- Registry dependency churn can break installs. Mitigation: update `registry.json` incrementally and run registry validation.
- Existing dirty workspace changes may overlap. Mitigation: inspect files before editing and preserve unrelated changes.
- Tests may expose existing failures. Mitigation: record baseline and distinguish pre-existing failures from refactor regressions.

## Success Criteria

- Existing public registry component names continue to work.
- Shared primitives reduce duplicated layout and interaction code.
- New names are clearer than old implementation-specific names.
- Component family boundaries are easier to understand.
- Design DNA remains intact: token-only color, semantic typography, `cn()`, `data-slot`, accessibility, and dark-mode compatibility.
- Focused tests and registry validation pass, or pre-existing failures are clearly identified.
