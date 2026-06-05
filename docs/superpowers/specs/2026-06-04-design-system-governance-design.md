# Design-system governance — rules, agents, and structural gates

**Date:** 2026-06-04
**Status:** Approved design, pending user review of this spec
**Goal:** Keep the byronwade/ui registry clean, consistent, well-named, well-organized, and
on-philosophy — automatically — by layering convention tooling, two design-system-specific
subagents, written conventions, and editor rules on top of the gates that already exist.

## Why

The repo already enforces _content_ DNA strongly (tokens, typography, Base UI + CVA, registry
integrity, tests, coverage) via `registry/rules/byronwade-ui.mdc` and `scripts/check-*.mjs`. The
thinner layer is **code organization + consistency**:

- **No formatting enforcement at all** — no Prettier config or dependency; ESLint is bare Next
  defaults. Result: real drift. `registry/ui/button.tsx` is semicolon-less with bottom exports;
  `registry/components/status-pill.tsx` uses semicolons + inline export. ~41 no-semi / ~33 semi.
- **No codified structural rules** — filename casing, file location (ui vs composite), export
  style, `data-slot` presence are followed by convention but never checked.
- **No design-system-specific authoring/review agents** — generic `code-review`/`simplify` exist,
  but nothing scaffolds a component fully to-spec or audits a diff against the Design DNA.

## Non-goals

- **Do not reinvent Prettier/ESLint as a custom guard.** Formatting → Prettier. Lint → ESLint.
  Token/raw-color/hand-rolled → existing `lint:on-system` + `check-*.mjs`. The new custom guard
  checks _only_ structural invariants those tools can't express.
- **Do not duplicate existing gates.** `check-examples.mjs` (every component has an example),
  `check-test-coverage.mjs` (every component has a test + coverage), `check-rule.mjs` (every
  component named in the shipped rule) stay authoritative. The new guard references, never copies.
- **Do not enforce variants-in-`*-variants.ts`.** Only `button` extracts variants to a separate
  file; 13 other components keep `cva()` inline, and the Design DNA only requires "a `cva()`
  block." A separate-file rule would wrongly flag 13 files. Inline `cva()` stays valid.

## House conventions (the codified rules)

These are the rules the doc, the Cursor rule, and the structural guard all encode. They reflect the
plurality of the existing tree plus the canonical `button.tsx`.

1. **Filenames** — `kebab-case.tsx` / `kebab-case.ts`. One component family per file.
2. **Location** — UI primitives → `registry/ui/`; composites/patterns → `registry/components/`;
   shared helpers/hooks → `registry/lib/`.
3. **Exports** — named exports at the **file bottom** (`export { X }` / `export type { … }`).
   Plurality is 44-vs-12. No default exports for components.
4. **Formatting** — Prettier, **`semi: false`**, double quotes, trailing commas (Prettier default).
   Matches canonical `button.tsx`.
5. **Imports** — consumer paths only: `@/components/ui/…`, `@/components/…`, `@/lib/…`.
6. **`data-slot`** — every rendered root/part of a `registry:ui`/`registry:component` carries a
   `data-slot`. _(Ratchet — see below; 7 UI + 12 composites lack it today.)_
7. **`cn()` + `className` passthrough** — components accept and merge `className` via `cn()`.
8. **Comments — minimal / self-documenting.** Prefer clear names over comments. Comment only
   genuinely non-obvious logic or public-API intent (the `button.tsx` JSDoc-on-tricky-props style).
   No file-header boilerplate, no comments that restate the code.

## Architecture — what gets built (Phase A)

### A1. Formatting + lint layer

- Add `prettier` devDependency + `.prettierrc.json` (`{ "semi": false }`, defaults otherwise) +
  `.prettierignore` (generated/git-ignored paths: `.next`, `components/`, `lib/`,
  `app/foundation.generated.css`, `public/r/`, `coverage/`, content/registry generated indexes).
- `npm run format` (`prettier --write`) and `npm run check:format` (`prettier --check`).
- Extend `eslint.config.mjs` minimally for import hygiene if it composes cleanly with Next config;
  otherwise leave ESLint as-is and let Prettier own style. (Decide during implementation; no new
  rule that fights `eslint-config-next`.)

### A2. Structural guard — `scripts/check-conventions.mjs`

Mirrors the existing gate idiom exactly: `#!/usr/bin/env node` shebang, WHY-first header comment,
`errors[]` of `{ title, items, hint }`, `process.exit(1)`, `✓` success line, ESM + `node:fs`.

Checks (each independently toggleable between **fail** and **report-only**):

- **Filename casing** — every `registry/**/*.{ts,tsx}` is kebab-case. _(enforce — tree passes)_
- **Export style** — component files end with a named `export { … }` block; no `export default`.
  _(enforce or report after a quick full-tree scan; flip to enforce once green)_
- **Import paths** — no relative `../` crossing registry roots; consumer `@/` paths only.
  _(enforce — verify green first)_
- **`data-slot` presence** on `registry:ui`/`registry:component` roots. _(report-only ratchet)_

It reads `registry.json` for the authoritative ui/component lists (same source as `check-rule.mjs`),
so it never drifts from the manifest.

### A3. Wire into `validate` + CI

- `validate` gains `check:format` and `check:conventions` (enforce-mode checks only).
- `.github/workflows/registry.yml` already runs the validate chain — no workflow edit needed beyond
  confirming `npm ci` installs the new `prettier` dep.

### A4. Two subagents — `.claude/agents/`

Kept few and non-overlapping with existing `code-review`/`simplify`/superpowers.

- **`component-author.md`** — scaffolds a new component fully to-spec in one pass: source file in
  the right root, inline `cva()` if variant-bearing, `data-slot`, `cn()` passthrough, bottom named
  exports, no-semi; plus `registry.json` item, `content/examples/<slug>/default.tsx`,
  `tests/components/<slug>.test.tsx`, and the rule line in `byronwade-ui.mdc`. Ends by running
  `npm run validate` + `npm run test:ci`. Encodes the AGENTS.md "Adding a new component" checklist.
- **`design-dna-reviewer.md`** — read-only auditor. Given a diff or file set, checks token-only
  color (no hex/rgb/hsl/arbitrary), editorial typography (no `font-bold` on display/section,
  `font-mono` for data), Base UI + CVA + `data-slot`, `cn()` + `className` passthrough, a11y
  (labels/aria/focus-visible), and the house conventions above. Reports findings; makes no edits.

### A5. Written conventions + editor rule

- `docs/CONVENTIONS.md` — the house conventions above, in prose, as the human-facing source of
  truth. Linked from `AGENTS.md` (new short "Code conventions" section pointing to it, so the LLM
  contract and the doc stay one click apart).
- `.cursor/rules/byronwade-conventions.mdc` — `alwaysApply: true`, mirroring the conventions so
  Cursor/other AI editors follow the same rules as Claude Code. Distinct from the _shipped_
  `byronwade-ui.mdc` (which is consumer-facing DNA); this one is repo-internal authoring hygiene.

## Phase B — Audit → report (gated)

After A is green, run `check:conventions` in full-report mode + a `design-dna-reviewer` sweep across
all ~90 components. Produce `docs/superpowers/specs/2026-06-04-governance-audit-report.md`: a
prioritized violations list (data-slot gaps, any stragglers on naming/exports/formatting,
DNA/token violations the on-system lint surfaces). **No code changes.** User reviews before Phase C.

## Phase C — Fix to conformance (gated on B, separate plan)

Bring existing components into conformance in **reviewed batches**:

- Run in a **git worktree** (a concurrent session edits this branch live — memory-noted hazard).
- `prettier --write` the whole tree as batch 0 (mechanical, low-risk), then structural fixes
  (add `data-slot`, normalize exports) in small batches.
- Run `npm run test:ci` **per batch** — coverage gate is strict (functions 100%, statements/lines
  99%); structural edits can break tests or drop coverage.
- When a ratcheted check (`data-slot`) reaches zero violations, flip it from report-only to enforce.

## Testing strategy

- New `scripts/check-conventions.mjs` is a node script in the `check-*` family; validated by running
  it against the live tree (must exit 0 in enforce mode before wiring into `validate`).
- `check:format` validated by `prettier --check` exiting 0 after a format pass.
- Subagents validated by a smoke run: `component-author` scaffolds a throwaway component and
  `npm run validate && npm run test:ci` passes; `design-dna-reviewer` flags a deliberately
  off-system snippet. (Throwaway artifacts removed after.)
- No component runtime behavior changes in Phase A, so the existing vitest suite must stay green
  throughout (`npm run test:run`).

## Risks & mitigations

- **Coverage gate brittleness (Phase C)** → per-batch `test:ci`, never end-of-run.
- **Concurrent session on branch** → Phase C in a worktree; Phase A commits only its own new files,
  never the unrelated `public/thumbs/*` + `gen-thumbs.mjs` changes already in the working tree.
- **Prettier reformatting generated files** → `.prettierignore` covers all generated/git-ignored
  output before the first `--write`.
- **Gate failing CI on day one** → ratchet model: only checks the tree already passes run in enforce
  mode; the rest are report-only until Phase C makes them green.
