# Meridian — agents.md

> **Strict AI operating manual.** Compact by design. Humans get a designed page; agents get this markdown (`?raw=1` forces raw).

**Product:** AI design contract (rules first) — not a custom component or shell zoo.  
**Platform:** Meridian is one contract in a **family**. Structure is shared; aesthetics may differ.  
**Biggest features:** **UX** + **DX** ([`/meridian/system/ux`](/meridian/system/ux) · [`/meridian/system/dx`](/meridian/system/dx)) — twin pillars.  
**North star:** [`docs/north-star.md`](/meridian/system/north-star).  
**Platform law:** [`docs/platform.md`](/meridian/system/platform).  
**Primitives:** shadcn/ui + shadcn/typeset. **Icons:** Phosphor `@/lib/icons`. **Color:** OKLCH only.  
**Influences (absorb, never label):** [Fluent 2](https://fluent2.microsoft.design/) material language + **Cursor application** density — not Fluent marketing, not Cursor.com.

---

## 0. Hard rules (fail closed)

| MUST | MUST NOT |
| --- | --- |
| Import structure from `@/lib/design` | Invent colors, radii, depths, shadows, type scales |
| OKLCH semantic tokens only | hex / rgb / hsl / arbitrary color utils |
| One accent → `--brand` | Second accent, neon, status-as-brand |
| shadcn primitives + compose | Fork twin components / invent app shells |
| `typesetClass()` for HTML/markdown | Per-tag class soup on markdown |
| Icons via `@/lib/icons` | `lucide-react` or direct Phosphor |
| `data-surface` + `ideas: 1` cinema | Overlay stickers, inset hero media |
| Object-bound AI + provenance | Floating chatbot |
| `edge` / `depth-*` | Tailwind `shadow-*` |
| `svh` viewport | `dvh` |
| Own empty / loading / error on resource surfaces | Demo-only happy paths |
| Keep **platform structure** identical across contracts | Fork MCP tools / filenames / JSON keys for one contract |
| Pass gates below | Ship without contrast / experience / platform audit |

**Frozen** = tokens, radii, depths, surfaces, shell rhythm, typeset presets, **uxLaws / dxLaws**, knobs, activity, bans, cinematic + material laws, contrast pairs, **platform skeleton**.  
**Creative** = copy, IA, domain objects, frame sequence, which shadcn wholes / typeset preset / disclosure level to compose, **per-contract DNA aesthetics**.

---

## 1. Load order (mandatory)

1. [`docs/north-star.md`](/meridian/system/north-star) — product definition (UX + DX pillars; rules ≠ shells)
2. [`docs/platform.md`](/meridian/system/platform) — **shared architecture for every contract**
3. [`design.md`](/meridian/design.md) — this contract’s DNA laws
4. `@/lib/design` — `grammar` · `experience` (`uxLaws`/`dxLaws`) · `typeset` · `shell` · `recipes` · `contrast`
5. When shaping interaction or APIs — [`/meridian/system/ux`](/meridian/system/ux) · [`/meridian/system/dx`](/meridian/system/dx)
6. Other research specs as needed — [`/meridian/system`](/meridian/system)
7. Matching skill under `skills/<name>/SKILL.md`
8. Proof (validation only): `components/surfaces/workbench.tsx` (+ `composer-shell.tsx`)
9. Gates: `npm run check:platform && npm run check:design && npm run check:shell && npm run check:proofs && npm run check:typeset && npm run check:experience && npm run check:contrast`

Skip a step → drift.

---

## 2. Platform consistency (all contracts)

> **Design DNA may differ. Architecture must not.**  
> If you change how something is named, routed, downloaded, or exposed over MCP/API, **change it for every contract** — never Meridian alone.

**Skins:** `/` is the platform catalog (`:root` + platform chrome). Every `/{id}/**` route must wrap in `ContractFrame` so `[data-contract="{id}"]` tokens from `app/contract-skins.css` own the whole page — including chrome. Never style the homepage like Meridian (or any single contract).

**DX on every contract:** `/install` (npx MCP into any project · JSON API · skills · shadcn), `/ui` (shared `components/ui` gallery under the skin), `/surfaces` (shared app shells), `/design` · `/skills` · `/system` · `/for-agents` (docs parity). Showcase modules live in `components/contracts/showcase/*` — never fork Buttons/Workbenches per DNA.

**vs shadcn MCP:** [shadcn MCP](https://ui.shadcn.com/docs/mcp) delivers registry components. **Contract MCP** is the fail-closed law (`get_contract` / `validate_ui` / recipes). Install both; do not treat them as substitutes.

**Agent stack (marketing + ops):** MCP required · markdown SSOT required · skills optional. Full pitch: [`/stack`](/stack) · [`docs/stack.md`](./docs/stack.md). Never ship MCP-only without docs, or docs/skills without MCP enforcement.

### Single source of truth

| Concern | Edit here only |
| --- | --- |
| MCP tool names / jobs | `lib/platform/skeleton.ts` → `packages/contract-mcp` |
| Machine filenames | `MACHINE_FILES` in skeleton |
| Route slots (`/install`, `/ui`, `/theme`, `/surfaces`, …) | `ROUTE_SLOTS` |
| Contract JSON keys | `CONTRACT_JSON_KEYS` + `lib/platform/build-contract.ts` |
| Per-contract OKLCH skins | `app/contract-skins.css` via `[data-contract]` |
| This manual’s section order | `AGENTS_MD_SECTIONS` |
| Task recipe ids | `lib/contracts/task-recipes.ts` |
| Price | `MCP_PRICE_USD` |
| Aesthetic / voice / tokens | `lib/contracts/dna/{id}.ts` (+ design grammar when live) |

### MCP = consistency kit (open source, lightweight)

The MCP server is **not** a docs browser. It only ships what keeps agents consistent:

| Tool | When | Job |
| --- | --- | --- |
| `get_contract` | **Before any UI** | MUST/MUST NOT + closed tokens + primitives + recipes |
| `resolve_token` | Picking color/radius/depth/surface | Closed set only — inventing fails |
| `list_primitives` | Choosing atoms | Compose shadcn list — never twin kits |
| `get_recipe` | Matching an intent | `must` / `never` for list, detail, agent-rail, … |
| `validate_ui` | **Before done** | Lint hex / shadow-* / lucide / arbitrary color |

Every tool response includes `obey.must` / `obey.mustNot`. Ignore them → drift.

### MUST

- Call **`get_contract` first**, obey `mandate.must` / `mandate.mustNot`, then compose
- Call **`validate_ui`** on new snippets before claiming done
- Use **identical** MCP tools on every contract: `get_contract` · `resolve_token` · `validate_ui` · `list_primitives` · `get_recipe`
- Ship the same machine files: `design.md` · `agents.md` · `architecture.md` · `llms.txt`
- Serve slim kit JSON at `/r/{id}.contract.json` (`buildContractEnvelope` — no fat laws dump)
- Keep `agents.md` sections in `AGENTS_MD_SECTIONS` order (DNA fills content; structure stays)
- Run `npm run gen:contract` after skeleton/DNA/consistency changes so **all** kits regenerate
- Start MCP via `packages/contract-mcp` with `CONTRACT_ID={id}` — thin aliases only (`packages/meridian-mcp`)

### MUST NOT fork

- A Meridian-only MCP tool or renamed tool for Harbor/Atlas/Vellum
- A one-off machine filename (`meridian-design.md`, `rules.json`, …)
- A bespoke contract JSON shape that other contracts do not share
- A divergent route slot (`/meridian/tokens` while others use `/theme`)
- Copy-pasting `server.mjs` tool lists per package — **MUST NOT fork** the shared MCP surface

### When aesthetics change (allowed)

Changing Meridian’s OKLCH paper, cinema tone, or proof emphasis does **not** require changing Harbor.  
Changing “we renamed `validate_ui` → `lint_classes`” **does** — update skeleton, regenerate every contract, update every `agents.md` that names the tool, pass `check:platform`.

Full law: [`docs/platform.md`](/meridian/system/platform).

---

## 3. Design influences → mapping

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

## 4. Material laws (app chrome)

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

## 5. Skills

Human index: [`/meridian/skills`](/meridian/skills). Canonical: `skills/<name>/SKILL.md`.

| Skill | When | Prove on site |
| --- | --- | --- |
| `meridian-theme` | Re-skin knobs; keep one deep accent | [`/meridian/theme`](/meridian/theme) |
| `meridian-surface` | `data-surface` + density | [`/meridian/surfaces`](/meridian/surfaces) |
| `meridian-compose` | Product wholes (workbench / composer) | [`/meridian/surfaces#proofs`](/meridian/surfaces#proofs) |
| `meridian-cinematic` | Full-bleed frames under cinema laws | [`/meridian`](/meridian) film |
| `meridian-a11y` | OKLCH + WCAG AA on every UI change | [`/meridian/theme#contrast`](/meridian/theme#contrast) |

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill meridian-theme
```

## 6. Agents

| Agent | Job |
| --- | --- |
| `meridian-author` | Implement under design.md + `@/lib/design` + platform skeleton |
| `meridian-reviewer` | Audit MUST / banned / cinema / material / contrast / **platform parity** |

## 7. Negotiated endpoints

Same filenames on **every** contract (`/{id}/…`). Meridian:

| URL | Agent payload |
| --- | --- |
| `/meridian/design.md` | Contract |
| `/meridian/agents.md` | This manual |
| `/meridian/llms.txt` | Discovery |
| `/meridian/architecture.md` | Layers |
| `/r/meridian.contract.json` | Machine contract (platform + DNA) |

`?raw=1` forces machine representation in a browser.  
MCP: `CONTRACT_ID=meridian node packages/contract-mcp/server.mjs`

## 8. Done gate

```bash
npm run check:platform && npm run gen:contract
npm run check:design && npm run check:shell && npm run check:proofs && npm run check:typeset && npm run check:experience && npm run check:contrast
```

- [ ] Load order followed (north star → **platform** → contract → experience grammar)
- [ ] Structural change (if any) landed in `lib/platform/skeleton.ts` and regenerated **all** contracts
- [ ] No forked MCP tools / filenames / JSON keys for Meridian only
- [ ] UX: status visible; empty/error owned; keyboard path
- [ ] DX: closed presets; self-verified gates; no twin kit
- [ ] No invented tokens / radii / shadows / type scales
- [ ] Typeset preset for rendered markdown (no per-tag soup)
- [ ] Control vs layer radius correct
- [ ] Selected = brand wash; AI object-bound (outcome → trace)
- [ ] Icons from `@/lib/icons`
- [ ] Did not invent a new shell / twin component
- [ ] `check:platform` + all checks green
