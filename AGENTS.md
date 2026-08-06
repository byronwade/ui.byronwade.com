<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — design contracts

Multi-contract platform. **Structure is shared. DNA differs.**

| Contract | Law book | DNA | Skills |
| --- | --- | --- | --- |
| Meridian | `contracts/meridian/` · root `design.md` | `docs/meridian.md` | `meridian-*` |
| Harbor | `contracts/harbor/` | `docs/harbor.md` | `harbor-*` |
| Atlas | `contracts/atlas/` | `docs/atlas.md` | `atlas-*` |
| Vellum | `contracts/vellum/` | `docs/vellum.md` | `vellum-*` |

## Agent stack (required)

1. **Law book** — `design.md` / `agents.md` for the active contract  
2. **Verified skills** — `{id}-compose` + specialty  
3. **Fail-closed gates** — `npm run validate`  
4. **Contract MCP** — optional accelerator  

Doctrine: [`docs/stack.md`](docs/stack.md) · [`/stack`](/stack)

## Load order

1. [`docs/platform.md`](docs/platform.md)  
2. Active contract DNA + law book  
3. Matching `skills/{id}-*/SKILL.md`  
4. Task recipe → shadcn compose  
5. `npm run validate` before done  

## Never

- Invent hex / shadows / twin Button-Card shells  
- Fork MCP tools / filenames / JSON keys for one DNA  
- Treat MCP as the only enforcement  
- Skip contrast / design / platform checks  
