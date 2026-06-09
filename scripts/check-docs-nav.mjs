#!/usr/bin/env node
// check-docs-nav.mjs
// Validates docs sidebar family metadata in content/components.ts.
//
// Usage: node scripts/check-docs-nav.mjs

import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const result = spawnSync(
  "npx",
  [
    "tsx",
    "--eval",
    `import { validateDocsNav } from "./content/docs-nav.ts"
const errors = validateDocsNav()
if (errors.length > 0) {
  console.error("\\nDocs nav validation failed:\\n")
  for (const error of errors) console.error("  - " + error)
  process.exit(1)
}
console.log("check:docs-nav OK")`,
  ],
  { cwd: root, stdio: "inherit" },
)

process.exit(result.status ?? 1)
