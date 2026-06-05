# @byronwade/mcp

A stdio MCP server exposing the byronwade/ui registry to agents. Self-contained — it
serves the registry it was published with (no network/repo needed).

## Use

Add to your agent's MCP config:

```json
{
  "mcpServers": {
    "byronwade": { "command": "npx", "args": ["-y", "@byronwade/mcp"] }
  }
}
```

## Tools

- `search_components` — find components by name/use-case
- `get_component_source` — a component's .tsx source
- `check_on_system` — check a TSX snippet for off-system code (tokens/primitives/utilities)
- `get_design_rule` — the design rule to follow
- `list_design_tokens` — token names + OKLCH values
- `list_house_utilities` — house utilities to reuse
