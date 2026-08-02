# Meridian — design.md

> **AI contract.** Read this before any UI work. Typed grammar: `lib/design/`. Drift lint: `npm run check:design`.

**Product:** cinematic theme system for AIs — not a custom component zoo.  
**Primitives:** shadcn/ui. **Enforcement:** TypeScript closed sets + CI audit.  
**Aesthetic list:** **Cinematic design**.

## The model — strict + creative

| Zone | What’s locked | What’s free |
| --- | --- | --- |
| **Frozen** | Color roles, radii, depth, surfaces, theme knobs, activity, bans, cinematic laws | — |
| **Creative** | — | Copy, IA, domain objects, frame sequence, which shadcn wholes to compose, narrative inside one-idea frames |

Agents invent **stories and compositions**. They do not invent **colors, shadows, or radii**. Import `@/lib/design` — TypeScript rejects fabrication.

```ts
import { bg, defineCinemaFrame, typeClass } from "@/lib/design"

defineCinemaFrame({
  tone: "theater",
  subject: "workbench",
  ideas: 1,              // literal — cannot be 2
  overlayStickers: false // cannot be true
})
```

## Identity

| Key | Value |
| --- | --- |
| Name | Meridian |
| Design list | **Cinematic design** |
| Accent | `--brand` — one deep ink-teal, prominent not bright |
| Paper | Soft warm stone neutrals — never pure white/black |
| Feeling | Crisp, calm, softly warm |
| Type | Geist Sans + Geist Mono |
| Depth | `edge` → `depth-soft` → `depth-raised` |
| Media | Full-bleed photographs (`BleedImage`) |
| Reading | `ReadingArticle` + `reading-ui` / `reading-prose` |
| Default surface | `application` |
| Grammar | `lib/design/grammar.ts` |

## Cinematic design list

Encoded in `lib/design/recipes.ts` → `cinematicLaws`:

1. **Product / photograph is the subject** — chrome recedes
2. **One idea per frame** — typed as `ideas: 1`
3. **Full-bleed media** — edge-to-edge `CinemaTile` / `BleedImage`; never inset hero cards
4. **No overlay stickers** on media
5. **Soft neutrals** — never pure white or pure black
6. **One accent** — deep and clear, never neon/bright noise
7. **Stable viewport** — `svh`, never `dvh`
8. **Motion is micro** — no scroll choreography
9. **Tile alternation** — photograph ↔ parchment rhythm (Apple stacking)
10. **Sparse copy** — product name, one headline, one line, text links (`CinemaLink`)
11. **Structured reading** — off the film (docs routes); measured hierarchy
12. **Type weight medium-max** — hierarchy from size + tracking

## MUST

1. Import design decisions from `@/lib/design` when choosing color/radius/depth/cinema structure
2. **Tokens only** — no raw hex / arbitrary color utilities
3. **One accent** — primary, ring, selected, success → `--brand`
4. **Status semantic** — destructive / warning never become brand
5. **shadcn only** for primitives — `npx shadcn@latest add`
6. **`data-surface`** — `application` | `marketing` | `mobile` | `desktop`
7. **Mono for data** — IDs, counts, times, prices, model/tool names
8. **Object-bound AI** — provenance + activity; no floating chatbot
9. Pass **`npm run check:design`**

## MUST NOT (`banned` in grammar)

raw-hex · arbitrary-color-utility · tailwind-shadow · dvh-viewport · font-bold-display · scroll-choreography · overlay-stickers-on-media · pure-white · pure-black · bright-neon-accent · cream-terracotta-cliche · second-accent · influence-brand-labels · floating-chatbot · nested-demo-scrollports · inset-hero-media

## Surfaces

| `data-surface` | Job | Controls |
| --- | --- | --- |
| `application` | Operate | 32px |
| `marketing` | Present / cinema tiles | 36–40px CTAs |
| `mobile` | Thumb-first | 44px |
| `desktop` | Keyboard + pointer | 28–32px chrome |

Shape: control `rounded-lg` · panel `rounded-2xl` · shell `rounded-3xl` · pill `rounded-full` (`radiusFor` in grammar).

## Theme knobs

```css
--brand --brand-foreground --brand-muted
--background --foreground --radius
```

## Load order

1. `design.md` (this file)
2. `lib/design/` (typed grammar + recipes)
3. `docs/architecture.md`
4. Matching skill (`.cursor/skills/…`)
5. Proof: `components/surfaces/workbench.tsx`

## Endpoints

| URL | Content |
| --- | --- |
| `/design` | Designed contract (Copy + Raw) |
| `/design.md` | Raw markdown contract |
| `/theme` | Live grammar + knobs |
| `/for-agents` | Skills, agents, frozen vs creative |
| `/architecture` | Designed architecture (Copy + Raw) |
| `/architecture.md` | Raw architecture |
| `/llms` | Designed discovery map |
| `/llms.txt` | Raw discovery |
| `/surfaces` | Surface proofs |

## Done checklist

- [ ] Used `@/lib/design` for structure (or equivalent closed tokens)
- [ ] `ideas: 1` on every cinema frame
- [ ] Correct `data-surface`
- [ ] shadcn primitive (no bespoke twin)
- [ ] Mono on data; quiet chrome
- [ ] AI object-bound (if any)
- [ ] `npm run check:design` clean
