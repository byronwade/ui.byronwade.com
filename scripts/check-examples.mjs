#!/usr/bin/env node
// check-examples.mjs
// Ensures every registry:ui and registry:component item has at least one styleguide
// example under content/examples/<slug>/default.tsx.
//
// Usage: node scripts/check-examples.mjs

import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))
const examplesRoot = join(root, "content/examples")

const testableTypes = new Set(["registry:ui", "registry:component"])
const testable = registry.items.filter((item) => testableTypes.has(item.type))

const missing = []
const empty = []

for (const item of testable) {
  const dir = join(examplesRoot, item.name)
  const defaultExample = join(dir, "default.tsx")

  if (!existsSync(dir)) {
    missing.push({ name: item.name, reason: "no examples directory" })
    continue
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"))
  if (files.length === 0) {
    empty.push(item.name)
    continue
  }

  if (!existsSync(defaultExample)) {
    missing.push({
      name: item.name,
      reason: "missing default.tsx (has other examples)",
    })
  }
}

if (missing.length > 0 || empty.length > 0) {
  if (missing.length) {
    console.error("\nMissing or incomplete examples:\n")
    for (const { name, reason } of missing) {
      console.error(`  - ${name}  (${reason})`)
    }
  }
  if (empty.length) {
    console.error("\nEmpty example directories:\n")
    for (const name of empty) console.error(`  - ${name}`)
  }
  console.error(
    "\nAdd content/examples/<slug>/default.tsx for each component, then run `npm run gen:examples`.",
  )
  process.exit(1)
}

console.log(`✓ all ${testable.length} components have examples`)
