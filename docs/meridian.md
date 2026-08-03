# Meridian — design DNA

Meridian is the design language for **ui.byronwade.com**. One philosophy, four surfaces, built on **shadcn/ui**.

> **Agents:** obey [`design.md`](../design.md) first. This file is the human-readable deep DNA.  
> Architecture: [`architecture.md`](./architecture.md). Ranked influences + specs: [`influences.md`](./influences.md) · [`/system`](/system).

Soft warm neutrals (never pure white/black). One deep accent (`--brand`). Full-bleed cinema. Structured reading. Density follows the task. The **website is a theme showcase** for AI authors — not a custom component catalog.

This DNA is distilled from what leading product designers and design-system practitioners publish — not from aesthetic collage. Sources and what we took: [`docs/sources.md`](./sources.md).

## Controlled principles

Six binding rules. Prefer these over vibe, trend, or naming other brands in the UI.

### 1. Obsess over usefulness

Solve real operator problems. Make the useful path effortless. Every control earns its place by helping someone finish a task — not by decorating the screen.

*Source: [Vercel Design Engineer Principles](https://vercel.com/design/engineer) — “Obsess over usefulness.”*

### 2. Assign meaning

Color, icon, and depth carry role — never decoration. Danger is destructive. Caution is warning. Go / primary / selected resolve to `--brand`. Agent activity pastels encode *what the agent is doing*, not accent fashion. If removing a visual doesn’t hurt scanning or trust, remove it.

*Source: [Shopify Polaris — Pro design language](https://polaris-react.shopify.com/design/pro-design-language) — “Assign meaning.”*

### 3. Density follows the task

High density for data-rich indexes and long sessions. Lower density for focused detail, forms, and marketing presence. Surfaces remap control/row heights via `data-surface`; don’t invent a new component kit per platform. Space groups related information; hierarchy comes from size, tracking, and weight — not chrome volume.

*Source: Polaris Pro — “Increase density”; Linear UI refresh — hierarchy and chrome clarity ([Linear Now](https://linear.app/now/how-we-redesigned-the-linear-ui)).*

### 4. Predictable, then juicy

Visually similar things behave the same. Interactions give clear feedback (hover quiet, press felt) without novelty motion. No scroll choreography. Honor `prefers-reduced-motion`.

*Source: Polaris Pro — “Make it predictable” / “Craft juicy interactions”; Vercel — own every state and edge case.*

### 5. Parts and wholes together

Tokens are subatomic decisions (`globals.css`). Atoms live in `components/ui/` (shadcn). Wholes are surfaces and the workbench — prove the system in real product frames, not isolated pattern grids. Don’t ship a Frankenstein kit of labeled influences; compose one calm product.

*Source: [Brad Frost — Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) and [The Part and The Whole](https://bradfrost.com/blog/post/the-part-and-the-whole/); tokens as subatomic particles ([Extending Atomic Design](https://bradfrost.com/blog/post/extending-atomic-design/)).*

### 6. Progressive disclosure

Make complexity available, not required. Application default is cool paper and compact controls. Theater, AI rails, and deep tooling appear when the object or task needs them — never as floating spectacle or chatbot cliché.

*Source: Vercel — “Build for everyone”; ChatGPT / OpenAI product craft — product as hero, hide complexity until needed.*

## Foundation

**Everything builds on shadcn.** Primitives live in `components/ui/`. Meridian is tokens + surface contracts + composition — not a parallel component library.

```bash
npx shadcn@latest add [component]
```

Canonical composition (part + whole): `components/surfaces/workbench.tsx`.

## Surface matrix

Four surfaces. Same tokens. Different density, chrome, and theater rules — driven by **task**, not aesthetics.

| | Web · Application | Web · Marketing | Mobile Native | Desktop Native |
| --- | --- | --- | --- | --- |
| **Job** | Operate — indexes, forms, detail, AI | Present — brand, product, docs | Thumb-first product UI | Keyboard + pointer productivity |
| **Density** | Compact — 32 dpx controls, 40 dpx rows | Comfortable — 36–40 dpx CTAs | Touch — 44 dpx targets | Compact chrome — 28–32 dpx toolbars |
| **Shape** | Controls `rounded-lg`; panels `rounded-2xl` | CTAs may `rounded-full`; shells `rounded-3xl` | Same as app; larger hit areas | Same as app; tighter toolbars |
| **Depth** | `edge` first; soft only when floated | Theater stages; product as subject | Flat + edge; avoid blur | Edge; raised for floating panels |
| **Type** | `text-sm` UI; mono for data | Display clamps; `reading-ui` / `reading-prose` | `text-base` primary labels | `text-sm` / `text-xs` chrome |
| **Chrome** | Quiet sidebar / topbar | Sparse header; theater-aware | Bottom bar + safe areas | Titlebar / menu / status |
| **Motion** | Micro state only | Still cinema; optional enter fade | System-like; respect reduce | Instant; keyboard feedback |
| **AI** | Object-bound in detail panes | Provenance demos only | Compact provenance chips | Same as app; shortcut-led |

### Surface rules

1. **Never fork components per surface** — one Button/Card/Table; density via `data-surface` and size props.
2. **Web Application is the default lane** — when unsure, design for app paper.
3. **Marketing may use theater; apps almost never do.**
4. **Native lanes borrow OS grammar, not OS skins** — safe areas, 44px touch, compact desktop toolbars — still Meridian tokens.
5. **Reduce chrome noise** — align labels/icons; soften borders; limit brand tint in chrome (Linear refresh discipline).

| `data-surface` | Lane |
| --- | --- |
| `application` | Web application |
| `marketing` | Web marketing |
| `mobile` | Mobile native |
| `desktop` | Desktop native |

## What we take (discipline, not labels)

Do not name other brands in UI chrome or marketing headlines. Encode the discipline:

| Discipline | Encode in Meridian | Leave behind |
| --- | --- | --- |
| Polaris Pro | Soft elevation, task density, meaningful color, predictable controls | Green-as-brand; decorative status color |
| Linear refresh | Calm rows, quieter chrome, selected wash, keyboard scan, higher content contrast | Purple accent; dark-only default; icon soup |
| Vercel craft | Type authority, mono for data, usefulness over polish theater | Pure cold starkness as personality |
| Cursor / agent UI | Object-bound AI, activity semantics | IDE dark as default; unbound chat |
| OpenAI simplicity | Provenance rhythm, progressive disclosure | Chatbot cliché; feature dump |
| Cinema staging | Product owns the frame; one idea per stage | Scroll-jacking, grain, blend-mode chrome |

## Cinema — styling, not spectacle

- Media owns the frame — full-bleed, not inset marketing cards
- One idea per frame
- No scroll choreography, SVG grain, `mix-blend` on fixed chrome, or `content-visibility` size placeholders
- Hero height uses `svh`, never `dvh` — dynamic viewport resizes on mobile chrome show/hide and jerks reverse-scroll
- Demo shells: `overflow-hidden`, not nested `overflow-auto` (nested scrollports steal the wheel on direction change)
- Simple motion only — honor `prefers-reduced-motion`
- Theater when earned — marketing presence; not app chrome
- No overlay stickers on media

## Shared laws (all surfaces)

1. **Tokens only** — no raw hex in components
2. **One accent** — `--brand` drives primary, ring, selected; success follows brand so one variable re-skins the system
3. **Status is semantic** — destructive / warning keep fixed meaning (Polaris “assign meaning”)
4. **Hierarchy from size + tracking** — not bold display weight
5. **Mono for data** — IDs, counts, timestamps, prices, model/tool names
6. **Depth defaults to none** — `edge` first; `depth-soft` / `depth-raised` sparingly
7. **Shape vocabulary** — controls `rounded-lg`; panels `rounded-2xl`; marketing CTAs may `rounded-full`; shells `rounded-3xl`
8. **Object-bound AI** — provenance + activity tokens; attach to a product object
9. **Fewer decisions** — prefer shared scales over one-off exceptions

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
| `design.md` | AI contract (source of truth for agents) |
| `docs/architecture.md` | AI layer map + toolchain |
| `app/globals.css` | Tokens (subatomic / theme knobs) |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Surface shells & workbench (wholes) |
| `components/cinematic/` | Stage / media plane |
| `components/home/` | Marketing homepage sections |
| `app/theme/` | Theme showcase |
| `app/for-agents/` | Agent onboarding |
| `app/surfaces/` | Live surface gallery |
| `.cursor/skills/` · `.cursor/agents/` | AI toolchain (mirrored in `.claude/`) |
| `docs/meridian.md` | This DNA |
| `docs/sources.md` | Designer sources we follow |
