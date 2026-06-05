# kibo-ui + Untitled UI components → byronwade/ui (batched)

**Date:** 2026-06-04
**Status:** Approved (design)

## Summary

Adapt ~13 components from **kibo-ui** and **Untitled UI** into the byronwade/ui
registry as token-driven, DNA-compliant components, **consolidating** multi-source
or pre-existing concepts into a single component with `cva` variants. Two large
items — a multi-variant **video-player** and a Notion-style **editor** — are
deferred to their own spec+plan cycles.

Credit: each adapted file credits its origin (kibo-ui or Untitled UI) in a header
comment and the registry description.

## Source registries
- kibo-ui: `https://www.kibo-ui.com/r/<name>.json` (confirmed 200).
- Untitled UI: resolve exact `r/` base at implementation time (`npx untitledui@latest add <name>`).

## Shared conventions (apply to every component)
- **Credit header** (origin + URL) + `Adapted from <source>.` in the registry `description`.
- **DNA**: tokens only (no raw hex/named colors), `data-slot` on each part, `cn()` +
  `className` passthrough, radius scale, `focus-visible:ring-ring`, dark mode for free.
- **Variants live in a `cva()` block** exposed as a `variant` (and `size` where apt)
  prop — this is what keeps "all variants look the same."
- **Per-component checklist** (AGENTS.md): source in `registry/ui/` (or `registry/components/`)
  → `registry.json` item (type, deps, registryDependencies) → name in
  `registry/rules/byronwade-ui.mdc` → `content/examples/<slug>/default.tsx` (+ a
  variant example) → `tests/components/<slug>.test.tsx` (variants/states/interactions/axe)
  → `content/components.ts` catalog entry (category, description, deps) → `npm run gen:*`
  → `test:ci` green → commit.

## Consolidation rule
A concept that comes from two sources, or already exists, becomes **one** component
with `cva` variants — never duplicates. Pick the best implementation of each source.
- `credit-card` = kibo-ui + Untitled UI → one component; `variant` for display card vs input form.
- `rating` = kibo-ui `rating` + Untitled UI `rating-badge` → one component; interactive stars
  + a read-only `badge` variant.
- `video-player` (sub-project E) = kibo-ui + Untitled UI + new variants → one component.
- `tree-view` (Untitled UI) → **folded into the existing `file-tree`** as new variants/features
  (no new component).

## Batches (build → test:ci green → commit, each batch its own commit(s))

### Batch A — simple primitives (7)
`pill`, `qr-code`, `relative-time`, `ticker`, `glimpse`, `cursor`, `rating` (consolidated).
Self-contained; establishes the credit + cva-variant pattern. Likely new deps: a QR lib
for `qr-code` (e.g. `qrcode`), none for the rest beyond lucide.

### Batch B — interactive media (3)
`color-picker`, `image-crop`, `credit-card` (consolidated). Heavier (canvas/crop, color math).

### Batch C — data composites (2)
`gantt`, `kanban`. Drag/drop + scheduling; likely `@dnd-kit/*` or the source's drag lib.

### Batch D — expand `file-tree`
Fold Untitled UI `tree-view` features/looks into the existing `file-tree` as variants;
keep the current API working, add the new capabilities behind props/variants.

### Deferred sub-projects (own spec each)
- **E — `video-player`**: multi-variant player (controls layouts, mini/theater/poster, etc.).
- **F — `editor`**: Notion-style rich text — slash menu, block types, drag handles. Largest.

## Testing & gates
Same global coverage gates (functions ≥99, branches ≥90, statements ≥95, lines ≥96).
Canvas/interactive components mock as established (canvas `getContext`, RAF, observers).
Each component fully covered before commit; `npm run build` before any deploy (the registry
ships via the site deploy).

## Out of scope (this spec)
- video-player and editor implementations (separate specs).
- Re-deploying after each batch (deploy when a meaningful set is ready, per user).
