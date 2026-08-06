#!/usr/bin/env node
/**
 * npx meridian check — validate arbitrary paths against the consistency bans.
 *
 * Rules come from lib/design/bans.mjs, the same module the repository gate
 * and the MCP `validate_ui` tool read, so this CLI cannot give a different
 * verdict from CI.
 * Usage: node scripts/meridian-check.mjs [--json] [paths...]
 */
import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative } from "node:path"

import { lintLine, mechanicalBans } from "../lib/design/bans.mjs"

const ROOT = process.cwd()
const jsonMode = process.argv.includes("--json")
const args = process.argv.slice(2).filter((a) => a !== "--json")
const targets = args.length > 0 ? args : ["components", "app", "lib"]

const skipDir = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "packages",
])

async function walk(dir, out = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!skipDir.has(e.name)) await walk(p, out)
    } else if (/\.(tsx?|jsx?|css|mdx?)$/.test(e.name)) {
      out.push(p)
    }
  }
  return out
}

const hits = []

for (const target of targets) {
  const abs = join(ROOT, target)
  let st
  try {
    st = await stat(abs)
  } catch {
    continue
  }
  const files = st.isDirectory() ? await walk(abs) : [abs]
  for (const file of files) {
    const rel = relative(ROOT, file)
    const src = await readFile(file, "utf8")
    if (src.includes("@ban-examples")) continue
    const lines = src.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      for (const hit of lintLine(lines[i], rel)) {
        hits.push({ file: rel, line: i + 1, rule: hit.ban, message: hit.why, fix: hit.fix })
      }
    }
  }
}

if (jsonMode) {
  process.stdout.write(
    `${JSON.stringify({ ok: hits.length === 0, hits }, null, 2)}\n`,
  )
} else {
  if (hits.length === 0) {
    console.log(`meridian check: ok — ${mechanicalBans.length} bans`)
  } else {
    console.error(`meridian check: ${hits.length} hit(s)`)
    for (const h of hits) {
      console.error(`  ${h.file}:${h.line} [${h.rule}] ${h.message}`)
      console.error(`    Fix: ${h.fix}`)
    }
  }
}

process.exit(hits.length === 0 ? 0 : 1)
