#!/usr/bin/env node
/**
 * Meridian drift guard — closed token layer audit.
 *
 * Catches the failure modes AI agents hit most:
 * fabricating colors, shadows, dvh heroes, bold display, cream paper vibes.
 *
 * Exit 1 on any hit in scanned source.
 */
import { readdir, readFile } from "node:fs/promises"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const SCAN_DIRS = ["components", "app", "lib"]
const EXTENSIONS = new Set([".tsx", ".ts", ".css"])

/** Skip generated / vendor-ish paths */
const IGNORE = [
  /node_modules/,
  /\.next/,
  /components\/ui\//, // shadcn primitives — upstream may use shadows briefly
  /scripts\//,
]

const RULES = [
  {
    id: "arbitrary-color-utility",
    re: /(?:text|bg|border|ring|fill|stroke)-\[#(?:[0-9a-fA-F]{3,8})\]/,
    message: "Arbitrary color utility — use a semantic token",
  },
  {
    id: "raw-hex-in-tsx",
    re: /['"`]#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})['"`]/,
    message: "Raw hex string in TSX/TS — use tokens",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "tailwind-shadow",
    re: /(?:^|[\s"'`])shadow-(?:sm|md|lg|xl|2xl|inner)(?:$|[\s"'`])/,
    message: "Tailwind shadow-* banned — use edge / depth-*",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "min-h-dvh",
    re: /min-h-dvh|h-dvh|100dvh/,
    message: "Dynamic viewport unit — use svh (stable)",
  },
  {
    id: "font-bold-display",
    re: /text-\[clamp[^\]]*\][^"'`\n]*font-bold|font-bold[^"'`\n]*text-\[clamp/,
    message: "Bold display weight — use font-medium",
  },
  {
    id: "mix-blend-chrome",
    re: /mix-blend-(?:difference|exclusion)/,
    message: "mix-blend on chrome causes scroll/paint jank",
  },
  {
    id: "content-visibility-auto",
    re: /content-visibility:\s*auto/,
    message: "content-visibility:auto causes reverse-scroll jumps",
  },
]

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

for (const file of files) {
  const rel = relative(ROOT, file)
  const source = await readFile(file, "utf8")
  const lines = source.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const rule of RULES) {
      if (rule.include && !rule.include.test(file)) continue
      if (rule.re.test(line)) {
        hits.push({
          rule: rule.id,
          message: rule.message,
          file: rel,
          line: i + 1,
          text: line.trim().slice(0, 120),
        })
      }
    }
  }
}

if (hits.length === 0) {
  console.log(`check:design OK — scanned ${files.length} files, 0 drift hits`)
  process.exit(0)
}

console.error(`check:design FAILED — ${hits.length} drift hit(s)\n`)
for (const hit of hits) {
  console.error(`  [${hit.rule}] ${hit.file}:${hit.line}`)
  console.error(`    ${hit.message}`)
  console.error(`    ${hit.text}\n`)
}
process.exit(1)
