# Meridian — agents.md

> **Strict AI operating manual.** Compact by design. Humans get a designed page; agents get this markdown (`?raw=1` forces raw).

**Product:** cinematic theme system — not a custom component zoo.  
**Primitives:** shadcn/ui. **Icons:** Phosphor `@/lib/icons`. **Color:** OKLCH only.  
**Influences (absorb, never label):** [Fluent 2](https://fluent2.microsoft.design/) material language + **Cursor application** density — not Fluent marketing, not Cursor.com.

---

## 0. Hard rules (fail closed)

| MUST | MUST NOT |
| --- | --- |
| Import structure from `@/lib/design` | Invent colors, radii, depths, shadows |
| OKLCH semantic tokens only | hex / rgb / hsl / arbitrary color utils |
| One accent → `--brand` | Second accent, neon, status-as-brand |
| shadcn primitives + compose | Fork twin components |
| Icons via `@/lib/icons` | `lucide-react` or direct Phosphor |
| `data-surface` + `ideas: 1` cinema | Overlay stickers, inset hero media |
| Object-bound AI + provenance | Floating chatbot |
| `edge` / `depth-*` | Tailwind `shadow-*` |
| `svh` viewport | `dvh` |
| Pass gates below | Ship without contrast audit |

**Frozen** = tokens, radii, depths, surfaces, knobs, activity, bans, cinematic + material laws, contrast pairs.  
**Creative** = copy, IA, domain objects, frame sequence, which shadcn wholes to compose.

---

## 1. Load order (mandatory)

1. [`design.md`](/design.md) — contract
2. `@/lib/design` — `grammar` · `recipes` · `contrast` · `cx`
3. Research specs when composing space/motion/AI — [`/system`](/system) (`influences` → `layout` · `ux` · `animations` · …)
4. Matching skill under `skills/<name>/SKILL.md`
5. Proof: `components/surfaces/workbench.tsx` (+ `composer-shell.tsx`)
6. Gates: `npm run check:design && npm run check:shell && npm run check:proofs && npm run check:contrast`

Skip a step → drift.

---

## 2. Design influences → Meridian mapping

Encode Fluent 2 + Cursor-app as **closed behaviors**, not brand pastiche.

| Fluent 2 | Cursor app | Meridian |
| --- | --- | --- |
| Global → alias tokens | Quiet chrome | OKLCH roles in `globals.css` / `colorRoles` |
| Neutral hierarchy | Dense panes | Soft warm neutrals; focus via lighter surface, not loud chrome |
| Brand on CTA / selected only | Object-bound AI | `--brand`; selected `bg-brand/10` |
| Semantic status ≠ brand | Provenance mono | `destructive` / `warning` stay semantic; `data-provenance` |
| `controlCornerRadius` vs `layerCornerRadius` | Compact controls | `radiusFor.control` → `rounded-lg`; panel/shell → `rounded-2xl` / `rounded-3xl` |
| Thin stroke (1px) | Hairline chrome | `edge` + `border-border`; focus = `ring-ring` (thicker), not color flip |
| Elevation ramp | Flat default | `edge` → `depth-soft` → `depth-raised` |
| Density / design unit | 28–32px rows | `data-surface` heights; 4px grid |
| Rest → hover → selected | Selection wash | hover `bg-muted/30–40`; selected `bg-brand/10` |

Do **not** ship FluentUI packages, Windows purple, or “Fluent / Cursor” labels in UI.

---

## 3. Material laws (app chrome)

1. **Control ≠ layer** — inputs/buttons/menu rows use control radius; cards/panels/popovers use layer; floating shells use shell.
2. **Stroke first** — default separation is 1px stroke / `edge`, not shadow.
3. **Depth is earned** — raise only when the surface floats (popover, modal, docked overlay).
4. **Neutral stack** — page `bg-background` · inset `bg-muted/15–30` · card `bg-card` · selected `bg-brand/10`.
5. **4px grid** — padding, gaps, control heights snap to the closed scale (`h-7`/`h-8`/`h-9`…).
6. **Focus ≠ fill** — keyboard focus uses ring/stroke weight; don’t rely on brand fill alone.
7. **Data is mono** — IDs, times, counts, tool names, filenames.
8. **AI attaches to an object** — issue, file, tool call; show provenance + activity.

Typed: `materialLaws` + `designInfluences` in `lib/design/recipes.ts`.

---

## 4. Skills

Human index: [`/skills`](/skills). Canonical: `skills/<name>/SKILL.md`.

| Skill | When | Prove on site |
| --- | --- | --- |
| `meridian-theme` | Re-skin knobs; keep one deep accent | [`/theme`](/theme) |
| `meridian-surface` | `data-surface` + density | [`/surfaces`](/surfaces) |
| `meridian-compose` | Product wholes (workbench / composer) | [`/surfaces#proofs`](/surfaces#proofs) |
| `meridian-cinematic` | Full-bleed frames under cinema laws | [`/`](/) home film |
| `meridian-a11y` | OKLCH + WCAG AA on every UI change | [`/theme#contrast`](/theme#contrast) |

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill meridian-theme
```

## 5. Agents

| Agent | Job |
| --- | --- |
| `meridian-author` | Implement under design.md + `@/lib/design` |
| `meridian-reviewer` | Audit MUST / banned / cinema / material / contrast |

## 6. Negotiated endpoints

| URL | Agent payload |
| --- | --- |
| `/design.md` | Contract |
| `/agents.md` | This manual |
| `/llms.txt` | Discovery |
| `/architecture.md` | Layers |

`?raw=1` forces machine representation in a browser.

## 7. Done gate

```bash
npm run check:design && npm run check:shell && npm run check:proofs && npm run check:contrast
```

- [ ] Load order followed  
- [ ] No invented tokens / radii / shadows  
- [ ] Control vs layer radius correct  
- [ ] Stroke/edge default; depth only when floated  
- [ ] Selected = brand wash; AI object-bound  
- [ ] Icons from `@/lib/icons`  
- [ ] Both checks green  
