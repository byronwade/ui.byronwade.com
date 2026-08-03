# Typography

Two layers. Do not collapse them.

## 1. UI chrome — role classes

Dense product UI (nav, tables, forms, labels, buttons):

| Role | Class | Use |
| --- | --- | --- |
| Display | `type-display` | Rare marketing heroes only |
| Title | `type-title` | Page / panel titles |
| Section | `type-section` | Section heads |
| Body | `type-body` | Short UI copy |
| Caption | `type-caption` | Meta under chrome |
| Mono | `type-mono` | IDs, counts, prices, hashes, tool names |
| UI | `type-ui` | Default control / row chrome (`text-sm` + tracking) |

Hierarchy from **size + tracking**, never `font-bold` on display/section.

Defined in `app/globals.css`. Prefer `typeClass()` / `shellType()` from
`@/lib/design` when composing from grammar.

## 2. Rendered HTML / markdown — shadcn typeset

Longer copy that arrives as HTML or markdown (docs, chat messages, essays,
release notes) uses **typeset**, not a hand-rolled per-tag class soup.

```tsx
import { typesetClass } from "@/lib/design"

<div className={typesetClass("docs")}>{/* markdown HTML */}</div>
<div className={typesetClass("chat")}>{messageHtml}</div>
<article className={typesetClass("reading")}>{essay}</article>
```

| Preset | Class | Surface |
| --- | --- | --- |
| Docs | `typeset typeset-docs` | Help, release notes, `/system` prose |
| Chat | `typeset typeset-chat` | Agent / assistant message bodies |
| Reading | `typeset typeset-reading` | Essays, long articles (serif) |
| Compact | `typeset typeset-compact` | Dense panels, side notes |

Source: `app/typeset.css` (shadcn typeset shape — size/leading/flow, streaming-stable).
Laws: `typesetLaws` in `lib/design/typeset.ts`.

Rules:

- Always pair base `typeset` with exactly one preset.
- Do not nest typeset inside typeset.
- Do not override typeset tag styles with ad-hoc `text-sm` / `leading-*` on children.
- UI chrome around a typeset block stays on role classes (`type-ui`, etc.).

## Reading measure

- Cap continuous prose at **65ch** (hard stop **80ch**) — baked into typeset presets.
- Left-align body. Token contrast only.
- No Bionic Reading, no e-ink sepia simulation, no full-bleed `text-sm` paragraphs.

## Mono is for data

`font-mono` / `type-mono` for stats, prices, timestamps, durations, counts, IDs,
hashes, slugs, filenames, `kbd`, model/tool names, JSON-like parameters, agent logs.
Not for marketing slogans.
