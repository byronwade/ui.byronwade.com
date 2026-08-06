#!/usr/bin/env node
/**
 * Contrast audit — WCAG AA (≥4.5:1) on platform :root + every contract skin.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const CSS_PATH = join(ROOT, "app/globals.css")
const SKINS_PATH = join(ROOT, "app/contract-skins.css")

const AA_BODY = 4.5
const AA_LARGE = 3

/** @type {{ name: string, fg: string, bg: string, large?: boolean, scope?: string }[]} */
const PAIRS = [
  // Platform catalog
  { name: "platform body", fg: "foreground", bg: "background", scope: "root" },
  { name: "platform muted", fg: "muted-foreground", bg: "background", scope: "root" },
  { name: "platform brand link", fg: "brand", bg: "background", scope: "root" },
  { name: "platform on-brand", fg: "brand-foreground", bg: "brand", scope: "root" },
  // Meridian paper
  { name: "meridian body", fg: "foreground", bg: "background", scope: "meridian" },
  { name: "meridian muted", fg: "muted-foreground", bg: "background", scope: "meridian" },
  { name: "meridian brand link", fg: "brand", bg: "background", scope: "meridian" },
  { name: "meridian on-brand", fg: "brand-foreground", bg: "brand", scope: "meridian" },
  { name: "meridian dock body", fg: "dock-foreground", bg: "dock", scope: "meridian" },
  { name: "meridian dock muted", fg: "dock-muted", bg: "dock", scope: "meridian" },
  {
    name: "theater brand on dock",
    fg: "brand",
    bg: "dock",
    scope: "theater",
  },
  // Meridian dark
  { name: "meridian dark body", fg: "foreground", bg: "background", scope: "meridian-dark" },
  { name: "meridian dark muted", fg: "muted-foreground", bg: "background", scope: "meridian-dark" },
  { name: "meridian dark brand", fg: "brand", bg: "background", scope: "meridian-dark" },
  { name: "meridian dark on-brand", fg: "brand-foreground", bg: "brand", scope: "meridian-dark" },
  // Harbor
  { name: "harbor body", fg: "foreground", bg: "background", scope: "harbor" },
  { name: "harbor muted", fg: "muted-foreground", bg: "background", scope: "harbor" },
  { name: "harbor brand", fg: "brand", bg: "background", scope: "harbor" },
  { name: "harbor on-brand", fg: "brand-foreground", bg: "brand", scope: "harbor" },
  { name: "harbor dark body", fg: "foreground", bg: "background", scope: "harbor-dark" },
  { name: "harbor dark brand", fg: "brand", bg: "background", scope: "harbor-dark" },
  // Atlas
  { name: "atlas body", fg: "foreground", bg: "background", scope: "atlas" },
  { name: "atlas muted", fg: "muted-foreground", bg: "background", scope: "atlas" },
  { name: "atlas brand", fg: "brand", bg: "background", scope: "atlas" },
  { name: "atlas on-brand", fg: "brand-foreground", bg: "brand", scope: "atlas" },
  { name: "atlas dark body", fg: "foreground", bg: "background", scope: "atlas-dark" },
  { name: "atlas dark brand", fg: "brand", bg: "background", scope: "atlas-dark" },
  // Vellum
  { name: "vellum body", fg: "foreground", bg: "background", scope: "vellum" },
  { name: "vellum muted", fg: "muted-foreground", bg: "background", scope: "vellum" },
  { name: "vellum brand", fg: "brand", bg: "background", scope: "vellum" },
  { name: "vellum on-brand", fg: "brand-foreground", bg: "brand", scope: "vellum" },
  { name: "vellum dark body", fg: "foreground", bg: "background", scope: "vellum-dark" },
  { name: "vellum dark brand", fg: "brand", bg: "background", scope: "vellum-dark" },
]

function extractBlock(css, startMarker) {
  // Prefer a real rule opener ("marker {") so comments like "(:root)" don't match.
  const rule = `${startMarker} {`
  let start = css.indexOf(rule)
  if (start < 0) start = css.indexOf(startMarker)
  if (start < 0) return ""
  let i = css.indexOf("{", start)
  if (i < 0) return ""
  let depth = 0
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") {
      depth--
      if (depth === 0) {
        const open = css.indexOf("{", start)
        return css.slice(open + 1, i)
      }
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
  return { L: Number(m[1]), C: Number(m[2]), h: Number(m[3]) }
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
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
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
const skins = await readFile(SKINS_PATH, "utf8")
const root = parseTokens(extractBlock(css, ":root"))
const meridian = {
  ...root,
  ...parseTokens(extractBlock(skins, '[data-contract="meridian"]')),
}
const meridianDark = {
  ...meridian,
  ...parseTokens(extractBlock(skins, '.dark [data-contract="meridian"]')),
}
const theater = {
  ...meridian,
  ...parseTokens(
    extractBlock(skins, '[data-contract="meridian"] [data-tone="theater"]'),
  ),
}

function skinScope(id) {
  return {
    ...root,
    ...parseTokens(extractBlock(skins, `[data-contract="${id}"]`)),
  }
}

function skinDarkScope(id, light) {
  return {
    ...light,
    ...parseTokens(extractBlock(skins, `.dark [data-contract="${id}"]`)),
  }
}

const harbor = skinScope("harbor")
const atlas = skinScope("atlas")
const vellum = skinScope("vellum")

const scopes = {
  root,
  meridian,
  "meridian-dark": meridianDark,
  theater,
  harbor,
  "harbor-dark": skinDarkScope("harbor", harbor),
  atlas,
  "atlas-dark": skinDarkScope("atlas", atlas),
  vellum,
  "vellum-dark": skinDarkScope("vellum", vellum),
}
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
