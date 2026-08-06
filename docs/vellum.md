# Vellum — design DNA

Vellum is the **reading-first** contract on ui.byronwade.com. It is not Meridian docs mode. It is a system for help, essays, release notes, and agent-readable prose with honest measure.

## The merge

| Source | Take | Leave behind |
| --- | --- | --- |
| OpenAI | Approachable message rhythm, provenance clarity | Soft chatbot cliché, toy pastels in prose |
| Vercel | Typographic confidence, sparse craft | Stark cold marketing as reading default |
| Evidence-backed reading lanes | 65ch measure, open leading, serif only for essays | Full-bleed `text-sm` paragraphs |
| Meridian (sibling) | Shared skeleton, typeset helpers, gates | Cinema heroes, dense ops indexes as default |

## What Vellum is

**Mist, measured prose.** Reading lanes first. Typeset presets (`docs` · `chat` · `reading` · `compact`) own long-form. Chrome stays quiet. Bronze-mist accent used sparingly. Streaming copy must not jump the layout. Activity pastels stay out of essay bodies.

## Laws

1. **Tokens only** — OKLCH semantics.
2. **One accent** — bronze mist `--brand` for links/CTA — not paragraph color.
3. **Measure** — ~65ch reading lanes; never exceed 80ch.
4. **Typeset presets** — no per-tag class soup on markdown.
5. **Hierarchy from size + tracking** — not bold display weight.
6. **Serif only for essays** — `reading-prose`; docs/help stay `reading-ui` sans.
7. **Streaming-stable** — reserve space; no cumulative layout shift on tokens.
8. **Chrome ≠ prose** — dashboards use Harbor/Atlas; Vellum owns help/docs.

## Surfaces

| Surface | Treatment |
| --- | --- |
| Docs / help | `reading-ui` — 65ch, 16px, 1.6 lh |
| Essays / manifesto | `reading-prose` — 65ch, 18px serif, 1.7 lh |
| Chat / assistant | `typesetClass("chat")` + provenance |
| Compact chrome | Sans, tight — never long-form |

## Agent stack

Law book (`contracts/vellum/`) → `vellum-*` skills → recipes → `npm run validate`.  
Contract MCP optional. See [`docs/stack.md`](./stack.md).

## Why this is not “Meridian with mist”

Vellum bans dashboard card grids as the primary help surface and forbids ops/workbench defaults. The system should feel like a careful book and a calm help center — not an admin console in softer colors.
