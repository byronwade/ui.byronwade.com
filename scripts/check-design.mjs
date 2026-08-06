#!/usr/bin/env node
/**
 * Drift guard — repository gate for the consistency bans.
 *
 * Patterns are NOT defined here. They live in lib/design/bans.mjs, which the
 * MCP `validate_ui` tool and the generated contract JSON also read, so an
 * agent that passes the tool passes this gate too.
 *
 * Exit 1 on any hit in scanned source.
 */
import { readdir, readFile } from "node:fs/promises"
import { join, relative } from "node:path"

import { lintLine, mechanicalBans } from "../lib/design/bans.mjs"

const ROOT = process.cwd()
const SCAN_DIRS = ["components", "app", "lib"]
const EXTENSIONS = new Set([".tsx", ".ts", ".css"])

/** Skip generated / vendor-ish paths. */
const IGNORE = [/node_modules/, /\.next/, /scripts\//, /\.mjs$/]

async function walk(dir, out = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    const rel = relative(ROOT, path)
    if (IGNORE.some((re) => re.test(rel))) continue
    if (entry.isDirectory()) {
      await walk(path, out)
      continue
    }
    const ext = entry.name.slice(entry.name.lastIndexOf("."))
    if (EXTENSIONS.has(ext)) out.push(path)
  }
  return out
}

const files = (
  await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))
).flat()

const hits = []
const exempt = []

for (const file of files) {
  const rel = relative(ROOT, file)
  const source = await readFile(file, "utf8")
  /*
   * Anti-example catalogs contain banned code on purpose. They declare it
   * inline instead of hiding behind a path regex in this file, so the
   * exemption is visible where the code is and gets reported below.
   */
  if (source.includes("@ban-examples")) {
    exempt.push(rel)
    continue
  }
  const lines = source.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    for (const hit of lintLine(lines[i], rel)) {
      hits.push({ ...hit, file: rel, line: i + 1, text: lines[i].trim().slice(0, 120) })
    }
  }
}

const exemptNote = exempt.length
  ? ` · ${exempt.length} declared @ban-examples file(s): ${exempt.join(", ")}`
  : ""

if (hits.length === 0) {
  console.log(
    `check:design OK — ${files.length} files × ${mechanicalBans.length} bans, 0 drift hits${exemptNote}`,
  )
  process.exit(0)
}

console.error(`check:design FAILED — ${hits.length} drift hit(s)\n`)
for (const hit of hits) {
  console.error(`  [${hit.ban}] ${hit.file}:${hit.line}`)
  console.error(`    ${hit.why}`)
  console.error(`    Fix: ${hit.fix}`)
  console.error(`    ${hit.text}\n`)
}
process.exit(1)
