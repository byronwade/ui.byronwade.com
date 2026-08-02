# Meridian — design DNA

Meridian is the design language for **ui.byronwade.com**. One philosophy across four surfaces, built on **shadcn/ui**.

Cool paper. One steel-teal accent (`--brand`). Cinematic *styling* without spectacle. Operational density from Polaris / Linear / Vercel / Cursor / OpenAI.

## Foundation

**Everything builds on shadcn.** Primitives live in `components/ui/`. Meridian is tokens + surface contracts + composition — not a parallel component library.

Add components with:

```bash
npx shadcn@latest add [component]
```

## Surface matrix

Four surfaces. Same tokens. Different density, chrome, and theater rules.

| | Web · Application | Web · Marketing | Mobile Native | Desktop Native |
| --- | --- | --- | --- | --- |
| **Job** | Operate (indexes, forms, detail, AI) | Present (brand, product, docs) | Thumb-first product UI | Keyboard + pointer productivity |
| **Tone** | Cool paper default | Paper + earned theater | Paper; theater sparingly | Paper; dock for focus modes |
| **Density** | `compact` — 32px controls, 40px rows | `comfortable` — 36–40px CTAs | `touch` — 44px targets | `compact` toolbar 28–32px |
| **Shape** | Controls `rounded-lg`; panels `rounded-2xl` | CTAs may `rounded-full`; shells `rounded-3xl` | Same as app; larger hit areas | Same as app; tighter toolbars |
| **Depth** | `edge` first; soft only when floated | Theater stages; product as subject | Flat + edge; avoid blur | Edge; raised for floating panels |
| **Type** | `text-sm` UI; mono for data | Display clamps; `reading-ui` / `reading-prose` | `text-base` primary labels | `text-sm` / `text-xs` chrome |
| **Chrome** | Sidebar / topbar paper | Sparse header; theater-aware | Bottom bar + safe areas | Titlebar / menu / status |
| **Motion** | None on scroll; micro state only | Still cinema; optional enter fade | System-like; respect reduce | Instant; keyboard feedback |
| **AI** | Object-bound in detail panes | Provenance demos only | Compact provenance chips | Same as app; shortcut-led |

### Surface rules

1. **Never fork components per surface** — one Button/Card/Table; surfaces change density via `data-surface` and size props.
2. **Web Application is the default lane** — when unsure, design for app paper.
3. **Marketing may use theater; apps almost never do** — dock stages are presence, not chrome.
4. **Native lanes borrow OS grammar, not OS skins** — safe areas, 44px touch, compact desktop toolbars — still Meridian tokens.
5. **Extremely clean means shared contracts** — radius, depth, brand, mono-for-data apply everywhere.

Set the lane with `data-surface`:

| Value | Lane |
| --- | --- |
| `application` | Web application |
| `marketing` | Web marketing |
| `mobile` | Mobile native |
| `desktop` | Desktop native |

## The merge

| Source | Take | Leave behind |
| --- | --- | --- |
| Polaris | Soft elevation, dense resources, calm neutrals | Green-as-brand |
| Vercel | Type authority, mono for data, sparse craft | Pure cold starkness |
| Linear | Row density, selected states, keyboard scan | Purple, dark-only |
| Cursor | Object-bound AI, activity semantics | IDE dark as default |
| OpenAI | Provenance, message rhythm | Chatbot cliché |

## Cinema — styling, not spectacle

| Source | Take | Leave behind |
| --- | --- | --- |
| Apple | Product as only subject; one idea per frame | Scroll-jacking films |
| Tesla | Confident dark theater; sparse overlay | Animated HUD clutter |
| YouTube | Media owns the viewport | Autoplay / thumbnail soup |

### Cinema laws

- Media owns the frame — full-bleed, not inset marketing cards
- One idea per frame
- Style over spectacle — no scroll choreography, SVG grain, or `mix-blend` on fixed chrome
- Simple motion only — honor `prefers-reduced-motion`
- Theater when earned — marketing presence; not app chrome
- No overlay stickers on media

## Shared laws (all surfaces)

1. **Tokens only** — no raw hex in components
2. **One accent** — `--brand` drives primary, ring, success, selected
3. **Hierarchy from size + tracking** — not bold display weight
4. **Mono for data** — IDs, counts, timestamps, prices, model/tool names
5. **Depth defaults to none** — `edge` first; `depth-soft` / `depth-raised` sparingly
6. **Shape vocabulary** — controls `rounded-lg`; panels `rounded-2xl`; marketing CTAs may `rounded-full`; shells `rounded-3xl`
7. **Object-bound AI** — provenance + activity tokens
8. **Density by surface** — see matrix

## Density scale

| Token | Height | Use |
| --- | --- | --- |
| `--control-h-xs` | 24px | Desktop toolbar icons |
| `--control-h-sm` | 28px | Compact chrome |
| `--control-h` | 32px | Application default |
| `--control-h-md` | 36px | Marketing secondary |
| `--control-h-lg` | 40px | Marketing primary CTA |
| `--control-h-touch` | 44px | Mobile native targets |
| `--row-h` | 40px | Application table/list rows |
| `--row-h-touch` | 52px | Mobile list rows |

## Reading lanes

| Lane | Class | Use |
| --- | --- | --- |
| Docs / help | `reading-ui` | Marketing + in-app help |
| Essays | `reading-prose` | Long-form marketing only |
| Measure only | `reading-measure` | 65ch cap |

## Where things go

| Path | Role |
| --- | --- |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Surface shells & frames |
| `components/cinematic/` | Stage / media plane |
| `components/home/` | Marketing homepage sections |
| `app/surfaces/` | Live surface gallery |
| `docs/meridian.md` | This DNA |
