# Meridian — design.md

> **AI contract.** Read this before any UI work. Typed grammar: `lib/design/`. Drift lint: `npm run check:design`.  
> **North star:** [`docs/north-star.md`](docs/north-star.md) — we build a **rule system**, not shells.

**Product:** ground-up AI design contract so agents under extreme constraints ship on-brand UI.  
**Not:** a custom component library, app-shell zoo, or place to invent twin Buttons/Cards.  
**Primitives:** shadcn/ui + shadcn/typeset. **Enforcement:** TypeScript closed sets + CI audit.  
**Aesthetic list:** **Cinematic design**.

## The model — strict + creative

| Zone | What’s locked | What’s free |
| --- | --- | --- |
| **Frozen** | Color (OKLCH), radii, depth, surfaces, shell rhythm, **typeset presets**, theme knobs, activity, bans, cinematic + material laws, contrast pairs | — |
| **Creative** | — | Copy, IA, domain objects, frame sequence, which shadcn wholes / typeset preset to compose, narrative inside one-idea frames |

Agents invent **stories and compositions**. They do not invent **colors, shadows, radii, or typography scales**. Import `@/lib/design` — TypeScript rejects fabrication.

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
| Accent | `--brand` — one deep ink-teal (lifts on theater) |
| Color space | **OKLCH only** — never hex / rgb / hsl |
| Contrast | WCAG AA — `npm run check:contrast` |
| Paper | Soft warm neutrals — never pure white/black |
| Feeling | Crisp, calm, softly warm |
| App chrome | **Cursor application** density (object-bound AI) — not Cursor.com |
| Material language | **Fluent 2** tokens/shape/stroke/elevation — not FluentUI packages or Windows chrome |
| Type | Geist Sans + Geist Mono |
| Depth | `edge` → `depth-soft` → `depth-raised` |
| Media | Full-bleed photographs (`BleedImage`) when staging; app windows otherwise |
| Reading | shadcn/typeset — `typesetClass("docs"\|"chat"\|"reading"\|"compact")` |
| Primitives | shadcn/ui — compose, don’t fork; never grow a shell zoo |
| Icons | Phosphor via `@/lib/icons` — duotone default |
| Default surface | `application` |
| Grammar | `lib/design/grammar.ts` |

## Material (Fluent 2 → Meridian)

Absorb Fluent 2; never paste Fluent brand or ship `@fluentui/*`.

| Fluent 2 concept | Meridian |
| --- | --- |
| Global → alias tokens | OKLCH roles / CSS vars |
| Neutral hierarchy | Soft warm stack; focus via surface lift |
| Brand sparingly (CTA / selected) | `--brand` + `bg-brand/10` |
| Semantic status ≠ decoration | `destructive` / `warning` never become brand |
| Control vs layer corner radius | `radiusFor.control` vs `panel` / `shell` |
| Thin stroke (1px) | `edge` + `border-border`; focus = `ring-ring` |
| Elevation ramp | `edge` → `depth-soft` → `depth-raised` |
| Density / design unit | `data-surface` + 4px grid |

Typed as `designInfluences` + `materialLaws` in `lib/design/recipes.ts`. See [`agents.md`](/agents.md).

## Cinematic design list

Encoded in `lib/design/recipes.ts` → `cinematicLaws`:

1. **Application is the subject** — Cursor-app density + Fluent stroke/radius discipline; chrome is quiet
2. **One idea per frame** — typed as `ideas: 1`
3. **Full-bleed media** — edge-to-edge when photographing; app windows otherwise — never inset hero cards
4. **No overlay stickers** on media
5. **Soft neutrals** — never pure white or pure black
6. **One accent** — deep and clear, never neon/bright noise
7. **Stable viewport** — `svh`, never `dvh`
8. **Motion is micro** — no scroll choreography
9. **Tile alternation** — app proof ↔ parchment rhythm (distinct beats, no repeated subject)
10. **Sparse copy** — one primary `CinemaLink` (+ optional secondary); no chevrons
11. **Structured reading** — shadcn/typeset presets; no per-tag class soup
12. **Type weight medium-max** — hierarchy from size + tracking
13. **OKLCH only** — all color tokens are `oklch(...)` or `var(--token)`
14. **Contrast audited** — WCAG AA on paper + theater; no opacity cheats
15. **Control ≠ layer** — Fluent corner-radius split via `radiusFor`
16. **Stroke before shadow** — default `edge`; depth only when floated
17. **Rules over widgets** — prefer a frozen preset / law over a new component

## Accessibility (mandatory)

Every UI or token change must pass this audit (skill: `meridian-a11y`):

1. Colors are **OKLCH** semantic tokens — never hex / rgb / hsl / named colors
2. Body/UI text ≥ **4.5:1**; large/display ≥ **3:1** (`lib/design/contrast.ts`)
3. On `bg-dock` / theater stages use `data-tone="theater"` so `--brand` lifts
4. Secondary text uses `text-muted-foreground` or `text-dock-muted` — never `text-*/70`
5. Focus uses `ring-ring`; touch targets follow `data-surface="mobile"` (44px)
6. Run **`npm run check:contrast`** (and `check:design`) before done

## MUST

1. Import design decisions from `@/lib/design` when choosing color/radius/depth/cinema structure
2. **OKLCH tokens only** — no raw hex / rgb / hsl / arbitrary color utilities
3. **One accent** — primary, ring, selected, success → `--brand`
4. **Status semantic** — destructive / warning never become brand
5. **shadcn only** for primitives — compose `Button`, `Card`, `Badge`, `Input`, … (`npx shadcn@latest add`)
6. **Typeset for HTML/markdown** — `typesetClass(...)` from `@/lib/design`; never invent per-tag type soup
7. **Icons from `@/lib/icons`** — Phosphor, duotone by default; never `lucide-react` or `@phosphor-icons/react` direct
8. **`data-surface`** — `application` | `marketing` | `mobile` | `desktop`
9. **Mono for data** — IDs, counts, times, prices, model/tool names
10. **Object-bound AI** — provenance + activity; no floating chatbot
11. **Audit accessibility + contrast** on every change
12. Pass **`npm run check:design`**, **`check:shell`**, **`check:proofs`**, **`check:typeset`**, and **`check:contrast`**
13. **Shell rhythm** — wrap app chrome in `data-surface`; size/type via shell utilities (proof rails, not a shell zoo)
14. **Interactive proofs** — `defineInteractiveProof` (idle + selected; agent ⇒ ActivityLegend) — validation only
15. **Theme knobs** — only `lib/design/knobs` presets (brand / radius / paper)
16. **Absorb first** — fill [`docs/absorb.md`](docs/absorb.md) before influence-driven UI changes
17. **North star** — if a change doesn’t make AI-consistent design more reliable, it’s out of scope

## MUST NOT (`banned` in grammar)

raw-hex · arbitrary-color-utility · non-oklch-color · tailwind-shadow · dvh-viewport · font-bold-display · scroll-choreography · overlay-stickers-on-media · pure-white · pure-black · bright-neon-accent · cream-terracotta-cliche · second-accent · influence-brand-labels · floating-chatbot · nested-demo-scrollports · inset-hero-media · low-contrast-on-dock · foreground-opacity-cheat · direct-lucide-import · direct-phosphor-import · arbitrary-px-height · arbitrary-px-type · arbitrary-px-padding

## Surfaces & shell rhythm

| `data-surface` | Job | Controls | Type UI |
| --- | --- | ---: | ---: |
| `application` | Operate | 32px | 14px |
| `marketing` | Present / cinema tiles | 36–40px CTAs | 16px |
| `mobile` | Thumb-first | 44px | 16px |
| `desktop` | Keyboard + pointer | 28px chrome | 13px |

**One shell contract:** spacing / sizing / type remap through CSS vars (`lib/design/shell.ts`). Use `h-control`, `h-row`, `shell-pad`, `shell-gap`, `type-ui` / `type-row` / `type-meta` / `type-label` — never invent off-scale `h-[NNpx]` / `text-[NNpx]` / `p-[NNpx]`. Proof: `/theme#shell-rhythm`.

Shape (Fluent control vs layer): control `rounded-lg` · panel `rounded-2xl` · shell `rounded-3xl` · pill `rounded-full` (`radiusFor`). Base `--radius` ≈ Fluent Large (8px); layers scale from it.

## Theme knobs

```css
--brand --brand-foreground --brand-muted
--background --foreground --radius
```

## Load order

1. `design.md` (this file)
2. `lib/design/` (typed grammar + recipes)
3. [`agents.md`](/agents.md) — strict operating manual
4. Research specs when needed — [`/system`](/system) (`influences`, `layout`, `ux`, `animations`, …)
5. Matching skill (`skills/…`)
6. Proof: `components/surfaces/workbench.tsx` · `composer-shell.tsx`

## Endpoints

Machine URLs content-negotiate: browsers get designed HTML; agents get raw
(`Accept: text/markdown` / `text/plain`, or `?raw=1`).

| URL | Human | Agent |
| --- | --- | --- |
| `/design.md` | Designed contract | Raw markdown |
| `/agents.md` | Designed agents guide | Raw markdown |
| `/llms.txt` | Designed discovery | Raw text |
| `/architecture.md` | Designed architecture | Raw markdown |
| `/design` · `/for-agents` · `/llms` · `/architecture` | Same designed pages (direct) | — |
| `/theme` · `/surfaces` | Showcase | — |

## Done checklist

- [ ] Used `@/lib/design` for structure (or equivalent closed tokens)
- [ ] `ideas: 1` on every cinema frame
- [ ] Correct `data-surface`
- [ ] shadcn primitive (no bespoke twin / no new shell)
- [ ] Typeset preset for HTML/markdown (no per-tag soup)
- [ ] Icons from `@/lib/icons` (Phosphor)
- [ ] Mono on data; quiet chrome
- [ ] AI object-bound (if any)
- [ ] `check:design` · `shell` · `proofs` · `typeset` · `contrast` clean
