# ui.byronwade.com

**Design contracts platform** — open-source AI design systems on [shadcn/ui](https://ui.shadcn.com).

The homepage (`/`) is a cool platform catalog. Each `/{id}` route is that contract’s DNA end-to-end (tokens, chrome, docs, install).

| Contract | Status | Start |
| --- | --- | --- |
| **Meridian** | Live | [`/meridian`](https://ui.byronwade.com/meridian) · [`/meridian/install`](https://ui.byronwade.com/meridian/install) |
| Harbor · Atlas · Vellum | Preview / soon | `/{id}` — same route slots + MCP shape |

## For agents

| Resource | Path |
| --- | --- |
| Design contract | `/{id}/design.md` (human: `/{id}/design`) |
| Agents law | `/{id}/agents.md` (human: `/{id}/for-agents`) |
| Architecture | `/{id}/architecture.md` |
| Compact entry | `/{id}/llms.txt` |
| Machine kit JSON | `/r/{id}.contract.json` |
| MCP | `CONTRACT_ID={id} node packages/contract-mcp/server.mjs` |

Meridian SSOT files still live at repo root (`design.md`, `agents.md`, `llms.txt`, `docs/architecture.md`); other contracts generate DNA-aware briefs from the same platform kit.

## Install (skills + MCP)

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill meridian-theme

CONTRACT_ID=meridian node packages/contract-mcp/server.mjs
```

Theme skills in-repo today are the Meridian pack (`skills/meridian-*`). Other contracts advertise that platform theme skill until `{id}-theme` packs ship — set `CONTRACT_ID` / `data-contract` for DNA.

Full paste-ready DX: **`/{id}/install`**.

## Route parity (every contract)

| Slot | Purpose |
| --- | --- |
| `/` · `/install` · `/ui` · `/theme` · `/surfaces` | Home + DX showcases |
| `/design` · `/skills` · `/system` · `/for-agents` | Docs + skills + research |
| `/architecture` · `/llms` | Human views of machine docs |

Structural SSOT: `lib/platform/skeleton.ts`. Gate: `npm run check:platform`.

## Scripts

```bash
npm run dev
npm run check:platform
npm run gen:contract
npm run validate
npm run build
```

## Frozen vs creative

| Frozen | Creative |
| --- | --- |
| MCP tools, filenames, JSON keys, route slots | Copy, IA, domain composition |
| Tokens / radii / depth closed sets | Narrative within DNA |
| `check:platform` + design gates | Encouraged |
