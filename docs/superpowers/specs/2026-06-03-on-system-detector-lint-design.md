# On-system detector core + consumer lint — design

**Date:** 2026-06-03
**Status:** Approved (design); pending implementation plan
**Subsystem:** 1 of 5 in the agent-native design-system epic
**Branch:** `feat/on-system-tooling`

## Purpose

Make "is this UI on-system?" a function anyone — a human's editor, a CI pipeline, or
an AI eval — can call and trust. This is the foundational subsystem of the epic: the
same detector that powers the consumer lint becomes the grader for the eval harness
(subsystem 2). It turns the byronwade/ui design DNA (tokens only, compose from
primitives, reuse house utilities) from prose guidance into an enforced guarantee.

## Success criteria

1. `detect(code, opts)` returns a precise list of on-system violations for any
   `.tsx`/`.ts` source string, with absolute character ranges and on-system
   replacement suggestions.
2. Consumers can run it two ways: an ESLint flat-config plugin (in-editor + CI) and a
   `byronwade-lint` CLI (one-shot scans, `--fix`).
3. The registry app dogfoods it: `registry/` and `app/` pass the lint in CI.
4. The detector's knowledge of tokens/utilities/components is derived from
   `registry.json` — it can never disagree with the registry.
5. Test suites prove on-system samples produce zero violations, off-system samples
   produce exactly the expected violations, and autofix output is itself on-system.

## Architecture & repo layout

Convert the repo to **npm workspaces**. The Next app stays at the repo root (least
disruption — no path/config/CI churn); new publishable packages live under
`packages/*`. Root `package.json` gains `"workspaces": ["packages/*"]` and acts as
both the app and the workspace host.

```
byronwade-ui/
  app/  registry/  scripts/  ...      ← existing Next app + registry (unchanged location)
  packages/
    on-system-core/                   ← @byronwade/on-system-core
    eslint-plugin-ui/                 ← @byronwade/eslint-plugin-ui
    lint-cli/                         ← @byronwade/lint  (bin: byronwade-lint)
```

Later epic subsystems add `packages/eval/` and `packages/mcp/` as further workspaces;
this layout is chosen to absorb them.

### Package responsibilities

| Package | Depends on | Public surface | One-line purpose |
|---------|-----------|----------------|------------------|
| `@byronwade/on-system-core` | (none — pure) | `detect(code, opts) → Violation[]`, `loadManifest()` | Framework-agnostic detection logic + OKLCH nearest-token mapping |
| `@byronwade/eslint-plugin-ui` | on-system-core | flat-config plugin, `recommended` preset | ESLint adapter: violation → `context.report()` + `fix` |
| `@byronwade/lint` | on-system-core | `byronwade-lint [globs] [--fix]` | CLI adapter + the surface the eval harness calls |

Rationale for the split: detection logic lives in exactly one place. The ESLint plugin
and CLI are thin adapters (< ~100 LOC each) over the same `detect()`. The eval grader
in subsystem 2 imports `on-system-core` directly, never re-implementing detection.

## The single source of truth: a generated manifest

`registry.json` already owns every token (foundation `cssVars.theme`, with light/dark
OKLCH values), every house utility (foundation `css["@layer utilities"]`), and every
component name (registry items). A build step compiles these into
`packages/on-system-core/src/manifest.generated.ts`:

```ts
export const MANIFEST = {
  tokens: { brand: { light: "oklch(0.6 0.17 148)", dark: "oklch(0.7 0.17 148)" }, /* … */ },
  utilities: ["bg-grid", "bg-grid-lines", "glow-brand", "text-gradient",
              "text-gradient-brand", "mask-fade-x", "full-bleed", "edge", "scrollbar-thin"],
  components: ["button", "input", "select", /* … all registry:ui/component names */],
  nativeToComponent: { button: "Button", input: "Input", select: "Select",
                       textarea: "Textarea", /* … */ },
};
```

- Generator: `scripts/gen-lint-manifest.mjs`, run in `prebuild` and a new
  `npm run gen:lint-manifest`. `manifest.generated.ts` is git-ignored and rebuilt,
  consistent with the repo's other generated artifacts.
- A `check:manifest` gate asserts `manifest.generated.ts` is in sync with
  `registry.json` (same philosophy as `check:rule`), wired into `validate` + CI.
- The `nativeToComponent` map is the one hand-curated piece (which native element maps
  to which primitive). It lives in `scripts/gen-lint-manifest.mjs` as an explicit table
  and is validated against real registry component names by `check:manifest`.
- **Semantic palettes are valid but never autofix targets.** Per the Design DNA, the
  agent-activity pastels (`activity-thinking/search/read/edit`) and the `chart-1…5` ramp
  carry meaning. They are kept in the validity set (so `bg-activity-search` / `bg-chart-2`
  are never flagged) but **excluded from the nearest-token candidate set**, so an
  arbitrary raw color is never snapped onto a meaning-bearing token (e.g. a green hex
  must map to `brand`, not the brand-adjacent `activity-search`).

## The five detectors

All run inside `detect()`. Source is parsed once with a TS+JSX-capable parser
(`@typescript-eslint/parser` via its `parseForESLint`, so offsets line up with what the
ESLint plugin would produce). Each detector walks the AST / scans the relevant nodes.

| # | Detector | What it flags | Default severity |
|---|----------|---------------|------------------|
| 1 | **Raw color** | hex (`#16a34a`), `rgb()/rgba()/hsl()/hsla()`, named CSS colors — inside `className` arbitrary values (`text-[#333]`), `style={{…}}` objects, and string literals assigned to style | error |
| 2 | **Arbitrary values** | Tailwind arbitrary values off the token/radius scale: `bg-[…]`, `text-[…]`, `p-[13px]`, `m-[…]`, `rounded-[10px]`, `gap-[…]` | error |
| 3 | **Hand-rolled gradient/grid/glow** | `bg-gradient-*` / inline `linear-gradient`/`radial-gradient` / repeating grid backgrounds, when a house utility (`glow-brand`, `text-gradient-brand`, `bg-grid`) covers it | error |
| 4 | **Off-system components** | JSX raw `<button>`/`<input>`/`<select>`/`<textarea>`/… present in `nativeToComponent` | warn (configurable) |
| 5 | **Typography (weight-hierarchy)** | a bold-family weight (`font-semibold`/`bold`/`extrabold`/`black`, or arbitrary `font-[≥600]`) on a native `<h1>`–`<h6>`; autofix → `font-medium` | error |

Scoping notes:
- Detector 1 must NOT flag arbitrary values that reference tokens (`bg-[var(--brand)]`)
  as "raw color" — those are handled by detector 2's autofix (→ `bg-brand`).
- Detector 4 is heuristic; it only fires on the curated native-element set and is
  `warn` so it never blocks a consumer's build by default. A consumer can raise it to
  `error` in their config.
- `className` parsing handles string literals, template literals, and `cn(...)`/`clsx`
  string arguments. Dynamic expressions that can't be statically read are skipped (no
  false positives on computed classes).

### Violation shape

```ts
interface Violation {
  detector: "raw-color" | "arbitrary-value" | "hand-rolled" | "off-system-component";
  range: [start: number, end: number];   // absolute char offsets in source
  message: string;                         // includes the on-system suggestion
  fix?: { range: [number, number]; text: string };  // present when autofixable
  severity: "error" | "warn";
}
```

## Autofix (aggressive nearest-token, with a safety net)

Per decision, autofix is aggressive: it maps a raw color to the **nearest token by
OKLCH ΔE** and applies it under `--fix`.

- **Mechanical 1:1 cases always autofix**: `bg-[var(--brand)]→bg-brand`,
  `rounded-[0.75rem]→rounded-lg` (when the value equals `--radius`), exact-value token
  matches.
- **Nearest-token mapping**: for an off-system color, compute ΔE (OKLCH Euclidean is
  acceptable for v1) against every theme token and pick the minimum.
- **Safety net (the guardrail on "aggressive")**: if the minimum ΔE exceeds a
  configurable `maxColorDistance` threshold, the violation falls back to a *suggestion*
  (no fix applied) rather than silently shifting the consumer's color to a wrong token.
  Default threshold is permissive (aggressive) but non-infinite.
- Autofix only applies under ESLint `--fix` / CLI `--fix`; without it, violations
  report with the suggested replacement in the message.
- The utility/spacing prefix is preserved when swapping the color token
  (`text-[#16a34a]` → `text-brand`, not `bg-brand`).

## Consumer surfaces

### ESLint plugin (`@byronwade/eslint-plugin-ui`)
- Flat-config export with a `recommended` config enabling detectors 1–3 as error, 4 as
  warn.
- Single rule (e.g. `byronwade-ui/on-system`) whose `create()` reads
  `context.sourceCode.getText()`, calls `detect()`, and for each violation calls
  `context.report({ loc/range, message, fix })`, applying `fixer.replaceTextRange`.
- Rule options: `{ maxColorDistance, offSystemComponents: "warn"|"error"|"off" }`.

### CLI (`@byronwade/lint`, bin `byronwade-lint`)
- `byronwade-lint "src/**/*.{ts,tsx}" [--fix] [--max-color-distance N]`.
- Globs files, runs `detect()` per file, prints a grouped report (file → violations
  with code frames), exits non-zero if any error-severity violation remains.
- `--fix` rewrites files in place using the violation fixes (applied right-to-left to
  keep offsets valid).
- This CLI is the surface subsystem 2's eval harness invokes (or it imports
  `on-system-core` directly — both are supported).

## Testing & gates (matches repo culture)

- **vitest fixture suites** in each package:
  - `on-system/*.tsx` corpus → `detect()` returns `[]`.
  - `off-system/*.tsx` corpus → `detect()` returns exactly the expected violations
    (snapshot of detector + range + suggestion).
  - **Round-trip**: applying autofix to each off-system fixture yields code that itself
    passes `detect()` with zero errors.
  - Per-detector unit tests for edge cases (template literals, `cn()` args, dynamic
    classNames skipped, `var(--token)` not flagged as raw color, ΔE threshold fallback).
- **Dogfood gate**: a new `npm run lint:on-system` runs `byronwade-lint` over
  `registry/` + `app/`; wired into CI. If our own components drift off-system, the
  build fails. (Expectation: the codebase already follows the DNA, so this should pass
  on day one; any failures it surfaces are real and get fixed as part of the work.)
- **`check:manifest` gate**: `manifest.generated.ts` matches `registry.json`; every
  `nativeToComponent` target is a real registry component.
- Coverage thresholds for the new packages consistent with the repo's existing ratchet
  (statements ≥ 99%, branches ≥ 96%, functions 100%, lines ≥ 99%).

## Out of scope (v1, YAGNI)

- No editor extension beyond standard ESLint integration.
- No suggesting *which composite* to use — detector 4 maps native→primitive only.
- No scanning of standalone `.css` files (only inline styles + className); foundation
  CSS is generated and trusted.
- No config presets beyond `recommended`.
- No nearest-token mapping for non-color arbitrary values (spacing/radius use exact /
  scale matching, not "nearest"); only color uses ΔE.
- **Typography detector (5) enforces only the negative rule** — a bold-family weight on a
  native `<h1>`–`<h6>`. The positive guidance (`font-mono` for data, `font-serif` for
  prose) needs semantic intent and is not lintable; **heading components** (e.g. a
  `<PageHeader>`/`<Heading>` wrapper) are also out of v1 — only native heading elements
  are checked. Both are future work.

## Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Workspaces restructure breaks existing app build/CI | App stays at root; only additive `workspaces` field + new `packages/*`. Verify `npm run build` + existing CI green before/after. |
| Aggressive autofix shifts a consumer's intended color | `maxColorDistance` safety net falls back to suggestion; autofix only under explicit `--fix`. |
| className parsing false positives on dynamic classes | Statically-unreadable expressions are skipped, never flagged. |
| Detector logic duplicated between ESLint + CLI | Both are thin adapters over a single `detect()` in `on-system-core`. |
| Manifest drift from registry | Generated from `registry.json`; `check:manifest` gate in CI. |

## Build order within this subsystem

1. Workspaces scaffold (`packages/*`, root `workspaces`, verify app build unaffected).
2. Manifest generator + `check:manifest` gate.
3. `on-system-core`: parser + the five detectors + violation shape (TDD against fixtures).
4. Autofix (mechanical + OKLCH nearest-token + threshold) (TDD round-trip).
5. `eslint-plugin-ui` adapter + `recommended` preset + tests.
6. `lint-cli` + tests.
7. Dogfood gate over `registry/` + `app/`; wire all gates into `validate` + CI.
8. Docs: consumer install/usage in the docs site.
