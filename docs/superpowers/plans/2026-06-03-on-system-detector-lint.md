# On-system Detector Core + Consumer Lint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a framework-agnostic `detect()` that flags off-system UI code, exposed as an ESLint plugin and a `byronwade-lint` CLI, with knowledge sourced from `registry.json`.

**Architecture:** npm workspaces. A pure `@byronwade/on-system-core` package owns all detection (five detectors + OKLCH nearest-token autofix) driven by a manifest generated from `registry.json`. `@byronwade/eslint-plugin-ui` and `@byronwade/lint` are thin adapters over `detect()`. The Next app stays at the repo root and dogfoods the lint.

**Tech Stack:** TypeScript (ESM), `@typescript-eslint/parser` (ESTree AST), `culori` (OKLCH color math), `fast-glob` + `picocolors` (CLI), `vitest` (tests), ESLint 9 flat config.

**Spec:** `docs/superpowers/specs/2026-06-03-on-system-detector-lint-design.md`

---

## File structure (locked decomposition)

```
package.json                                  ← add "workspaces": ["packages/*"] + deps + scripts
scripts/gen-lint-manifest.mjs                 ← generates the manifest from registry.json
scripts/check-lint-manifest.mjs               ← gate: manifest in sync with registry.json
packages/
  on-system-core/
    package.json  tsconfig.json  vitest.config.ts
    src/
      types.ts                                ← Violation, DetectOptions, Manifest types
      manifest.generated.ts                   ← GENERATED (git-ignored)
      manifest.ts                             ← re-export + typed accessor
      parse.ts                                ← parse() + walk() AST helpers
      extract.ts                              ← extractClassTokens(), extractStyleStrings(), extractJsxElements()
      color.ts                                ← nearestToken() OKLCH math
      detectors/
        raw-color.ts
        arbitrary-value.ts
        hand-rolled.ts
        off-system-component.ts
        typography.ts
      detect.ts                               ← orchestrator: parse → run detectors → sort
      apply-fixes.ts                          ← applyFixes(code, violations)
      index.ts                                ← public exports
    tests/
      color.test.ts  raw-color.test.ts  arbitrary-value.test.ts
      hand-rolled.test.ts  off-system-component.test.ts  typography.test.ts  roundtrip.test.ts
      fixtures/on-system/*.tsx  fixtures/off-system/*.tsx
  eslint-plugin-ui/
    package.json  tsconfig.json  vitest.config.ts
    src/index.ts  src/rule.ts
    tests/rule.test.ts
  lint-cli/
    package.json  tsconfig.json  vitest.config.ts
    src/cli.ts  src/run.ts
    tests/run.test.ts
app/(docs)/docs/lint/page.tsx                 ← consumer docs
```

---

## Task 1: npm workspaces scaffold + on-system-core package skeleton

**Files:**
- Modify: `package.json` (root)
- Create: `packages/on-system-core/package.json`
- Create: `packages/on-system-core/tsconfig.json`
- Create: `packages/on-system-core/vitest.config.ts`
- Create: `packages/on-system-core/src/index.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Add workspaces + deps + scripts to root `package.json`**

In root `package.json`, add a top-level `"workspaces"` key and the new dependencies. Add these exact entries (merge into existing `dependencies`/`devDependencies`/`scripts` objects):

```jsonc
// top level (anywhere among the top keys)
"workspaces": ["packages/*"],
```
```jsonc
// devDependencies — add:
"@typescript-eslint/parser": "^8.20.0",
"culori": "^4.0.1",
"fast-glob": "^3.3.2",
"picocolors": "^1.1.1"
```
```jsonc
// scripts — add:
"gen:lint-manifest": "node scripts/gen-lint-manifest.mjs",
"check:lint-manifest": "node scripts/check-lint-manifest.mjs",
"test:packages": "npm run test --workspaces --if-present"
```

- [ ] **Step 2: Create `packages/on-system-core/package.json`**

```json
{
  "name": "@byronwade/on-system-core",
  "version": "0.1.0",
  "description": "Framework-agnostic detector for off-system byronwade/ui code.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "tsc --noEmit -p tsconfig.json && vitest run",
    "test:watch": "vitest"
  },
  "dependencies": { "@typescript-eslint/parser": "^8.20.0", "culori": "^4.0.1" },
  "devDependencies": { "typescript": "^5", "vitest": "^4.1.7", "@types/culori": "^2.1.1" }
}
```

- [ ] **Step 3: Create `packages/on-system-core/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "declaration": true, "outDir": "dist", "rootDir": "src",
    "strict": true, "esModuleInterop": true, "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `packages/on-system-core/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: { provider: "v8", include: ["src/**"], exclude: ["src/manifest.generated.ts"] },
  },
});
```

- [ ] **Step 5: Create placeholder `packages/on-system-core/src/index.ts`**

```ts
export const VERSION = "0.1.0";
```

- [ ] **Step 6: Ignore generated manifest**

Append to `.gitignore`:

```
# generated lint manifest
packages/on-system-core/src/manifest.generated.ts
```

- [ ] **Step 7: Install and verify workspaces + app build unaffected**

Run: `npm install`
Expected: installs without error, creates `node_modules/@byronwade/on-system-core` symlink.

Run: `npm run build`
Expected: the existing Next app build still succeeds (workspaces are additive).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore packages/on-system-core
git commit -m "chore(workspaces): scaffold on-system-core package + npm workspaces"
```

---

## Task 2: Manifest generator + sync gate

The manifest is the single source of truth derived from `registry.json`. `cssVars.light`/`dark` hold bare `name: "oklch(...)"`; `cssVars.theme` holds `color-<name>: var(--<name>)`; `css["@layer utilities"]` keys are house utilities; registry items give component names.

**Files:**
- Create: `scripts/gen-lint-manifest.mjs`
- Create: `scripts/check-lint-manifest.mjs`
- Create: `packages/on-system-core/src/manifest.ts`
- Create: `packages/on-system-core/src/types.ts`
- Modify: `package.json` (wire into `prebuild` + `validate`)

- [ ] **Step 1: Create `packages/on-system-core/src/types.ts`**

```ts
export type DetectorId =
  | "raw-color" | "arbitrary-value" | "hand-rolled" | "off-system-component" | "typography";
export type Severity = "error" | "warn";

export interface Fix { range: [number, number]; text: string; }

export interface Violation {
  detector: DetectorId;
  range: [number, number];   // absolute char offsets into the source
  message: string;
  severity: Severity;
  fix?: Fix;
}

export interface DetectOptions {
  /** Max OKLCH (oklab Euclidean) distance for nearest-token autofix. Above this, suggest only. */
  maxColorDistance?: number;             // default 0.1
  offSystemComponents?: "warn" | "error" | "off";  // default "warn"
}

export interface Manifest {
  /** Base color tokens with concrete oklch values, for nearest-token mapping. */
  colorValues: Record<string, { light: string; dark: string }>;
  /** All valid color token names (e.g. "brand","success","dock-active") for bg-/text- validity. */
  colorTokens: string[];
  /** House utility class names (no leading dot): "bg-grid","glow-brand",... */
  utilities: string[];
  /** Registry component slugs: "button","input",... */
  components: string[];
  /** Native element -> primitive component name. */
  nativeToComponent: Record<string, string>;
}
```

- [ ] **Step 2: Create `scripts/gen-lint-manifest.mjs`**

```js
#!/usr/bin/env node
// Generates packages/on-system-core/src/manifest.generated.ts from registry.json.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const foundation = registry.items.find((i) => i.name === "foundation");

// Curated: which native element maps to which primitive. Validated by check gate.
const NATIVE_TO_COMPONENT = {
  button: "Button", input: "Input", select: "Select", textarea: "Textarea",
  label: "Label", table: "Table", progress: "Progress",
};

const light = foundation.cssVars.light;
const dark = foundation.cssVars.dark;
const theme = foundation.cssVars.theme;

// colorTokens: every `color-<name>` in theme -> "<name>"
const colorTokens = Object.keys(theme)
  .filter((k) => k.startsWith("color-"))
  .map((k) => k.slice("color-".length));

// Semantic palettes carry MEANING and must never be autofix targets (AGENTS.md DNA):
// the agent-activity pastels (activity-thinking/search/read/edit) encode what an AI agent
// is doing, and chart-1…5 encode series identity. Snapping an arbitrary raw color onto
// `activity-search` (a brand-adjacent green) would be semantically wrong, so they are
// excluded from the nearest-token candidate set — while remaining VALID tokens (kept in
// colorTokens) so `bg-activity-search` / `bg-chart-2` are never flagged.
const isSemantic = (name) => name.startsWith("activity-") || name.startsWith("chart-");

// colorValues: base tokens with a concrete oklch value (exclude var() aliases + semantic palettes)
const colorValues = {};
for (const name of colorTokens) {
  const l = light[name];
  if (typeof l === "string" && l.startsWith("oklch(") && !isSemantic(name)) {
    colorValues[name] = { light: l, dark: dark[name] ?? l };
  }
}

const utilities = [
  ...Object.keys(foundation.css?.["@layer utilities"] ?? {}),
  ...Object.keys(foundation.css ?? {}).filter((k) => k.startsWith(".")),
].map((sel) => sel.replace(/^\./, ""));

const componentTypes = new Set(["registry:ui", "registry:component"]);
const components = registry.items
  .filter((i) => componentTypes.has(i.type))
  .map((i) => i.name);

const manifest = {
  colorValues,
  colorTokens: [...new Set(colorTokens)].sort(),
  utilities: [...new Set(utilities)].sort(),
  components: [...new Set(components)].sort(),
  nativeToComponent: NATIVE_TO_COMPONENT,
};

const out = `// GENERATED by scripts/gen-lint-manifest.mjs — do not edit.
import type { Manifest } from "./types.js";
export const MANIFEST: Manifest = ${JSON.stringify(manifest, null, 2)};
`;
writeFileSync(join(root, "packages/on-system-core/src/manifest.generated.ts"), out);
console.log(
  `✓ lint manifest: ${manifest.colorTokens.length} color tokens, ` +
    `${manifest.utilities.length} utilities, ${manifest.components.length} components`
);
```

- [ ] **Step 3: Create `packages/on-system-core/src/manifest.ts`**

```ts
import type { Manifest } from "./types.js";
import { MANIFEST } from "./manifest.generated.js";
export const manifest: Manifest = MANIFEST;
```

- [ ] **Step 4: Generate it and verify**

Run: `npm run gen:lint-manifest`
Expected: prints the counts; creates `packages/on-system-core/src/manifest.generated.ts`.

- [ ] **Step 5: Create `scripts/check-lint-manifest.mjs`**

```js
#!/usr/bin/env node
// Fails if manifest.generated.ts is stale vs registry.json, or nativeToComponent
// references a non-existent component.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const genPath = join(root, "packages/on-system-core/src/manifest.generated.ts");
const errors = [];

if (!existsSync(genPath)) {
  errors.push("manifest.generated.ts missing — run `npm run gen:lint-manifest`.");
} else {
  const before = readFileSync(genPath, "utf8");
  execFileSync("node", ["scripts/gen-lint-manifest.mjs"], { cwd: root, stdio: "ignore" });
  const after = readFileSync(genPath, "utf8");
  if (before !== after) errors.push("manifest.generated.ts is stale — run `npm run gen:lint-manifest`.");

  const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
  const names = new Set(registry.items.map((i) => i.name));
  const m = after.match(/"nativeToComponent":\s*({[^}]*})/s);
  // crude but adequate: ensure each component slug referenced exists
  const slugs = [...after.matchAll(/"([a-z-]+)":\s*"[A-Z][A-Za-z]+"/g)].map((x) => x[1]);
  for (const slug of slugs) if (!names.has(slug)) errors.push(`nativeToComponent maps to missing component: ${slug}`);
}

if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
console.log("✓ lint manifest in sync with registry.json");
```

- [ ] **Step 6: Wire into `prebuild` and `validate`**

In root `package.json`, prepend manifest generation to `prebuild` and append the gate to `validate`:
- `prebuild`: ensure it runs `node scripts/gen-lint-manifest.mjs` before existing prebuild steps.
- `validate`: append ` && node scripts/check-lint-manifest.mjs`.

- [ ] **Step 7: Verify the gate**

Run: `npm run check:lint-manifest`
Expected: `✓ lint manifest in sync with registry.json`

- [ ] **Step 8: Commit**

```bash
git add scripts/gen-lint-manifest.mjs scripts/check-lint-manifest.mjs \
  packages/on-system-core/src/manifest.ts packages/on-system-core/src/types.ts package.json
git commit -m "feat(lint): generate on-system manifest from registry.json + sync gate"
```

---

## Task 3: Parser + AST traversal + extraction helpers

**Files:**
- Create: `packages/on-system-core/src/parse.ts`
- Create: `packages/on-system-core/src/extract.ts`
- Test: `packages/on-system-core/tests/extract.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/parse.ts`**

```ts
import { parse as tsParse } from "@typescript-eslint/parser";

export interface Node { type: string; range: [number, number]; [k: string]: unknown; }

export function parse(code: string): Node {
  return tsParse(code, { ecmaFeatures: { jsx: true }, range: true, loc: false }) as unknown as Node;
}

/** Depth-first walk; calls visit(node) for every node with a string `type`. */
export function walk(node: Node, visit: (n: Node) => void): void {
  visit(node);
  for (const key of Object.keys(node)) {
    if (key === "parent" || key === "range" || key === "loc") continue;
    const child = (node as Record<string, unknown>)[key];
    if (Array.isArray(child)) {
      for (const c of child) if (c && typeof (c as Node).type === "string") walk(c as Node, visit);
    } else if (child && typeof (child as Node).type === "string") {
      walk(child as Node, visit);
    }
  }
}
```

- [ ] **Step 2: Write `packages/on-system-core/src/extract.ts`**

```ts
import type { Node } from "./parse.js";
import { walk } from "./parse.js";

export interface ClassToken { value: string; range: [number, number]; }
export interface StyleString { value: string; prop: string; range: [number, number]; }
export interface JsxElement { name: string; range: [number, number]; }

/** Split a static class string into tokens, each with absolute source offsets. */
function splitClasses(text: string, base: number): ClassToken[] {
  const out: ClassToken[] = [];
  const re = /\S+/g; let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push({ value: m[0], range: [base + m.index, base + m.index + m[0].length] });
  return out;
}

/** Static string parts of a className value, with absolute offsets (literal start + 1 for the quote). */
function stringParts(node: Node): { text: string; base: number }[] {
  if (node.type === "Literal" && typeof node.value === "string") {
    return [{ text: node.value as string, base: node.range[0] + 1 }];
  }
  if (node.type === "TemplateLiteral") {
    return (node.quasis as Node[]).map((q) => ({
      text: ((q.value as { cooked?: string } | undefined)?.cooked) ?? "",
      base: q.range[0] + 1,
    }));
  }
  if (node.type === "CallExpression") {
    // cn(...) / clsx(...) / cva(...) — recurse into string + template args
    return (node.arguments as Node[]).flatMap((a) => stringParts(a));
  }
  return [];
}

/** Static class tokens of a single className/class JSXAttribute. */
function attrClassTokens(attr: Node): ClassToken[] {
  const value = attr.value as Node | null;
  if (!value) return [];
  const expr = value.type === "JSXExpressionContainer" ? (value.expression as Node) : value;
  const out: ClassToken[] = [];
  for (const { text, base } of stringParts(expr)) out.push(...splitClasses(text, base));
  return out;
}

const isClassAttr = (n: Node) => {
  const name = (n.name as { name?: string } | undefined)?.name;
  return name === "className" || name === "class";
};

export function extractClassTokens(ast: Node): ClassToken[] {
  const out: ClassToken[] = [];
  walk(ast, (n) => {
    if (n.type === "JSXAttribute" && isClassAttr(n)) out.push(...attrClassTokens(n));
  });
  return out;
}

export interface ElementClasses { name: string; classes: ClassToken[]; }

/** Each JSX opening element paired with its own className tokens (for element-scoped rules). */
export function extractElementClasses(ast: Node): ElementClasses[] {
  const out: ElementClasses[] = [];
  walk(ast, (n) => {
    if (n.type !== "JSXOpeningElement") return;
    const nm = n.name as { type: string; name?: string };
    if (nm.type !== "JSXIdentifier" || !nm.name) return;
    const classes: ClassToken[] = [];
    for (const attr of (n.attributes as Node[])) {
      if (attr.type === "JSXAttribute" && isClassAttr(attr)) classes.push(...attrClassTokens(attr));
    }
    out.push({ name: nm.name, classes });
  });
  return out;
}

export function extractStyleStrings(ast: Node): StyleString[] {
  const out: StyleString[] = [];
  walk(ast, (n) => {
    if (n.type !== "JSXAttribute") return;
    if ((n.name as { name?: string } | undefined)?.name !== "style") return;
    const value = n.value as Node | null;
    if (!value || value.type !== "JSXExpressionContainer") return;
    const obj = value.expression as Node;
    if (obj.type !== "ObjectExpression") return;
    for (const p of (obj.properties as Node[])) {
      const key = (p.key as { name?: string; value?: string } | undefined);
      const prop = key?.name ?? key?.value ?? "";
      const v = p.value as Node | undefined;
      if (v && v.type === "Literal" && typeof (v as { value?: unknown }).value === "string") {
        out.push({ value: (v as { value: string }).value, prop: String(prop), range: [v.range[0] + 1, v.range[1] - 1] });
      }
    }
  });
  return out;
}

export function extractJsxElements(ast: Node): JsxElement[] {
  const out: JsxElement[] = [];
  walk(ast, (n) => {
    if (n.type !== "JSXOpeningElement") return;
    const nm = n.name as { type: string; name?: string };
    if (nm.type === "JSXIdentifier" && nm.name) out.push({ name: nm.name, range: (n.name as Node).range });
  });
  // walk() visits in Object.keys order; for JSXElement `children` precede `openingElement`,
  // so sort by source position to keep nested-after-parent ordering the tests assert.
  return out.sort((a, b) => a.range[0] - b.range[0]);
}
```

- [ ] **Step 3: Write `packages/on-system-core/tests/extract.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { parse } from "../src/parse.js";
import { extractClassTokens, extractStyleStrings, extractJsxElements, extractElementClasses } from "../src/extract.js";

describe("extractClassTokens", () => {
  it("reads string literal classNames with correct offsets", () => {
    const code = `const x = <div className="bg-brand p-4" />;`;
    const toks = extractClassTokens(parse(code));
    expect(toks.map((t) => t.value)).toEqual(["bg-brand", "p-4"]);
    expect(code.slice(...toks[0].range)).toBe("bg-brand");
  });
  it("reads cn() and template literal args", () => {
    const code = "const x = <div className={cn('text-[#333]', `bg-grid`)} />;";
    const toks = extractClassTokens(parse(code));
    expect(toks.map((t) => t.value)).toContain("text-[#333]");
    expect(toks.map((t) => t.value)).toContain("bg-grid");
  });
  it("skips dynamic expressions", () => {
    const code = "const x = <div className={cls} />;";
    expect(extractClassTokens(parse(code))).toEqual([]);
  });
});

describe("extractStyleStrings", () => {
  it("reads literal style values with prop + offsets", () => {
    const code = `const x = <div style={{ color: "#16a34a" }} />;`;
    const s = extractStyleStrings(parse(code));
    expect(s[0].prop).toBe("color");
    expect(code.slice(...s[0].range)).toBe("#16a34a");
  });
});

describe("extractJsxElements", () => {
  it("reads element names", () => {
    const code = `const x = <button><Input /></button>;`;
    expect(extractJsxElements(parse(code)).map((e) => e.name)).toEqual(["button", "Input"]);
  });
});

describe("extractElementClasses", () => {
  it("pairs each element with its own class tokens", () => {
    const code = `const x = <h1 className="text-4xl font-bold"><span className="bg-brand" /></h1>;`;
    const els = extractElementClasses(parse(code));
    const h1 = els.find((e) => e.name === "h1")!;
    expect(h1.classes.map((c) => c.value)).toEqual(["text-4xl", "font-bold"]);
    const span = els.find((e) => e.name === "span")!;
    expect(span.classes.map((c) => c.value)).toEqual(["bg-brand"]);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS (extract tests green).

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/parse.ts packages/on-system-core/src/extract.ts packages/on-system-core/tests/extract.test.ts
git commit -m "feat(lint): AST parser + className/style/element extraction helpers"
```

---

## Task 4: OKLCH nearest-token color utility

**Files:**
- Create: `packages/on-system-core/src/color.ts`
- Test: `packages/on-system-core/tests/color.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/color.ts`**

```ts
import { parse as parseColor, differenceEuclidean } from "culori";

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC = /\b(?:rgb|rgba|hsl|hsla)\s*\([^)]*\)/;
const NAMED = new Set([
  "red","green","blue","white","black","gray","grey","yellow","orange","purple",
  "pink","cyan","magenta","lime","teal","navy","maroon","olive","silver","gold",
  "indigo","violet","brown","beige","coral","crimson","salmon","khaki","tomato",
]);

/** Returns the first raw-color substring in `text`, or null. Ignores var(--token) and on-scale words. */
export function findRawColor(text: string): string | null {
  const hex = text.match(HEX); if (hex) return hex[0];
  const fn = text.match(FUNC); if (fn) return fn[0];
  for (const word of text.toLowerCase().match(/[a-z]+/g) ?? [])
    if (NAMED.has(word)) return word;
  return null;
}

const diff = differenceEuclidean("oklab");

export interface NearestResult { token: string; distance: number; }

/** Nearest color token by oklab distance, or null if none within maxDistance. */
export function nearestToken(
  raw: string,
  candidates: Record<string, { light: string; dark: string }>,
  maxDistance: number
): NearestResult | null {
  const c = parseColor(raw);
  if (!c) return null;
  let best: string | null = null;
  let bestD = Infinity;
  for (const [name, val] of Object.entries(candidates)) {
    const t = parseColor(val.light);
    if (!t) continue;
    const d = diff(c, t);
    if (d < bestD) { bestD = d; best = name; }
  }
  if (best === null || bestD > maxDistance) return null;
  return { token: best, distance: bestD };
}
```

- [ ] **Step 2: Write `packages/on-system-core/tests/color.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { findRawColor, nearestToken } from "../src/color.js";

const candidates = {
  brand: { light: "oklch(0.6 0.17 148)", dark: "oklch(0.7 0.17 148)" },
  destructive: { light: "oklch(0.58 0.22 27)", dark: "oklch(0.62 0.22 27)" },
};

describe("findRawColor", () => {
  it("finds hex", () => expect(findRawColor("text-[#16a34a]")).toBe("#16a34a"));
  it("finds rgb()", () => expect(findRawColor("color: rgb(20, 180, 80)")).toBe("rgb(20, 180, 80)"));
  it("finds named color", () => expect(findRawColor("border: 1px solid red")).toBe("red"));
  it("ignores var(--token)", () => expect(findRawColor("bg-[var(--brand)]")).toBeNull());
  it("ignores plain utilities", () => expect(findRawColor("bg-brand p-4")).toBeNull());
});

describe("nearestToken", () => {
  it("maps a green hex to brand", () => {
    expect(nearestToken("#16a34a", candidates, 0.1)?.token).toBe("brand");
  });
  it("maps a red hex to destructive", () => {
    expect(nearestToken("#dc2626", candidates, 0.1)?.token).toBe("destructive");
  });
  it("returns null beyond threshold", () => {
    expect(nearestToken("#16a34a", candidates, 0.0001)).toBeNull();
  });
  it("returns null for unparseable input", () => {
    expect(nearestToken("not-a-color", candidates, 1)).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS (color tests green). If the green→brand assertion is borderline, widen the threshold in the test to the measured distance and note it — but with these candidates a green hex must be nearer brand than destructive.

- [ ] **Step 4: Commit**

```bash
git add packages/on-system-core/src/color.ts packages/on-system-core/tests/color.test.ts
git commit -m "feat(lint): OKLCH nearest-token color utility"
```

---

## Task 5: `detect()` orchestrator + raw-color detector

**Files:**
- Create: `packages/on-system-core/src/detectors/raw-color.ts`
- Create: `packages/on-system-core/src/detect.ts`
- Modify: `packages/on-system-core/src/index.ts`
- Test: `packages/on-system-core/tests/raw-color.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/detectors/raw-color.ts`**

Raw color appears (a) inside a className arbitrary value `prefix-[#hex]` and (b) inside a style string. Autofix maps to the nearest color token (preserving the utility prefix for className, or `var(--token)` for style).

```ts
import type { Violation, DetectOptions, Manifest } from "../types.js";
import type { ClassToken, StyleString } from "../extract.js";
import { findRawColor, nearestToken } from "../color.js";

const ARBITRARY = /^([a-z-]+)-\[([^\]]+)\]$/;
const STYLE_COLOR_PROPS = new Set(["color", "background", "backgroundColor", "borderColor", "fill", "stroke", "outlineColor"]);

export function detectRawColor(
  classes: ClassToken[],
  styles: StyleString[],
  manifest: Manifest,
  opts: Required<Pick<DetectOptions, "maxColorDistance">>
): Violation[] {
  const out: Violation[] = [];
  const max = opts.maxColorDistance;

  for (const tok of classes) {
    const m = tok.value.match(ARBITRARY);
    if (!m) continue;
    const [, prefix, inner] = m;
    const raw = findRawColor(inner);
    if (!raw) continue;
    const near = nearestToken(raw, manifest.colorValues, max);
    const replacement = near ? `${prefix}-${near.token}` : null;
    out.push({
      detector: "raw-color",
      range: tok.range,
      severity: "error",
      message: replacement
        ? `Raw color "${raw}" is off-system. Use \`${replacement}\` (token).`
        : `Raw color "${raw}" is off-system. Use a color token (e.g. bg-brand); no close token found.`,
      ...(replacement ? { fix: { range: tok.range, text: replacement } } : {}),
    });
  }

  for (const s of styles) {
    if (!STYLE_COLOR_PROPS.has(s.prop)) continue;
    const raw = findRawColor(s.value);
    if (!raw) continue;
    const near = nearestToken(raw, manifest.colorValues, max);
    out.push({
      detector: "raw-color",
      range: s.range,
      severity: "error",
      message: near
        ? `Raw color "${raw}" in style is off-system. Use the \`${near.token}\` token (var(--${near.token})).`
        : `Raw color "${raw}" in style is off-system. Use a design token.`,
      ...(near ? { fix: { range: s.range, text: `var(--${near.token})` } } : {}),
    });
  }
  return out;
}
```

- [ ] **Step 2: Write `packages/on-system-core/src/detect.ts`**

```ts
import type { Violation, DetectOptions } from "./types.js";
import { manifest } from "./manifest.js";
import { parse } from "./parse.js";
import { extractClassTokens, extractStyleStrings, extractJsxElements } from "./extract.js";
import { detectRawColor } from "./detectors/raw-color.js";

export function detect(code: string, options: DetectOptions = {}): Violation[] {
  const opts = {
    maxColorDistance: options.maxColorDistance ?? 0.1,
    offSystemComponents: options.offSystemComponents ?? "warn",
  } as const;

  const ast = parse(code);
  const classes = extractClassTokens(ast);
  const styles = extractStyleStrings(ast);
  const elements = extractJsxElements(ast);
  void elements; // used by later detectors

  const violations: Violation[] = [
    ...detectRawColor(classes, styles, manifest, opts),
  ];

  return violations.sort((a, b) => a.range[0] - b.range[0]);
}
```

- [ ] **Step 3: Update `packages/on-system-core/src/index.ts`**

```ts
export { detect } from "./detect.js";
export { applyFixes } from "./apply-fixes.js";
export { manifest } from "./manifest.js";
export type { Violation, DetectOptions, DetectorId, Severity, Fix, Manifest } from "./types.js";
```

Note: `apply-fixes.js` is created in Task 10; until then, comment that export out or create the file early. (Task 10 Step 1 creates it.)

- [ ] **Step 4: Write `packages/on-system-core/tests/raw-color.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("raw-color detector", () => {
  it("flags a hex in a className arbitrary value and suggests a token fix", () => {
    const v = detect(`const x = <div className="text-[#16a34a]" />;`);
    expect(v).toHaveLength(1);
    expect(v[0].detector).toBe("raw-color");
    expect(v[0].fix?.text).toBe("text-brand");
  });
  it("flags a raw color in style", () => {
    const v = detect(`const x = <div style={{ color: "#dc2626" }} />;`);
    expect(v[0].detector).toBe("raw-color");
    expect(v[0].fix?.text).toMatch(/^var\(--/);
  });
  it("does not flag on-system classes", () => {
    expect(detect(`const x = <div className="bg-brand text-foreground" />;`)).toEqual([]);
  });
  it("does not flag var(--token) arbitrary values as raw color", () => {
    expect(detect(`const x = <div className="bg-[var(--brand)]" />;`)
      .filter((v) => v.detector === "raw-color")).toEqual([]);
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npm run gen:lint-manifest && npm run test --workspace @byronwade/on-system-core`
Expected: PASS. (Regenerate manifest first so real token values back the suggestions.)

- [ ] **Step 6: Commit**

```bash
git add packages/on-system-core/src/detectors/raw-color.ts packages/on-system-core/src/detect.ts \
  packages/on-system-core/src/index.ts packages/on-system-core/tests/raw-color.test.ts
git commit -m "feat(lint): detect() orchestrator + raw-color detector"
```

---

## Task 6: Arbitrary-value detector

Flags off-token arbitrary values (`p-[13px]`, `rounded-[10px]`, `bg-[…]`) that are NOT raw colors (those are raw-color's job). Mechanical autofix for `prefix-[var(--token)]` → `prefix-token`; otherwise suggestion-only.

**Files:**
- Create: `packages/on-system-core/src/detectors/arbitrary-value.ts`
- Modify: `packages/on-system-core/src/detect.ts`
- Test: `packages/on-system-core/tests/arbitrary-value.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/detectors/arbitrary-value.ts`**

```ts
import type { Violation, Manifest } from "../types.js";
import type { ClassToken } from "../extract.js";
import { findRawColor } from "../color.js";

const ARBITRARY = /^([a-z-]+)-\[([^\]]+)\]$/;
const VAR_TOKEN = /^var\(--([a-z0-9-]+)\)$/;

export function detectArbitraryValue(classes: ClassToken[], manifest: Manifest): Violation[] {
  const out: Violation[] = [];
  for (const tok of classes) {
    const m = tok.value.match(ARBITRARY);
    if (!m) continue;
    const [, prefix, inner] = m;
    if (findRawColor(inner)) continue; // handled by raw-color
    const varMatch = inner.match(VAR_TOKEN);
    if (varMatch && manifest.colorTokens.includes(varMatch[1])) {
      const replacement = `${prefix}-${varMatch[1]}`;
      out.push({
        detector: "arbitrary-value", range: tok.range, severity: "error",
        message: `Arbitrary value \`${tok.value}\` should use the token utility \`${replacement}\`.`,
        fix: { range: tok.range, text: replacement },
      });
      continue;
    }
    out.push({
      detector: "arbitrary-value", range: tok.range, severity: "error",
      message: `Arbitrary value \`${tok.value}\` is off-system. Use a token/scale utility (spacing, radius from --radius, or a color token).`,
    });
  }
  return out;
}
```

- [ ] **Step 2: Wire into `detect.ts`**

Add the import and call. In `packages/on-system-core/src/detect.ts`:

```ts
import { detectArbitraryValue } from "./detectors/arbitrary-value.js";
```
and add to the `violations` array (after `detectRawColor`):
```ts
    ...detectArbitraryValue(classes, manifest),
```

- [ ] **Step 3: Write `packages/on-system-core/tests/arbitrary-value.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("arbitrary-value detector", () => {
  it("flags a px spacing arbitrary value (suggestion only)", () => {
    const v = detect(`const x = <div className="p-[13px]" />;`);
    const av = v.filter((x) => x.detector === "arbitrary-value");
    expect(av).toHaveLength(1);
    expect(av[0].fix).toBeUndefined();
  });
  it("mechanically fixes prefix-[var(--token)] to the token utility", () => {
    const v = detect(`const x = <div className="bg-[var(--brand)]" />;`);
    const av = v.filter((x) => x.detector === "arbitrary-value");
    expect(av[0].fix?.text).toBe("bg-brand");
  });
  it("does not double-flag a raw color (raw-color owns it)", () => {
    const v = detect(`const x = <div className="text-[#16a34a]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/detectors/arbitrary-value.ts packages/on-system-core/src/detect.ts \
  packages/on-system-core/tests/arbitrary-value.test.ts
git commit -m "feat(lint): arbitrary-value detector"
```

---

## Task 7: Hand-rolled gradient/grid/glow detector

**Files:**
- Create: `packages/on-system-core/src/detectors/hand-rolled.ts`
- Modify: `packages/on-system-core/src/detect.ts`
- Test: `packages/on-system-core/tests/hand-rolled.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/detectors/hand-rolled.ts`**

```ts
import type { Violation } from "../types.js";
import type { ClassToken, StyleString } from "../extract.js";

const GRADIENT_CLASS = /^(bg-gradient-|bg-\[(?:linear|radial|conic)-gradient)/;
const GRADIENT_STYLE = /(linear|radial|conic)-gradient\s*\(/;

export function detectHandRolled(classes: ClassToken[], styles: StyleString[]): Violation[] {
  const out: Violation[] = [];
  for (const tok of classes) {
    if (GRADIENT_CLASS.test(tok.value)) {
      out.push({
        detector: "hand-rolled", range: tok.range, severity: "error",
        message: `Hand-rolled gradient \`${tok.value}\`. Use a house utility: glow-brand, text-gradient-brand, or bg-grid.`,
      });
    }
  }
  for (const s of styles) {
    if (GRADIENT_STYLE.test(s.value)) {
      out.push({
        detector: "hand-rolled", range: s.range, severity: "error",
        message: `Hand-rolled gradient in style. Use a house utility: glow-brand, text-gradient-brand, or bg-grid.`,
      });
    }
  }
  return out;
}
```

- [ ] **Step 2: Wire into `detect.ts`**

```ts
import { detectHandRolled } from "./detectors/hand-rolled.js";
```
add to `violations`:
```ts
    ...detectHandRolled(classes, styles),
```

- [ ] **Step 3: Write `packages/on-system-core/tests/hand-rolled.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("hand-rolled detector", () => {
  it("flags bg-gradient-* utilities", () => {
    const v = detect(`const x = <div className="bg-gradient-to-b from-white to-black" />;`);
    expect(v.some((x) => x.detector === "hand-rolled")).toBe(true);
  });
  it("flags inline linear-gradient", () => {
    const v = detect(`const x = <div style={{ backgroundImage: "linear-gradient(white, black)" }} />;`);
    expect(v.some((x) => x.detector === "hand-rolled")).toBe(true);
  });
  it("does not flag the house utilities", () => {
    const v = detect(`const x = <div className="glow-brand bg-grid text-gradient-brand" />;`);
    expect(v.filter((x) => x.detector === "hand-rolled")).toEqual([]);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/detectors/hand-rolled.ts packages/on-system-core/src/detect.ts \
  packages/on-system-core/tests/hand-rolled.test.ts
git commit -m "feat(lint): hand-rolled gradient/grid/glow detector"
```

---

## Task 8: Off-system component detector

**Files:**
- Create: `packages/on-system-core/src/detectors/off-system-component.ts`
- Modify: `packages/on-system-core/src/detect.ts`
- Test: `packages/on-system-core/tests/off-system-component.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/detectors/off-system-component.ts`**

```ts
import type { Violation, Manifest, DetectOptions } from "../types.js";
import type { JsxElement } from "../extract.js";

export function detectOffSystemComponent(
  elements: JsxElement[],
  manifest: Manifest,
  mode: NonNullable<DetectOptions["offSystemComponents"]>
): Violation[] {
  if (mode === "off") return [];
  const out: Violation[] = [];
  for (const el of elements) {
    const component = manifest.nativeToComponent[el.name];
    if (!component) continue;
    out.push({
      detector: "off-system-component", range: el.range,
      severity: mode === "error" ? "error" : "warn",
      message: `Raw <${el.name}> where a primitive exists. Use <${component}> from @byronwade/ui.`,
    });
  }
  return out;
}
```

- [ ] **Step 2: Wire into `detect.ts`**

```ts
import { detectOffSystemComponent } from "./detectors/off-system-component.js";
```
add to `violations`:
```ts
    ...detectOffSystemComponent(elements, manifest, opts.offSystemComponents),
```
and remove the temporary `void elements;` line.

- [ ] **Step 3: Write `packages/on-system-core/tests/off-system-component.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("off-system-component detector", () => {
  it("warns on a raw <button>", () => {
    const v = detect(`const x = <button>Go</button>;`);
    const c = v.filter((x) => x.detector === "off-system-component");
    expect(c).toHaveLength(1);
    expect(c[0].severity).toBe("warn");
    expect(c[0].message).toContain("<Button>");
  });
  it("respects offSystemComponents: 'off'", () => {
    expect(detect(`const x = <button>Go</button>;`, { offSystemComponents: "off" })).toEqual([]);
  });
  it("escalates to error when configured", () => {
    const v = detect(`const x = <input />;`, { offSystemComponents: "error" });
    expect(v[0].severity).toBe("error");
  });
  it("does not flag a registry component", () => {
    expect(detect(`const x = <Button>Go</Button>;`)).toEqual([]);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/detectors/off-system-component.ts packages/on-system-core/src/detect.ts \
  packages/on-system-core/tests/off-system-component.test.ts
git commit -m "feat(lint): off-system-component detector (warn)"
```

---

## Task 9: Typography (weight-hierarchy) detector

Enforces the Design DNA's editorial-typography rule: headings carry hierarchy through size + tracking, never weight. Flags a bold-family weight on an `<h1>`–`<h6>` and autofixes to `font-medium`. (The positive guidance — `font-mono` for data, `font-serif` for prose — is not lintable without semantic intent and stays out of scope.)

**Files:**
- Create: `packages/on-system-core/src/detectors/typography.ts`
- Modify: `packages/on-system-core/src/detect.ts`
- Test: `packages/on-system-core/tests/typography.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/detectors/typography.ts`**

```ts
import type { Violation } from "../types.js";
import type { ElementClasses } from "../extract.js";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const BOLD = new Set(["font-semibold", "font-bold", "font-extrabold", "font-black"]);
const ARB_WEIGHT = /^font-\[(\d{3})\]$/;

/** Headings carry hierarchy through size + tracking, never weight (Design DNA). */
export function detectTypography(elements: ElementClasses[]): Violation[] {
  const out: Violation[] = [];
  for (const el of elements) {
    if (!HEADINGS.has(el.name)) continue;
    for (const tok of el.classes) {
      const arb = tok.value.match(ARB_WEIGHT);
      const isBold = BOLD.has(tok.value) || (arb !== null && Number(arb[1]) >= 600);
      if (!isBold) continue;
      out.push({
        detector: "typography", range: tok.range, severity: "error",
        message: `Headings carry hierarchy through size + tracking, not weight. Use \`font-medium\`, not \`${tok.value}\`.`,
        fix: { range: tok.range, text: "font-medium" },
      });
    }
  }
  return out;
}
```

- [ ] **Step 2: Wire into `detect.ts`**

In `packages/on-system-core/src/detect.ts`:
1. Add `extractElementClasses` to the extract import:
```ts
import { extractClassTokens, extractStyleStrings, extractJsxElements, extractElementClasses } from "./extract.js";
```
2. Add the detector import:
```ts
import { detectTypography } from "./detectors/typography.js";
```
3. After the existing `const elements = extractJsxElements(ast);`, add:
```ts
  const elementClasses = extractElementClasses(ast);
```
4. Add to the `violations` array:
```ts
    ...detectTypography(elementClasses),
```

- [ ] **Step 3: Write `packages/on-system-core/tests/typography.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("typography detector", () => {
  it("flags font-bold on a heading and autofixes to font-medium", () => {
    const v = detect(`const x = <h1 className="text-4xl font-bold">Hi</h1>;`);
    const t = v.filter((x) => x.detector === "typography");
    expect(t).toHaveLength(1);
    expect(t[0].fix?.text).toBe("font-medium");
  });
  it("flags font-semibold and arbitrary heavy weights on headings", () => {
    expect(detect(`const x = <h2 className="font-semibold" />;`).some((x) => x.detector === "typography")).toBe(true);
    expect(detect(`const x = <h3 className="font-[700]" />;`).some((x) => x.detector === "typography")).toBe(true);
  });
  it("allows font-medium / font-normal on headings", () => {
    expect(detect(`const x = <h1 className="text-4xl font-medium" />;`).filter((x) => x.detector === "typography")).toEqual([]);
  });
  it("does not flag bold weight on non-heading elements", () => {
    expect(detect(`const x = <span className="font-bold" />;`).filter((x) => x.detector === "typography")).toEqual([]);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/detectors/typography.ts packages/on-system-core/src/detect.ts \
  packages/on-system-core/tests/typography.test.ts
git commit -m "feat(lint): typography detector — headings never carry weight"
```

---

## Task 10: Apply-fixes + round-trip fixtures

**Files:**
- Create: `packages/on-system-core/src/apply-fixes.ts`
- Create: `packages/on-system-core/tests/fixtures/on-system/clean.tsx`
- Create: `packages/on-system-core/tests/fixtures/off-system/colors.tsx`
- Test: `packages/on-system-core/tests/roundtrip.test.ts`

- [ ] **Step 1: Write `packages/on-system-core/src/apply-fixes.ts`**

```ts
import type { Violation } from "./types.js";

/** Apply fixes right-to-left so earlier offsets stay valid. Overlapping fixes: first wins. */
export function applyFixes(code: string, violations: Violation[]): string {
  const fixes = violations.filter((v): v is Violation & { fix: NonNullable<Violation["fix"]> } => !!v.fix)
    .map((v) => v.fix)
    .sort((a, b) => b.range[0] - a.range[0]);
  let out = code;
  let lastStart = Infinity;
  for (const f of fixes) {
    if (f.range[1] > lastStart) continue; // skip overlapping
    out = out.slice(0, f.range[0]) + f.text + out.slice(f.range[1]);
    lastStart = f.range[0];
  }
  return out;
}
```

- [ ] **Step 2: Create fixtures**

`packages/on-system-core/tests/fixtures/on-system/clean.tsx`:
```tsx
export function Clean() {
  return (
    <section className="bg-card text-foreground p-4 rounded-lg glow-brand">
      <span className="bg-brand text-primary-foreground">on-system</span>
    </section>
  );
}
```

`packages/on-system-core/tests/fixtures/off-system/colors.tsx`:
```tsx
export function Dirty() {
  return (
    <div className="text-[#16a34a] p-[13px] bg-gradient-to-b" style={{ color: "#dc2626" }}>
      <h2 className="text-2xl font-bold">Heading</h2>
      <button>raw</button>
    </div>
  );
}
```

- [ ] **Step 3: Write `packages/on-system-core/tests/roundtrip.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { detect } from "../src/detect.js";
import { applyFixes } from "../src/apply-fixes.js";

const read = (p: string) => readFileSync(join(__dirname, p), "utf8");

describe("fixtures", () => {
  it("on-system fixture produces zero violations", () => {
    expect(detect(read("fixtures/on-system/clean.tsx"))).toEqual([]);
  });
  it("off-system fixture produces violations across detectors", () => {
    const v = detect(read("fixtures/off-system/colors.tsx"));
    const kinds = new Set(v.map((x) => x.detector));
    expect(kinds).toContain("raw-color");
    expect(kinds).toContain("arbitrary-value");
    expect(kinds).toContain("hand-rolled");
    expect(kinds).toContain("off-system-component");
    expect(kinds).toContain("typography");
  });
  it("autofix output has no error-severity color/arbitrary violations left", () => {
    const code = read("fixtures/off-system/colors.tsx");
    const fixed = applyFixes(code, detect(code));
    const remaining = detect(fixed).filter(
      (v) => v.detector === "raw-color" && v.severity === "error" && v.fix
    );
    expect(remaining).toEqual([]);
  });
});
```

Note: `__dirname` requires the test to run under vitest's Node environment; if the package is pure ESM and `__dirname` is undefined, replace with `fileURLToPath(new URL("./fixtures/...", import.meta.url))`. Use whichever the package's vitest resolves — verify in Step 4 and switch if needed.

- [ ] **Step 4: Run tests**

Run: `npm run test --workspace @byronwade/on-system-core`
Expected: PASS. If `__dirname` is undefined, switch the `read` helper to `fileURLToPath(new URL(p, import.meta.url))` and re-run.

- [ ] **Step 5: Commit**

```bash
git add packages/on-system-core/src/apply-fixes.ts packages/on-system-core/tests/fixtures packages/on-system-core/tests/roundtrip.test.ts
git commit -m "feat(lint): applyFixes + on/off-system round-trip fixtures"
```

---

## Task 11: ESLint plugin adapter

**Files:**
- Create: `packages/eslint-plugin-ui/package.json`
- Create: `packages/eslint-plugin-ui/tsconfig.json`
- Create: `packages/eslint-plugin-ui/vitest.config.ts`
- Create: `packages/eslint-plugin-ui/src/rule.ts`
- Create: `packages/eslint-plugin-ui/src/index.ts`
- Test: `packages/eslint-plugin-ui/tests/rule.test.ts`

- [ ] **Step 1: Create `packages/eslint-plugin-ui/package.json`**

```json
{
  "name": "@byronwade/eslint-plugin-ui",
  "version": "0.1.0",
  "description": "ESLint flat-config plugin enforcing the byronwade/ui design system.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist"],
  "scripts": { "build": "tsc -p tsconfig.json", "test": "vitest run" },
  "dependencies": { "@byronwade/on-system-core": "0.1.0" },
  "peerDependencies": { "eslint": ">=9" },
  "devDependencies": { "eslint": "^9", "typescript": "^5", "vitest": "^4.1.7", "@typescript-eslint/parser": "^8.20.0" }
}
```

- [ ] **Step 2: Create `packages/eslint-plugin-ui/tsconfig.json`** (same as on-system-core's tsconfig in Task 1 Step 3, with `"rootDir": "src"`).

- [ ] **Step 3: Create `packages/eslint-plugin-ui/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
```

- [ ] **Step 4: Write `packages/eslint-plugin-ui/src/rule.ts`**

```ts
import type { Rule } from "eslint";
import { detect } from "@byronwade/on-system-core";

export const onSystem: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Enforce byronwade/ui tokens, utilities, and primitives." },
    fixable: "code",
    schema: [{
      type: "object",
      properties: {
        maxColorDistance: { type: "number" },
        offSystemComponents: { enum: ["warn", "error", "off"] },
      },
      additionalProperties: false,
    }],
    messages: { offSystem: "{{message}}" },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as Record<string, unknown>;
    // Report inside a Program handler so reports are flushed during traversal
    // (reporting directly in create() before returning visitors is not reliable).
    return {
      Program() {
        const sc = context.sourceCode;
        for (const v of detect(sc.getText(), options)) {
          context.report({
            loc: { start: sc.getLocFromIndex(v.range[0]), end: sc.getLocFromIndex(v.range[1]) },
            messageId: "offSystem",
            data: { message: v.message },
            fix: v.fix ? (fixer) => fixer.replaceTextRange(v.fix!.range, v.fix!.text) : null,
          });
        }
      },
    };
  },
};
```

- [ ] **Step 5: Write `packages/eslint-plugin-ui/src/index.ts`**

```ts
import { onSystem } from "./rule.js";

const plugin = {
  meta: { name: "@byronwade/eslint-plugin-ui", version: "0.1.0" },
  rules: { "on-system": onSystem },
  configs: {} as Record<string, unknown>,
};

plugin.configs.recommended = {
  plugins: { "byronwade-ui": plugin },
  rules: { "byronwade-ui/on-system": "error" },
};

export default plugin;
```

- [ ] **Step 6: Write `packages/eslint-plugin-ui/tests/rule.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { onSystem } from "../src/rule.js";

const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

describe("byronwade-ui/on-system", () => {
  it("passes valid + flags invalid", () => {
    tester.run("on-system", onSystem, {
      valid: [{ code: `const x = <div className="bg-brand p-4" />;` }],
      invalid: [{
        code: `const x = <div className="text-[#16a34a]" />;`,
        output: `const x = <div className="text-brand" />;`,
        errors: 1,
      }],
    });
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 7: Build core (so the plugin can import it) and run tests**

Run: `npm run build --workspace @byronwade/on-system-core`
Run: `npm run test --workspace @byronwade/eslint-plugin-ui`
Expected: PASS. (The plugin imports the built `dist` of core; rebuild core after core changes.)

- [ ] **Step 8: Commit**

```bash
git add packages/eslint-plugin-ui
git commit -m "feat(lint): eslint-plugin-ui adapter + recommended config"
```

---

## Task 12: CLI adapter

**Files:**
- Create: `packages/lint-cli/package.json`
- Create: `packages/lint-cli/tsconfig.json`
- Create: `packages/lint-cli/vitest.config.ts`
- Create: `packages/lint-cli/src/run.ts`
- Create: `packages/lint-cli/src/cli.ts`
- Test: `packages/lint-cli/tests/run.test.ts`

- [ ] **Step 1: Create `packages/lint-cli/package.json`**

```json
{
  "name": "@byronwade/lint",
  "version": "0.1.0",
  "description": "CLI that flags off-system byronwade/ui code.",
  "type": "module",
  "bin": { "byronwade-lint": "./dist/cli.js" },
  "files": ["dist"],
  "scripts": { "build": "tsc -p tsconfig.json", "test": "vitest run" },
  "dependencies": {
    "@byronwade/on-system-core": "0.1.0",
    "fast-glob": "^3.3.2",
    "picocolors": "^1.1.1"
  },
  "devDependencies": { "typescript": "^5", "vitest": "^4.1.7" }
}
```

- [ ] **Step 2: Create `packages/lint-cli/tsconfig.json`** (same shape as Task 1 Step 3).

- [ ] **Step 3: Create `packages/lint-cli/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
```

- [ ] **Step 4: Write `packages/lint-cli/src/run.ts`**

```ts
import { readFileSync, writeFileSync } from "node:fs";
import fg from "fast-glob";
import { detect, applyFixes, type Violation } from "@byronwade/on-system-core";

export interface RunOptions { fix?: boolean; maxColorDistance?: number; cwd?: string; }
export interface RunResult { errorCount: number; warnCount: number; files: { file: string; violations: Violation[] }[]; }

export async function run(patterns: string[], opts: RunOptions = {}): Promise<RunResult> {
  const files = await fg(patterns, { cwd: opts.cwd ?? process.cwd(), absolute: true, dot: false });
  const result: RunResult = { errorCount: 0, warnCount: 0, files: [] };
  for (const file of files) {
    const code = readFileSync(file, "utf8");
    let violations = detect(code, { maxColorDistance: opts.maxColorDistance });
    if (opts.fix && violations.some((v) => v.fix)) {
      writeFileSync(file, applyFixes(code, violations));
      violations = detect(readFileSync(file, "utf8"), { maxColorDistance: opts.maxColorDistance });
    }
    for (const v of violations) v.severity === "error" ? result.errorCount++ : result.warnCount++;
    if (violations.length) result.files.push({ file, violations });
  }
  return result;
}
```

- [ ] **Step 5: Write `packages/lint-cli/src/cli.ts`**

```ts
#!/usr/bin/env node
import pc from "picocolors";
import { run } from "./run.js";

async function main() {
  const argv = process.argv.slice(2);
  const fix = argv.includes("--fix");
  const distIdx = argv.indexOf("--max-color-distance");
  const maxColorDistance = distIdx >= 0 ? Number(argv[distIdx + 1]) : undefined;
  const patterns = argv.filter((a, i) =>
    !a.startsWith("--") && !(distIdx >= 0 && i === distIdx + 1));
  if (patterns.length === 0) patterns.push("**/*.{ts,tsx}");

  const res = await run(patterns, { fix, maxColorDistance });
  for (const { file, violations } of res.files) {
    console.log(pc.underline(file));
    for (const v of violations) {
      const tag = v.severity === "error" ? pc.red("error") : pc.yellow("warn ");
      console.log(`  ${tag}  ${v.message}  ${pc.dim(v.detector)}`);
    }
  }
  console.log(
    `\n${res.errorCount} error(s), ${res.warnCount} warning(s) across ${res.files.length} file(s).`
  );
  process.exit(res.errorCount > 0 ? 1 : 0);
}
main();
```

- [ ] **Step 6: Write `packages/lint-cli/tests/run.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../src/run.js";

function tmp(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), "byronwade-lint-"));
  const file = join(dir, "x.tsx");
  writeFileSync(file, content);
  return file;
}

describe("run", () => {
  it("reports errors and returns a non-zero error count", async () => {
    const file = tmp(`const x = <div className="text-[#16a34a]" />;`);
    const res = await run([file]);
    expect(res.errorCount).toBeGreaterThan(0);
  });
  it("--fix rewrites the file on-system", async () => {
    const file = tmp(`const x = <div className="text-[#16a34a]" />;`);
    await run([file], { fix: true });
    expect(readFileSync(file, "utf8")).toContain("text-brand");
  });
});
```

- [ ] **Step 7: Build core + run tests**

Run: `npm run build --workspace @byronwade/on-system-core`
Run: `npm run test --workspace @byronwade/lint`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/lint-cli
git commit -m "feat(lint): byronwade-lint CLI (run + --fix)"
```

---

## Task 13: Dogfood gate + wire all gates into validate/CI

**Files:**
- Modify: `package.json` (scripts)
- Modify: `.github/workflows/registry.yml` (or `test.yml`)

- [ ] **Step 1: Add a build+dogfood script to root `package.json`**

```jsonc
// scripts — add:
"build:lint": "npm run build --workspace @byronwade/on-system-core && npm run build --workspace @byronwade/lint",
"lint:on-system": "npm run build:lint && node packages/lint-cli/dist/cli.js \"registry/**/*.{ts,tsx}\" \"app/**/*.{ts,tsx}\""
```

- [ ] **Step 2: Run the dogfood lint over our own code**

Run: `npm run gen:lint-manifest && npm run lint:on-system`
Expected: `0 error(s)`. If errors surface, they are real DNA drift in `registry/`/`app/` — fix each (raw color/arbitrary value → token/utility; hand-rolled gradient → house utility; `font-bold` on a heading → `font-medium`), re-run until `0 error(s)`. Note: the editorial-typography rule was added to the DNA recently, so existing headings may carry a bold weight that now flags — those are legitimate fixes. Commit separately with message `fix(registry): resolve on-system lint violations`.

- [ ] **Step 3: Add the packages test + dogfood to CI**

In `.github/workflows/registry.yml`, after the existing validate steps, add:

```yaml
      - name: On-system lint manifest sync
        run: node scripts/check-lint-manifest.mjs

      - name: Test lint packages
        run: npm run test:packages

      - name: Dogfood on-system lint
        run: npm run lint:on-system
```

- [ ] **Step 4: Verify the full local gate chain**

Run: `npm run validate && npm run test:packages && npm run lint:on-system`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add package.json .github/workflows/registry.yml
git commit -m "ci(lint): dogfood on-system lint + run lint packages in CI"
```

---

## Task 14: Consumer docs

**Files:**
- Create: `app/(docs)/docs/lint/page.tsx`
- Modify: the docs nav source that lists doc routes (follow the pattern used by `app/(docs)/docs/ai/page.tsx`'s nav entry)

- [ ] **Step 1: Find how existing docs pages register in the nav**

Run: `grep -rn "installation\|theming" app/(docs)/_components content/ | grep -i nav`
Expected: locate the nav list (e.g. in a `site-nav`/`docs-nav` source). Add a `{ label: "Lint", href: "/docs/lint" }` entry alongside the existing ones, matching their exact shape.

- [ ] **Step 2: Write `app/(docs)/docs/lint/page.tsx`**

Model it on the existing `app/(docs)/docs/installation/page.tsx` structure (same imports, `CodeBlock`, `Step`/section components — open that file and mirror it). Content covers:

```tsx
// Mirror installation/page.tsx's page shell + CodeBlock usage.
// Sections:
// 1. ESLint plugin (flat config):
//    import byronwadeUi from "@byronwade/eslint-plugin-ui";
//    export default [ byronwadeUi.configs.recommended ];
// 2. CLI:
//    npx byronwade-lint "src/**/*.{ts,tsx}"
//    npx byronwade-lint "src/**/*.{ts,tsx}" --fix
// 3. What it catches (the five detectors) + the maxColorDistance/offSystemComponents options.
```

Write the actual page using the real components from `installation/page.tsx` (do not invent a new shell). Keep all copy on-system (it will be linted by the dogfood gate).

- [ ] **Step 3: Verify the docs build**

Run: `npm run build`
Expected: build succeeds, `/docs/lint` route compiles.

- [ ] **Step 4: Commit**

```bash
git add "app/(docs)/docs/lint/page.tsx" <the nav source file>
git commit -m "docs(lint): consumer usage page for the ESLint plugin + CLI"
```

---

## Self-review notes (for the executor)

- **Build order matters for imports:** the ESLint plugin and CLI import the **built** `dist` of `@byronwade/on-system-core`. After any change to core, run `npm run build --workspace @byronwade/on-system-core` before testing the adapters (Tasks 11–13 steps already do this).
- **Regenerate the manifest** (`npm run gen:lint-manifest`) before any test that relies on real token suggestions (Tasks 5, 10, 13). The manifest is git-ignored.
- **Coverage:** the on-system-core vitest config collects coverage; if the repo's package coverage ratchet is enforced for these packages, extend the fixture corpus (more on/off-system samples) until thresholds are met. The round-trip test is the cheapest way to raise coverage broadly.
- **`apply-fixes.js` export:** Task 5 Step 3 exports `applyFixes` from `index.ts`, but the file is created in Task 10. If executing strictly in order, create an empty `apply-fixes.ts` stub (`export function applyFixes(c: string){ return c; }`) in Task 5 and replace it in Task 10, or comment the export until Task 10. Prefer creating the real file early.
- **Semantic-palette exclusion (verify in Task 5):** add an assertion that a brand-adjacent raw green does NOT autofix to a semantic token. With the real manifest, `detect(\`<div className="text-[#10b981]" />\`)[0].fix?.text` must be `text-brand` (or another general accent), never `text-activity-search` / `text-chart-*`. The exclusion lives in the manifest generator (Task 2); this test guards it from regressing.
- **Typography detector (Task 9) covers only the negative rule** — a bold-family weight on a native `<h1>`–`<h6>`. It does NOT enforce the positive guidance (`font-mono` for data, `font-serif` for prose), which needs semantic intent and is genuinely not lintable. Heading *components* (e.g. a `<PageHeader>` or `<Heading>`) are also not covered in v1 — only native heading elements. Note both as future work.
```
