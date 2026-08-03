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
| OKLCH values, cinema voice, paper tone | **NO — DNA** | `lib/contracts/dna/{id}.ts` + per-contract design grammar |
| Marketing copy / film narrative | **NO — DNA** | contract pages / content |

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
lib/platform/skeleton.ts          ← structural SSOT
lib/contracts/dna/{id}.ts         ← aesthetic SSOT per contract
lib/platform/build-contract.ts    ← merge → contract JSON
packages/contract-mcp             ← one MCP binary; CONTRACT_ID selects DNA
public/r/{id}.contract.json       ← generated for ALL ids
check:platform                    ← parity gate
```

## Adding a new contract

1. Add `lib/contracts/dna/{id}.ts` and register in `dna/index.ts`.
2. Do **not** invent new MCP tools or machine filenames.
3. `npm run gen:contract` — emits `/r/{id}.contract.json` with the shared shape.
4. Add `app/{id}/…` pages using the same `ROUTE_SLOTS`.
5. When the contract goes `live`, attach its design grammar through `buildContractEnvelope` (same keys as Meridian).

## Gates

```bash
npm run check:platform
npm run gen:contract
npm run validate
```
