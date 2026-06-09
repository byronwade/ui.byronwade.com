# Registry MCP server — design

**Date:** 2026-06-03
**Status:** Approved (design); pending implementation plan
**Subsystem:** 3 of 5 in the agent-native design-system epic
**Branch:** `feat/registry-mcp`
**Depends on:** `@byronwade/on-system-core` (subsystem 1, on `main`) — reused for the live check.

## Purpose

Give any agent live, structured access to the byronwade/ui design system over MCP: find
the right component, load the rule/tokens/utilities, read a component's source, and —
the tie-in — check a snippet on-system in real time using the same `detect()` the lint
and eval use. One definition of "on-system", three surfaces (lint, eval, MCP).

## Success criteria

1. `npx @byronwade/mcp` starts a stdio MCP server exposing the six tools below.
2. The package is **self-contained**: it serves the registry it was published with, with
   no network access or repo checkout (data bundled at build time from `registry.json`).
3. Each tool handler is a pure `(args) → result` function, unit-tested directly (no real
   stdio transport spawned in tests).
4. `check_on_system` returns exactly what `@byronwade/on-system-core`'s `detect()` returns
   — identical to the lint/eval definition.
5. A `check:mcp-data` gate keeps the generated bundle in sync with `registry.json`.

## Decisions (locked during brainstorming)

- **Transport:** stdio only (run via `npx`, added to an agent's MCP config). No HTTP/hosted in v1.
- **Tools:** all six (search, rule, tokens, utilities, on-system check, source).
- **Design-context tools:** three discrete tools (`get_design_rule`, `list_design_tokens`,
  `list_house_utilities`) rather than one combined — agents call only what they need.
- **Component source:** bundled at build time (self-contained/offline), not fetched from
  the live registry URL.

## Architecture & layout

New workspace package `@byronwade/mcp` under `packages/mcp/`. A stdio server built on
`@modelcontextprotocol/sdk`. The data layer is a generated bundle; tool handlers are pure
functions over that bundle (+ `detect()` for the live check); the server shell registers
the handlers and connects stdio.

```
scripts/gen-mcp-data.mjs              ← generate the bundle from registry.json + rule + sources
scripts/check-mcp-data.mjs            ← gate: bundle in sync with registry.json
packages/mcp/
  package.json  tsconfig.json  vitest.config.ts
  src/
    data.generated.json               ← GENERATED (git-ignored): components, rule, tokens, utilities, sources
    data.ts                           ← typed loader for the bundle
    types.ts                          ← McpData, ComponentEntry
    tools/
      search-components.ts            ← searchComponents(data, { query }) -> result
      get-design-rule.ts              ← getDesignRule(data) -> result
      list-design-tokens.ts           ← listDesignTokens(data) -> result
      list-house-utilities.ts         ← listHouseUtilities(data) -> result
      check-on-system.ts              ← checkOnSystem({ code, offSystemComponents? }) -> result
      get-component-source.ts         ← getComponentSource(data, { name }) -> result
    server.ts                         ← build McpServer, register the 6 tools (thin shell)
    cli.ts                            ← #!/usr/bin/env node — connect StdioServerTransport
  tests/
    search-components.test.ts  get-component-source.test.ts  check-on-system.test.ts
    design-context.test.ts (rule/tokens/utilities)
```

### Unit responsibilities

| Unit               | Purpose                                                       | Depends on                |
| ------------------ | ------------------------------------------------------------- | ------------------------- |
| `gen-mcp-data.mjs` | Compile `registry.json` + rule + sources → bundle             | fs, registry.json         |
| `data.ts`          | Load + type the bundle                                        | data.generated.json       |
| `tools/*`          | One pure handler per tool: `(data/args) → MCP result content` | data, on-system-core      |
| `server.ts`        | Register the six tools on an `McpServer`                      | @modelcontextprotocol/sdk |
| `cli.ts`           | Connect stdio transport and run                               | server.ts, sdk            |

## The generated bundle

`scripts/gen-mcp-data.mjs` writes `packages/mcp/src/data.generated.json`:

```jsonc
{
  "components": [
    { "name": "button", "type": "registry:ui", "description": "...",
      "deps": ["@byronwade/foundation","@byronwade/utils"],
      "install": "npx shadcn@latest add @byronwade/button",
      "source": "<full .tsx source of registry/ui/button.tsx>" }
    // ... every registry:ui + registry:component item
  ],
  "rule": "<full text of registry/rules/byronwade-ui.mdc>",
  "tokens": { "brand": { "light": "oklch(...)", "dark": "oklch(...)" }, ... },  // from foundation cssVars
  "utilities": ["bg-grid","glow-brand", ...]
}
```

- `source` is read from each item's `files[].path` under `registry/` at build time.
- Generated in `prebuild` + a new `npm run gen:mcp-data`; git-ignored; rebuilt like the
  other generated artifacts.
- `scripts/check-mcp-data.mjs` regenerates and diffs (stale → fail) + asserts every
  component has non-empty source, wired into `validate` + CI.

## The six tools

Each handler is pure and returns MCP `content` (text). Schemas via the SDK's zod-style
input definitions.

| Tool                   | Input                                                            | Returns                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_components`    | `{ query: string }`                                              | Components whose name/description match (substring, case-insensitive), each with description, install command, deps. Empty query → all, name-sorted. |
| `get_design_rule`      | `{}`                                                             | The full rule text.                                                                                                                                  |
| `list_design_tokens`   | `{}`                                                             | Token names + light/dark OKLCH values, grouped.                                                                                                      |
| `list_house_utilities` | `{}`                                                             | The house utility class names + a one-line note to prefer them over re-rolling gradients/grids.                                                      |
| `check_on_system`      | `{ code: string, offSystemComponents?: "warn"\|"error"\|"off" }` | `detect()` violations (detector, message, line/col, suggestion) + a pass/fail summary.                                                               |
| `get_component_source` | `{ name: string }`                                               | The component's `.tsx` source, or a not-found message listing near matches.                                                                          |

`check_on_system` computes line/col from the violation char range for readability.

## Distribution & docs

- MCP config snippet (documented on a NEW docs page `app/(docs)/docs/mcp/page.tsx`, not
  touching in-flight docs files):
  ```json
  {
    "mcpServers": {
      "byronwade": { "command": "npx", "args": ["-y", "@byronwade/mcp"] }
    }
  }
  ```
- `packages/mcp/README.md` with the same + a tool list.

## Testing

All tool handlers are pure and unit-tested against a small fixture `McpData` (no real
stdio, no SDK transport):

- `search_components`: substring match on name + description; empty query → all; no match → empty.
- `get_component_source`: returns source for a known name; not-found path for unknown.
- `check_on_system`: a clean snippet → pass/zero; an off-system snippet → the expected
  detectors + line/col; respects `offSystemComponents`.
- design-context: rule/tokens/utilities handlers return the bundle's content.
  The `server.ts` registration shell is thin; a smoke test asserts it registers six tools
  with the expected names (calling the registration with a fake/mock server object).
  Bundle generation + `check:mcp-data` are exercised by running the scripts.

## Out of scope (v1)

- stdio only (no HTTP/streamable transport, no hosting).
- Read-only (no tools that mutate the registry).
- No fuzzy/semantic/embedding search — substring over names+descriptions.
- No prompts/resources (MCP) — tools only.
- The docs page is new; wiring it into the (in-flight) docs nav is left to the user.

## Risks & mitigations

| Risk                                                    | Mitigation                                                                                            |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Published package can't reach the repo/registry         | Bundle everything at build time; server reads only `data.generated.json`                              |
| Bundle drifts from registry                             | `check:mcp-data` gate (regenerate + diff) in `validate` + CI                                          |
| `@modelcontextprotocol/sdk` API shape varies by version | `server.ts` is the only SDK-coupled file; pin a version and adjust the thin shell if needed           |
| Large bundle (all sources)                              | Acceptable (~text source of 56 components); JSON, gzip-friendly. Revisit only if it becomes a problem |
| Tests accidentally spawn a transport                    | Handlers are pure functions tested directly; only `cli.ts` connects stdio                             |

## Build order (for the plan)

1. Package scaffold (`packages/mcp`, workspace, tsconfig, vitest) + `@modelcontextprotocol/sdk` dep.
2. `gen-mcp-data.mjs` + `check-mcp-data.mjs` + wire `prebuild`/`validate`; `types.ts` + `data.ts`.
3. `tools/search-components.ts` (+ tests).
4. `tools/get-component-source.ts` (+ tests).
5. `tools/check-on-system.ts` over `on-system-core` (+ tests).
6. `tools/get-design-rule.ts` + `list-design-tokens.ts` + `list-house-utilities.ts` (+ tests).
7. `server.ts` (register six tools) + registration smoke test.
8. `cli.ts` (stdio) + `packages/mcp/README.md` + a manual `npx` smoke note.
9. Docs page `app/(docs)/docs/mcp/page.tsx` (new file only) + verify build.
10. Verify `test:packages` runs the mcp tests; full gate chain green.
