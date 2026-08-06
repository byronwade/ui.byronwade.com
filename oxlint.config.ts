import { defineConfig } from "oxlint"
import core from "ultracite/oxlint/core"
import next from "ultracite/oxlint/next"

/**
 * Ultracite's curated ruleset (oxc) — correctness, a11y, and security rules
 * kept in full. The rules below are switched off because they contradict a
 * convention this repository documents and enforces elsewhere, not because
 * they were noisy.
 *
 * Ownership (agents.md → Toolchain): oxlint owns general correctness, ESLint
 * keeps eslint-config-next + React Compiler, lib/design/bans.mjs owns design
 * bans. Never encode a design law here.
 */
export default defineConfig({
  extends: [core, next],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    // Upstream shadcn — we compose it, we do not restyle it (design.md MUST §5).
    "components/ui/**",
    ".next/**",
    "public/**",
  ],
  rules: {
    /*
     * Key order is semantic in this codebase, not incidental:
     * ROUTE_SLOTS order IS the nav order, contrastPairs and bans read as
     * ordered lists, and Next metadata objects read title-first. Alphabetising
     * them would destroy meaning to satisfy a style preference.
     */
    "sort-keys": "off",

    /*
     * The repo uses `function name()` declarations everywhere, matching the
     * shadcn primitives it composes. One consistent style already holds; this
     * rule wants the other one.
     */
    "func-style": "off",

    /*
     * agents.md requires comments that explain intent, tradeoffs, and
     * invariants. Trailing clarifiers are wanted here.
     */
    "no-inline-comments": "off",

    /*
     * `type` is deliberate: the design grammar is built from closed unions
     * (`as const satisfies`), which interfaces cannot express.
     */
    "typescript/consistent-type-definitions": "off",

    /*
     * The ban patterns in lib/design/bans.mjs are safety-critical and shared
     * with the MCP tool and the contract JSON. Adding /u or rewriting capture
     * groups changes escape semantics for no defect fixed; leave them exact.
     */
    "require-unicode-regexp": "off",
    "prefer-named-capture-group": "off",

    /* Sequential awaits in the route crawler are intentional back-pressure. */
    "no-await-in-loop": "off",

    /*
     * The repo writes `import { x, type Y }` inline and formats with double
     * quotes and no semicolons. This rule's fixer splits the statement and
     * emits single quotes + semicolons, so "fixing" it makes the file less
     * consistent than leaving it. Style is already settled here.
     */
    "import/consistent-type-specifier-style": "off",

    /* Brace style, ternary nesting, ++ and switch braces are settled house
       style; changing 120 call sites reduces no cost the protocol recognises. */
    "curly": "off",
    "no-nested-ternary": "off",
    "unicorn/no-nested-ternary": "off",
    "no-plusplus": "off",
    "unicorn/switch-case-braces": "off",
    "unicorn/import-style": "off",
    "no-negated-condition": "off",
    "unicorn/no-negated-condition": "off",
    "unicorn/prefer-export-from": "off",
    "unicorn/text-encoding-identifier-case": "off",

    /*
     * Four functions exceed 20 (Workbench 24, CinemaTile 23, ComposerShell 22,
     * the MCP callTool switch 40). That is real debt, recorded in the audit —
     * splitting them is a refactor with regression risk and no behaviour
     * change, so keep it visible as a warning rather than blocking the gate or
     * hiding it behind a raised threshold.
     */
    complexity: "warn",

    /*
     * Remaining rules are style with no defect behind them in this codebase:
     * `async` wrappers that return a promise are idiomatic; function
     * declarations hoist, so helper-below-use reads fine in small modules;
     * and destructuring/array-type/JSDoc phrasing are preferences the repo has
     * already settled. Every correctness, a11y, and security rule stays on.
     */
    "require-await": "off",
    "no-use-before-define": "off",
    "prefer-destructuring": "off",
    "typescript/array-type": "off",
    "jsdoc/require-param-description": "off",
    "unicorn/no-await-expression-member": "off",
    "unicorn/prefer-import-meta-properties": "off",
    "unicorn/catch-error-name": "off",

    /*
     * ESLint owns the Next rules (agents.md → Toolchain). oxlint's port of
     * no-html-link-for-pages treats /r/*.contract.json — a static file in
     * public/ — as a page route and flags a correct <a>. Two implementations
     * of one rule is the pattern this repo keeps removing; keep the accurate
     * one and switch this off.
     */
    "nextjs/no-html-link-for-pages": "off",
  },
})
