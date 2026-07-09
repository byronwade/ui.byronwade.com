#!/usr/bin/env node
/**
 * Ensures every UI file in apps/polaris/components/ui has a catalog entry.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = path.join(root, "apps/polaris/components/ui")
const catalogPath = path.join(root, "apps/polaris/lib/component-catalog.ts")

const catalogSource = fs.readFileSync(catalogPath, "utf8")
const catalogSlugs = [...catalogSource.matchAll(/slug:\s*"([^"]+)"/g)].map(
  (m) => m[1],
)
const uiSlugs = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))

const polarisCompositeSlugs = ["admin-shell"]
const catalogUiSlugs = catalogSlugs.filter(
  (s) => !polarisCompositeSlugs.includes(s),
)

const missingFromCatalog = uiSlugs.filter((slug) => !catalogSlugs.includes(slug))
const extraInCatalog = catalogUiSlugs.filter((slug) => !uiSlugs.includes(slug))

let failed = false

if (missingFromCatalog.length) {
  failed = true
  console.error("UI components missing from component-catalog.ts:")
  for (const slug of missingFromCatalog) console.error(`  - ${slug}`)
}

if (extraInCatalog.length) {
  failed = true
  console.error("Catalog entries with no matching UI file:")
  for (const slug of extraInCatalog) console.error(`  - ${slug}`)
}

if (failed) process.exit(1)

console.log(
  `check-polaris-catalog: OK — ${catalogSlugs.length} catalog entries (${uiSlugs.length} UI + ${polarisCompositeSlugs.length} Polaris).`,
)
