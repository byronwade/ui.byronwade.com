# Component Docs Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build scannable component reference pages that show features, examples, installation, API, source paths, and related components.

**Architecture:** Extend `ComponentDoc` metadata with optional reference fields, add small pure helpers for fallback features and source rows, and update the existing docs route to render optional sections. Keep the current examples and variant browser flow intact.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library, existing byronwade/ui docs components.

---

### Task 1: Metadata Helpers

**Files:**
- Modify: `content/components.ts`
- Test: `tests/content/component-docs-reference.test.ts`

- [ ] Add `FeatureRow`, `ExportRow`, `SlotRow`, `CssVarRow`, and `SourceRow` types.
- [ ] Extend `ComponentDoc` with optional `features`, `exports`, `slots`, `cssVars`, `source`, and `related`.
- [ ] Add pure helpers:
  - `getComponentFeatures(doc)`
  - `getComponentSourceRows(doc)`
  - `resolveRelatedComponents(doc)`
- [ ] Write failing tests for authored features, fallback features, fallback source rows, and related slug resolution.
- [ ] Run `npm run test:run -- tests/content/component-docs-reference.test.ts`.
- [ ] Implement the helpers until tests pass.

### Task 2: Component Page Sections

**Files:**
- Modify: `app/(docs)/docs/[slug]/page.tsx`
- Test: `tests/app/component-docs-reference.test.tsx`

- [ ] Extract small local render helpers for section labels, feature list, API tables, source rows, and related links.
- [ ] Render `Features` only when `getComponentFeatures(doc)` returns rows.
- [ ] Render the current examples/variants section unchanged except for the section label.
- [ ] Expand `API` to include props, exports, slots, CSS variables, and dependencies when present.
- [ ] Render `Source and related` when source rows or related components exist.
- [ ] Write tests using mock docs that prove optional sections render and empty sections are omitted.
- [ ] Run `npm run test:run -- tests/app/component-docs-reference.test.tsx`.

### Task 3: Representative Metadata Batch

**Files:**
- Modify: `content/components.ts`

- [ ] Populate reference metadata for `button`, `input`, `dialog`, `table`, and `morph-dock`.
- [ ] Keep descriptions concise and practical.
- [ ] Use existing component slugs for `related`.
- [ ] Run `npm run test:run -- tests/content/component-docs-reference.test.ts tests/content/variants.test.ts`.

### Task 4: Verification

**Files:**
- No new files.

- [ ] Run `npm run test:run -- tests/content/component-docs-reference.test.ts tests/app/component-docs-reference.test.tsx tests/app/variant-browser.test.tsx`.
- [ ] Run `npm run validate` if the implementation changes registry rule coverage or generated metadata.
- [ ] Start the dev server and inspect `/docs/button` in the browser.
- [ ] Commit the implementation changes.
