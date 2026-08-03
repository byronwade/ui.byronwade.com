#!/usr/bin/env node
/**
 * npx meridian check — validate source against Meridian bans.
 * Usage: node scripts/meridian-check.mjs [--json] [paths...]
 */
import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const jsonMode = process.argv.includes("--json")
const args = process.argv.slice(2).filter((a) => a !== "--json")
const targets = args.length > 0 ? args : ["components", "app", "lib"]

const rules = [
  {
    id: "hex-color",
    re: /#[0-9a-fA-F]{3,8}\b/,
    message: "hex color banned — use semantic tokens",
  },
  {
    id: "rgb-hsl",
    re: /\b(?:rgb|hsl)a?\(/,
    message: "rgb/hsl literal banned — use oklch tokens / utilities",
  },
  {
    id: "shadow-util",
    re: /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/,
    message: "Tailwind shadow-* banned — use depth-*",
  },
  {
    id: "lucide-import",
    re: /from\s+["']lucide-react["']/,
    message: "lucide-react import banned — use @/lib/icons",
  },
  {
    id: "arbitrary-color",
    re: /\b(?:text|bg|border)-\[(?:#|rgb|hsl)/,
    message: "arbitrary color utility banned",
  },
]

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
    // Allow OKLCH + hex only in foundation / knobs / globals token files
    const rel = relative(ROOT, file)
    const allowColorLiterals =
      /globals\.css$|knobs\.ts$|contrast\.ts$|typeset\.css$/.test(rel)
    const src = await readFile(file, "utf8")
    for (const rule of rules) {
      if (
        allowColorLiterals &&
        (rule.id === "hex-color" || rule.id === "rgb-hsl")
      ) {
        continue
      }
      if (rule.re.test(src)) {
        hits.push({ file: rel, rule: rule.id, message: rule.message })
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
    console.log("meridian check: ok")
  } else {
    console.error(`meridian check: ${hits.length} hit(s)`)
    for (const h of hits) {
      console.error(`  ${h.file}: [${h.rule}] ${h.message}`)
    }
  }
}

process.exit(hits.length === 0 ? 0 : 1)
