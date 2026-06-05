#!/usr/bin/env node
// Fails if manifest.generated.ts is stale vs registry.json, or nativeToComponent
// references a non-existent component.
import { readFileSync, existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const genPath = join(root, "packages/on-system-core/src/manifest.generated.ts")
const errors = []

if (!existsSync(genPath)) {
  errors.push(
    "manifest.generated.ts missing — run `npm run gen:lint-manifest`.",
  )
} else {
  const before = readFileSync(genPath, "utf8")
  execFileSync("node", ["scripts/gen-lint-manifest.mjs"], {
    cwd: root,
    stdio: "ignore",
  })
  const after = readFileSync(genPath, "utf8")
  if (before !== after)
    errors.push(
      "manifest.generated.ts is stale — run `npm run gen:lint-manifest`.",
    )

  const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))
  const names = new Set(registry.items.map((i) => i.name))
  // ensure each nativeToComponent slug (lowercase key -> Capitalized value) exists
  const slugs = [...after.matchAll(/"([a-z-]+)":\s*"[A-Z][A-Za-z]+"/g)].map(
    (x) => x[1],
  )
  for (const slug of slugs)
    if (!names.has(slug))
      errors.push(`nativeToComponent maps to missing component: ${slug}`)
}

if (errors.length) {
  for (const e of errors) console.error("  - " + e)
  process.exit(1)
}
console.log("✓ lint manifest in sync with registry.json")
