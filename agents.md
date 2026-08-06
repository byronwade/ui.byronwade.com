# Meridian — agents.md

> **Strict AI operating manual.** Compact by design. Humans get a designed page; agents get this markdown (`?raw=1` forces raw).
>
> Two halves: **§0–§8** are the design-contract law (what is frozen). **[Engineering protocol](#engineering-protocol)** is the working discipline (how to change anything here). Both bind. Put package-specific facts in the nearest nested AGENTS.md; do not repeat these rules there.

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

# Engineering protocol

Governs AI-assisted work in this repository. Sections §0–§8 say what is frozen; this says how to change anything at all. Read [`docs/north-star.md`](/meridian/system/north-star) for the rationale behind this protocol only when changing it, not during normal tasks.

## Mission

Complete the requested change while leaving its affected dependency cone healthier than before.

Success means:

- requested behavior is correct and verified;
- existing concepts are reused before new ones are created;
- architecture, security, accessibility, maintainability, and measured performance do not regress;
- relevant duplication, dead code, and accidental complexity are reduced;
- recurring objective failures become mechanical checks;
- unrelated repository-wide rewrites do not enter the task.

Optimize for the fewest necessary concepts and the lowest future change cost — not merely fewer lines, files, or abstractions.

## Authority

Apply instructions in this order:

1. User request and acceptance criteria.
2. Closest applicable nested AGENTS.md.
3. This file.
4. Architecture decisions, public contracts, security requirements, and repository documentation.
5. Existing conventions, only when they do not degrade code health.

Report meaningful conflicts. Never preserve a bad pattern solely because it already exists.

## Repository bindings

How the generic rules below land on this codebase:

| Rule | Binding here |
| --- | --- |
| Reuse ladder | `components/ui` (shadcn) is the canonical atom set — compose or reskin via `[data-contract]`, never fork a twin |
| One source of truth | MCP tools, machine filenames, route slots, JSON keys live once in `lib/platform/skeleton.ts` — change one, change every contract, then `gen:contract` |
| What may diverge | OKLCH values, voice, catalog drawing, **and landing architecture** (`components/contracts/layouts/{id}-landing.tsx`) — `/{id}` is a shared route, not a shared layout |
| Mechanical prevention | `scripts/check-*.mjs` — a recurring objective failure becomes a rule there, not a paragraph |
| Verification | `npm run validate` (platform · design · shell · proofs · typeset · experience · contrast · lint) |

```bash
npm run validate     # all gates + lint
npm run gen:contract # regenerate every contract kit after a skeleton/DNA change
npx tsc --noEmit     # type check
npm run build        # production build
```

## Required workflow

For every nontrivial task:

1. Frame the behavior, constraints, non-goals, and verification target.
2. Reconnoiter the relevant code before editing.
3. Decide whether to reuse, configure, extend, extract, or create.
4. Implement the smallest coherent solution.
5. Recursively clean the task-related dependency cone until it converges.
6. Verify with deterministic checks and full-diff review.
7. Report decisions, checks, cleanup, and remaining findings truthfully.

Before implementation, provide a compact decision record for substantial work:

```text
Target and acceptance criteria:
Existing candidates inspected:
Reuse/extend/extract/create decision:
Expected dependency cone:
Verification plan:
```

## Reconnaissance before creation

Expand inspection progressively:

1. Read nearest instructions, manifests, architecture notes, tests, and CI configuration.
2. Inspect target symbols, direct callers, dependencies, data contracts, and owners.
3. Search repository-wide for exact and semantic equivalents.
4. Inspect comparable completed features and tests.
5. Inspect history when intent or ownership is unclear.
6. Run a narrow baseline check before risky work.

Before creating any component, hook, service, utility, formatter, validator, schema, type, client, state container, query, or abstraction, search for:

- equivalent names, inputs, outputs, invariants, and side effects;
- shared-package exports and internal package APIs;
- copies or near-copies in other applications;
- platform, language, framework, or existing-dependency capabilities;
- deprecated implementations whose callers should be migrated;
- tests that reveal the intended contract.

No exact name match does not mean no equivalent exists. Search by behavior and domain meaning.

## Reuse decision ladder

Choose the first sound option:

1. **Reuse** unchanged when semantics and lifecycle match.
2. **Configure or compose** through existing props, slots, callbacks, adapters, or children.
3. **Extend** coherently when the behavior belongs to the same concept and does not create unrelated flags or invalid states.
4. **Extract** shared behavior when multiple implementations express one stable concept with a clear owner.
5. **Create** new only when existing concepts differ materially or extension would confuse ownership and evolution.

New code requires a brief reason earlier options were rejected.

A shared abstraction must have one stable responsibility, a clear owner, a simpler interface than the behavior it hides, and lower change amplification than separate implementations. Do not merge incidental similarity. Do not copy a shared concept merely because presentation differs; prefer composition around one canonical primitive.

Do not add wrappers that only rename an API or forward arguments without enforcing a meaningful invariant.

## Bounded recursive cleanup

“Leave it better” applies to the task-related dependency cone, not the whole repository.

Seed a queue with each changed file, symbol, contract, and test. For each item:

1. Inspect direct callers and dependencies.
2. Search for semantic duplicates and competing sources of truth.
3. Find dead paths, obsolete compatibility code, boundary violations, and defects exposed by the change.
4. Classify each finding as fix now, migrate atomically, or record.
5. Enqueue only items directly affected by an accepted fix or migration.
6. Repeat until no task-related violation remains.

**Fix now** when the issue:

- is introduced, exposed, or made riskier by the task;
- is in code already being changed;
- is a correctness, security, data-integrity, accessibility, or measured-performance defect;
- is a duplicate or competing implementation of the same concept;
- is dead code or an obsolete export revealed by migration;
- blocks correct architecture or complete caller migration;
- is small, safe, and verifiable.

**Migrate atomically** when:

- a contract, schema, shared primitive, or boundary must change;
- every current caller can be updated and verified together;
- parallel old and new paths would create drift.

When the user or repository explicitly identifies the product as pre-production, internal backward compatibility is not a default requirement: use the better contract, migrate every caller, and delete the obsolete path. Persisted data, public APIs, external integrations, migration history, and user-visible behavior remain protected unless explicitly authorized otherwise.

**Record instead of fixing** when the issue is:

- unrelated to the request or its dependency/contract chain;
- speculative, subjective, or unsupported by evidence;
- a broad migration without a safe verification path;
- likely to create a mixed-purpose diff;
- dependent on a separate product or architecture decision.

Stop when acceptance criteria are met, affected callers are migrated, task-related duplicates and obsolete paths are gone, checks pass, and the next change would be unrelated or disproportionately risky.

Each recursion must reduce a concrete cost: duplication, coupling, obscurity, invalid states, dead code, unsafe operations, failing checks, or measured resource use. Moving, renaming, formatting, or abstracting without reducing such a cost is not cleanup.

## Architecture invariants

- Organize around stable responsibilities and hidden change-prone decisions, not execution order.
- Prefer narrow, capable interfaces over shallow abstractions.
- Maintain high cohesion, low coupling, explicit ownership, one-way dependencies, and no cycles.
- Keep domain rules in their domain; generic UI/shared packages must not become dumping grounds.
- Keep application workflows out of generic primitives.
- Keep side effects at explicit boundaries; prefer deterministic domain logic where practical.
- Maintain one source of truth for every invariant; derive values instead of synchronizing duplicated state.
- Do not bypass layers or import through backdoors for convenience.
- Avoid indiscriminate barrel exports and leaked implementation details.
- Do not add packages, layers, services, events, factories, or configuration for hypothetical future use.
- Enforce important architecture with dependency or structural checks rather than diagrams alone.

## Simplicity and code quality

- Prefer language, platform, framework, and existing-library capabilities over custom machinery.
- Prefer direct readable flow over clever compression and needless indirection.
- Do not equate shorter code with faster or better code.
- Do not duplicate constants, business rules, schemas, formatting, validation, or error handling.
- Avoid catch-all utils, helpers, and common modules without cohesive ownership.
- Make invalid states unrepresentable when practical.
- Do not use `any`, unsafe casts, suppressions, ignored promises, swallowed errors, or disabled rules as shortcuts.
- Comments explain intent, tradeoffs, and invariants — not obvious syntax.
- Delete replaced implementations, dead exports, abandoned files, commented-out code, and temporary shims.
- Modify generated code through its source or generator.
- Before adding a dependency, check repository/platform alternatives and evaluate maintenance, security, runtime cost, bundle size, and overlap.

## TypeScript and React

- Preserve strict inference and validate untrusted data at boundaries.
- Derive render values instead of storing synchronized state.
- Use effects only to synchronize with external systems.
- Do not memoize without a demonstrated identity or performance need.
- Keep server-capable work off the client when supported.
- Use canonical formatting, class-name, schema, data-access, and error primitives.
- Preserve accessibility, keyboard behavior, stable identity, hydration safety, and deterministic rendering.

Earned in this repository, and non-negotiable here:

- A component embedded at several widths folds on **container queries**, not viewport breakpoints — a shell that keeps three columns open in a half-page slot collides its own rows.
- Anything that resolves after hydration (theme, locale) renders the **server value** on the hydrating pass.
- Color a component picks must come from a token that **follows its context** (`stageInk()` / `data-tone`), never a role that is only correct on one surface.

## Performance protocol

Performance claims require evidence:

1. Establish a representative baseline.
2. Measure or profile one level below the visible symptom.
3. Identify the dominant bottleneck.
4. Change the smallest responsible design or implementation.
5. Repeat the same measurement.
6. Preserve a benchmark or budget when regression risk matters.

Prioritize algorithms, database/query behavior, network trips, serialization, caching, client JavaScript, rendering, allocations, concurrency, and hot-path I/O before cosmetic micro-optimization. Do not claim speed from fewer lines, different syntax, or a newer library without representative measurement.

## Correctness, testing, and safety

- Test observable behavior and public contracts, not private arrangement.
- Before risky refactoring, identify or add characterization tests.
- A bug fix should include a regression test that fails for the defect when practical.
- Cover success, failure, boundary, authorization, and concurrency cases as relevant.
- Prefer result/state assertions over brittle interaction assertions and excessive mocking.
- Keep tests deterministic and readable; test code may repeat setup when abstraction would hide the scenario.
- Run checks from narrowest to broadest: affected tests, package tests, type check, lint/static analysis, integration/end-to-end, then build/repository checks as risk requires.
- Never weaken a valid test merely to pass a change.
- Validate and normalize data at trust boundaries.
- Enforce authorization on the trusted side.
- Use parameterized data access and context-appropriate escaping.
- Keep secrets out of source, logs, client bundles, fixtures, and errors.
- Centralize risky operations behind safe typed abstractions.
- Prefer allowlists, least privilege, and structural prevention of vulnerability classes.

This repository's suite is static and visual rather than unit tests: `scripts/check-*.mjs` is the regression suite, and rendering a changed page — light, dark, and narrow — is the integration test.

## Mechanical prevention and ratchets

When an objective failure can recur, add the smallest reliable sensor:

- type invariant;
- formatter, linter, or AST rule;
- forbidden-import or dependency-boundary check;
- exact/near-duplicate detector;
- dead-file/export check;
- contract, regression, property, or architecture test;
- secret, dependency, or static-security scan;
- bundle, latency, query-count, memory, or throughput budget.

Sensors should be deterministic where possible, actionable, low-noise, and fast enough for their execution stage. Messages must explain how to correct violations.

For existing debt, record a baseline, block new violations, and reduce the baseline when touched. Do not introduce a noisy repository-wide gate that will be ignored. Prefer safe autofixes when semantics are unambiguous.

Sensors live in `scripts/` and run from `npm run validate`. **A sensor that audits one contract is a latent gap** — audit every contract the rule applies to.

## Toolchain

Repo-owned gates (`scripts/check-*.mjs`) enforce *this system's* laws. The tools
below cover the general classes those gates were never meant to catch — dead
code, formatting, render cost, React correctness, a11y fundamentals, hosting
spend. Run them; do not hand-roll their jobs.

| Tool | Job | Command |
| --- | --- | --- |
| **Ultracite** | Curated oxlint + oxfmt ruleset — general correctness, a11y, security | `npm run lint:ultracite` · `npm run format` |
| **Knip** | Unused files, exports, dependencies | `npm run scan:dead` |
| **react-doctor** | React correctness — the mistakes agents make | `npm run scan:react` |
| **shadscan** | shadcn UI fundamentals (a11y, missing states) | `npm run scan:ui` |
| **react-scan** | Render cost — measured, not guessed | dev overlay: `npm run dev`, read the on-page report |
| **vercel-doctor** | Hosting-cost regressions in the Next build | `npm run scan:cost` |

`npm run scan` runs the static ones in sequence. react-scan is the exception:
its URL-scanning CLI was removed in v0.5, so it mounts as a dev-only overlay
(`components/dev/react-scan.tsx`) and is read in the browser, not in CI.

**Ownership, so two linters never fight:**

- **Ultracite owns general lint and formatting** (`oxlint.config.ts` /
  `oxfmt.config.ts`, both extending Ultracite presets). It replaced Biome —
  they occupy the same slot, and three general linters is the exact duplication
  this manual bans. Do not add Prettier or Biome back.
- **ESLint keeps `eslint-config-next`** and the React Compiler plugin. Those
  rules are framework-specific and more accurate than the oxc ports; ESLint's
  `no-html-link-for-pages` has caught two real bugs here, while oxlint's port
  flags a static `/r/*.json` asset as a page. Where both ship a rule, ESLint
  owns it and the oxlint copy is switched off.
- **`lib/design/bans.mjs` owns design bans.** Never encode a design law as an
  oxlint or ESLint rule — it would become a fifth copy.

**Turning an Ultracite rule off requires a reason in `oxlint.config.ts`.** Every
disabled rule there names the convention it contradicts. A rule switched off to
reach a green gate, rather than because it fights a documented convention, is a
suppression and is banned. Correctness, a11y, and security rules are never
disabled. Run `npx oxlint --config oxlint.config.ts --fix` only on a clean tree
and read the diff: its fixer emits single quotes and semicolons, which fight
this repo's style, so unreviewed autofix makes the codebase less consistent.

**Reading the output.** These are third-party heuristics, not this repo's law.
A finding is evidence, not a verdict: confirm it against the protocol above
before acting, and record what you reject and why. Two known caveats —
`vercel-doctor` is a community package (not official Vercel tooling) and needs
a linked project to say anything useful; `knip` will flag the `lib/design`
grammar exports, which are the published API and deliberately have no internal
caller.

## Verification gate

Before completion:

- review the full diff;
- verify every acceptance criterion and non-goal;
- confirm existing candidates were reused or explicitly rejected;
- search again for duplicate helpers, components, services, schemas, and sources of truth;
- migrate every affected caller, import, export, test, and contract;
- remove dead and obsolete code;
- verify package, dependency, and client/server boundaries;
- run checks appropriate to the risk;
- compare before/after measurements for performance claims;
- confirm no unrelated cleanup entered the diff;
- run `git diff --check` or the repository equivalent;
- state any unrun check and why.

Never call a solution “best,” “optimal,” “safe,” or “fully verified” without evidence.

## Required final report

- **Decision** — chosen design and why.
- **Reused** — existing concepts used.
- **Created or extended** — what changed and why reuse unchanged was insufficient.
- **Recursive cleanup** — duplicates, dead paths, or debt removed in the dependency cone.
- **Mechanical prevention** — sensors added or the highest-value next sensor.
- **Verification** — exact checks and results.
- **Remaining findings** — relevant issues intentionally kept out of this change.

## Never

- create before searching;
- copy-paste implementations across applications by default;
- reimplement an existing canonical helper locally;
- force unrelated concepts together merely to satisfy DRY;
- create wrappers with no invariant or meaningful simplification;
- preserve obsolete internal paths solely for pre-production compatibility;
- perform an unbounded cleanup rewrite during a focused task;
- optimize without measurement;
- broaden public exports for convenience;
- suppress types, lint, tests, security findings, or errors without a justified exception;
- leave old and new implementations competing after migration;
- mistake passing AI-generated tests for proof that the requested behavior is correct.

---

# Design-contract law

## 1. Load order (mandatory)

0. [Engineering protocol](#engineering-protocol) below — reuse before create, bounded cleanup, verification gate
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

**DX on every contract:** `/install` (MCP · JSON API · npx skills · shadcn), `/ui` (shared `components/ui` gallery under the skin), `/surfaces` (shared app shells). Showcase modules live in `components/contracts/showcase/*` — never fork Buttons/Workbenches per DNA.

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
