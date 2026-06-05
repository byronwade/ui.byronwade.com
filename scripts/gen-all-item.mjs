#!/usr/bin/env node
// gen-all-item.mjs
// Regenerates the synthetic `all` aggregator item in registry.json so consumers
// can install the entire catalog with one command:
//
//   npx shadcn@latest add @byronwade/all
//
// The item carries no files of its own — it is purely a dependency manifest whose
// `registryDependencies` list every other installable item. Run before every
// `shadcn build` so it can never drift from the real component set.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const registryPath = join(root, "registry.json")

const registry = JSON.parse(readFileSync(registryPath, "utf8"))

// Everything except the foundation base (installed via `init`), the synthetic
// build index, and the aggregator itself. Foundation still comes along
// transitively because components depend on it.
const EXCLUDE = new Set(["foundation", "all", "registry"])

// `all` means "every component". Non-component artifacts like the AI design-rules
// (registry:file) are opt-in and must NOT be force-installed by the aggregator.
const EXCLUDE_TYPES = new Set(["registry:base", "registry:file"])

const deps = registry.items
  .filter((item) => !EXCLUDE_TYPES.has(item.type) && !EXCLUDE.has(item.name))
  .map((item) => `@byronwade/${item.name}`)

const allItem = {
  name: "all",
  type: "registry:block",
  title: "All components",
  description:
    "The entire byronwade/ui catalog in one install. Run `init` against foundation first, then add this to pull every component (dependencies resolve automatically).",
  registryDependencies: deps,
}

registry.items = registry.items.filter((item) => item.name !== "all")
registry.items.push(allItem)

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8")

console.log(
  `gen-all-item: wrote \`all\` aggregator with ${deps.length} components`,
)
