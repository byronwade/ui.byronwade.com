#!/usr/bin/env node
// check-rule.mjs
// Keeps the shipped, AI-facing contract in sync with what actually exists.
// The published artifacts (the AI rule, README, docs site) tell people and their
// AI agents what to compose with and what to `npx shadcn add @byronwade/<name>`.
// If those drift from the registry/foundation, agents 404 on installs, re-implement
// house utilities, or never reach for a component — silently, until this gate fails.
//
// Source of truth = registry.json (manifest + foundation item). No generated /
// git-ignored files are read, so this runs in CI before `sync`.
//
// Invariants:
//   1. Component coverage — every registry:ui / registry:component is named in
//      the canonical rule (registry/rules/byronwade-ui.mdc).
//   2. No ghost installs  — every `@byronwade/<name>` ref across the docs surfaces
//      resolves to a real registry item.
//   3. Utility coverage   — every house utility foundation defines is documented
//      in the rule (so agents reuse it instead of re-rolling gradients/grids/glows).
//   4. Accent DNA intact  — the tokens the "one --brand variable re-skins
//      everything" promise derives from all exist in the foundation theme.
//
// Usage: node scripts/check-rule.mjs

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

/** First class only — `.reading-prose p + p` documents as `reading-prose`. */
function utilityBase(sel) {
  return sel.replace(/^\./, "").trim().split(/\s+/)[0]
}

const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))
const rule = readFileSync(join(root, "registry/rules/byronwade-ui.mdc"), "utf8")

const allNames = new Set(registry.items.map((item) => item.name))
const foundation = registry.items.find((item) => item.name === "foundation")

// Components consumers compose with — these MUST be discoverable from the rule.
const componentTypes = new Set(["registry:ui", "registry:component"])
const componentNames = registry.items
  .filter((item) => componentTypes.has(item.type))
  .map((item) => item.name)

// `@byronwade/ui` is the design-system namespace itself (used in prose), and the
// entries below are published npm workspace packages (under packages/*), not
// shadcn registry items — consumers install them with npm, so they're legitimate
// `@byronwade/*` references in docs, never ghosts.
const NAMESPACE_ALLOW = new Set([
  "ui",
  "eslint-plugin-ui",
  "on-system-core",
  "lint",
  "mcp",
])

const errors = []

// ---- 1. Component coverage -------------------------------------------------
// Covered if it appears as `name` (backtick token) or as a boundary-terminated
// @byronwade/name ref. Boundaries stop a name matching as a prefix of another
// (e.g. `toggle` inside `@byronwade/toggle-group`, `card` inside `stat-card`).
const mentions = (name) =>
  rule.includes("`" + name + "`") ||
  new RegExp("@byronwade/" + name + "(?![a-z0-9-])").test(rule)
const uncoveredComponents = componentNames.filter((name) => !mentions(name))
if (uncoveredComponents.length) {
  errors.push({
    title: "Components missing from the shipped rule",
    items: uncoveredComponents,
    hint: "Add each to registry/rules/byronwade-ui.mdc (section 1) so agents compose with it.",
  })
}

// ---- 2. No ghost installs --------------------------------------------------
// Walk every doc surface that can carry an @byronwade/<name> install reference.
// The `<name>` placeholder can't match [a-z0-9-]+ (the `<` stops it), so it's skipped.
const DOC_ROOTS = ["app", "content", "registry/rules", "README.md", "AGENTS.md"]
const TEXT_EXT = /\.(tsx?|mdx?|mdc)$/

function walk(absPath) {
  const out = []
  if (statSync(absPath).isFile()) {
    if (TEXT_EXT.test(absPath)) out.push(absPath)
    return out
  }
  for (const entry of readdirSync(absPath)) {
    if (entry === "node_modules") continue
    out.push(...walk(join(absPath, entry)))
  }
  return out
}

const ghosts = []
const ghostSeen = new Set()
for (const relRoot of DOC_ROOTS) {
  const abs = join(root, relRoot)
  if (!existsSync(abs)) continue
  for (const file of walk(abs)) {
    const text = readFileSync(file, "utf8")
    for (const m of text.matchAll(/@byronwade\/([a-z0-9-]+)/g)) {
      const name = m[1]
      if (allNames.has(name) || NAMESPACE_ALLOW.has(name)) continue
      const rel = file.slice(root.length + 1)
      const key = rel + "::" + name
      if (ghostSeen.has(key)) continue
      ghostSeen.add(key)
      ghosts.push(`@byronwade/${name}  (${rel})`)
    }
  }
}
if (ghosts.length) {
  errors.push({
    title: "Ghost @byronwade/<name> references (no such registry item)",
    items: ghosts,
    hint: "A consumer running `add @byronwade/<ghost>` would 404. Rename or remove it.",
  })
}

// ---- 3. House-utility coverage ---------------------------------------------
// Foundation owns custom utilities under `@layer utilities` plus top-level class
// keys (e.g. `.scrollbar-thin`). Every one must be documented in the rule, or
// agents won't know it exists and will hand-roll the gradient/grid/glow.
const utilityKeys = [
  ...Object.keys(foundation?.css?.["@layer utilities"] ?? {}),
  ...Object.keys(foundation?.css ?? {}).filter((k) => k.startsWith(".")),
]
const houseUtilities = [...new Set(utilityKeys.map(utilityBase))]
const undocumentedUtilities = houseUtilities.filter(
  (u) => !rule.includes("`" + u + "`"),
)
if (undocumentedUtilities.length) {
  errors.push({
    title: "House utilities defined in foundation but absent from the rule",
    items: undocumentedUtilities,
    hint: "List each in registry/rules/byronwade-ui.mdc (house-utilities section) so agents reuse it.",
  })
}

// ---- 4. Accent DNA intact --------------------------------------------------
// The design DNA promises a single --brand knob re-skins rings, charts, success
// and active states. Those tokens must exist in the foundation theme, or a
// consumer overriding --brand silently fails to re-skin part of the system.
const themeTokens = new Set(Object.keys(foundation?.cssVars?.theme ?? {}))
const ACCENT_TOKENS = [
  "color-brand",
  "color-brand-foreground",
  "color-brand-muted",
  "color-success",
  "color-warning",
  "color-ring",
  "color-chart-1",
  "color-chart-2",
  "color-chart-3",
  "color-chart-4",
  "color-chart-5",
  "color-dock",
  "color-dock-active",
]
const missingAccentTokens = ACCENT_TOKENS.filter((t) => !themeTokens.has(t))
if (missingAccentTokens.length) {
  errors.push({
    title: "Accent-DNA tokens missing from foundation theme",
    items: missingAccentTokens,
    hint: "The one-`--brand`-knob promise depends on these; restore them in registry.json foundation.cssVars.theme.",
  })
}

// ---- Report ----------------------------------------------------------------
if (errors.length) {
  for (const { title, items, hint } of errors) {
    console.error(`\n${title}:\n`)
    for (const item of items) console.error(`  - ${item}`)
    console.error(`\n${hint}`)
  }
  console.error(
    "\nThe rule ships as @byronwade/design-rules; keep it, the docs, and foundation aligned with registry.json.",
  )
  process.exit(1)
}

console.log(
  `✓ rule covers ${componentNames.length} components + ${houseUtilities.length} house utilities; ` +
    `no ghost installs; accent DNA intact`,
)
