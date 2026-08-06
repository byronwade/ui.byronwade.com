# Harbor — design DNA

Harbor is the **ops admin** contract on ui.byronwade.com. It is not Meridian with a green hue. It is a deliberate system for dense indexes, quiet chrome, and semantic status — the surfaces agents keep open for hours.

## The merge

| Source | Take | Leave behind |
| --- | --- | --- |
| Shopify Polaris | Dense resource clarity, calm neutrals, status honesty | Green-as-brand decoration, heavy marketing chrome |
| Linear | Row density, selected wash, keyboard scanning | Purple accent, dark-only identity, issue-tracker clichés |
| Vercel | Sparse craft, mono metadata | Pure stark coldness, marketing-hero defaults |
| Meridian (sibling) | Shared platform skeleton, shadcn compose, gates | Cinema frames, theater tone, warm soft paper as default |

## What Harbor is

**Quiet paper operations.** Indexes you can scan. Status you can trust. Chrome that stays out of the way. Light-first cool paper. One accent — harbor green for brand/selected only; warning / destructive stay semantic. Depth defaults to none. No cinema.

## Laws

1. **Tokens only** — OKLCH semantic utilities; no raw hex in components.
2. **One accent** — `--brand` for selected / primary CTA; never wash whole rows in brand.
3. **Status ≠ brand** — open / warning / healthy / destructive chips stay semantic.
4. **Dense by default** — stable row heights, mono IDs, compact toolbars.
5. **Depth defaults to none** — `edge` first; raise only for floating panels.
6. **Shape vocabulary** — controls `rounded-lg` / pills `rounded-full`; panels `rounded-2xl`.
7. **No cinema** — no full-bleed heroes, overlay stickers, or theater tone on ops routes.
8. **Own empty / loading / error** on every resource index.

## Surfaces

| Surface | Treatment |
| --- | --- |
| Indexes / tables | Compact sans, mono meta, semantic chips |
| Record detail | Title → description → meta → actions |
| Settings | Calm forms, h-8/h-9 controls |
| Docs (secondary) | reading-ui only when truly long-form |

## Agent stack

Law book (`contracts/harbor/`) → `harbor-*` skills → recipes → `npm run validate`.  
Contract MCP optional. See [`docs/stack.md`](./stack.md).

## Why this is not Meridian-green

Anyone can recolor Meridian. Harbor bans cinema, prefers list-resource over agent-rail as the default hero pattern, and treats status chips as first-class grammar. The site should feel like a trustworthy ops console — inevitable, not referential.
