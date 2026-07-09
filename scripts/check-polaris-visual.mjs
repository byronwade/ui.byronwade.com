#!/usr/bin/env node
/**
 * Fails when Polaris app UI source contains raw Tailwind palette colors or hex
 * that fight the Polaris token contract (var(--polaris-*) / semantic tokens).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const SCAN_DIRS = [
  path.join(root, "apps/polaris/components/ui"),
  path.join(root, "apps/polaris/components/polaris"),
]

const PALETTE =
  "red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|sky|lime|amber|stone|zinc|neutral|slate|gray"

const RULES = [
  {
    id: "raw-hex",
    pattern: /(?:^|[^[\w-])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/,
    message: "Use Polaris / semantic tokens — no raw hex in component source",
    allow: ["chart.tsx"],
  },
  {
    id: "tailwind-palette",
    pattern: new RegExp(
      `\\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(${PALETTE})-\\d{2,3}\\b`,
    ),
    message: "Use semantic tokens (bg-background, text-foreground, …) — no Tailwind palette colors",
  },
]

function walkTsx(dir) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkTsx(full))
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      out.push(full)
    }
  }
  return out
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8")
  const base = path.basename(filePath)
  const hits = []
  for (const rule of RULES) {
    if (rule.allow?.some((name) => base === name)) continue
    if (rule.pattern.test(text)) {
      hits.push(rule)
    }
  }
  return hits
}

let failed = false

for (const dir of SCAN_DIRS) {
  for (const full of walkTsx(dir)) {
    const relative = path.relative(root, full)
    const hits = scanFile(full)
    if (hits.length) {
      failed = true
      console.error(`${relative}:`)
      for (const hit of hits) {
        console.error(`  - ${hit.message}`)
      }
    }
  }
}

if (failed) {
  console.error("\ncheck-polaris-visual: failed — fix patterns above or update allowlist.")
  process.exit(1)
}

console.log(
  "check-polaris-visual: OK — no raw palette/hex patterns in apps/polaris/components/{ui,polaris}",
)
