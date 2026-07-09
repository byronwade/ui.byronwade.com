#!/usr/bin/env node
/**
 * Ensures every UI file in apps/linear/components/ui has a catalog entry
 * and every catalog entry has a preview anchor in catalog-sections.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = path.join(root, "apps/linear/components/ui")
const catalogPath = path.join(root, "apps/linear/lib/component-catalog.ts")
const sectionsPath = path.join(root, "apps/linear/app/catalog/catalog-sections.tsx")

const catalogSource = fs.readFileSync(catalogPath, "utf8")
const sectionsSource = fs.readFileSync(sectionsPath, "utf8")

const catalogSlugs = [...catalogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
const uiSlugs = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))

const linearCompositeSlugs = [
  "issue-row",
  "cycle-panel",
  "command-shell",
  "agent-timeline",
  "ask-linear-panel",
  "workspace-shell",
  "settings-shell",
  "search-shell",
  "backlog-issue-row",
  "ask-linear-welcome",
  "project-detail",
]
const expectedUiSlugs = new Set(uiSlugs)
const catalogUiSlugs = catalogSlugs.filter((s) => !linearCompositeSlugs.includes(s))

const missingFromCatalog = uiSlugs.filter((slug) => !catalogSlugs.includes(slug))
const extraInCatalog = catalogUiSlugs.filter((slug) => !expectedUiSlugs.has(slug))
const missingPreviews = catalogSlugs.filter(
  (slug) => !sectionsSource.includes(`slug="${slug}"`) && !sectionsSource.includes(`id="${slug}"`),
)

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

if (missingPreviews.length) {
  failed = true
  console.error("Catalog entries missing ComponentPreview in catalog-sections.tsx:")
  for (const slug of missingPreviews) console.error(`  - ${slug}`)
}

if (failed) {
  process.exit(1)
}

console.log(
  `check-linear-catalog: OK — ${catalogSlugs.length} catalog entries (${uiSlugs.length} UI + ${linearCompositeSlugs.length} Linear).`,
)
