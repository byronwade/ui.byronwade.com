# Meridian — influences (ranked merge)

> Research hub. **Absorb discipline, never paste brand chrome.** Do not label influences in product UI.  
> Companion specs: [`layout.md`](./layout.md) · [`architecture.md`](./architecture.md) · [`ux.md`](./ux.md) · [`animations.md`](./animations.md) · [`color.md`](./color.md) · [`typography.md`](./typography.md) · [`density.md`](./density.md) · [`ai-surfaces.md`](./ai-surfaces.md)

**Method:** inventory every published influence already in Meridian → score against product goals → deep-read primary docs → pick the **best merge features** per concern. Parallel CLI deep-research was unavailable (no auth); findings below cite primary sources fetched Aug 2026.

## Product goals (scoring axes)

| Axis | Weight | Meaning |
| --- | ---: | --- |
| **A — App operator density** | 5 | Long sessions, indexes, keyboards, quiet chrome |
| **B — Agent-native** | 5 | Object-bound AI, provenance, typed anti-drift |
| **C — Material coherence** | 4 | Tokens, radius/stroke/elevation as one family |
| **D — Cinema / showcase** | 3 | Full-bleed film for theme marketing only |
| **E — A11y / contrast** | 5 | WCAG AA, OKLCH, reduced motion |
| **F — Implementability** | 4 | Works with shadcn + Tailwind v4 + lint |

Score = weighted fit (1–5 per axis × weight). Higher = stronger claim on Meridian defaults.

## Ranked inspirations

| Rank | Influence | Score | Primary lane | Role in Meridian |
| ---: | --- | ---: | --- | --- |
| 1 | **Cursor application** (not Cursor.com) | 92 | App chrome + AI | Density, object-bound composer, quiet panes |
| 2 | **Fluent 2** ([fluent2.microsoft.design](https://fluent2.microsoft.design/)) | 90 | Material + layout | Tokens, control vs layer radius, 4px grid, thin stroke, motion tokens |
| 3 | **Shopify Polaris Pro** ([pro design language](https://polaris-react.shopify.com/design/pro-design-language)) | 88 | Meaning + density | Semantic color, task density, predictable+juicy press |
| 4 | **Linear UI refresh** ([Linear Now](https://linear.app/now/how-we-redesigned-the-linear-ui)) | 86 | Chrome hierarchy | Less chrome noise, LCH/theme knobs, content contrast |
| 5 | **AI design-system anti-drift** ([Superdesign](https://superdesign.dev/blog/ai-design-system-drift), [Pandya](https://hvpandya.com/llm-design-systems)) | 85 | Agent contract | Frozen file + closed components + lint |
| 6 | **Vercel Design Engineer** ([principles](https://vercel.com/design/engineer)) | 80 | Process | Usefulness, whole experience, progressive complexity |
| 7 | **Brad Frost atomic / parts+wholes** | 78 | Structure | Tokens → atoms → wholes proven in product frames |
| 8 | **Cinema staging** (Apple-class product film) | 72 | Marketing film | One idea/frame, full-bleed subject, no scroll spectacle |
| 9 | **OpenAI product simplicity** | 70 | Disclosure | Provenance rhythm; hide complexity until needed |
| 10 | **shadcn/ui** | 68 | Primitives | Compose, don’t fork a parallel kit |

### Explicit reject list (common traps)

| Temptation | Why rejected |
| --- | --- |
| FluentUI packages / Windows purple | Wrong brand gravity; we absorb tokens only |
| Cursor.com marketing collage | Spectacle ≠ app density |
| Polaris green-as-brand | Status meaning must stay semantic; accent is `--brand` |
| Linear purple + Inter Display mandate | Theme knobs own accent/type |
| Scroll-jacked cinema, grain, mix-blend chrome | Breaks focus + a11y |
| Floating chatbot | Violates object-bound AI |
| Influence labels in UI | Frankenstein pastiche |

## Merge matrix — who wins each concern

| Concern | Winner | Runner-up | Meridian encoding |
| --- | --- | --- | --- |
| Spacing grid | Fluent 2 (4px ramp) | Polaris density-by-task | `--surface-pad/gap` + 4px multiples; see [`layout.md`](./layout.md) |
| Control height | Cursor app + Polaris | Fluent density | `data-surface` → `--control-h*` |
| Corner radius | Fluent (control vs layer) | Linear soft chrome | `radiusFor` control/panel/shell/pill |
| Stroke | Fluent thin 1px | Linear soften borders | `edge` + `border-border` |
| Elevation | Polaris soft ramp | Fluent elevation motion | `edge` → `depth-soft` → `depth-raised` |
| Color roles | Polaris meaning | Fluent neutrals/brand sparingly | OKLCH roles; status ≠ brand |
| Theme knobs | Linear (base/accent/contrast) | Fluent alias tokens | `--brand` + paper/dock; OKLCH |
| Selection | Linear / Cursor | Fluent selected wash | `bg-brand/10` |
| Focus | Fluent thicker stroke | — | `ring-ring` / focus stroke, not fill alone |
| Motion | Fluent (functional, short) + Polaris juicy press | — | Micro only; see [`animations.md`](./animations.md) |
| AI surfaces | Cursor app | OpenAI provenance | [`ai-surfaces.md`](./ai-surfaces.md) |
| Cinema | Apple-class film | — | `cinematicLaws` |
| Anti-drift | Superdesign / Pandya | Frost | `design.md` + `lib/design` + `check:design` |
| Process | Vercel DE principles | — | DNA in `meridian.md` |

## Per-influence deep notes (compressed)

### 1. Cursor application — rank 1

**Take:** Dense inverted-L chrome; explorer + tabs + object rail; mono metadata; agent bound to selection; no marketing hero collage.  
**Leave:** Dark-IDE-as-personality; unbound chat.  
**Proofs:** `workbench.tsx`, `composer-shell.tsx`.

### 2. Fluent 2 — rank 2

From [Shapes](https://fluent2.microsoft.design/shapes), [Layout](https://fluent2.microsoft.design/layout), [Motion](https://fluent2.microsoft.design/motion), [Color](https://fluent2.microsoft.design/color), [Tokens](https://fluent2.microsoft.design/design-tokens):

| Fluent concept | Value / rule | Meridian |
| --- | --- | --- |
| Global → alias tokens | Context-agnostic globals, semantic aliases | OKLCH vars + `colorRoles` |
| Spacing base | **4px** ramp (`size40`=4 … `size400`=40) | Snap pads/gaps/heights to 4 |
| Control radius | Medium **4px** / Large **8px** | `--radius: 0.5rem` (8px) → `rounded-lg` |
| Layer radius | X-Large **12px**+ for sheets/popovers | `rounded-2xl` / `rounded-3xl` |
| Stroke thin | **1px** web | `edge` inset 1px |
| Neutrals hierarchy | Lighter surfaces for focus | `bg-muted/15–30`, `bg-card` |
| Brand sparingly | CTA + selected, not large fills | `--brand`, `bg-brand/10` |
| Semantic status | Danger/caution ≠ decoration | `destructive` / `warning` |
| Motion | Functional, natural, short; top-level = fade | Micro; `prefers-reduced-motion` |
| Breakpoints | small→xxx-large classes | Tailwind + surface lanes |

### 3. Polaris Pro — rank 3

From [Pro design language](https://polaris-react.shopify.com/design/pro-design-language):

1. **Assign meaning** — color/icon/depth = role  
2. **Increase density** — high for data, low for focus  
3. **Juicy interactions** — hover quiet, press visceral  
4. **Predictable** — same look → same behavior  

Meridian: semantic status, `data-surface` density, press feedback without novelty motion.

### 4. Linear refresh — rank 4

From [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) (Mar 2024):

- Redesign chrome (sidebar/tabs/headers), don’t disassemble the product  
- Align labels/icons on tiny surfaces  
- Theme from few knobs (base, accent, contrast); LCH/perceptual uniformity  
- Limit accent tint in chrome; darken/lighten content neutrals for contrast  
- Environment stress: desktop + browser  

Meridian: quiet chrome, OKLCH (stricter than LCH), `--brand` knob, content contrast pairs.

### 5. AI anti-drift — rank 5

From [Why AI Breaks Your Design System](https://superdesign.dev/blog/ai-design-system-drift):

Failure modes: token fabrication · within-session drift · between-session amnesia · silent breaking changes.  
Fix: freeze tokens · constrain to real components · lock stable regions · validate output.

Meridian: `design.md` + `agents.md` + `lib/design` unions + `npm run check:design` / `check:contrast`.

### 6–10. Craft supports

| Source | Encode |
| --- | --- |
| [Vercel DE](https://vercel.com/design/engineer) | Usefulness; own states; complexity available not required |
| Brad Frost | Parts+wholes; tokens subatomic; prove in real frames |
| Cinema | One idea; full-bleed; `svh`; no stickers |
| OpenAI simplicity | Progressive disclosure; provenance without chatbot cliché |
| shadcn | Only primitive source |

## Decision log (merge conflicts)

| Conflict | Resolution |
| --- | --- |
| Fluent Medium 4px controls vs Meridian softer app feel | **Large 8px** control base (`--radius: 0.5rem`) — Fluent Large, not Medium |
| Fluent elevation shadows vs Polaris bevel | **Polaris-shaped** `edge`/`depth-*`; ban Tailwind `shadow-*` |
| Linear Inter Display vs Geist | Keep **Geist** — type is a theme knob family, not Linear skin |
| Polaris green success vs one-accent | **Success → brand**; destructive/warning stay fixed |
| Cinema spectacle vs app density | Cinema **only** on marketing `data-surface` / theater stages |
| Juicy Polaris press vs Fluent restrained motion | Juicy **local** (button/checkbox); page transitions = fade/micro |

## How agents use this file

1. Read [`design.md`](../design.md) + [`agents.md`](../agents.md) first.  
2. Use this ranking when a PR proposes a new visual habit — higher rank wins ties.  
3. Encode wins into `lib/design` / CSS; update this table if rank changes.  
4. Never name ranks 1–10 in product UI.

## Sources

- [Fluent 2 — Shapes](https://fluent2.microsoft.design/shapes)
- [Fluent 2 — Layout](https://fluent2.microsoft.design/layout)
- [Fluent 2 — Motion](https://fluent2.microsoft.design/motion)
- [Fluent 2 — Color](https://fluent2.microsoft.design/color)
- [Fluent 2 — Design tokens](https://fluent2.microsoft.design/design-tokens)
- [Shopify Polaris — Pro design language](https://polaris-react.shopify.com/design/pro-design-language)
- [Linear — How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Vercel — Design Engineer Principles](https://vercel.com/design/engineer)
- [Superdesign — Why AI Breaks Your Design System](https://superdesign.dev/blog/ai-design-system-drift)
- [Hardik Pandya — Expose your design system to LLMs](https://hvpandya.com/llm-design-systems)
