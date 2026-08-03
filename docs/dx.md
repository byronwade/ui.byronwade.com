# Meridian — dx.md

> **Developer experience** for humans and AI agents. Twin pillar with [`ux.md`](./ux.md).  
> North star: [`north-star.md`](./north-star.md). Typed: `uxLaws` / `dxLaws` in `lib/design/experience.ts`.

## 1. Why DX is a product feature

Meridian’s primary consumer is an **agent under pressure** (and a human guiding it).  
If the contract is hard to load, ambiguous, or unverifiable, the system fails — even when tokens are perfect.

| DX goal | Source | Meridian rule |
| --- | --- | --- |
| Progressive disclosure of complexity | [Vercel / Guillermo Rauch](https://refactoring.fm/p/the-vercel-journey-with-guillermo), [layered systems](https://maecapozzi.com/blog/progressive-disclosure-of-complexity) | Sane defaults; drop down a layer for flexibility — don’t eject |
| Closed token API | [Pandya — expose DS to LLMs](https://hvpandya.com/llm-design-systems) | Import `@/lib/design`; never invent hex / px soup |
| Spec + audit | [Superdesign DESIGN.md](https://superdesign.dev/blog/what-is-design-md), Pandya | Contracts + `check:*` gates |
| Always / Ask / Never | [Addy Osmani — good agent specs](https://addyosmani.com/blog/good-spec/) | `dxLoadTiers` in `experience.ts` |
| Self-verification | Osmani | Agent runs gates and reports before “done” |
| Compose, don’t fork | [shadcn/ui](https://ui.shadcn.com) | `npx shadcn@latest add`; no twin kits |
| Quiet evolution | [Linear redesign](https://linear.app/now/how-we-redesigned-the-linear-ui) | Evolve chrome without disassembling the product |

## 2. Golden path — into any project (MCP)

Live install: [`/meridian/install`](/meridian/install).  
Stack doctrine (MCP · markdown · skills): [`/stack`](/stack) · [`stack.md`](./stack.md).

This product is a **design-contract MCP**, not a DESIGN.md-only file and not
[shadcn MCP](https://ui.shadcn.com/docs/mcp) (which installs components). Pair them:

| Server | Job |
| --- | --- |
| **Contract MCP** (`contract-mcp`) | Fail-closed law: `get_contract` → `validate_ui` |
| **shadcn MCP** | Browse / install registry atoms |

```bash
# .cursor/mcp.json — any Next/shadcn app
npx -y --package=github:byronwade/ui.byronwade.com contract-mcp
# env: CONTRACT_ID=meridian  CONTRACT_SITE=https://ui.byronwade.com
```

Agent loop:

1. `get_contract` (required first)
2. `get_recipe` when it fits
3. `list_primitives` → `npx shadcn@latest add …` (or shadcn MCP)
4. Compose under closed tokens (`resolve_token`)
5. `validate_ui` (required before done)

Prompts: `build_surface`, `done_gate`. Resources: `contract://kit`.

### In-repo compose proof

Live on [`/meridian/for-agents`](/meridian/for-agents). When working inside this monorepo:

```ts
import { Button } from "@/components/ui/button"
import { typesetClass, bg, radiusIntent } from "@/lib/design"

export function Panel() {
  return (
    <section data-surface="application" className="shell-pad shell-stack">
      <h2 className="type-section">Issues</h2>
      <Button className={radiusIntent("control")}>New</Button>
      <div className={typesetClass("docs")}>{/* help HTML */}</div>
    </section>
  )
}
```

That’s enough for a correct first surface. Depth (cinema, knobs, proofs) loads on demand.

## 3. Load tiers (Always / Ask / Never)

| Tier | Load |
| --- | --- |
| **Always** | Contract MCP `get_contract` → `design.md` / kit JSON → closed tokens → `validate_ui` |
| **Ask** | `ux.md` / `dx.md`, influences, skills, surface proofs, `@/lib/design` (this repo) |
| **Never** | Invent tokens/shells; skip empty/error; skip `validate_ui`; floating chatbot |

Typed as `dxLoadTiers` — keep `agents.md` aligned.

## 4. Layers of abstraction (escape without ejecting)

From least flexible → most flexible (Capozzi / progressive disclosure):

1. **Presets** — `typesetClass("docs")`, `data-surface="application"`, knob presets  
2. **Grammar helpers** — `bg()`, `radiusIntent()`, `defineInteractiveProof()`  
3. **shadcn atoms** — compose `Button` / `Card` / `Input`  
4. **Owned CSS** — `globals.css` / `typeset.css` variables (theme owners only)  
5. **New frozen law** — last resort; update `design.md` + lint in the same change  

Never jump from (1) to inventing a parallel component kit.

## 5. Verification loop (mandatory DX)

```bash
npm run check:design && npm run check:shell && npm run check:proofs \
  && npm run check:typeset && npm run check:experience && npm run check:contrast
```

After implementing, agents **must**:

1. Run the gates  
2. List any unmet MUST from `design.md` / `uxLaws` / `dxLaws`  
3. Fix or explicitly call out blockers  

Hope is not a DX strategy — audit is ([Pandya](https://hvpandya.com/llm-design-systems)).

## 6. Machine-readable surface

| Endpoint | Job |
| --- | --- |
| `/meridian/design.md` · `/meridian/agents.md` | Negotiated contracts (`?raw=1`) |
| `/meridian/system/*` | Research specs |
| `@/lib/design` | Closed TypeScript unions |
| `check:*` | Fail-closed CI |

Docs for humans and agents must stay **one grammar** — not three drifting stories.

## 7. Anti-patterns (DX)

| Ban | Why |
| --- | --- |
| Dumping all skills into every prompt | Context overload; use Ask tier |
| Storybook-only truth with no lint | Agents can’t enforce screenshots |
| “Just make it look like X brand” | Pastiche; absorb discipline only |
| New wrapper components for every demo | Shell zoo |
| Skipping empty/error because “demo” | UX debt ships as product debt |

## 8. Agent checklist

- [ ] Followed Always load tier  
- [ ] Used closed grammar / presets (no invented scales)  
- [ ] Owned loading / empty / error if building a resource surface  
- [ ] Ran `check:experience` + sibling gates  
- [ ] Did not invent a twin component or shell  

## Sources

- [Vercel Design Engineer Principles](https://vercel.com/design/engineer)
- [Progressive disclosure of complexity (Rauch / Refactoring)](https://refactoring.fm/p/the-vercel-journey-with-guillermo)
- [Building systems in layers (Capozzi)](https://maecapozzi.com/blog/progressive-disclosure-of-complexity)
- [Expose your design system to LLMs (Pandya)](https://hvpandya.com/llm-design-systems)
- [What is DESIGN.md (Superdesign)](https://superdesign.dev/blog/what-is-design-md)
- [How to write a good spec for AI agents (Osmani)](https://addyosmani.com/blog/good-spec/)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
