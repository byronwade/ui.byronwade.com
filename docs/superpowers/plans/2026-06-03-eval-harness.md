# Eval Harness + Published Pass-Rate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `npm run eval` harness that measures how on-system Claude's generated UI is with vs without the design rule, graded by the subsystem-1 detector, producing a committed pass-rate snapshot.

**Architecture:** New `@byronwade/eval` workspace package. Pure units (extract-code, grade, aggregate, report) are TDD'd with fixtures; the Anthropic client is an injected interface so the test suite makes ZERO API calls. Only a live `npm run eval` spends money.

**Tech Stack:** TypeScript (ESM), `@anthropic-ai/sdk` (claude-sonnet-4-6, prompt caching), `@byronwade/on-system-core` (the grader), `vitest`.

**Spec:** `docs/superpowers/specs/2026-06-03-eval-harness-design.md`

> **SDK note (Task 6):** when wiring `@anthropic-ai/sdk`, follow the `claude-api` skill. The system prompt is sent as an array of text blocks; the rule block carries `cache_control: { type: "ephemeral" }` so it's cached across the with-rule calls.

---

## File structure

```
package.json                          ← add "eval": "node packages/eval/dist/cli.js" script + @anthropic-ai/sdk dep
packages/eval/
  package.json  tsconfig.json  vitest.config.ts
  prompts/                            ← 12 committed *.md build prompts
  results/                            ← latest.json + latest.md (committed by a run)
  src/
    types.ts                         ← Condition, Prompt, GradedResult, ConditionSummary, EvalReport
    extract-code.ts                  ← extractCode(responseText) -> string | null
    grade.ts                         ← gradeGeneration(code) -> GradedResult fields
    prompts.ts                       ← loadPrompts(), hashPrompts()
    generate.ts                      ← AnthropicClient interface, makeAnthropicClient(), buildSystem()
    aggregate.ts                     ← aggregate(GradedResult[]) -> EvalReport
    report.ts                        ← toJson(), toMarkdown()
    run-eval.ts                      ← runEval(client, prompts, ruleText) -> EvalReport
    cli.ts                           ← npm run eval entry (--dry-run, --out)
    fixtures/
      fake-client.ts                 ← FakeClient returning canned responses (tests + --dry-run)
      responses.ts                   ← a few recorded generations (on-system + off-system)
  tests/
    extract-code.test.ts  grade.test.ts  aggregate.test.ts  report.test.ts  run-eval.test.ts
```

---

## Task 1: Package scaffold

**Files:**
- Modify: `package.json` (root)
- Create: `packages/eval/package.json`, `tsconfig.json`, `vitest.config.ts`, `src/index.ts`

- [ ] **Step 1: Root `package.json`** — add to `devDependencies`: `"@anthropic-ai/sdk": "^0.40.1"`; add to `scripts`: `"eval": "npm run build --workspace @byronwade/eval && node packages/eval/dist/cli.js"`.

- [ ] **Step 2: Create `packages/eval/package.json`**

```json
{
  "name": "@byronwade/eval",
  "version": "0.1.0",
  "description": "Measures how on-system Claude's UI is, with vs without the byronwade/ui rule.",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "tsc --noEmit -p tsconfig.json && vitest run"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.40.1",
    "@byronwade/on-system-core": "0.1.0"
  },
  "devDependencies": { "typescript": "^5", "vitest": "^4.1.7" }
}
```

- [ ] **Step 3: Create `packages/eval/tsconfig.json`**

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

- [ ] **Step 4: Create `packages/eval/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
```

- [ ] **Step 5: Create `packages/eval/src/index.ts`**

```ts
export const VERSION = "0.1.0";
```

- [ ] **Step 6: Ignore eval dist** — confirm `.gitignore` already has `packages/*/dist` (added in subsystem 1). If not, add it.

- [ ] **Step 7: Install + verify** — Run `npm install` (links the workspace + adds the SDK). Run `npm run build --workspace @byronwade/on-system-core` (the grader must be built for eval to import its `dist`). Expected: both succeed.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json packages/eval
git commit -m "chore(eval): scaffold @byronwade/eval workspace package"
```

---

## Task 2: Types + code extraction

**Files:**
- Create: `packages/eval/src/types.ts`, `packages/eval/src/extract-code.ts`
- Test: `packages/eval/tests/extract-code.test.ts`

- [ ] **Step 1: Write `packages/eval/src/types.ts`**

```ts
import type { DetectorId } from "@byronwade/on-system-core";

export type Condition = "with-rule" | "baseline";

export interface Prompt { name: string; text: string; }

export interface GradedResult {
  prompt: string;
  condition: Condition;
  pass: boolean;                 // true iff zero violations and code extracted+parsed
  violations: number;
  byDetector: Partial<Record<DetectorId, number>>;
  reason?: "no-code" | "parse-error";  // set when pass is false for a non-violation reason
}

export interface ConditionSummary {
  condition: Condition;
  total: number;
  passes: number;
  passRate: number;              // passes / total, 0..1
  meanViolations: number;
  byDetector: Partial<Record<DetectorId, number>>;
}

export interface EvalReport {
  date: string;                  // injected (no Date.now in library code)
  model: string;
  promptSetHash: string;
  conditions: { "with-rule": ConditionSummary; baseline: ConditionSummary };
  lift: number;                  // withRule.passRate - baseline.passRate
  perPrompt: GradedResult[];
}
```

- [ ] **Step 2: Write `packages/eval/tests/extract-code.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { extractCode } from "../src/extract-code.js";

describe("extractCode", () => {
  it("extracts a ```tsx fenced block", () => {
    const r = "Here you go:\n```tsx\nconst x = <Button />;\n```\nDone.";
    expect(extractCode(r)).toBe("const x = <Button />;");
  });
  it("extracts a ```jsx block", () => {
    expect(extractCode("```jsx\nconst y = 1;\n```")).toBe("const y = 1;");
  });
  it("takes the FIRST block when several exist", () => {
    expect(extractCode("```tsx\nA\n```\n```tsx\nB\n```")).toBe("A");
  });
  it("returns null when there is no fenced block", () => {
    expect(extractCode("no code here")).toBeNull();
  });
});
```

- [ ] **Step 3: Run test (fails)** — `npm run test --workspace @byronwade/eval` → FAIL (extractCode not defined).

- [ ] **Step 4: Write `packages/eval/src/extract-code.ts`**

```ts
const FENCE = /```(?:tsx|jsx|ts|js)?\s*\n([\s\S]*?)```/;

/** First fenced code block's inner text (trimmed), or null if none. */
export function extractCode(response: string): string | null {
  const m = response.match(FENCE);
  return m ? m[1].replace(/\s+$/, "").replace(/^\n+/, "") : null;
}
```

- [ ] **Step 5: Run test (passes)** — `npm run test --workspace @byronwade/eval` → PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/eval/src/types.ts packages/eval/src/extract-code.ts packages/eval/tests/extract-code.test.ts
git commit -m "feat(eval): result types + code-block extraction"
```

---

## Task 3: Grading via the detector

**Files:**
- Create: `packages/eval/src/grade.ts`
- Test: `packages/eval/tests/grade.test.ts`

- [ ] **Step 1: Write `packages/eval/tests/grade.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { gradeGeneration } from "../src/grade.js";

describe("gradeGeneration", () => {
  it("passes clean on-system code", () => {
    const g = gradeGeneration(`const x = <div className="bg-brand text-foreground p-4" />;`);
    expect(g.pass).toBe(true);
    expect(g.violations).toBe(0);
  });
  it("fails code with a raw color and counts it", () => {
    const g = gradeGeneration(`const x = <div className="text-[#16a34a]" />;`);
    expect(g.pass).toBe(false);
    expect(g.violations).toBeGreaterThan(0);
    expect(g.byDetector["raw-color"]).toBeGreaterThan(0);
  });
  it("counts a native element as off-system (all-5-strict)", () => {
    const g = gradeGeneration(`const x = <button>go</button>;`);
    expect(g.pass).toBe(false);
    expect(g.byDetector["off-system-component"]).toBeGreaterThan(0);
  });
  it("returns no-code reason for null", () => {
    const g = gradeGeneration(null);
    expect(g.pass).toBe(false);
    expect(g.reason).toBe("no-code");
  });
  it("returns parse-error reason for invalid tsx", () => {
    const g = gradeGeneration(`const x = <div className=`);
    expect(g.pass).toBe(false);
    expect(g.reason).toBe("parse-error");
  });
});
```

- [ ] **Step 2: Run test (fails)** — `npm run test --workspace @byronwade/eval` → FAIL.

- [ ] **Step 3: Write `packages/eval/src/grade.ts`**

```ts
import { detect, type DetectorId } from "@byronwade/on-system-core";

export interface GradeFields {
  pass: boolean;
  violations: number;
  byDetector: Partial<Record<DetectorId, number>>;
  reason?: "no-code" | "parse-error";
}

/** All-five-detectors-strict grading: pass iff code extracts, parses, and has zero violations. */
export function gradeGeneration(code: string | null): GradeFields {
  if (code === null) return { pass: false, violations: 0, byDetector: {}, reason: "no-code" };
  let violations;
  try {
    violations = detect(code, { offSystemComponents: "error" });
  } catch {
    return { pass: false, violations: 0, byDetector: {}, reason: "parse-error" };
  }
  const byDetector: Partial<Record<DetectorId, number>> = {};
  for (const v of violations) byDetector[v.detector] = (byDetector[v.detector] ?? 0) + 1;
  return { pass: violations.length === 0, violations: violations.length, byDetector };
}
```

- [ ] **Step 4: Run test (passes)** — `npm run test --workspace @byronwade/eval`. If the `parse-error` case does not actually throw (the parser may tolerate it), adjust the fixture to clearly-invalid TSX like `const x = <<<;` and re-run until the parse-error path is exercised. PASS required.

- [ ] **Step 5: Commit**

```bash
git add packages/eval/src/grade.ts packages/eval/tests/grade.test.ts
git commit -m "feat(eval): grade a generation with the on-system detector (all 5 strict)"
```

---

## Task 4: Prompt set + loading

**Files:**
- Create: `packages/eval/prompts/*.md` (12 files), `packages/eval/src/prompts.ts`
- Test: `packages/eval/tests/` (covered via run-eval test in Task 7; a tiny load test here)

- [ ] **Step 1: Create the 12 prompt files.** Each is a plain build request, no hints about tokens/components. Exact filenames + contents:

`packages/eval/prompts/sign-in-form.md`:
```
Build a sign-in form with email and password fields, a "Remember me" checkbox, a primary "Sign in" button, and a "Forgot password?" link. Return one self-contained React .tsx component.
```
`packages/eval/prompts/pricing-table.md`:
```
Build a three-tier pricing table (Starter, Pro, Enterprise) with per-tier price, a feature list, and a call-to-action button on each. Return one self-contained React .tsx component.
```
`packages/eval/prompts/settings-page.md`:
```
Build an account settings page with sections for profile, notifications (toggles), and danger zone (delete account). Return one self-contained React .tsx component.
```
`packages/eval/prompts/dashboard-stats.md`:
```
Build a dashboard stat row of four metric cards (label, big value, trend delta). Return one self-contained React .tsx component.
```
`packages/eval/prompts/top-nav.md`:
```
Build a top navigation bar with a logo, primary nav links, a search field, and an avatar menu on the right. Return one self-contained React .tsx component.
```
`packages/eval/prompts/empty-state.md`:
```
Build an empty state for a projects list: an icon, a heading, a short description, and a primary "Create project" button. Return one self-contained React .tsx component.
```
`packages/eval/prompts/data-table.md`:
```
Build a data table of users (avatar, name, email, role, status badge) with a header row and row hover. Return one self-contained React .tsx component.
```
`packages/eval/prompts/profile-header.md`:
```
Build a profile header with an avatar, name, handle, short bio, follower/following counts, and a "Follow" button. Return one self-contained React .tsx component.
```
`packages/eval/prompts/notifications.md`:
```
Build a notifications list panel with grouped items (avatar, message, timestamp) and a "Mark all read" action. Return one self-contained React .tsx component.
```
`packages/eval/prompts/modal-dialog.md`:
```
Build a confirmation modal dialog with a title, body text, and Cancel / Confirm buttons. Return one self-contained React .tsx component.
```
`packages/eval/prompts/filter-bar.md`:
```
Build a filter bar with a search input, a few dropdown filters, active filter chips, and a "Clear" button. Return one self-contained React .tsx component.
```
`packages/eval/prompts/card-grid.md`:
```
Build a responsive grid of product cards (image area, title, price, "Add to cart" button). Return one self-contained React .tsx component.
```

- [ ] **Step 2: Write `packages/eval/src/prompts.ts`**

```ts
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import type { Prompt } from "./types.js";

const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts");

export function loadPrompts(dir: string = PROMPTS_DIR): Prompt[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ name: basename(f, ".md"), text: readFileSync(join(dir, f), "utf8").trim() }));
}

export function hashPrompts(prompts: Prompt[]): string {
  const h = createHash("sha256");
  for (const p of prompts) h.update(p.name).update("\0").update(p.text).update("\0");
  return h.digest("hex").slice(0, 12);
}
```

- [ ] **Step 3: Quick load test** — create `packages/eval/tests/prompts.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { loadPrompts, hashPrompts } from "../src/prompts.js";

describe("prompts", () => {
  it("loads the 12 committed prompts", () => {
    const p = loadPrompts();
    expect(p.length).toBe(12);
    expect(p.every((x) => x.text.length > 0)).toBe(true);
  });
  it("hash is stable + 12 chars", () => {
    expect(hashPrompts(loadPrompts())).toHaveLength(12);
  });
});
```

- [ ] **Step 4: Run test** — `npm run test --workspace @byronwade/eval` → PASS (12 prompts).

- [ ] **Step 5: Commit**

```bash
git add packages/eval/prompts packages/eval/src/prompts.ts packages/eval/tests/prompts.test.ts
git commit -m "feat(eval): 12 committed build prompts + loader/hash"
```

---

## Task 5: Aggregation

**Files:**
- Create: `packages/eval/src/aggregate.ts`
- Test: `packages/eval/tests/aggregate.test.ts`

- [ ] **Step 1: Write `packages/eval/tests/aggregate.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { aggregate } from "../src/aggregate.js";
import type { GradedResult } from "../src/types.js";

const R = (condition: "with-rule" | "baseline", pass: boolean, violations = pass ? 0 : 2): GradedResult =>
  ({ prompt: "p", condition, pass, violations, byDetector: pass ? {} : { "raw-color": violations } });

describe("aggregate", () => {
  it("computes per-condition pass rates and the lift", () => {
    const results = [
      R("with-rule", true), R("with-rule", true), R("with-rule", false),
      R("baseline", false), R("baseline", false), R("baseline", true),
    ];
    const report = aggregate(results, { date: "2026-06-03", model: "claude-sonnet-4-6", promptSetHash: "abc123abc123" });
    expect(report.conditions["with-rule"].passRate).toBeCloseTo(2 / 3);
    expect(report.conditions.baseline.passRate).toBeCloseTo(1 / 3);
    expect(report.lift).toBeCloseTo(1 / 3);
    expect(report.conditions["with-rule"].byDetector["raw-color"]).toBe(2);
  });
});
```

- [ ] **Step 2: Run test (fails)** — FAIL.

- [ ] **Step 3: Write `packages/eval/src/aggregate.ts`**

```ts
import type { GradedResult, Condition, ConditionSummary, EvalReport, DetectorId } from "./types.js";

function summarize(condition: Condition, results: GradedResult[]): ConditionSummary {
  const rows = results.filter((r) => r.condition === condition);
  const passes = rows.filter((r) => r.pass).length;
  const total = rows.length;
  const byDetector: Partial<Record<DetectorId, number>> = {};
  let violations = 0;
  for (const r of rows) {
    violations += r.violations;
    for (const [d, n] of Object.entries(r.byDetector)) byDetector[d as DetectorId] = (byDetector[d as DetectorId] ?? 0) + (n ?? 0);
  }
  return {
    condition, total, passes,
    passRate: total ? passes / total : 0,
    meanViolations: total ? violations / total : 0,
    byDetector,
  };
}

export function aggregate(
  results: GradedResult[],
  meta: { date: string; model: string; promptSetHash: string }
): EvalReport {
  const withRule = summarize("with-rule", results);
  const baseline = summarize("baseline", results);
  return {
    ...meta,
    conditions: { "with-rule": withRule, baseline },
    lift: withRule.passRate - baseline.passRate,
    perPrompt: results,
  };
}
```

Note: `DetectorId` must be re-exported from `types.ts`. Add to `types.ts`: `export type { DetectorId } from "@byronwade/on-system-core";`.

- [ ] **Step 4: Run test (passes)** — PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/eval/src/aggregate.ts packages/eval/src/types.ts packages/eval/tests/aggregate.test.ts
git commit -m "feat(eval): aggregate graded results into per-condition summaries + lift"
```

---

## Task 6: Generation (injected Anthropic client)

**Files:**
- Create: `packages/eval/src/generate.ts`, `packages/eval/src/fixtures/fake-client.ts`, `packages/eval/src/fixtures/responses.ts`
- Test: covered by run-eval test (Task 7)

> Follow the `claude-api` skill for the SDK call + prompt caching.

- [ ] **Step 1: Write `packages/eval/src/generate.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk";
import type { Condition } from "./types.js";

export interface CompleteRequest { system: string; user: string; cacheSystem: boolean; }
export interface AnthropicClient { complete(req: CompleteRequest): Promise<string>; }

const BASELINE_SYSTEM =
  "You are an expert React + Tailwind CSS engineer. Build production-quality UI as a single self-contained .tsx component. Return the component in one ```tsx code block.";

/** Build the system prompt + cache flag for a condition. `ruleText` is the shipped rule. */
export function buildSystem(condition: Condition, ruleText: string): { system: string; cacheSystem: boolean } {
  if (condition === "with-rule") {
    return {
      system: `${ruleText}\n\n---\nBuild the requested UI as a single self-contained .tsx component, following the rules above. Return it in one \`\`\`tsx code block.`,
      cacheSystem: true,
    };
  }
  return { system: BASELINE_SYSTEM, cacheSystem: false };
}

/** Real Anthropic-backed client. Only used by the live CLI path. */
export function makeAnthropicClient(apiKey: string, model: string): AnthropicClient {
  const sdk = new Anthropic({ apiKey });
  return {
    async complete({ system, user, cacheSystem }) {
      const systemBlocks = [
        cacheSystem
          ? { type: "text" as const, text: system, cache_control: { type: "ephemeral" as const } }
          : { type: "text" as const, text: system },
      ];
      const msg = await sdk.messages.create({
        model,
        max_tokens: 4096,
        temperature: 0,
        system: systemBlocks,
        messages: [{ role: "user", content: user }],
      });
      return msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
    },
  };
}
```

- [ ] **Step 2: Write `packages/eval/src/fixtures/responses.ts`**

```ts
// Recorded-style responses for --dry-run + tests. Keyed by "<prompt>:<condition>".
// with-rule responses are on-system; baseline responses contain off-system code.
export const ON_SYSTEM = "```tsx\nexport function Demo() {\n  return <div className=\"bg-card text-foreground p-4 rounded-lg\"><span className=\"bg-brand text-primary-foreground\">ok</span></div>;\n}\n```";
export const OFF_SYSTEM = "```tsx\nexport function Demo() {\n  return <div style={{ color: \"#16a34a\" }} className=\"p-[13px]\"><button>go</button></div>;\n}\n```";
```

- [ ] **Step 3: Write `packages/eval/src/fixtures/fake-client.ts`**

```ts
import type { AnthropicClient } from "../generate.js";
import { ON_SYSTEM, OFF_SYSTEM } from "./responses.js";

/** Deterministic fake: with-rule (cacheSystem true) returns on-system code; baseline returns off-system. */
export function makeFakeClient(): AnthropicClient {
  return {
    async complete({ cacheSystem }) {
      return cacheSystem ? ON_SYSTEM : OFF_SYSTEM;
    },
  };
}
```

- [ ] **Step 4: Build to verify the SDK types compile** — `npm run typecheck --workspace @byronwade/eval`. Expected: clean. If `@anthropic-ai/sdk` type names differ (e.g. `TextBlock`), adjust the cast minimally and keep it tsc-clean.

- [ ] **Step 5: Commit**

```bash
git add packages/eval/src/generate.ts packages/eval/src/fixtures
git commit -m "feat(eval): injected Anthropic client + buildSystem + fixtures"
```

---

## Task 7: Run-eval orchestration

**Files:**
- Create: `packages/eval/src/run-eval.ts`
- Test: `packages/eval/tests/run-eval.test.ts`

- [ ] **Step 1: Write `packages/eval/tests/run-eval.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { runEval } from "../src/run-eval.js";
import { makeFakeClient } from "../src/fixtures/fake-client.js";
import type { Prompt } from "../src/types.js";

const prompts: Prompt[] = [
  { name: "a", text: "build a" },
  { name: "b", text: "build b" },
];

describe("runEval", () => {
  it("runs every prompt in both conditions and grades them", async () => {
    const report = await runEval(makeFakeClient(), prompts, "RULE TEXT", {
      date: "2026-06-03", model: "claude-sonnet-4-6", promptSetHash: "deadbeef0000",
    });
    expect(report.perPrompt).toHaveLength(4); // 2 prompts x 2 conditions
    // fake: with-rule is on-system (pass), baseline is off-system (fail)
    expect(report.conditions["with-rule"].passRate).toBe(1);
    expect(report.conditions.baseline.passRate).toBe(0);
    expect(report.lift).toBe(1);
  });
});
```

- [ ] **Step 2: Run test (fails)** — FAIL.

- [ ] **Step 3: Write `packages/eval/src/run-eval.ts`**

```ts
import type { AnthropicClient } from "./generate.js";
import { buildSystem } from "./generate.js";
import { extractCode } from "./extract-code.js";
import { gradeGeneration } from "./grade.js";
import { aggregate } from "./aggregate.js";
import type { Prompt, Condition, GradedResult, EvalReport } from "./types.js";

const CONDITIONS: Condition[] = ["with-rule", "baseline"];

export async function runEval(
  client: AnthropicClient,
  prompts: Prompt[],
  ruleText: string,
  meta: { date: string; model: string; promptSetHash: string }
): Promise<EvalReport> {
  const results: GradedResult[] = [];
  for (const prompt of prompts) {
    for (const condition of CONDITIONS) {
      const { system, cacheSystem } = buildSystem(condition, ruleText);
      const response = await client.complete({ system, user: prompt.text, cacheSystem });
      const graded = gradeGeneration(extractCode(response));
      results.push({ prompt: prompt.name, condition, ...graded });
    }
  }
  return aggregate(results, meta);
}
```

- [ ] **Step 4: Run test (passes)** — PASS (4 results, lift 1 with the fake).

- [ ] **Step 5: Commit**

```bash
git add packages/eval/src/run-eval.ts packages/eval/tests/run-eval.test.ts
git commit -m "feat(eval): runEval matrix (prompt x condition) -> graded report"
```

---

## Task 8: Report serialization

**Files:**
- Create: `packages/eval/src/report.ts`
- Test: `packages/eval/tests/report.test.ts`

- [ ] **Step 1: Write `packages/eval/tests/report.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { toJson, toMarkdown } from "../src/report.js";
import type { EvalReport } from "../src/types.js";

const report: EvalReport = {
  date: "2026-06-03", model: "claude-sonnet-4-6", promptSetHash: "deadbeef0000",
  conditions: {
    "with-rule": { condition: "with-rule", total: 2, passes: 2, passRate: 1, meanViolations: 0, byDetector: {} },
    baseline: { condition: "baseline", total: 2, passes: 0, passRate: 0, meanViolations: 3, byDetector: { "raw-color": 4 } },
  },
  lift: 1,
  perPrompt: [],
};

describe("report", () => {
  it("toJson round-trips", () => {
    expect(JSON.parse(toJson(report)).lift).toBe(1);
  });
  it("toMarkdown shows the headline lift as percentages", () => {
    const md = toMarkdown(report);
    expect(md).toContain("0% → 100%");
    expect(md).toContain("claude-sonnet-4-6");
  });
});
```

- [ ] **Step 2: Run test (fails)** — FAIL.

- [ ] **Step 3: Write `packages/eval/src/report.ts`**

```ts
import type { EvalReport } from "./types.js";

export function toJson(report: EvalReport): string {
  return JSON.stringify(report, null, 2) + "\n";
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function toMarkdown(report: EvalReport): string {
  const w = report.conditions["with-rule"];
  const b = report.conditions.baseline;
  const lines = [
    `# On-system eval — ${report.date}`,
    ``,
    `Model: \`${report.model}\` · prompts: \`${report.promptSetHash}\` · ${w.total} prompts × 2 conditions`,
    ``,
    `## Headline`,
    ``,
    `**First-try on-system (zero violations): ${pct(b.passRate)} → ${pct(w.passRate)}** with the byronwade/ui rule (+${pct(report.lift)}).`,
    ``,
    `| condition | pass rate | mean violations |`,
    `| --- | --- | --- |`,
    `| baseline | ${pct(b.passRate)} | ${b.meanViolations.toFixed(2)} |`,
    `| with-rule | ${pct(w.passRate)} | ${w.meanViolations.toFixed(2)} |`,
    ``,
    `> Single generation per cell at temperature 0; a dated snapshot, not a guaranteed-stable number.`,
  ];
  return lines.join("\n") + "\n";
}
```

- [ ] **Step 4: Run test (passes)** — PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/eval/src/report.ts packages/eval/tests/report.test.ts
git commit -m "feat(eval): json + markdown report serialization"
```

---

## Task 9: CLI + dry-run snapshot

**Files:**
- Create: `packages/eval/src/cli.ts`, `packages/eval/README.md`
- Create (via dry-run): `packages/eval/results/latest.json`, `packages/eval/results/latest.md`

- [ ] **Step 1: Write `packages/eval/src/cli.ts`**

```ts
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPrompts, hashPrompts } from "./prompts.js";
import { runEval } from "./run-eval.js";
import { toJson, toMarkdown } from "./report.js";
import { makeAnthropicClient } from "./generate.js";
import { makeFakeClient } from "./fixtures/fake-client.js";

const MODEL = "claude-sonnet-4-6";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const today = process.env.EVAL_DATE ?? new Date().toISOString().slice(0, 10);

  const prompts = loadPrompts();
  const ruleText = readFileSync(join(root, "..", "..", "registry", "rules", "byronwade-ui.mdc"), "utf8");

  let client;
  if (dryRun) {
    client = makeFakeClient();
  } else {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) { console.error("ANTHROPIC_API_KEY is required (or pass --dry-run)."); process.exit(1); return; }
    client = makeAnthropicClient(apiKey, MODEL);
  }

  console.log(`Running eval: ${prompts.length} prompts × 2 conditions${dryRun ? " (dry-run)" : ""}…`);
  const report = await runEval(client, prompts, ruleText, {
    date: today, model: MODEL, promptSetHash: hashPrompts(prompts),
  });

  const outDir = join(root, "results");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "latest.json"), toJson(report));
  writeFileSync(join(outDir, "latest.md"), toMarkdown(report));

  const w = report.conditions["with-rule"].passRate;
  const b = report.conditions.baseline.passRate;
  console.log(`on-system: baseline ${Math.round(b * 100)}% → with-rule ${Math.round(w * 100)}% (lift +${Math.round(report.lift * 100)}%)`);
  console.log(`wrote results/latest.json + latest.md`);
}

main();
```

Note on `new Date()`: the CLI is a top-level script (not library code), so a real date is fine here; `EVAL_DATE` allows overriding it for reproducible dry-runs.

- [ ] **Step 2: Generate the dry-run snapshot** — Run `npm run build --workspace @byronwade/eval` then `EVAL_DATE=2026-06-03 node packages/eval/dist/cli.js --dry-run`. Expected: prints `baseline 0% → with-rule 100%` (the fake) and writes `results/latest.json` + `latest.md`. (This committed snapshot is a placeholder until a real run replaces it.)

- [ ] **Step 3: Write `packages/eval/README.md`**

```md
# @byronwade/eval

Measures how on-system Claude's generated UI is **with** the byronwade/ui design rule
versus **without** it, graded by `@byronwade/on-system-core` (all five detectors strict —
zero violations = on-system).

## Run

```bash
# real run (spends API budget: ~24 claude-sonnet-4-6 calls, rule prompt-cached)
ANTHROPIC_API_KEY=sk-... npm run eval

# wiring smoke test, no API calls (uses recorded fixtures)
npm run eval -- --dry-run
```

Outputs `packages/eval/results/latest.json` (machine-readable, read by the homepage) and
`latest.md` (human summary). Single generation per cell at temperature 0 — a dated
snapshot, not a guaranteed-stable number.
```

- [ ] **Step 4: Commit**

```bash
git add packages/eval/src/cli.ts packages/eval/README.md packages/eval/results/latest.json packages/eval/results/latest.md
git commit -m "feat(eval): CLI + dry-run snapshot + README"
```

---

## Task 10: Wire package tests into CI

**Files:**
- Modify: `.github/workflows/registry.yml` (the `test:packages` step already runs `--workspaces`, so the eval tests run automatically — verify only)

- [ ] **Step 1: Verify eval tests run under the existing `test:packages`** — Run `npm run test:packages`. Expected: the eval package's tests appear and pass alongside core/eslint/cli. (`test:packages` is `npm run test --workspaces --if-present`, so no workflow edit is needed.)

- [ ] **Step 2: Full chain** — Run `npm run test:packages && npm run eval -- --dry-run`. Expected: all green; dry-run writes results. Commit nothing if no files changed.

---

## Self-review notes (for the executor)

- **Build the grader first.** `@byronwade/eval` imports the built `dist` of `@byronwade/on-system-core`. If eval tests fail to resolve it, run `npm run build --workspace @byronwade/on-system-core`. (vitest transpiles eval's own TS, but the dependency is consumed as built JS.)
- **No `Date.now()` in library code.** Only `cli.ts` reads the date (overridable via `EVAL_DATE`); everything else takes `date` as a parameter, keeping units deterministic and testable.
- **Tests never hit the network.** The `AnthropicClient` is injected; only `makeAnthropicClient` (used solely in `cli.ts`'s non-dry-run path) touches the SDK. Do not import the real client in any test.
- **The first committed `latest.json` is a dry-run placeholder** (baseline 0% → with-rule 100%, from the fixtures). It is NOT a real measurement. A real `npm run eval` (gated on the user's go-ahead) overwrites it with true numbers.
- **SDK type names:** if `@anthropic-ai/sdk@^0.40` differs on `TextBlock`/`cache_control` typing, adjust the minimal cast in `generate.ts` to stay tsc-clean; the call shape (system blocks + `cache_control: { type: "ephemeral" }`) is correct.
