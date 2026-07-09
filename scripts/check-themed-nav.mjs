#!/usr/bin/env node
/**
 * Ensures themed-app sidebar hrefs resolve to existing page.tsx files.
 * Catches dead nav that would 404 in the Linear/Polaris demos.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function collectHrefs(filePath) {
  const text = fs.readFileSync(filePath, "utf8")
  const hrefs = new Set()
  for (const match of text.matchAll(/href:\s*"(\/[^"]+)"/g)) {
    hrefs.add(match[1])
  }
  for (const match of text.matchAll(/href=\{?"(\/[^"]+)"\}?/g)) {
    hrefs.add(match[1])
  }
  return [...hrefs]
}

function pageExists(appRoot, href) {
  // Strip query/hash
  const clean = href.split("?")[0].split("#")[0]
  if (clean === "/") {
    return fs.existsSync(path.join(appRoot, "app/page.tsx"))
  }
  const rel = clean.replace(/^\//, "")
  const candidates = [
    path.join(appRoot, "app", rel, "page.tsx"),
    path.join(appRoot, "app", `${rel}.tsx`),
  ]
  // Dynamic segments: /products/[id] — if href is /products/foo, accept [id]
  const parts = rel.split("/")
  const dyn = path.join(
    appRoot,
    "app",
    ...parts.slice(0, -1),
    "[id]",
    "page.tsx",
  )
  candidates.push(dyn)
  return candidates.some((c) => fs.existsSync(c))
}

const checks = [
  {
    name: "linear",
    appRoot: path.join(root, "apps/linear"),
    shells: [
      "apps/linear/components/linear/workspace-shell.tsx",
      "apps/linear/components/linear/settings-shell.tsx",
    ],
  },
  {
    name: "polaris",
    appRoot: path.join(root, "apps/polaris"),
    shells: ["apps/polaris/components/polaris/admin-shell.tsx"],
  },
]

let failed = false

for (const check of checks) {
  const hrefs = new Set()
  for (const shell of check.shells) {
    for (const href of collectHrefs(path.join(root, shell))) {
      hrefs.add(href)
    }
  }
  const missing = [...hrefs].filter((h) => !pageExists(check.appRoot, h)).sort()
  if (missing.length) {
    failed = true
    console.error(`${check.name}: sidebar hrefs with no page.tsx:\n`)
    for (const href of missing) console.error(`  - ${href}`)
  } else {
    console.log(
      `check-themed-nav (${check.name}): OK — ${hrefs.size} hrefs resolve`,
    )
  }
}

if (failed) process.exit(1)
