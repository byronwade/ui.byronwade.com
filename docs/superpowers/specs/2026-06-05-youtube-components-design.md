# YouTube component set — design

**Date:** 2026-06-05
**Branch:** `feat/youtube-components`
**Goal:** Add 22 YouTube-modeled components to the byronwade/ui registry, spanning browse,
watch, Shorts/player-chrome, and Studio/creator surfaces. Built primitives-first so the
composites reuse a small reusable foundation, fully on the Design DNA (tokens only, editorial
type, Base UI + CVA + `data-slot`, `cn()` passthrough, accessibility + dark mode for free).

Reference was gathered live from youtube.com (home grid, watch page, channel page) on the
build date.

## Approach

Primitive-first: build six reusable primitives, then assemble page-level patterns as
composites on top of them. Composites compose primitives — never bespoke one-off elements.
No duplication of existing registry items; reuse `avatar`, `badge`, `card`, `progress`,
`dropdown-menu`, `filter-pill`, `tabs`, `scroll-area`, `metric-stat`, `button`, `video-player`.

## Token / DNA decisions

- **`live-badge` → `bg-destructive`.** The only red semantic token; "LIVE" reads as an
  attention/alert indicator. Documented in the rule line. Not pinned to `--brand`.
- **Counts, durations, timestamps, view/subscriber numbers → `font-mono` + `tabular-nums`.**
- **Verified check, "watched" progress, muted metadata → muted/foreground tokens**, never grey.
- **Active chip / selected tab / focus ring → `--brand`-derived** (`ring-ring`, `bg-primary`).

## Inventory & build order

Each batch ends green (`npm run update:registry` + `npm run test:ci`) and committed before the
next starts. Primitives sync first so composites can import `@/components/ui/<name>`.

### Batch 1 — foundation primitives (`registry/ui/`)

1. **`thumbnail`** — `aspect-video` media + duration badge (bottom-right) + optional watched
   `progress` overlay (bottom edge) + optional live badge. Placeholder when no `src`. The atom
   under every video tile.
2. **`verified-badge`** — inline verified check, sized to the channel-name baseline; muted token.
3. **`live-badge`** — "LIVE" pill on `bg-destructive`; optional pulse dot; `count` viewers slot.
4. **`subscribe-button`** — subscribed / unsubscribed states; bell-notification dropdown when
   subscribed (`all` / `personalized` / `none`); composes `button` + `dropdown-menu`.
5. **`chip-bar`** — horizontal-scroll selectable chip row, `mask-fade-x` edges, scroll chevron;
   single-select with `value`/`onValueChange`; composes `filter-pill`.
6. **`action-rail`** — vertical icon+count button stack (Shorts side rail); orientation-aware.

### Batch 2 — browse & discovery (`registry/components/`)

7. **`video-card`** — `thumbnail` + channel `avatar` + title (2-line clamp) + byline
   (`verified-badge`) + `views · time` meta + `dropdown-menu` ⋯. Optional `onClick`.
8. **`video-shelf`** — titled horizontal row of `video-card`s + chevron + edge fade.
9. **`channel-header`** — banner + avatar + name + `@handle · subs · videos` + description +
   Subscribe/Join + `tabs` row.

### Batch 3 — watch page (`registry/components/`)

10. **`up-next-item`** — compact horizontal video row (thumbnail+duration / title / channel / meta).
11. **`channel-byline`** — avatar + name + `verified-badge` + subs + `subscribe-button`.
12. **`engagement-bar`** — like/dislike segmented pill + Share + Save + ⋯.
13. **`description-box`** — `views · date` header + collapsible text (`...more` / `Show less`).
14. **`comment`** — avatar + author·time + text + vote/reply controls + replies disclosure.
15. **`comment-composer`** — avatar + input + Cancel/Comment.

### Batch 4 — Shorts & player chrome (`registry/components/`)

16. **`shorts-player`** — 9:16 frame + `action-rail` + author/caption overlay + follow.
17. **`mini-player`** — PiP card: thumbnail/play + title + "Continue watching" + close.
18. **`chapter-list`** — chapter rows (timestamp + title + thumb), active highlight.
19. **`playback-menu`** — quality / speed / captions settings `dropdown-menu`.

### Batch 5 — Studio & creator (`registry/components/`)

20. **`studio-video-row`** — content-table row: thumb+title / visibility / date / views / comments / likes.
21. **`upload-row`** — upload+processing row: thumb + filename + `progress` + status.
22. **`comment-moderation-row`** — held-for-review comment + approve / remove / heart.

## Per-component deliverables (enforced by CI)

For every component: source under `registry/{ui,components}/`, an item in `registry.json`
(type, title, description, `registryDependencies`, files→target), `content/examples/<slug>/default.tsx`,
`tests/components/<slug>.test.tsx` (default render + every variant/state/interaction + `axe`),
and a name in `registry/rules/byronwade-ui.mdc` (new "Video / YouTube" section).

Coverage thresholds are steep (statements ≥95, branches ≥90, functions ≥99, lines ≥96) — tests
must exercise every handler, conditional render, and variant.

## Risks

- **Shared-file contention** if authored in parallel: `registry.json` and the rule `.mdc` are
  integrated centrally; per-component files live at unique paths.
- **Coverage failures** surface at the batch gate; fixed before commit.
