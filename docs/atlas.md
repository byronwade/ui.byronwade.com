# Atlas — design DNA

Atlas is the **developer workbench** contract on ui.byronwade.com. It is not dark-mode Meridian. It is ink-forward tooling chrome for keyboard-native agents and humans.

## The merge

| Source | Take | Leave behind |
| --- | --- | --- |
| Vercel / Next tooling | Typographic authority, mono for data, sparse craft | Marketing-hero defaults as app chrome |
| Linear | Keyboard-first scanning, selected states | Purple accent, issue-tracker narrative |
| Cursor (app) | Object-bound AI, panel composition, density | IDE darkness as the only skin |
| Meridian (sibling) | Shared skeleton, gates, shadcn compose | Full cinema as default, warm soft paper |

## What Atlas is

**Ink workbench.** Paths, hashes, tool names, and durations in mono. Command palette over mega-nav. Higher-contrast cool steel paper. One steel-ink accent. Subtle motion only — never Meridian theater. AI rails attach to files, tools, and runs — not floating chat bubbles.

## Laws

1. **Tokens only** — OKLCH semantics; no arbitrary color utils.
2. **One accent** — steel ink `--brand`; selected = `bg-brand/10`.
3. **Mono for tooling data** — paths, SHAs, model/tool names, ms, ports.
4. **Keyboard-first** — visible shortcuts; no hover-only critical actions.
5. **Desktop density** — `data-surface="desktop"` or application with tighter rhythm.
6. **Command palette patterns** — jump/search as a primary navigation affordance.
7. **Depth defaults to none** — panels `edge`; float only when earned.
8. **Object-bound AI** — provenance on tool/file/run objects.

## Surfaces

| Surface | Treatment |
| --- | --- |
| File / run indexes | Mono meta, dense rows, keyboard hints |
| Editor-adjacent chrome | Quiet panels, sharp focus rings |
| Palette / jump | Keyboard-first list, mono labels |
| Settings | Compact forms, mono ids |

## Agent stack

Law book (`contracts/atlas/`) → `atlas-*` skills → recipes → `npm run validate`.  
Contract MCP optional. See [`docs/stack.md`](./stack.md).

## Why this is not “dark Meridian”

Atlas prefers ink paper and workbench recipes. Cinema is subtle at most. Harbor’s ops status language and Vellum’s reading lanes are out of bounds as defaults. The system should feel like a precise instrument panel.
