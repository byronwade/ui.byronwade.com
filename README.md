# ui.byronwade.com

**Fail-closed design contracts** — law books, verified skills, and CI gates agents cannot skip. Contract MCP is an optional accelerator.

**Agent stack (every contract):**

| Layer | Job |
| --- | --- |
| **design.md / agents.md / DNA** | Required law book |
| **`{id}-*` skills** | Required verified cookbook |
| **`npm run validate`** | Required bailiff |
| **Contract MCP** | Optional tool-calling accelerator |

Marketing + docs: [`/`](https://ui.byronwade.com/) · [`/stack`](https://ui.byronwade.com/stack) · [`docs/stack.md`](./docs/stack.md).

- **[shadcn MCP](https://ui.shadcn.com/docs/mcp)** / CLI installs registry components (pair it; different job).
- **Gates + skills + law books** keep agents inside closed tokens — inspired by [v0 Design Systems 2.0](https://v0.app/docs/design-systems-2) (source-grounded skills + starters), not protocol theater.

Homepage (`/`) is the platform catalog. Each `/{id}` route is that contract’s DNA end-to-end.

| Contract | Status | Start |
| --- | --- | --- |
| **Meridian** | Live | [`/meridian/install`](https://ui.byronwade.com/meridian/install) |
| **Harbor** · **Atlas** · **Vellum** | Preview | `/{id}/install` — same stack shape, unique DNA |

## Install into any project

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill harbor-compose
```

Fetch the law book: `/{id}/design.md?raw=1` · `/{id}/agents.md?raw=1`.

Agent loop:

1. Load law book (required first)
2. Open matching `{id}-*` skill + recipe
3. `npx shadcn@latest add …` for atoms
4. Compose under closed tokens
5. `npm run validate` (required before done)
6. Optional: contract MCP `get_contract` / `validate_ui`

```bash
# Optional MCP
CONTRACT_ID=meridian CONTRACT_SITE=https://ui.byronwade.com \
  npx -y --package=github:byronwade/ui.byronwade.com contract-mcp
```

## For agents

| Resource | Path |
| --- | --- |
| Design contract | `/{id}/design.md` · `contracts/{id}/DESIGN.md` |
| Agents law | `/{id}/agents.md` · `contracts/{id}/AGENTS.md` |
| Deep DNA | `docs/{id}.md` |
| Skills | `skills/{id}-*/SKILL.md` |
| Machine kit JSON | `/r/{id}.contract.json` |
| Schema | `/r/contract.schema.json` |
| MCP package | `packages/contract-mcp` (optional) |

## Route parity (every contract)

`/install` · `/ui` · `/theme` · `/surfaces` · `/design` · `/skills` · `/system` · `/for-agents` (+ machine docs + skill detail routes).

Structural SSOT: `lib/platform/skeleton.ts`. Gate: `npm run check:platform`.

## Scripts

```bash
npm run dev
npm run check:platform
npm run gen:contract
npm run validate
npm run build
```
