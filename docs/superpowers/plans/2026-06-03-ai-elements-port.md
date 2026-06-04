# AI Elements → byronwade/ui Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a **resumable marathon** — pick up at the first unchecked component.

**Goal:** Port all 31 Vercel "AI Elements" components into the byronwade/ui registry, fully adapted to our Design DNA (base-ui + tokens + `data-slot` + CVA, no arbitrary values, editorial typography), each landing CI-green at the full repo bar.

**Architecture:** Each component lives at `registry/components/ai-elements/<name>.tsx` (target `components/ai-elements/<name>.tsx`), registered as `registry:component` named `ai-<name>` (the `ai-` prefix avoids the `edge` house-utility collision; file layout keeps their internal `@/components/ai-elements/*` cross-imports intact). Functional deps are kept (`ai`, `streamdown`, `shiki`, `use-stick-to-bottom`, `tokenlens`, `motion`, `nanoid`, `@xyflow/react`); `@radix-ui/react-use-controllable-state` is replaced with a local controllable-state hook. Source of truth for porting is `registry.ai-sdk.dev/all.json` (30 components); `attachments` is sourced from `github.com/vercel/ai-elements` (unpublished).

**Tech Stack:** Next.js (vendored), React 19, Tailwind v4, @base-ui/react, CVA, vitest + vitest-axe, shadcn registry tooling.

**Working in-place** on `feat/registry-mcp` alongside a concurrent writer — **re-read `registry.json` and `registry/rules/byronwade-ui.mdc` immediately before every edit** and append, never clobber.

---

## Conventions / file structure (per component)

| Path | Responsibility |
|---|---|
| `registry/components/ai-elements/<name>.tsx` | Ported component source (hand-maintained) |
| `registry.json` → new item `ai-<name>` | type `registry:component`, `dependencies` (npm), `registryDependencies` (`@byronwade/foundation`, `@byronwade/utils`, + any of our primitives it composes, + cross `@byronwade/ai-<other>`), `files` → target `components/ai-elements/<name>.tsx` |
| `registry/rules/byronwade-ui.mdc` | Add `ai-<name>` to the AI/agent components list (section 1) |
| `content/examples/ai-<name>/default.tsx` | One runnable example (hand-maintained) |
| `tests/components/ai-<name>.test.tsx` | Variants/states/interactions + axe, ≥ coverage thresholds |

If a port needs a primitive we lack, build it as a proper `registry:ui` item first (its own item + test + example + rule entry).

## The fixed per-component loop (repeat ×31)

- [ ] **Step 1 — Pull source.** Extract `<name>.tsx` from `/tmp/all.json` (or GitHub for `attachments`). Read it fully.
- [ ] **Step 2 — Port to our DNA.** Rewrite: swap shadcn/Radix primitives → our `@/components/ui/*` (base-ui); replace raw colors/arbitrary values with semantic tokens + house utilities; `font-bold`/`font-semibold` → `font-medium`; ensure every part carries `data-slot`; variants via `cva(...)`; merge with `cn()` and accept `className`. Replace `@radix-ui/react-use-controllable-state` with a local hook. Keep functional deps.
- [ ] **Step 3 — Register.** Re-read `registry.json`; append the `ai-<name>` item with correct deps/registryDependencies/files.
- [ ] **Step 4 — Rule.** Re-read the rule; add `ai-<name>` to the AI components list.
- [ ] **Step 5 — Sync + example.** `npm run sync`; write `content/examples/ai-<name>/default.tsx`; `npm run gen:examples`.
- [ ] **Step 6 — Test.** Write `tests/components/ai-<name>.test.tsx` (default render, each variant/size/state, interactions, axe).
- [ ] **Step 7 — Gates.** `npm run validate` and `npm run test:ci` (or scoped `npx vitest run` during iteration) — must be green.
- [ ] **Step 8 — Commit.** `git add -A && git commit -m "feat(ai-elements): add ai-<name> (adapted from AI Elements)"`.

## Component spec table (ordered leaves-first; check off as completed)

Legend: **L**=source lines, **ext**=external npm deps, **ui**=our primitives it composes.

### Tier 0 — trivial, no deps
- [ ] `loader` — 96L — ext: — — ui: — (pure SVG spinner + cn)
- [ ] `shimmer` — 64L — ext: — — ui: — (animated text shimmer)

### Tier 1 — composes our primitives / single functional dep
- [ ] `suggestion` — 56L — ui: button
- [ ] `image` — 26L — ext: ai (FileUIPart type)
- [ ] `open-in-chat` — 365L — ui: button
- [ ] `inline-citation` — 287L — ui: badge
- [ ] `context` — 408L — ext: ai, tokenlens — ui: button, progress
- [ ] `code-block` — 178L — ext: shiki — ui: button
- [ ] `task` — 87L — ui: —
- [ ] `sources` — 77L — ui: —
- [ ] `model-selector` — 205L — ui: —
- [ ] `confirmation` — 182L — ext: ai — ui: alert, button
- [ ] `checkpoint` — 68L — ui: button, separator
- [ ] `plan` — 142L — ui: button
- [ ] `queue` — 274L — ui: button, scroll-area
- [ ] `web-preview` — 263L — ui: button, input
- [ ] `conversation` — 100L — ext: use-stick-to-bottom — ui: button
- [ ] `attachments` — (GitHub) — ui: button, hover-card — ext: ai

### Tier 2 — heavier composites
- [ ] `reasoning` — 180L — ext: streamdown (+ local controllable-state)
- [ ] `tool` — 165L — ext: ai — ui: badge
- [ ] `message` — 448L — ext: ai, streamdown — ui: button
- [ ] `prompt-input` — 1413L — ext: ai, nanoid — ui: button  ⚠️ largest
- [ ] `chain-of-thought` — 231L — ui: badge (+ local controllable-state)
- [ ] `artifact` — 147L — ui: button

### Tier 3 — React-Flow workflow canvas (hard dep `@xyflow/react`)
- [ ] `node` — 71L
- [ ] `edge` — 140L
- [ ] `connection` — 28L
- [ ] `controls` — 18L
- [ ] `panel` — 15L
- [ ] `canvas` — 22L
- [ ] `toolbar` — 16L

## Notes / risks
- **Scale:** ~6,000 lines of source across 31 components + equivalent tests. This spans many sessions; commit each component green.
- **Collision:** concurrent writer on `registry.json`/rule/`button.tsx` — append-only, re-read before edit.
- **`@radix-ui/react-use-controllable-state`** (reasoning, chain-of-thought): replace with a small local `useControllableState` in `registry/lib/` (or inline) to avoid a Radix dep.
- **Coverage:** thresholds are global (statements ≥95, branches ≥90, functions ≥99, lines ≥96 in vitest.config; CI ratchet higher). Large components (prompt-input, message, context) need thorough tests.
- **Canvas group** only renders meaningfully inside a `<ReactFlow>` provider — tests/examples must wrap accordingly.
