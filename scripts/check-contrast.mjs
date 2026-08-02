#!/usr/bin/env node
/**
 * Meridian contrast audit — WCAG AA (≥4.5:1) on frozen OKLCH token pairs.
 * Large-text pairs (≥3:1) marked with large: true.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const CSS_PATH = join(ROOT, "app/globals.css")

const AA_BODY = 4.5
const AA_LARGE = 3

/** @type {{ name: string, fg: string, bg: string, large?: boolean, scope?: "root"|"dark"|"theater" }[]} */
const PAIRS = [
  // Paper (light)
  { name: "paper body", fg: "foreground", bg: "background", scope: "root" },
  { name: "paper muted", fg: "muted-foreground", bg: "background", scope: "root" },
  { name: "paper brand link", fg: "brand", bg: "background", scope: "root" },
  { name: "card body", fg: "card-foreground", bg: "card", scope: "root" },
  { name: "on-brand", fg: "brand-foreground", bg: "brand", scope: "root" },
  { name: "dock body", fg: "dock-foreground", bg: "dock", scope: "root" },
  { name: "dock muted", fg: "dock-muted", bg: "dock", scope: "root" },
  // Theater lifts brand for links on dock
  {
    name: "theater brand on dock",
    fg: "brand",
    bg: "dock",
    scope: "theater",
  },
  // Dark mode
  { name: "dark body", fg: "foreground", bg: "background", scope: "dark" },
  { name: "dark muted", fg: "muted-foreground", bg: "background", scope: "dark" },
  { name: "dark brand link", fg: "brand", bg: "background", scope: "dark" },
  { name: "dark on-brand", fg: "brand-foreground", bg: "brand", scope: "dark" },
  { name: "dark dock body", fg: "dock-foreground", bg: "dock", scope: "dark" },
  { name: "dark dock muted", fg: "dock-muted", bg: "dock", scope: "dark" },
]

function extractBlock(css, startMarker) {
  const start = css.indexOf(startMarker)
  if (start < 0) return ""
  let i = css.indexOf("{", start)
  let depth = 0
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") {
      depth--
      if (depth === 0) return css.slice(css.indexOf("{", start) + 1, i)
    }
  }
  return ""
}

function parseTokens(block) {
  /** @type {Record<string, string>} */
  const tokens = {}
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi
  let m
  while ((m = re.exec(block))) {
    tokens[m[1]] = m[2].trim()
  }
  return tokens
}

function resolve(tokens, name, depth = 0) {
  if (depth > 8) throw new Error(`Token cycle resolving --${name}`)
  const raw = tokens[name]
  if (!raw) throw new Error(`Missing token --${name}`)
  const varMatch = raw.match(/^var\(\s*--([a-z0-9-]+)\s*\)$/i)
  if (varMatch) return resolve(tokens, varMatch[1], depth + 1)
  return raw
}

function parseOklch(value) {
  const m = value.match(
    /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)/i,
  )
  if (!m) throw new Error(`Not OKLCH: ${value}`)
  return {
    L: Number(m[1]),
    C: Number(m[2]),
    h: Number(m[3]),
  }
}

function oklchToLinearSrgb(L, C, h) {
  const hr = (h * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x))
}

function relativeLuminance(oklch) {
  const { r, g, b } = oklchToLinearSrgb(oklch.L, oklch.C, oklch.h)
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b)
}

function contrastRatio(a, b) {
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

const css = await readFile(CSS_PATH, "utf8")
const root = parseTokens(extractBlock(css, ":root"))
const dark = { ...root, ...parseTokens(extractBlock(css, ".dark")) }
const theater = {
  ...root,
  ...parseTokens(extractBlock(css, '[data-tone="theater"]')),
}

const scopes = { root, dark, theater }
const failures = []

for (const pair of PAIRS) {
  const tokens = scopes[pair.scope ?? "root"]
  try {
    const fg = parseOklch(resolve(tokens, pair.fg))
    const bg = parseOklch(resolve(tokens, pair.bg))
    const ratio = contrastRatio(relativeLuminance(fg), relativeLuminance(bg))
    const min = pair.large ? AA_LARGE : AA_BODY
    if (ratio < min) {
      failures.push({
        ...pair,
        ratio: ratio.toFixed(2),
        min,
      })
    }
  } catch (err) {
    failures.push({
      ...pair,
      ratio: "n/a",
      min: pair.large ? AA_LARGE : AA_BODY,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

if (failures.length === 0) {
  console.log(
    `check:contrast OK — ${PAIRS.length} pairs meet WCAG AA (≥${AA_BODY}:1)`,
  )
  process.exit(0)
}

console.error(`check:contrast FAILED — ${failures.length} pair(s)\n`)
for (const f of failures) {
  console.error(
    `  [${f.scope ?? "root"}] ${f.name}: ${f.fg} on ${f.bg} → ${f.ratio}:1 (need ≥${f.min})`,
  )
  if (f.error) console.error(`    ${f.error}`)
}
process.exit(1)
