# Meridian — north star

> **What we are building.** Read this before inventing surfaces or shells.

## The product

Meridian is an **AI design contract** — a ground-up rule system so that an agent under extreme constraints **always** produces on-brand, high-quality UI with excellent **user experience** and **developer/agent experience**.

It is **not**:

- a custom component library
- a zoo of app shells to re-create
- a marketing collage kit
- a place to invent second Buttons / Cards / Workbenches

It **is**:

| Layer | Job |
| --- | --- |
| `design.md` / `agents.md` | Fail-closed MUST / MUST NOT |
| `lib/design/*` | Typed closed unions (tokens, UX/DX laws, shells, typeset, cinema) |
| `app/globals.css` + `typeset.css` | OKLCH theme + shadcn/typeset rhythm |
| `components/ui/*` | **shadcn primitives** — compose, don’t fork |
| Proofs (`surfaces/*`) | **Validation only** — prove rules work; not the product |
| `check:*` gates | CI that agents cannot skip |

## Twin pillars (biggest features)

```
UX — operator experience          DX — human + AI developer experience
────────────────────────────      ────────────────────────────────────
usefulness, meaning, status       progressive complexity
predictable → juicy press         closed token API
quiet chrome, loud content        Always / Ask / Never load tiers
empty / loading / error owned     self-verification via check:*
object-bound AI, outcome→trace    golden path: surface + typeset + shadcn
keyboard parity + a11y            rules over widgets
```

Visual grammar (color, radius, cinema) exists to **serve** these pillars — not the other way around.

Typed: `uxLaws` · `dxLaws` in `lib/design/experience.ts`.  
Prose: [`ux.md`](./ux.md) · [`dx.md`](./dx.md).

## The AI model

```
FROZEN (cannot invent)              CREATIVE (must invent well)
────────────────────────────        ─────────────────────────────
colors / radii / depth              copy & voice
shell rhythm (space/size/type)      information architecture
typeset presets (docs/chat/…)       which shadcn wholes to compose
theme knobs (closed presets)        domain objects & workflows
uxLaws + dxLaws                     which states/disclosure to emphasize
cinematic + material + lane laws    one-idea frame sequence
bans + contrast pairs               narrative inside the laws
```

Agents invent **stories and compositions**.  
They do **not** invent **tokens, shadows, radii, typography scales, or interaction physics**.

## Primitives policy

1. **shadcn/ui** owns atoms (`Button`, `Card`, `Input`, …) — `npx shadcn@latest add`.  
2. **shadcn/typeset** owns rendered HTML/markdown rhythm — `typeset` + frozen presets.  
3. Meridian owns **rules** (especially UX + DX) that force those primitives into one coherent system.  
4. New “components” are almost always **wrong** — prefer a rule, a preset, or a composed proof.

## Success criteria

An AI with only Meridian contracts + shadcn, under pressure, still ships:

- **UX** — useful controls, visible status, owned empty/error, keyboard path, object-bound AI  
- **DX** — closed grammar, golden path, self-verified gates, no twin kits  
- one accent, OKLCH, AA contrast  
- shell-correct density without `h-[37px]`  
- typeset-correct reading without per-tag class soup  
- cinema with `ideas: 1`, no stickers  

If a change doesn’t make UX or DX more reliable for agents, it’s out of scope.
