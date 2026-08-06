# Agent stack — law book · skills · fail-closed gates · optional MCP

> **Lead with what agents cannot skip.**  
> Design contracts are fail-closed systems — not mood boards, not protocol theater.

This is the product architecture behind ui.byronwade.com. Marketing and agents should tell the same story.

## The short answer

| Layer | Required? | Job |
| --- | --- | --- |
| **design.md · agents.md · DNA docs** | **Yes — law book** | Persistent why, load order, negatives, per-contract identity |
| **Skills (verified adapters)** | **Yes — cookbook** | Exhaustive playbooks grounded in real primitives / recipes |
| **Fail-closed gates** | **Yes — bailiff** | ESLint + `check:*` + CI — agents fail the PR when they freestyle |
| **Contract MCP** | **Optional accelerator** | Queryable kit + `validate_ui` for tool-calling agents |
| **shadcn MCP / CLI** | Optional | Atom delivery only — not design law |

**Do not ship vibes alone.** Markdown without gates drifts. Skills without catalogs invent twins. MCP without local lint is opt-in folklore.

## Why this order (research-backed)

[v0 Design Systems 2.0](https://v0.app/docs/design-systems-2) teaches systems as a **skill adapter** grounded in real source + a verified **starter** — not as a docs dump and not as MCP-first protocol.

[DESIGN.md](https://github.com/google-labs-code/design.md) is portable identity (tokens + prose + don’t-rules). It is necessary and lintable — and still skippable unless CI fails.

MCP tool schemas cost context ([CircleCI on MCP vs CLI](https://circleci.com/blog/mcp-vs-cli/)). Design-system obedience is mostly **local**: imports, classnames, forbidden patterns. Linters and scripts outperform agents for deterministic checks ([The Design System Guide](https://learn.thedesignsystem.guide/p/should-you-build-an-agent-for-your)).

## Fail-closed loop (every contract)

1. Load **this contract’s** `design.md` + `agents.md` (always-on rules / AGENTS.md)
2. Open the matching **skill** (`{id}-compose`, `{id}-theme`, …) — verified APIs only
3. Prefer a **task recipe** over freeform layout (`list-resource`, `agent-rail`, …)
4. Compose **approved shadcn primitives** — never twin Buttons/Cards/shells
5. Run **`npm run validate`** (or at least `check:design` + `check:platform` + `check:contrast`) before done
6. Optionally call contract MCP `get_contract` / `validate_ui` when the agent is tool-wired

## Per-contract DNA

| Contract | Feeling | Skill prefix |
| --- | --- | --- |
| **Meridian** | Cinematic warm paper · ink-teal · full-bleed frames | `meridian-*` |
| **Harbor** | Quiet ops paper · semantic status · dense indexes | `harbor-*` |
| **Atlas** | Ink workbench · mono metadata · keyboard-first | `atlas-*` |
| **Vellum** | Mist reading lanes · measured prose · typeset-first | `vellum-*` |

Structure (routes, machine filenames, recipe ids, JSON keys) is **shared** via `lib/platform/skeleton.ts`. Aesthetics and skill cookbooks **may** differ. See [`platform.md`](./platform.md).

## Comparison (honest)

| Approach | Strength | Failure mode |
| --- | --- | --- |
| DESIGN.md only | Portable rationale | Agents skip; no PR fail |
| Skills only | Great procedures | Opt-in; invent APIs without catalogs |
| MCP only | Queryable tools | Context tax; agents skip tools |
| shadcn MCP only | Atom install | No brand / ban / recipe law |
| **Law book + verified skills + CI gates (+ optional MCP)** | Context + procedure + enforcement | Slightly more surface — intentional |

## What is *not* the wedge

- Marketing MCP as the only way to stay on-system
- Freeform theme playgrounds as product prefs
- Forking MCP tools or JSON keys per DNA
- Twin component kits “just for this screen”

## Golden path

1. Pick a contract on the platform catalog (`/`)
2. Open `/{id}` — the page *is* the DNA
3. Install skills: `npx skills add byronwade/ui.byronwade.com`
4. Copy `design.md` / `agents.md` (or fetch `/{id}/design.md?raw=1`)
5. Wire always-on AGENTS / Cursor rules
6. Agent loop: law book → skill → recipe → compose → **validate**
7. Optional: add contract MCP for tool-calling sessions

## Links

- Platform stack UI: [`/stack`](/stack)
- Install (any contract): `/{id}/install`
- Agents: `/{id}/for-agents`
- Contract JSON: `/r/{id}.contract.json`
- Platform law: [`platform.md`](./platform.md)
