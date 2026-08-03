# Design contracts — platform law

> **One architecture. Many aesthetics.**  
> Structural change happens once — in `lib/platform/skeleton.ts` — and applies to every contract.

## The split

| Layer | Shared across all contracts? | Where |
| --- | --- | --- |
| MCP tool names + arg shapes | **YES — locked** | `lib/platform/skeleton.ts` → `packages/contract-mcp` |
| Machine filenames (`design.md`, `agents.md`, …) | **YES — locked** | `MACHINE_FILES` |
| Route slots (`/{id}/theme`, `/surfaces`, …) | **YES — locked** | `ROUTE_SLOTS` |
| Contract JSON keys | **YES — locked** | `CONTRACT_JSON_KEYS` + `buildContractEnvelope` |
| `agents.md` section order | **YES — locked** | `AGENTS_MD_SECTIONS` |
| Task recipe ids | **YES — locked** | `lib/contracts/task-recipes.ts` |
| Price (open source / $0) | **YES — locked** | `MCP_PRICE_USD` · `PRICING_MODEL` · [`pricing.md`](./pricing.md) |
| OKLCH values, cinema voice, paper tone | **NO — DNA** | `app/contract-skins.css` via `[data-contract="{id}"]` + `lib/contracts/dna/{id}.ts` |
| Marketing copy / film narrative | **NO — DNA** | contract pages / content |
| Platform homepage chrome | **Platform only** | `app/(platform)/*` + `:root` in `globals.css` — never a contract skin |

## Agent rule (non-negotiable)

If you change **architecture**, a **filename used by MCP/API/download**, a **JSON key**, a **route slot**, or an **MCP tool**:

1. Edit **`lib/platform/skeleton.ts`** (and the shared builder / MCP server).
2. Run **`npm run gen:contract`** so every `public/r/{id}.contract.json` updates.
3. Update **every** live contract’s docs that mention the old name (`agents.md` sections stay; links may need regen).
4. Run **`npm run check:platform`** — must be green.

**MUST NOT** invent a Meridian-only (or Harbor-only) MCP tool, machine filename, or JSON shape.

Design DNA **may** differ: Harbor can feel like quiet ops paper while Meridian stays cinematic — as long as agents still call `get_contract` / `validate_ui` the same way and still fetch `/{id}/design.md`.

## Pipeline

```
lib/platform/skeleton.ts          ← structural SSOT (tools, routes, filenames)
lib/platform/consistency.ts       ← agent MUST / MUST NOT + closed intents
lib/contracts/dna/{id}.ts         ← aesthetic SSOT per contract
lib/platform/build-contract.ts    ← merge → slim consistency-kit JSON
packages/contract-mcp             ← lightweight MCP; CONTRACT_ID selects DNA
public/r/{id}.contract.json       ← generated for ALL ids (mandate + tokens + recipes)
check:platform                    ← parity + slim-kit gate
```

MCP responses always include `obey.must` / `obey.mustNot`. Fat prose stays in markdown.

## Skins (homepage ≠ contracts)

| Surface | Skin owner |
| --- | --- |
| `/` platform index | `:root` platform tokens + `components/chrome/platform-*` |
| `/{id}/**` | `[data-contract="{id}"]` in `contract-skins.css` + `ContractFrame` |

Landing a contract must feel like that DNA end-to-end (chrome included). The catalog stays on the platform shell so systems can be compared without guessing.

## Adding a new contract

1. Add `lib/contracts/dna/{id}.ts` and register in `dna/index.ts`.
2. Add a `[data-contract="{id}"]` (+ dark) block in `app/contract-skins.css`.
3. Wrap `app/{id}/layout.tsx` in `<ContractFrame contractId="{id}">`.
4. Do **not** invent new MCP tools or machine filenames.
5. `npm run gen:contract` — emits `/r/{id}.contract.json` with the shared shape.
6. Add `app/{id}/…` pages using the same `ROUTE_SLOTS` when live.

## Gates

```bash
npm run check:platform
npm run gen:contract
npm run validate
```
