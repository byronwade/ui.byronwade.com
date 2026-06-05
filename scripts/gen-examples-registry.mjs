#!/usr/bin/env node
/**
 * gen-examples-registry.mjs
 *
 * Scans content/examples/<slug>/<file>.tsx and auto-generates
 * content/examples/registry.ts with typed imports + export map.
 *
 * Run: node scripts/gen-examples-registry.mjs
 */

import { readdirSync, writeFileSync } from "node:fs"
import { join, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const EXAMPLES_DIR = join(ROOT, "content/examples")

// ─── Helpers ────────────────────────────────────────────────────────────────

/** kebab-case / dash-separated → PascalCase */
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

/** "with-icon" → "With Icon" */
function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Build a unique import identifier: <PascalSlug><PascalBase> */
function makeImportName(slug, base) {
  return toPascalCase(slug) + toPascalCase(base)
}

// ─── Scan ───────────────────────────────────────────────────────────────────

const slugDirs = readdirSync(EXAMPLES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

/** Map from slug → array of { base, file, importName, label } */
const bySlug = new Map()

for (const slug of slugDirs) {
  const dir = join(EXAMPLES_DIR, slug)
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => basename(f, ".tsx"))
    .sort((a, b) => {
      if (a === "default") return -1
      if (b === "default") return 1
      return a.localeCompare(b)
    })

  if (files.length === 0) continue

  bySlug.set(
    slug,
    files.map((base) => ({
      base,
      file: `${slug}/${base}.tsx`,
      importName: makeImportName(slug, base),
      label: toTitleCase(base),
    })),
  )
}

// ─── Generate ───────────────────────────────────────────────────────────────

const lines = []

lines.push(`import type { ComponentType } from "react";`)
lines.push("")

// One import line per file
for (const [, examples] of bySlug) {
  for (const { importName, file } of examples) {
    // Strip .tsx extension for the module path
    const modulePath = `./${file.replace(/\.tsx$/, "")}`
    lines.push(`import ${importName} from "${modulePath}";`)
  }
}

lines.push("")
lines.push(
  `export type Example = { name: string; file: string; Component: ComponentType };`,
)
lines.push("")
lines.push(`export const examples: Record<string, Example[]> = {`)

for (const [slug, exs] of bySlug) {
  lines.push(`  "${slug}": [`)
  for (const { importName, file, label } of exs) {
    lines.push(
      `    { name: "${label}", file: "${file}", Component: ${importName} },`,
    )
  }
  lines.push(`  ],`)
}

lines.push(`};`)
lines.push("")

const output = lines.join("\n")

writeFileSync(join(EXAMPLES_DIR, "registry.ts"), output, "utf8")

// ─── Summary ────────────────────────────────────────────────────────────────

let totalComponents = bySlug.size
let totalExamples = 0
for (const [, exs] of bySlug) totalExamples += exs.length

console.log(`\n✅  Generated content/examples/registry.ts`)
console.log(`   Components : ${totalComponents}`)
console.log(`   Examples   : ${totalExamples}`)
console.log("")

// Per-component summary
for (const [slug, exs] of bySlug) {
  console.log(
    `  ${slug.padEnd(24)} ${exs.length} example(s): ${exs.map((e) => e.base).join(", ")}`,
  )
}
console.log("")
