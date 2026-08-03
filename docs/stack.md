# Agent stack — MCP · markdown · skills

> **Use all three. Lead with MCP.**  
> Design contracts are fail-closed systems agents *install*, not mood boards they *read once*.

This is the product architecture behind ui.byronwade.com. Marketing and agents should tell the same story.

## The short answer

| Layer | Required? | Job |
| --- | --- | --- |
| **Contract MCP** | **Yes — product centerpiece** | Runtime law: `get_contract` → `apply_prefs` → `validate_ui` |
| **design.md / agents.md** | **Yes — SSOT** | Persistent “why” + load order + material laws |
| **Skills** | Optional cookbook | Playbooks for compose / theme / cinema — teach MCP, don’t replace it |

**Do not pick one.** MCP without markdown is brittle taste. Markdown without MCP is easy to ignore. Skills without either are opt-in folklore.

## Why MCP is the install product

[shadcn MCP](https://ui.shadcn.com/docs/mcp) already owns **component delivery** (browse / add registry items).  
[DESIGN.md](https://github.com/google-labs-code/design.md)-style files own **prose identity**.

Neither gives agents a **fail-closed consistency loop**:

1. Call `get_contract` before writing UI  
2. Optionally `apply_prefs` with closed brand / radius / paper ids  
3. Compose approved primitives (often via shadcn CLI or shadcn MCP)  
4. Call `validate_ui` before claiming done  

That loop is the wedge: **design systems that install as MCP servers**.

Install: [`/meridian/install`](/meridian/install) · package: `packages/contract-mcp`.

```bash
CONTRACT_ID=meridian CONTRACT_SITE=https://ui.byronwade.com \
  npx -y --package=github:byronwade/ui.byronwade.com contract-mcp
```

## Why markdown still matters

Fat docs stay outside the slim kit on purpose:

| File | Role |
| --- | --- |
| `design.md` | Frozen vs creative, tokens, contrast, cinema |
| `agents.md` | Operating manual — load order, platform consistency, done gate |
| `architecture.md` · system specs | Layout, motion, density, UX/DX pillars |

Served negotiated at `/{id}/design.md`, `/{id}/agents.md`, … — HTML for humans, raw for agents (`?raw=1`).

Markdown is the **law book**. MCP is the **bailiff**.

## Why skills are optional

Skills (`npx skills add byronwade/ui.byronwade.com`) are on-demand playbooks:

- `meridian-theme` — closed knobs + `apply_prefs`  
- `meridian-compose` — workbench / shells under the kit  
- `meridian-cinematic` · `meridian-surface` · `meridian-a11y`

They accelerate common tasks. They **must not** be the only enforcement — agents can skip skills. Every skill should point back to MCP tools.

## Comparison (honest)

| Approach | Strength | Failure mode |
| --- | --- | --- |
| DESIGN.md / docs only | Great rationale; portable | Agents skip or drift; no lint |
| Skills only | Great procedures | Opt-in; never loaded = no contract |
| shadcn MCP only | Great atom install | No brand/radius/ban enforcement |
| **Contract MCP + markdown + skills** | Runtime law + law book + cookbook | Slightly more surface to learn — worth it |

## What is *not* in the stack

- Freeform theme playgrounds as product prefs (only closed `apply_prefs` ids)  
- Layout / animation “preferred settings” marketplaces (those stay UX laws)  
- Forking MCP tools or JSON keys per DNA  

See [`prefs.md`](./prefs.md) · [`layout.md`](./layout.md) · [`animations.md`](./animations.md).

## Golden path (marketing + agents)

1. Browse the platform catalog (`/`)  
2. Open a contract route — the page *is* the DNA (`/meridian`)  
3. Install contract MCP (+ optional shadcn MCP)  
4. Optional: install skills  
5. Agent loop: `get_contract` → (`apply_prefs`) → `get_recipe` → compose → `validate_ui`  
6. Read markdown when taste or edge cases matter  

## Links

- Install UI: `/meridian/install`  
- Theme prefs: `/meridian/theme`  
- Agents: `/meridian/for-agents`  
- Contract JSON: `/r/meridian.contract.json`  
- Platform law: [`platform.md`](./platform.md)
