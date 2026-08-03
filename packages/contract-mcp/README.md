# @byronwade/contract-mcp

**Fail-closed design-contract MCP** — the consistency law agents obey while composing UI.

This is **not** [shadcn MCP](https://ui.shadcn.com/docs/mcp). shadcn MCP browses/installs registry components. This server keeps agents inside closed tokens, recipes, and `validate_ui`.

## Install into any project (Cursor)

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "meridian-contract": {
      "command": "npx",
      "args": [
        "-y",
        "--package=github:byronwade/ui.byronwade.com",
        "contract-mcp"
      ],
      "env": {
        "CONTRACT_ID": "meridian",
        "CONTRACT_SITE": "https://ui.byronwade.com"
      }
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

Enable both servers in Cursor Settings → MCP.

## Env

| Var | Default | Purpose |
| --- | --- | --- |
| `CONTRACT_ID` | `meridian` | DNA pack (`meridian` · `harbor` · `atlas` · `vellum`) |
| `CONTRACT_SITE` | `https://ui.byronwade.com` | Origin for `/r/{id}.contract.json` |
| `CONTRACT_URL` | derived | Override kit URL entirely |

## Tools

| Tool | When |
| --- | --- |
| `get_contract` | **Required first** — mandate, tokens, primitives, recipes |
| `resolve_token` | Closed color / radius / depth / surface |
| `list_primitives` | Approved shadcn atoms + import/add mapping |
| `get_recipe` | Task recipes (`list-resource`, `agent-rail`, …) |
| `validate_ui` | **Required before done** — lint className / snippets |

## Prompts · resources

- Prompts: `build_surface`, `done_gate`
- Resources: `contract://kit`, `contract://mandate`

## Golden path

1. `get_contract`
2. `get_recipe` (when it fits)
3. `list_primitives` → shadcn add (CLI or shadcn MCP)
4. Compose under closed tokens
5. `validate_ui` until `ok: true`

Docs: https://ui.byronwade.com/meridian/install
