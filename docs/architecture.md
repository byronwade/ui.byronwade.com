# Meridian — architecture.md

> System layers for humans and agents. Influences: [`influences.md`](./influences.md).  
> Contracts: [`../design.md`](../design.md) · [`../agents.md`](../agents.md). Specs: layout · ux · animations · color · typography · density · ai-surfaces.

## 1. What Meridian is

An **AI design contract** — strict guidelines + typed grammar so agents under
extreme constraints always produce good UI. Showcased on a cinematic website.
Surfaces are **proofs**, not the product. See [`north-star.md`](./north-star.md).

| Is | Is not |
| --- | --- |
| Tokens + grammar + fail-closed laws | Parallel component library |
| shadcn primitives + typeset rhythm | Forked Button/Card twins / shell zoo |
| Frozen material + creative composition | Freeform vibe coding |
| Agent-readable contracts + lint | Prompt-only hope |

## 2. Research → system (why each layer exists)

| Finding | Source | Response |
| --- | --- | --- |
| Agents fabricate tokens / drift mid-session | [Superdesign](https://superdesign.dev/blog/ai-design-system-drift) | Closed unions in `lib/design/grammar.ts` |
| Docs ≠ code ≠ components | [Pandya](https://hvpandya.com/llm-design-systems) | One grammar imported by UI + `check:design` |
| Creativity dies if everything locked | Internal model | Frozen vs creative zones in `recipes.ts` |
| Productivity apps need quiet dense chrome | Cursor app, [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui) | Shell rhythm + workbench proofs |
| Material needs control vs layer + stroke | [Fluent 2](https://fluent2.microsoft.design/) | `materialLaws`, `radiusFor`, `edge` |
| Meaning-bearing color + task density | [Polaris Pro](https://polaris-react.shopify.com/design/pro-design-language) | Status semantics, `data-surface` |
| HTML/markdown type soup repeats | [shadcn/typeset](https://ui.shadcn.com/docs/typeset) | Owned `typeset.css` + frozen presets |
| Cinema staging | Apple-class film patterns | `cinematicLaws`, `defineCinemaFrame` |
| Parts without wholes fail | [Brad Frost](https://bradfrost.com/blog/post/the-part-and-the-whole/) | Surfaces **validate** atoms in product frames |
| Compose don’t invent | shadcn / schema UI gen | `npx shadcn@latest add` |

## 3. North star pipeline

```
docs/north-star.md             ← product = AI contract
docs/platform.md               ← shared architecture (all contracts)
        ↓
lib/platform/skeleton.ts       ← MCP · filenames · routes · JSON keys (SSOT)
lib/contracts/dna/{id}.ts      ← aesthetic DNA only (may differ)
        ↓
influences.md (ranked absorb)
        ↓
design.md + agents.md          ← contracts (MUST / load order / platform parity)
        ↓
lib/design/{grammar,recipes,typeset,shell,contrast,cx,knobs}.ts
        ↓
app/globals.css + typeset.css  ← OKLCH tokens + typeset rhythm
        ↓
components/ui/*                ← shadcn atoms (compose only)
        ↓
components/surfaces/*          ← proofs (validation only)
components/cinematic/*         ← film stages
        ↓
check:platform · design · shell · proofs · typeset · contrast
```

Agents invent **stories and compositions**. They do not invent **colors, shadows, radii, or type scales**.  
They also do not invent **Meridian-only MCP tools or machine filenames** — see [`platform.md`](./platform.md).

## 4. Frozen vs creative

```
FROZEN                              CREATIVE
──────────────────────────────      ─────────────────────────────
colorRoles / OKLCH                  copy / voice
radii / depths / strokeFor          information architecture
surfaces / shell rhythm             domain objects
typeset presets / laws              which typeset preset
themeKnobs / activity               frame sequence (ideas: 1)
cinematicLaws / materialLaws        which shadcn wholes
banned / designInfluences           narrative within one idea
contrast pairs
```

## 5. Layer catalog

| Layer | Path | Owner |
| --- | --- | --- |
| North star | `docs/north-star.md` | Product |
| Ranked influences | `docs/influences.md` | Research |
| Spatial system | `docs/layout.md` | Research |
| Interaction / UX | `docs/ux.md` | Research |
| Motion | `docs/animations.md` | Research |
| Color | `docs/color.md` | Research |
| Type + typeset | `docs/typography.md` | Research |
| Density | `docs/density.md` | Research |
| Operator UX | `docs/ux.md` | Pillar |
| Developer / agent DX | `docs/dx.md` | Pillar |
| AI UI | `docs/ai-surfaces.md` | Research |
| Human DNA | `docs/meridian.md` | DNA |
| Source ledger | `docs/sources.md` | DNA |
| AI contract | `design.md` | Contract |
| Agent OS manual | `agents.md` | Contract |
| Typed grammar | `lib/design/grammar.ts` | Code |
| Recipes / laws | `lib/design/recipes.ts` | Code |
| Typeset presets | `lib/design/typeset.ts` | Code |
| Shell rhythm | `lib/design/shell.ts` | Code |
| Contrast pairs | `lib/design/contrast.ts` | Code |
| Class helpers | `lib/design/cx.ts` | Code |
| Drift lint | `scripts/check-*.mjs` | CI |
| Tokens | `app/globals.css` | Theme |
| Typeset CSS | `app/typeset.css` | Theme |
| Primitives | `components/ui/*` | shadcn |
| Proofs | `components/surfaces/*` | Validation |
| Film | `components/cinematic/*` | Marketing |
| Skills | `skills/*/SKILL.md` | Agents |
| Agents | `.cursor/agents/*` | Agents |

## 6. Typed grammar surface

Import `@/lib/design` — never ad-hoc fabrication.

| Export | Job |
| --- | --- |
| `colorRoles` | Closed semantic colors |
| `radii` / `radiusFor` | Control vs layer vs shell |
| `depths` / `depthFor` | edge → soft → raised |
| `strokeFor` | thin edge / focus ring |
| `surfaces` | application · marketing · mobile · desktop |
| `activityRoles` | thinking · search · read · edit |
| `provenanceRoles` | user · assistant · tool · … |
| `banned` | Drift patterns |
| `typesetClass` / `typesetLaws` | Frozen HTML/markdown rhythm |
| `uxLaws` / `dxLaws` | Twin pillars — operator + agent/dev experience |
| `shellRhythm` / `shellLaws` | Surface density contract |
| `cinematicLaws` | Film contract |
| `materialLaws` | Fluent-shaped material |
| `designInfluences` | Absorb / reject lists |
| `defineCinemaFrame` | Typed one-idea frames |
| `defineInteractiveProof` | Proof recipe (validation) |
| `contrastPairs` | WCAG AA audit data |

## 7. Runtime architecture (Next.js)

```
app/
  page.tsx                 home film
  globals.css              tokens
  typeset.css              shadcn/typeset (owned)
  theme/                   grammar showcase
  surfaces/                proof gallery (validation)
  for-agents/              designed agents guide
  architecture/            designed architecture
  system/                  research docs index + [slug]
  design.md/route.ts       negotiated contract
  agents.md/route.ts
  architecture.md/route.ts
  *.md/route.ts            other negotiated docs
components/
  ui/                      shadcn (compose only)
  surfaces/                proofs — not a shell product
  cinematic/               stages
  home/                    film beats
  docs/                    DocShell, MarkdownBody (typeset)
lib/design/                typed law
scripts/check-*.mjs        gates
```

Content negotiation: browsers → designed HTML; agents → raw markdown (`Accept` or `?raw=1`).

## 8. Toolchain roles

| Kind | Role | Examples |
| --- | --- | --- |
| Contract | Always-on law | `design.md`, `agents.md`, `north-star.md` |
| Research spec | Deep merge rules | `docs/layout.md`, `typography.md`, … |
| Skill | Task workflow | `meridian-compose` |
| Agent | Author / reviewer | `meridian-author` |
| Lint | Fail closed | `check:design`, `shell`, `proofs`, `typeset`, `contrast` |

## 9. Website routes

| Route | Job |
| --- | --- |
| `/` | Cinematic positioning |
| `/design` · `/meridian/design.md` | Contract |
| `/meridian/for-agents` · `/meridian/agents.md` | Agent OS |
| `/meridian/architecture` · `/meridian/architecture.md` | This file |
| `/system` · `/meridian/system/[slug]` | Research specs (influences, layout, ux, …) |
| `/meridian/theme` · `/meridian/surfaces` · `/skills` | Showcase |
| `/llms` · `/meridian/llms.txt` | Discovery |

## 10. Extension protocol

1. **New token role** → `grammar.ts` + `globals.css` + `cx.ts` + contrast if text/bg (same PR).  
2. **New ban** → `banned` + `check-design.mjs` rule.  
3. **New influence win** → update `influences.md` merge matrix + encode in recipes/CSS.  
4. **New skill** when a workflow repeats three times.  
5. Keep MUST lists short — raise the floor, don’t write a novel in the contract; put depth in `docs/*`.

## 11. Dependency rules

```
docs/research  →  informs  →  design.md / recipes
recipes        →  imported by  →  UI / theme pages
UI             →  may import  →  @/lib/design, @/components/ui, @/lib/icons
UI             ✗  must not    →  invent hex, shadow-*, lucide direct
```

## 12. Done definition (architectural)

- [ ] Change sits in the correct layer  
- [ ] Frozen vocabulary unchanged unless intentional + tests/lint updated  
- [ ] Influence merge matrix still true (or updated)  
- [ ] Gates green  

## Sources

- [Superdesign — AI design system drift](https://superdesign.dev/blog/ai-design-system-drift)
- [Pandya — LLM design systems](https://hvpandya.com/llm-design-systems)
- [Fluent 2](https://fluent2.microsoft.design/)
- [Polaris Pro](https://polaris-react.shopify.com/design/pro-design-language)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Vercel Design Engineer Principles](https://vercel.com/design/engineer)
