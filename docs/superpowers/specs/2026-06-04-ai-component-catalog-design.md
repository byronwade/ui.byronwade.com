# AI-orchestratable component catalog — docs IA at scale

**Date:** 2026-06-04
**Status:** Design approved (forks locked), ready for implementation plan
**Topic:** Restructure the `/docs` information architecture so it scales from ~84
component types to **hundreds of types × hundreds of tagged variants each**, browsable
as easily as the `/templates` and `/layouts` galleries, and emitting a machine-readable
index so an AI can discover and orchestrate components — not just humans.

---

## 1. Problem & framing

The registry is shifting from "a design system humans browse" to "a component **database**
an AI orchestrates." The current docs IA does not survive that volume:

- **Nav** (`app/(docs)/_components/site-nav.tsx`): a flat, always-expanded sidebar — one
  group per single `category`, every component listed by name. Fine at ~84, unusable at
  hundreds, and a constant sync liability.
- **Catalog** (`app/(docs)/docs/page.tsx`): an editorial index with every category fully
  expanded inline. Same scaling wall.
- **Data model** (`content/components.ts`): one `ComponentDoc` per type, a **single**
  `category` string, and `examples: string[]` (demo file names). A "variant" today is just
  a demo file — not an addressable, taggable record.
- **Machine layer** (`scripts/gen-mcp-data.mjs` → `packages/mcp/src/data.generated.json`):
  exists, but is **per-type only** — no tags, no variants, so an AI can match a *type* but
  not a *variant* or a *use-case*.

What must be preserved (the "same concepts"): the editorial Introduction/catalog, Philosophy,
Foundation, Installation, Theming, Typography, AI-rules pages; the per-component specimen
page; and **the design system itself** (tokens only, Base UI + CVA + `data-slot`, house
utilities — per `AGENTS.md` Design DNA).

---

## 2. Locked decisions (from brainstorming)

| Decision | Choice | Consequence |
|---|---|---|
| **Variant model** | **Hybrid** — type is the page/nav unit; each variant is an addressable record (id, tags, anchor, install ref) living on the type page | Hundreds of pages, *not* tens of thousands; every variant individually searchable + AI-addressable |
| **Taxonomy** | **Primary `group` + `tags[]` facets** (type-level AND variant-level) | Light migration (add `tags[]`); unlocks cross-cutting discovery a single category can't |
| **Machine layer** | **Emit in the same pass** — one source (`content/components.ts`) feeds human docs *and* the machine index | No drift; the existing `searchIndex` already proves the derive-from-one-source pattern |
| **Primary nav** | **Gallery-first, two levels** (types → variants) + ⌘K palette as universal jump; **no exhaustive sidebar** (contextual rail only on detail pages) | Matches the `/templates` + `/layouts` pages the user already likes; nothing to maintain twice |
| **Card previews** | **Static build-time thumbnails over a windowed grid** | Flat render cost at any catalog size; identical look; reuses `/preview` route + `.screenshots/` |

**The scaling invariant** that makes this work: *no single view and no render cost grows with
the total catalog — only with what is on screen.* The two-level gallery guarantees each grid
stays in the hundreds (a type's variants), never the tens of thousands (every variant).

---

## 3. The full map (six subsystems)

```
content/components.ts  ── single source of truth (types + variants + tags)
   │
   ├─► (A) DATA MODEL      enriched ComponentDoc: group, tags[], variants[]
   │
   ├─► (B) CATALOG /docs   faceted gallery of TYPES (windowed, static thumbs)
   │        └─ /docs/[type]  faceted gallery of that type's VARIANTS
   │
   ├─► (C) DETAIL PAGE     specimen + per-variant anchor, tag chips, install
   │        └─ light contextual rail (related types / jump-to-variant)
   │
   ├─► (D) SEARCH          searchIndex extended to index VARIANTS; ⌘K palette
   │
   ├─► (E) THUMBNAILS      gen:thumbs — screenshot default variant per type
   │
   └─► (F) MACHINE INDEX   gen-mcp-data evolved → per-variant + tags; + llms.txt
            └─ check:index gate (mirrors check:mcp-data / check:rule)
```

Subsystems B, C, D, E, F all **consume** A and the generated index. Therefore A + F + a single
real-data proving ground are **Phase 1**, and the UI rides on top once the schema is proven.

---

## 4. Data model (subsystem A)

Evolve `content/components.ts`. Keep the field name `category` **or** rename to `group` — TBD
in the plan (rename touches `site-nav`, the index page, `[slug]` page, `search-index`, and the
`category` union; keeping `category` as the field name minimizes churn). The model:

```ts
export type Variant = {
  id: string;          // stable, unique within a type — e.g. "ghost-sm"  → #ghost-sm anchor
  name: string;        // human label
  tags: string[];      // facets: use-case / density / tone / surface …
  example: string;     // existing demo file name (variants ⊇ today's examples[])
  install?: string;    // optional per-variant install ref (else the type's install)
};

export type ComponentDoc = {
  slug: string;
  name: string;
  group: Group;        // primary bucket (today's `category`) — drives gallery grouping
  tags: string[];      // type-level facets — drive catalog filters + AI match
  description: string;
  npmDeps?: string[];
  registryDeps?: string[];
  props?: PropRow[];
  variants: Variant[]; // supersedes examples[]; back-compat shim derives a default
                       // variant list from examples[] until a type is authored out
};
```

**Migration:** additive. `tags[]` defaults to `[]`; `variants` is derived from `examples[]`
when not yet authored, so existing pages/tests keep working during the rollout. No big-bang
rewrite of all 84 items.

---

## 5. Human UI (subsystems B, C, D) — Phase 2

- **(B) Catalog `/docs`:** a `ComponentGallery` (extends the existing `Gallery`) — facet bar
  (**Group**, **Tags**, free-text search box — the one addition over today's facet-only
  Gallery), removable active pills, count, A–Z/Featured sort, **windowed** card grid, static
  thumbnails. Keep the editorial masthead (count numeral, principles, install one-liner) — a
  preserved concept — above the gallery. Each card → `/docs/[type]`.
- **(B′) Type page grid `/docs/[type]`:** the *same* gallery shell, scoped to one type's
  **variants**. Faceted by variant `tags`. Each variant card deep-links to its anchor.
- **(C) Detail/specimen page:** keep `ExampleTabs`; add per-variant **anchor** (`#variant-id`),
  **tag chips**, and per-variant **install/copy**, making each variant addressable (the hybrid
  payoff). Replace the exhaustive sidebar with a **light contextual rail** (related types,
  jump-to-variant).
- **(D) Search:** extend `content/search-index.ts` to emit a **Variant** entry kind (label,
  type, tags, deep-link href) so ⌘K spans types *and* variants. Palette stays in root chrome
  as the universal jump.

---

## 6. Machine layer (subsystems E, F) — Phase 1 + Phase 2

- **(E) Thumbnails — `scripts/gen-thumbs.mjs`:** add a component preview route (extend
  `app/preview/[slug]` or a sibling) that renders a type's **default variant** full-bleed;
  screenshot it at build time into `public/thumbs/<slug>.png`. Wire into `prebuild` /
  `update:registry`. Cards reference the static image. (Phase 2 nicety: swap the *focused/
  hovered* card to a live preview — pay for liveness only where you look.)
- **(F) AI index — evolve `scripts/gen-mcp-data.mjs`:** emit **per-variant** records carrying
  `{ id, type, name, group, tags, install, deepLink, deps }` alongside the existing per-type
  records, sourced from the enriched `components.ts`. Add an **`/llms.txt`** entry point
  (types + variants + install convention). Add a **`check:index`** gate mirroring
  `check:mcp-data` / `check:rule`, added to `validate`.

---

## 7. Phasing (decomposed — Phase 1 is the spec's build target)

**Phase 1 — Foundation + proof (this plan):**
1. Enrich the `ComponentDoc` / `Variant` types + back-compat shim (A).
2. **Author ONE real component out to ~20–30 genuine variants** (e.g. `button` or `badge`) —
   the proving ground. Let the schema (`tags` vocabulary, `density`/`tone` traits, `id`
   convention) settle against real data **before** migrating the other 83.
3. Evolve `gen-mcp-data` → per-variant + tags; add `/llms.txt`; add `check:index` gate (F).
4. Extend `search-index` to index that one type's variants (D, minimal slice) to prove the
   end-to-end "variant is addressable" loop.

**Exit criteria for Phase 1:** the schema is stable against real variants; `npm run validate`
(incl. new `check:index`) is green; the one proven type's variants appear in ⌘K and the
machine index. *Then* the schema is frozen and the remaining migration + full UI begin.

**Phase 2 — Roll out (separate plan):** migrate the other 83 types' `tags`/`variants`; build
`ComponentGallery` + windowed grid + thumbnails (B, B′, E); the contextual rail + per-variant
anchors/install on the detail page (C); full variant indexing in search (D).

**Phase 3 — later:** hover-to-live card previews; MCP server surface over the per-variant index.

---

## 8. Testing & gates (per `AGENTS.md`)

- Registry component source is unaffected in Phase 1 → existing `test:ci` gates hold.
- New logic (gallery filter/search reducers, the index generator, the back-compat variant
  shim) gets unit tests; the index generator gets a `check:index` gate in `validate`.
- Thumbnail generation runs in `prebuild`; the gate verifies every type has a thumbnail
  (mirrors `check:examples`).

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Schema guessed wrong → migrate 84 items twice | **Phase 1 proves the schema on one real type first** |
| `category`→`group` rename churn | Keep field name `category` unless the plan finds rename is cheap; `group` is the *concept*, not necessarily the key |
| Windowed grid + static thumbs perf at thousands | Two-level gallery keeps any grid in the hundreds; windowing caps DOM |
| Thumbnail staleness | Regenerate in `prebuild`/CI on change; `check:thumbs` gate |
| Machine index drifts from docs | Both derive from `content/components.ts`; `check:index` gate |
```
