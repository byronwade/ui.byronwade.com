#!/usr/bin/env node
// check-conventions.mjs
// Guards the *structural* house conventions that Prettier and ESLint can't express —
// where a file lives, what it's named, how it exports, and whether its parts are
// addressable. Formatting is Prettier's job; raw-color / hand-rolled / token drift is
// the on-system lint's job; component coverage in the shipped rule is check-rule.mjs's
// job. This gate owns only the organizational invariants those tools leave uncovered.
//
// Source of truth = registry.json (same manifest check-rule.mjs reads), so the ui /
// component file lists never drift from what actually ships. No generated / git-ignored
// files are read, so this runs in CI before `sync`.
//
// Two tiers of check:
//   ENFORCE  — the tree already passes; a violation fails CI (exit 1).
//   RATCHET  — the tree does NOT yet pass (Phase C brings it green). Reported as a
//              warning, never fails CI, until its violation count hits zero — then it
//              graduates to ENFORCE (flip the flag below). Mirrors the coverage ratchet.
//
// Invariants:
//   ENFORCE 1. Filenames     — every registry/**/*.{ts,tsx} is kebab-case.
//   ENFORCE 2. Import paths   — no relative parent (`../`) imports; consumer `@/` only.
//   ENFORCE 3. No default     — components use named exports, never `export default`.
//   ENFORCE 4. data-slot      — every ui / component root carries a `data-slot`.
//
// Usage: node scripts/check-conventions.mjs
//        node scripts/check-conventions.mjs --strict   (treat ratchets as enforce too)

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const strict = process.argv.includes("--strict")

const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))

// Component items consumers compose with — these own the structural contract.
const componentTypes = new Set(["registry:ui", "registry:component"])
const componentFiles = registry.items
  .filter((item) => componentTypes.has(item.type))
  .flatMap((item) => (item.files ?? []).map((file) => file.path))
  .filter((path) => /\.tsx?$/.test(path))

// Rendered components only (.tsx). Pure `.ts` helpers like `*-variants.ts` carry
// CVA blocks, not JSX, so the export-shape and data-slot contracts don't apply.
const renderedFiles = componentFiles.filter((path) => path.endsWith(".tsx"))

// All hand-maintained source under registry/ (for the filename sweep).
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*\.(ts|tsx)$/
function walk(absPath) {
  const out = []
  for (const entry of readdirSync(absPath)) {
    const abs = join(absPath, entry)
    if (statSync(abs).isDirectory()) {
      out.push(...walk(abs))
    } else if (/\.tsx?$/.test(entry)) {
      out.push(abs)
    }
  }
  return out
}
const allSource = walk(join(root, "registry"))

const enforce = []
const ratchet = []

// ---- ENFORCE 1. Kebab-case filenames ---------------------------------------
// One component family per file; predictable, URL-safe, matches the registry slug.
const badNames = allSource
  .map((abs) => abs.slice(root.length + 1))
  .filter((rel) => !KEBAB.test(basename(rel)))
if (badNames.length) {
  enforce.push({
    title: "Non-kebab-case filenames under registry/",
    items: badNames,
    hint: "Rename to kebab-case (e.g. status-pill.tsx). The filename is the component slug.",
  })
}

// ---- ENFORCE 2. No relative parent imports ---------------------------------
// Registry source imports via consumer `@/` paths only, so a copied component
// resolves the same in a downstream app. A `../` import would dangle there.
const parentImport = /(?:from|import)\s+["']\.\.\//
const crossing = []
for (const abs of allSource) {
  const src = readFileSync(abs, "utf8")
  if (parentImport.test(src)) crossing.push(abs.slice(root.length + 1))
}
if (crossing.length) {
  enforce.push({
    title: "Relative parent (`../`) imports in registry source",
    items: crossing,
    hint: "Use consumer paths: @/components/ui/…, @/components/…, @/lib/…. Never ../.",
  })
}

// ---- ENFORCE 3. No default exports -----------------------------------------
// Components export named, at the file bottom, so consumers get stable import
// names and the file can expose multiple parts (Root + sub-components + types).
const defaultExport = /^export default\b/m
const defaulted = renderedFiles.filter((rel) => {
  const abs = join(root, rel)
  return defaultExport.test(readFileSync(abs, "utf8"))
})
if (defaulted.length) {
  enforce.push({
    title: "Components using `export default`",
    items: defaulted,
    hint: "Switch to a named export at the file bottom: export { Component }.",
  })
}

// ---- ENFORCE 4. data-slot presence -----------------------------------------
// Every rendered part carries data-slot so consumers can target it without
// reaching into class internals (the styling-handle contract from the DNA).
const undatedSlot = renderedFiles.filter((rel) => {
  const abs = join(root, rel)
  return !readFileSync(abs, "utf8").includes("data-slot")
})
if (undatedSlot.length) {
  enforce.push({
    title: "Components missing a `data-slot` attribute",
    items: undatedSlot,
    hint: "Add data-slot to the rendered root (and notable parts) so consumers can target them.",
  })
}

// ---- Report ----------------------------------------------------------------
function print(group, label) {
  for (const { title, items, hint } of group) {
    console.error(`\n${label} — ${title}:\n`)
    for (const item of items) console.error(`  - ${item}`)
    console.error(`\n  ${hint}`)
  }
}

const failures = strict ? [...enforce, ...ratchet] : enforce
const warnings = strict ? [] : ratchet

print(warnings, "ratchet (report-only)")
if (warnings.length) {
  const n = warnings.reduce((sum, g) => sum + g.items.length, 0)
  console.error(
    `\nℹ ${n} ratchet violation(s) above do not fail CI yet. ` +
      "When a ratchet reaches zero, promote it from 'ratchet' to 'enforce' in check-conventions.mjs.",
  )
}

if (failures.length) {
  print(failures, "error")
  console.error(
    "\nStructural conventions are enforced in `npm run validate`; fix the above to pass CI.",
  )
  process.exit(1)
}

const enforced = enforce.length === 0 ? "filenames + import paths clean" : ""
console.log(
  `✓ structural conventions: ${enforced}` +
    (warnings.length
      ? ` (${warnings.reduce((s, g) => s + g.items.length, 0)} ratchet warning(s) pending Phase C)`
      : ""),
)
