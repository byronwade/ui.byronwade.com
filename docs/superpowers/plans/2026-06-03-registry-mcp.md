# Registry MCP Server — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A self-contained stdio MCP server (`npx @byronwade/mcp`) exposing six read-only tools over the byronwade/ui registry, including a live on-system check.

**Architecture:** New `@byronwade/mcp` workspace package. A generated `data.generated.json` (from `registry.json` + rule + component sources) is the data layer; each tool is a pure `(data, args) → string` handler unit-tested directly; a thin `server.ts` registers them on an `McpServer`; `cli.ts` connects stdio. `check_on_system` reuses `@byronwade/on-system-core`.

**Tech Stack:** TypeScript (ESM), `@modelcontextprotocol/sdk`, `zod`, `@byronwade/on-system-core`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-06-03-registry-mcp-design.md`

---

## File structure

```
package.json                      ← add deps + gen:mcp-data/check:mcp-data scripts + prebuild/validate wiring
scripts/gen-mcp-data.mjs          ← generate the bundle from registry.json + rule + sources
scripts/check-mcp-data.mjs        ← sync gate
packages/mcp/
  package.json  tsconfig.json  vitest.config.ts
  src/
    data.generated.json           ← GENERATED (git-ignored)
    types.ts                      ← McpData, ComponentEntry
    data.ts                       ← typed loader
    tools/
      search-components.ts  get-component-source.ts  check-on-system.ts
      get-design-rule.ts  list-design-tokens.ts  list-house-utilities.ts
    server.ts                     ← register the 6 tools (thin SDK shell)
    cli.ts                        ← #!/usr/bin/env node stdio entry
  tests/
    search-components.test.ts  get-component-source.test.ts  check-on-system.test.ts  design-context.test.ts  server.test.ts
  README.md
app/(docs)/docs/mcp/page.tsx       ← consumer docs (new file only)
```

---

## Task 1: Scaffold + dependencies

**Files:** Modify root `package.json`; Create `packages/mcp/{package.json,tsconfig.json,vitest.config.ts,src/index.ts}`

- [ ] **Step 1: Root `package.json`** — add to `devDependencies`: `"@modelcontextprotocol/sdk": "^1.12.0"`, `"zod": "^3.24.1"`. Add to `scripts`: `"gen:mcp-data": "node scripts/gen-mcp-data.mjs"`, `"check:mcp-data": "node scripts/check-mcp-data.mjs"`.

- [ ] **Step 2: Create `packages/mcp/package.json`**

```json
{
  "name": "@byronwade/mcp",
  "version": "0.1.0",
  "description": "MCP server exposing the byronwade/ui registry to agents.",
  "type": "module",
  "bin": { "byronwade-mcp": "./dist/cli.js" },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "tsc --noEmit -p tsconfig.json && vitest run"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "@byronwade/on-system-core": "0.1.0",
    "zod": "^3.24.1"
  },
  "devDependencies": { "typescript": "^5", "vitest": "^4.1.7" }
}
```

- [ ] **Step 3: Create `packages/mcp/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "declaration": true, "outDir": "dist", "rootDir": "src",
    "strict": true, "esModuleInterop": true, "skipLibCheck": true, "resolveJsonModule": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `packages/mcp/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
```

- [ ] **Step 5: Create `packages/mcp/src/index.ts`**

```ts
export const VERSION = "0.1.0";
```

- [ ] **Step 6: Ignore generated bundle** — append to `.gitignore`: `packages/mcp/src/data.generated.json` (under the existing generated section). `packages/*/dist` + `packages/*/node_modules` are already ignored.

- [ ] **Step 7: Install + build the grader** — `npm install`, then `npm run build --workspace @byronwade/on-system-core`. Both succeed.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore packages/mcp
git commit -m "chore(mcp): scaffold @byronwade/mcp workspace package"
```

---

## Task 2: Data bundle generator + sync gate + loader

**Files:** Create `scripts/gen-mcp-data.mjs`, `scripts/check-mcp-data.mjs`, `packages/mcp/src/types.ts`, `packages/mcp/src/data.ts`; Modify root `package.json`

- [ ] **Step 1: Create `packages/mcp/src/types.ts`**

```ts
export interface ComponentEntry {
  name: string;
  type: string;
  description: string;
  deps: string[];
  install: string;
  source: string;
}
export interface McpData {
  components: ComponentEntry[];
  rule: string;
  tokens: Record<string, { light: string; dark: string }>;
  utilities: string[];
}
```

- [ ] **Step 2: Create `scripts/gen-mcp-data.mjs`**

```js
#!/usr/bin/env node
// Generates packages/mcp/src/data.generated.json from registry.json + rule + component sources.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const foundation = registry.items.find((i) => i.name === "foundation");

const componentTypes = new Set(["registry:ui", "registry:component"]);
const components = registry.items
  .filter((i) => componentTypes.has(i.type))
  .map((i) => ({
    name: i.name,
    type: i.type,
    description: i.description ?? "",
    deps: i.registryDependencies ?? [],
    install: `npx shadcn@latest add @byronwade/${i.name}`,
    source: (i.files ?? [])
      .map((f) => readFileSync(join(root, f.path), "utf8"))
      .join("\n\n"),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const theme = foundation.cssVars.theme;
const light = foundation.cssVars.light;
const dark = foundation.cssVars.dark;
const tokens = {};
for (const key of Object.keys(theme)) {
  if (!key.startsWith("color-")) continue;
  const name = key.slice("color-".length);
  const l = light[name];
  if (typeof l === "string" && l.startsWith("oklch(")) {
    tokens[name] = { light: l, dark: dark[name] ?? l };
  }
}

const utilities = [
  ...Object.keys(foundation.css?.["@layer utilities"] ?? {}),
  ...Object.keys(foundation.css ?? {}).filter((k) => k.startsWith(".")),
].map((s) => s.replace(/^\./, "")).sort();

const rule = readFileSync(join(root, "registry/rules/byronwade-ui.mdc"), "utf8");

const data = { components, rule, tokens, utilities };
writeFileSync(join(root, "packages/mcp/src/data.generated.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`✓ mcp data: ${components.length} components, ${Object.keys(tokens).length} tokens, ${utilities.length} utilities`);
```

- [ ] **Step 3: Create `packages/mcp/src/data.ts`**

```ts
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { McpData } from "./types.js";

// Load the generated bundle at runtime (avoids JSON-module import assertions across tsc/node).
const here = dirname(fileURLToPath(import.meta.url));
export const data: McpData = JSON.parse(readFileSync(join(here, "data.generated.json"), "utf8"));
```

- [ ] **Step 4: Generate + verify** — Run `npm run gen:mcp-data`. Expected: prints counts (56 components, N tokens, 9 utilities); writes `packages/mcp/src/data.generated.json`.

- [ ] **Step 5: Create `scripts/check-mcp-data.mjs`**

```js
#!/usr/bin/env node
// Fails if data.generated.json is stale vs registry.json, or any component has empty source.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const genPath = join(root, "packages/mcp/src/data.generated.json");
const errors = [];

if (!existsSync(genPath)) {
  errors.push("data.generated.json missing — run `npm run gen:mcp-data`.");
} else {
  const before = readFileSync(genPath, "utf8");
  execFileSync("node", ["scripts/gen-mcp-data.mjs"], { cwd: root, stdio: "ignore" });
  const after = readFileSync(genPath, "utf8");
  if (before !== after) errors.push("data.generated.json is stale — run `npm run gen:mcp-data`.");
  const data = JSON.parse(after);
  for (const c of data.components) if (!c.source || c.source.length < 10) errors.push(`component ${c.name} has empty source`);
}

if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
console.log("✓ mcp data in sync with registry.json");
```

- [ ] **Step 6: Wire `prebuild` + `validate`** — In root `package.json`: prepend `node scripts/gen-mcp-data.mjs && ` to `prebuild` (after the existing gen-lint-manifest if present; both generators before the rest). Append ` && node scripts/check-mcp-data.mjs` to `validate`.

- [ ] **Step 7: Verify gate** — Run `npm run check:mcp-data`. Expected: `✓ mcp data in sync with registry.json`.

- [ ] **Step 8: Commit**

```bash
git add scripts/gen-mcp-data.mjs scripts/check-mcp-data.mjs packages/mcp/src/types.ts packages/mcp/src/data.ts package.json
git commit -m "feat(mcp): generate registry data bundle from registry.json + sync gate"
```

---

## Task 3: search_components tool

**Files:** Create `packages/mcp/src/tools/search-components.ts`; Test `packages/mcp/tests/search-components.test.ts`

- [ ] **Step 1: Write `packages/mcp/tests/search-components.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { searchComponents } from "../src/tools/search-components.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [
    { name: "button", type: "registry:ui", description: "A clickable button", deps: ["@byronwade/utils"], install: "npx shadcn@latest add @byronwade/button", source: "x" },
    { name: "table", type: "registry:ui", description: "Tabular data display", deps: [], install: "npx shadcn@latest add @byronwade/table", source: "x" },
  ],
  rule: "", tokens: {}, utilities: [],
};

describe("searchComponents", () => {
  it("matches by name substring", () => {
    expect(searchComponents(data, { query: "butt" })).toContain("button");
    expect(searchComponents(data, { query: "butt" })).not.toContain("table");
  });
  it("matches by description substring (case-insensitive)", () => {
    expect(searchComponents(data, { query: "TABULAR" })).toContain("table");
  });
  it("includes the install command and deps", () => {
    expect(searchComponents(data, { query: "button" })).toContain("npx shadcn@latest add @byronwade/button");
  });
  it("empty query returns all components", () => {
    const r = searchComponents(data, { query: "" });
    expect(r).toContain("button");
    expect(r).toContain("table");
  });
  it("no match returns a clear message", () => {
    expect(searchComponents(data, { query: "zzzz" })).toMatch(/no components/i);
  });
});
```

- [ ] **Step 2: Run (fails)** — `npm run test --workspace @byronwade/mcp` → FAIL.

- [ ] **Step 3: Write `packages/mcp/src/tools/search-components.ts`**

```ts
import type { McpData } from "../types.js";

export function searchComponents(data: McpData, args: { query: string }): string {
  const q = (args.query ?? "").trim().toLowerCase();
  const matches = data.components.filter(
    (c) => q === "" || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
  if (matches.length === 0) return `No components match "${args.query}".`;
  return matches
    .map((c) => `## ${c.name} (${c.type})\n${c.description}\nInstall: ${c.install}\nDeps: ${c.deps.join(", ") || "none"}`)
    .join("\n\n");
}
```

- [ ] **Step 4: Run (passes)** — PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/tools/search-components.ts packages/mcp/tests/search-components.test.ts
git commit -m "feat(mcp): search_components tool"
```

---

## Task 4: get_component_source tool

**Files:** Create `packages/mcp/src/tools/get-component-source.ts`; Test `packages/mcp/tests/get-component-source.test.ts`

- [ ] **Step 1: Write `packages/mcp/tests/get-component-source.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { getComponentSource } from "../src/tools/get-component-source.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [
    { name: "button", type: "registry:ui", description: "d", deps: [], install: "i", source: "export const Button = () => null;" },
  ],
  rule: "", tokens: {}, utilities: [],
};

describe("getComponentSource", () => {
  it("returns the source for a known component", () => {
    expect(getComponentSource(data, { name: "button" })).toContain("export const Button");
  });
  it("returns a not-found message with near matches for unknown", () => {
    const r = getComponentSource(data, { name: "buton" });
    expect(r).toMatch(/not found/i);
    expect(r).toContain("button");
  });
});
```

- [ ] **Step 2: Run (fails)** — FAIL.

- [ ] **Step 3: Write `packages/mcp/src/tools/get-component-source.ts`**

```ts
import type { McpData } from "../types.js";

export function getComponentSource(data: McpData, args: { name: string }): string {
  const name = (args.name ?? "").trim();
  const hit = data.components.find((c) => c.name === name);
  if (hit) return `// ${hit.name} — ${hit.install}\n\n${hit.source}`;
  const near = data.components
    .filter((c) => c.name.includes(name) || name.includes(c.name))
    .map((c) => c.name);
  const hint = near.length ? ` Did you mean: ${near.join(", ")}?` : "";
  return `Component "${name}" not found.${hint}`;
}
```

- [ ] **Step 4: Run (passes)** — PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/tools/get-component-source.ts packages/mcp/tests/get-component-source.test.ts
git commit -m "feat(mcp): get_component_source tool"
```

---

## Task 5: check_on_system tool

**Files:** Create `packages/mcp/src/tools/check-on-system.ts`; Test `packages/mcp/tests/check-on-system.test.ts`

- [ ] **Step 1: Write `packages/mcp/tests/check-on-system.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { checkOnSystem } from "../src/tools/check-on-system.js";

describe("checkOnSystem", () => {
  it("reports on-system for clean code", () => {
    const r = checkOnSystem({ code: `const x = <div className="bg-brand p-4" />;` });
    expect(r).toMatch(/on-system|0 violation/i);
  });
  it("reports violations with line numbers for off-system code", () => {
    const r = checkOnSystem({ code: `const x = <div className="text-[#16a34a]" />;` });
    expect(r).toContain("raw-color");
    expect(r).toMatch(/line \d+/i);
  });
  it("respects offSystemComponents off", () => {
    const r = checkOnSystem({ code: `const x = <button>go</button>;`, offSystemComponents: "off" });
    expect(r).not.toContain("off-system-component");
  });
});
```

- [ ] **Step 2: Run (fails)** — FAIL.

- [ ] **Step 3: Write `packages/mcp/src/tools/check-on-system.ts`**

```ts
import { detect } from "@byronwade/on-system-core";

function lineColOf(code: string, index: number): { line: number; col: number } {
  let line = 1, col = 1;
  for (let i = 0; i < index && i < code.length; i++) {
    if (code[i] === "\n") { line++; col = 1; } else col++;
  }
  return { line, col };
}

export function checkOnSystem(args: { code: string; offSystemComponents?: "warn" | "error" | "off" }): string {
  let violations;
  try {
    violations = detect(args.code, { offSystemComponents: args.offSystemComponents ?? "error" });
  } catch {
    return "Could not parse the snippet as TSX/JSX.";
  }
  if (violations.length === 0) return "✓ On-system: 0 violations.";
  const lines = violations.map((v) => {
    const { line, col } = lineColOf(args.code, v.range[0]);
    return `- [${v.detector}] line ${line}, col ${col}: ${v.message}`;
  });
  return `${violations.length} violation(s):\n${lines.join("\n")}`;
}
```

- [ ] **Step 4: Run (passes)** — Run `npm run build --workspace @byronwade/on-system-core` first (the tool imports its dist), then `npm run test --workspace @byronwade/mcp`. PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/tools/check-on-system.ts packages/mcp/tests/check-on-system.test.ts
git commit -m "feat(mcp): check_on_system tool (reuses on-system-core detect)"
```

---

## Task 6: design-context tools (rule, tokens, utilities)

**Files:** Create `packages/mcp/src/tools/get-design-rule.ts`, `list-design-tokens.ts`, `list-house-utilities.ts`; Test `packages/mcp/tests/design-context.test.ts`

- [ ] **Step 1: Write `packages/mcp/tests/design-context.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { getDesignRule } from "../src/tools/get-design-rule.js";
import { listDesignTokens } from "../src/tools/list-design-tokens.js";
import { listHouseUtilities } from "../src/tools/list-house-utilities.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [],
  rule: "# byronwade rule\nTokens only.",
  tokens: { brand: { light: "oklch(0.6 0.17 148)", dark: "oklch(0.7 0.17 148)" } },
  utilities: ["bg-grid", "glow-brand"],
};

describe("design-context tools", () => {
  it("getDesignRule returns the rule text", () => {
    expect(getDesignRule(data)).toContain("Tokens only");
  });
  it("listDesignTokens lists names + values", () => {
    const r = listDesignTokens(data);
    expect(r).toContain("brand");
    expect(r).toContain("oklch(0.6 0.17 148)");
  });
  it("listHouseUtilities lists utilities", () => {
    const r = listHouseUtilities(data);
    expect(r).toContain("bg-grid");
    expect(r).toContain("glow-brand");
  });
});
```

- [ ] **Step 2: Run (fails)** — FAIL.

- [ ] **Step 3: Write the three tools**

`packages/mcp/src/tools/get-design-rule.ts`:
```ts
import type { McpData } from "../types.js";
export function getDesignRule(data: McpData): string {
  return data.rule;
}
```

`packages/mcp/src/tools/list-design-tokens.ts`:
```ts
import type { McpData } from "../types.js";
export function listDesignTokens(data: McpData): string {
  const rows = Object.entries(data.tokens)
    .map(([name, v]) => `- ${name}: light ${v.light} / dark ${v.dark}  (use bg-${name}, text-${name}, border-${name})`)
    .join("\n");
  return `Design tokens (semantic — never hardcode color):\n${rows}`;
}
```

`packages/mcp/src/tools/list-house-utilities.ts`:
```ts
import type { McpData } from "../types.js";
export function listHouseUtilities(data: McpData): string {
  return `House utilities (reuse instead of re-rolling gradients/grids/shadows):\n${data.utilities.map((u) => `- ${u}`).join("\n")}`;
}
```

- [ ] **Step 4: Run (passes)** — PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/tools/get-design-rule.ts packages/mcp/src/tools/list-design-tokens.ts packages/mcp/src/tools/list-house-utilities.ts packages/mcp/tests/design-context.test.ts
git commit -m "feat(mcp): get_design_rule + list_design_tokens + list_house_utilities tools"
```

---

## Task 7: server.ts — register the six tools

**Files:** Create `packages/mcp/src/server.ts`; Test `packages/mcp/tests/server.test.ts`

- [ ] **Step 1: Write `packages/mcp/tests/server.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { registerTools } from "../src/server.js";
import { data } from "../src/data.js";

describe("registerTools", () => {
  it("registers all six tools with a passed registrar", () => {
    const names: string[] = [];
    const fakeServer = {
      registerTool(name: string) { names.push(name); },
    };
    registerTools(fakeServer as never, data);
    expect(names.sort()).toEqual([
      "check_on_system", "get_component_source", "get_design_rule",
      "list_design_tokens", "list_house_utilities", "search_components",
    ]);
  });
});
```

- [ ] **Step 2: Run (fails)** — Run `npm run gen:mcp-data` first (so `data.js` loads), then `npm run test --workspace @byronwade/mcp` → FAIL.

- [ ] **Step 3: Write `packages/mcp/src/server.ts`**

```ts
import { z } from "zod";
import type { McpData } from "./types.js";
import { searchComponents } from "./tools/search-components.js";
import { getComponentSource } from "./tools/get-component-source.js";
import { checkOnSystem } from "./tools/check-on-system.js";
import { getDesignRule } from "./tools/get-design-rule.js";
import { listDesignTokens } from "./tools/list-design-tokens.js";
import { listHouseUtilities } from "./tools/list-house-utilities.js";

// Minimal structural type so this file (and its test) don't depend on the SDK's exact class.
interface Registrar {
  registerTool(
    name: string,
    config: { description: string; inputSchema?: Record<string, unknown> },
    handler: (args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>
  ): void;
}

const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

export function registerTools(server: Registrar, data: McpData): void {
  server.registerTool("search_components",
    { description: "Find byronwade/ui components by name or use-case. Returns description, install command, and deps.", inputSchema: { query: z.string().describe("name or use-case keywords; empty for all") } },
    async (a) => text(searchComponents(data, { query: String(a.query ?? "") })));

  server.registerTool("get_component_source",
    { description: "Return a byronwade/ui component's .tsx source.", inputSchema: { name: z.string().describe("component slug, e.g. button") } },
    async (a) => text(getComponentSource(data, { name: String(a.name ?? "") })));

  server.registerTool("check_on_system",
    { description: "Check whether a TSX snippet is on-system (tokens/primitives/house utilities). Returns violations with line numbers.", inputSchema: { code: z.string(), offSystemComponents: z.enum(["warn", "error", "off"]).optional() } },
    async (a) => text(checkOnSystem({ code: String(a.code ?? ""), offSystemComponents: a.offSystemComponents as "warn" | "error" | "off" | undefined })));

  server.registerTool("get_design_rule",
    { description: "Return the byronwade/ui design rule (the constraints to follow when generating UI).", inputSchema: {} },
    async () => text(getDesignRule(data)));

  server.registerTool("list_design_tokens",
    { description: "List byronwade/ui design tokens (names + OKLCH values). Never hardcode color.", inputSchema: {} },
    async () => text(listDesignTokens(data)));

  server.registerTool("list_house_utilities",
    { description: "List byronwade/ui house utilities (bg-grid, glow-brand, …). Reuse instead of re-rolling gradients/grids.", inputSchema: {} },
    async () => text(listHouseUtilities(data)));
}
```

- [ ] **Step 4: Run (passes)** — PASS (the fake registrar records six names).

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/server.ts packages/mcp/tests/server.test.ts
git commit -m "feat(mcp): register the six tools on a server (SDK-agnostic shell)"
```

---

## Task 8: cli.ts — stdio entry + README

**Files:** Create `packages/mcp/src/cli.ts`, `packages/mcp/README.md`

- [ ] **Step 1: Write `packages/mcp/src/cli.ts`**

```ts
#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./server.js";
import { data } from "./data.js";

async function main() {
  const server = new McpServer({ name: "byronwade-ui", version: "0.1.0" });
  registerTools(server as never, data);
  await server.connect(new StdioServerTransport());
}
main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Typecheck + build** — Run `npm run typecheck --workspace @byronwade/mcp`. If `@modelcontextprotocol/sdk@^1.12` exports differ (e.g. `registerTool` signature, or `McpServer` import path), adjust `cli.ts` and the `Registrar` type in `server.ts` MINIMALLY to match the installed SDK while keeping the six tools + stdio behavior. Then `npm run build --workspace @byronwade/mcp`. Report any adjustment.

- [ ] **Step 3: Manual stdio smoke (optional but recommended)** — Run `npm run gen:mcp-data && npm run build --workspace @byronwade/mcp`, then verify the binary starts without throwing:
```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node packages/mcp/dist/cli.js
```
Expected: a JSON response listing the six tools (or at minimum, the process starts and reads stdin without crashing). If the handshake requires an `initialize` first, that's fine — the goal is "starts and registers"; the unit tests already prove the handlers.

- [ ] **Step 4: Write `packages/mcp/README.md`**

```md
# @byronwade/mcp

A stdio MCP server exposing the byronwade/ui registry to agents. Self-contained — it
serves the registry it was published with (no network/repo needed).

## Use

Add to your agent's MCP config:

```json
{ "mcpServers": { "byronwade": { "command": "npx", "args": ["-y", "@byronwade/mcp"] } } }
```

## Tools

- `search_components` — find components by name/use-case
- `get_component_source` — a component's .tsx source
- `check_on_system` — check a TSX snippet for off-system code (tokens/primitives/utilities)
- `get_design_rule` — the design rule to follow
- `list_design_tokens` — token names + OKLCH values
- `list_house_utilities` — house utilities to reuse
```

- [ ] **Step 5: Commit**

```bash
git add packages/mcp/src/cli.ts packages/mcp/README.md
git commit -m "feat(mcp): stdio cli entry + README"
```

---

## Task 9: Consumer docs page (new file only)

**Files:** Create `app/(docs)/docs/mcp/page.tsx`

- [ ] **Step 1: Check working tree** — Run `git status --short`. Do NOT modify any file with uncommitted user changes (e.g. `content/guides.ts`, other docs pages, `registry.json`, `AGENTS.md`). You create exactly ONE new file and wire it into NO nav.

- [ ] **Step 2: Write `app/(docs)/docs/mcp/page.tsx`** — mirror the shell of `app/(docs)/docs/installation/page.tsx` (read it for the pattern: `Metadata` export, `CodeBlock` from `@/app/(docs)/_components/code-block`, a local `Eyebrow`/`BLEED`, token-only classes, headings `font-medium`/`font-normal` never `font-bold`/`font-semibold`). Content:
  - Title "MCP — byronwade/ui"; intro: the server gives an agent live access to components, tokens, the rule, and a real-time on-system check.
  - Section "Install": the `mcpServers` config json in a `CodeBlock`.
  - Section "Tools": the six tools as a list (names + one-line each).
Keep all copy on-system. Use the REAL components from `installation/page.tsx`; do not invent a shell.

- [ ] **Step 3: Build** — Run `npm run build`. Expected: build succeeds and `/docs/mcp` compiles. If it fails for an unrelated/in-flight reason, report DONE_WITH_CONCERNS; do not edit other files.

- [ ] **Step 4: Commit (only your file)**

```bash
git add "app/(docs)/docs/mcp/page.tsx"
git commit -m "docs(mcp): consumer usage page for the registry MCP server"
```

---

## Task 10: Wire gates + verify full chain

**Files:** Modify `.github/workflows/registry.yml`

- [ ] **Step 1: Add the mcp-data gate to CI** — In `.github/workflows/registry.yml`, next to the existing `On-system lint manifest sync` step, add:
```yaml
      - name: MCP data sync
        run: node scripts/check-mcp-data.mjs
```
(`test:packages` already runs the mcp tests via `--workspaces`; no separate step needed.)

- [ ] **Step 2: Full local chain** — Run `npm run gen:mcp-data && npm run validate && npm run test:packages`. Expected: all green (validate now includes `check:mcp-data`; test:packages includes the mcp tests).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/registry.yml
git commit -m "ci(mcp): run mcp-data sync gate"
```

---

## Self-review notes (for the executor)

- **Regenerate the bundle** (`npm run gen:mcp-data`) before any task whose test imports `../src/data.js` (Tasks 7, 10) — it's git-ignored.
- **Build the grader first** — `check_on_system` (Task 5) and any build imports `@byronwade/on-system-core`'s `dist`; run `npm run build --workspace @byronwade/on-system-core` if resolution fails.
- **Pure handlers, SDK only in two files** — every `tools/*` handler is a pure `(data/args) → string`, tested directly. The SDK is touched only in `server.ts` (via a structural `Registrar` type, so even its test is SDK-free) and `cli.ts`. If the installed `@modelcontextprotocol/sdk` version's `registerTool`/`McpServer` differs, adjust only those two files.
- **SDK version drift** — `^1.12` is a guess; if `npm install` resolves a different 1.x, the `registerTool({description, inputSchema}, handler)` shape is stable across recent 1.x; adjust the `cli.ts` import paths (`server/mcp.js`, `server/stdio.js`) only if they moved.
- **Don't touch the user's in-flight docs/nav** (Task 9) — one new file, no nav wiring.
