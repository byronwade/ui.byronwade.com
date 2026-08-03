# ui.byronwade.com

**Design systems that install as MCP** — the first open catalog of fail-closed design contracts agents run over the [Model Context Protocol](https://modelcontextprotocol.io).

**Agent stack (we ship all three):**

| Layer | Job |
| --- | --- |
| **Contract MCP** | Required runtime law — `get_contract` → `validate_ui` |
| **design.md / agents.md** | Required law book |
| **Skills** | Optional cookbook |

Marketing + docs: [`/`](https://ui.byronwade.com/) · [`/stack`](https://ui.byronwade.com/stack) · [`docs/stack.md`](./docs/stack.md).

- **[shadcn MCP](https://ui.shadcn.com/docs/mcp)** installs registry components (pair it; different job).
- **Contract MCP** (`contract-mcp`) is the consistency law.

Homepage (`/`) is the platform catalog. Each `/{id}` route is that contract’s DNA end-to-end.

| Contract | Status | Start |
| --- | --- | --- |
| **Meridian** | Live | [`/meridian/install`](https://ui.byronwade.com/meridian/install) |
| Harbor · Atlas · Vellum | Preview / soon | `/{id}/install` — same tools + JSON shape |

## Install into any project

```bash
# Cursor — .cursor/mcp.json
npx -y --package=github:byronwade/ui.byronwade.com contract-mcp
# env: CONTRACT_ID=meridian  CONTRACT_SITE=https://ui.byronwade.com
```

Pair with shadcn MCP for atom delivery. Agent loop:

1. `get_contract` (required first)
2. `get_recipe` when it fits
3. `list_primitives` → `npx shadcn@latest add …`
4. Compose under closed tokens
5. `validate_ui` (required before done)

Prompts: `build_surface`, `done_gate`. Resources: `contract://kit`.

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill meridian-theme
```

## For agents

| Resource | Path |
| --- | --- |
| Design contract | `/{id}/design.md` |
| Agents law | `/{id}/agents.md` |
| Machine kit JSON | `/r/{id}.contract.json` |
| Schema | `/r/contract.schema.json` |
| MCP package | `packages/contract-mcp` |

## Route parity (every contract)

`/install` · `/ui` · `/theme` · `/surfaces` · `/design` · `/skills` · `/system` · `/for-agents` (+ machine docs).

Structural SSOT: `lib/platform/skeleton.ts`. Gate: `npm run check:platform`.

## Scripts

```bash
npm run dev
npm run check:platform
npm run gen:contract
npm run validate
npm run build
```
