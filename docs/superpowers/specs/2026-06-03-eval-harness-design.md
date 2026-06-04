# Eval harness + published pass-rate — design

**Date:** 2026-06-03
**Status:** Approved (design); pending implementation plan
**Subsystem:** 2 of 5 in the agent-native design-system epic
**Branch:** `feat/on-system-eval`
**Depends on:** `@byronwade/on-system-core` (subsystem 1, on `main`) — reused as the grader.

## Purpose

Turn the epic's thesis into a number. The eval measures how on-system Claude's
generated UI is **with** the shipped design rule versus **without** it, producing a
defensible headline ("the rule takes Claude from X% to Y% on-system, first try") that
the homepage and docs can cite. It reuses the subsystem-1 detector as the grader, so
the metric is exactly the same definition of "on-system" the lint enforces.

## Success criteria

1. `npm run eval` (with `ANTHROPIC_API_KEY`) runs the full matrix and writes a committed
   results snapshot + human-readable summary.
2. The harness logic is fully unit-tested with **zero real API calls** (fixture
   responses, injected client) and is deterministic in tests.
3. Results report, per condition: the % of generations that are fully on-system (zero
   violations), the mean violations/generation, and a per-detector breakdown — plus the
   with-rule-vs-baseline lift.
4. Re-running produces a comparable snapshot (same prompts, same grader, same model).

## Decisions (locked during brainstorming)

- **Run model:** manual local script (`npm run eval`); results JSON committed. No
  automatic/CI spend.
- **Conditions:** two per prompt — **with-rule** (system = shipped rule) and **baseline**
  (neutral system prompt). The headline is the lift between them.
- **Model:** `claude-sonnet-4-6`, `temperature: 0`.
- **Grading:** all five detectors at error severity; a generation **passes only with zero
  violations**.

## Architecture & layout

New workspace package `@byronwade/eval` under `packages/eval/`. Pure Node/TS (ESM),
reusing `@byronwade/on-system-core`'s `detect()`. The Anthropic client is injected so
tests never hit the network.

```
packages/eval/
  package.json  tsconfig.json  vitest.config.ts
  prompts/                      ← ~12 committed *.md build prompts
  results/                      ← latest.json + latest.md (committed snapshots)
  src/
    types.ts                   ← Prompt, Generation, GradedResult, EvalReport
    prompts.ts                 ← load prompts/*.md
    extract-code.ts            ← pull the ```tsx block out of a model response
    generate.ts                ← AnthropicClient interface + real impl + generate(prompt, condition)
    grade.ts                   ← run detect() over a generation, all 5 detectors at error
    run-eval.ts                ← orchestrate matrix → GradedResult[] → aggregate → EvalReport
    report.ts                  ← EvalReport → latest.json + latest.md
    cli.ts                     ← npm run eval entry (flags: --dry-run, --out)
    fixtures/                  ← recorded responses for --dry-run + tests
  tests/
    extract-code.test.ts  grade.test.ts  aggregate.test.ts  report.test.ts
```

### Unit responsibilities

| Unit | Purpose | Depends on |
|------|---------|-----------|
| `prompts.ts` | Load + hash the committed prompt set | fs |
| `extract-code.ts` | Extract the first ```tsx/```jsx fenced block; null if none | (pure) |
| `generate.ts` | `AnthropicClient` interface + real SDK impl; `generate()` returns raw text | @anthropic-ai/sdk (injected) |
| `grade.ts` | `detect()` a generation → violations; pass = zero | @byronwade/on-system-core |
| `run-eval.ts` | Matrix (prompt × condition), collect `GradedResult[]`, aggregate to `EvalReport` | the above |
| `report.ts` | Serialize `EvalReport` → json + markdown | (pure) |
| `cli.ts` | Parse flags, wire real client (or fixtures for `--dry-run`), write outputs | all |

## Prompt set

~12 plain-English "build this UI" requests in `prompts/*.md`, e.g.: sign-in form,
pricing table, settings page, dashboard stat row, top nav bar, empty state, data table,
profile header, notification list, modal dialog, filter bar, card grid. Each is a
neutral build request with **no hints** about tokens/components — so the rule's presence
is the only difference between conditions. Committed and hashed (the hash goes in the
report so a changed prompt set is visible).

## Conditions, model, generation

- **with-rule:** system prompt = the contents of `registry/rules/byronwade-ui.mdc`
  (the shipped `@byronwade/design-rules`) + a short framing line ("Build the requested UI
  as a single `.tsx` component."). The rule block is sent with `cache_control` so it's
  cached across all with-rule calls in the run.
- **baseline:** system prompt = a neutral "You are an expert React + Tailwind engineer;
  build production-quality UI as a single `.tsx` component." — no rule.
- Both: `model: claude-sonnet-4-6`, `temperature: 0`, the prompt's text as the user
  message. The response text is passed to `extract-code.ts`.
- Matrix size: 12 prompts × 2 conditions × 1 generation = 24 calls/run.

## Grading

`grade.ts` runs `detect(code, { offSystemComponents: "error" })` (all five detectors,
all error severity) over each extracted generation.
- **Pass** = zero violations.
- A generation whose response has **no extractable code block** (or code that throws on
  parse) is a **fail** with `reason: "no-code" | "parse-error"` (counts against the
  condition, recorded for transparency).
- Per generation we keep: pass boolean, violation count, per-detector counts, reason.

### Aggregation / metrics
Per condition (with-rule, baseline):
- `passRate` = passes / total (the headline per condition).
- `meanViolations` = mean violations across generations.
- `byDetector` = total violations per detector.
The report also computes `lift = withRule.passRate - baseline.passRate` and the
per-detector reduction.

## Output

`run-eval.ts` returns an `EvalReport`; `report.ts` writes:
- `results/latest.json` — `{ date, model, promptSetHash, conditions: { withRule, baseline }, lift, perPrompt: [...] }`. Committed; the homepage/docs (subsystems 4–5) read this.
- `results/latest.md` — a human summary table (per-prompt pass/fail per condition + the headline lift).

The date/model/hash make each snapshot self-describing. (API is non-deterministic even at
temp 0; the report is a dated snapshot, not a guaranteed-stable number — noted in the md.)

## Running it

- `npm run eval` — needs `ANTHROPIC_API_KEY` in the env; runs the real matrix and writes
  `results/`.
- `npm run eval -- --dry-run` — uses recorded `src/fixtures/*` responses instead of the
  API (for wiring/CI smoke without spend).
- Cost: ~24 Sonnet calls/run with the rule cached — a few cents to low single digits.

## Testing

All harness logic is unit-tested with **no network**:
- `extract-code`: fenced-block extraction (tsx/jsx/no-fence/multiple blocks → first).
- `grade`: a clean generation → pass; a generation with a raw hex / native `<button>` /
  `font-bold` heading → fail with the right per-detector counts; no-code → fail reason.
- `aggregate`: from a hand-built `GradedResult[]`, passRate/meanViolations/byDetector/lift
  math is exact.
- `report`: `EvalReport` → json/md serialization shape.
The `AnthropicClient` is an interface; tests and `--dry-run` pass a fake returning fixture
text. The real SDK impl is a thin adapter, exercised only in a live `npm run eval`.

## Out of scope (v1)

- No repeated sampling / confidence intervals (single generation per cell; variance noted
  in the report). A `--samples N` flag is a clean future extension.
- No automatic CI run (manual only).
- No UI — the homepage/docs that surface the number are subsystems 4–5.
- No multi-model matrix (Sonnet only).
- No grading of whether the generation is *functional*/renders — only whether it is
  on-system (static analysis), which is what the thesis claims.

## Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Model wraps code in prose / multiple blocks | `extract-code` takes the first fenced tsx/jsx block; no block → recorded fail, not a crash |
| API non-determinism makes the number wobble | temp 0 + dated snapshot + note in md; `--samples` as future work |
| Tests accidentally hit the network / cost money | `AnthropicClient` injected; tests use fixtures only; real client only in `cli.ts` live path |
| Generated code references components that don't resolve | `detect()` is static (text/AST), needs no installs — unaffected |
| Grader drift vs the lint | Same `@byronwade/on-system-core` package; metric == lint definition by construction |

## Build order (for the plan)

1. Package scaffold (`packages/eval`, workspace, tsconfig, vitest) + `@anthropic-ai/sdk` dep.
2. `types.ts` + `extract-code.ts` (+ tests).
3. `grade.ts` over `on-system-core` (+ tests).
4. `prompts.ts` + the 12 committed prompts + hashing.
5. `generate.ts` — `AnthropicClient` interface, fake for tests, real SDK adapter w/ caching.
6. `run-eval.ts` matrix + aggregation (+ tests on aggregation with fixtures).
7. `report.ts` json+md (+ tests) + `results/` snapshot via `--dry-run`.
8. `cli.ts` + `npm run eval` script; document `ANTHROPIC_API_KEY` + cost in the eval README.
9. (Optional, gated on your go-ahead) a real live run to produce the first committed `latest.json`.
