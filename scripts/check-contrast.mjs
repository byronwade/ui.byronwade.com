#!/usr/bin/env node
/**
 * Contrast audit — WCAG AA (≥4.5:1) on the platform shell and EVERY contract
 * skin, light and dark.
 *
 * Skins diverge on purpose (that is the DNA), so every one of them has to be
 * audited on its own tokens — auditing Meridian and assuming the rest inherit
 * is how a sibling contract ships an unreadable chip.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const CSS_PATH = join(ROOT, "app/globals.css")
const SKINS_PATH = join(ROOT, "app/contract-skins.css")

const AA_BODY = 4.5
const AA_LARGE = 3

/** Every contract that ships a skin block in app/contract-skins.css. */
const CONTRACTS = ["meridian", "harbor", "atlas", "vellum"]

/**
 * Pairs that actually get painted. `--stage-ink` resolves through `[data-tone]`,
 * so both stage tones are checked against the surface they land on.
 * @type {{ name: string, fg: string, bg: string, large?: boolean }[]}
 */
const SKIN_PAIRS = [
  { name: "body", fg: "foreground", bg: "background" },
  { name: "muted", fg: "muted-foreground", bg: "background" },
  { name: "brand link", fg: "brand", bg: "background" },
  { name: "on-brand fill", fg: "brand-foreground", bg: "brand" },
  { name: "body on card", fg: "foreground", bg: "card" },
  { name: "muted on card", fg: "muted-foreground", bg: "card" },
  { name: "brand on card", fg: "brand", bg: "card" },
  { name: "text on muted chip", fg: "foreground", bg: "muted" },
  { name: "muted on muted chip", fg: "muted-foreground", bg: "muted" },
  { name: "on-secondary", fg: "secondary-foreground", bg: "secondary" },
  { name: "on-accent", fg: "accent-foreground", bg: "accent" },
  { name: "on-warning", fg: "warning-foreground", bg: "warning" },
  { name: "destructive text", fg: "destructive", bg: "background" },
  { name: "dock body", fg: "dock-foreground", bg: "dock" },
  { name: "dock muted", fg: "dock-muted", bg: "dock" },
  // Cinema copy — paper stages read stage ink on --background …
  { name: "stage ink on paper", fg: "stage-ink", bg: "background" },
  { name: "stage ink muted on paper", fg: "stage-ink-muted", bg: "background" },
]

/** Theater stages remap --stage-ink to dock tokens and lift --brand. */
const THEATER_PAIRS = [
  { name: "stage ink on theater", fg: "stage-ink", bg: "dock" },
  { name: "stage ink muted on theater", fg: "stage-ink-muted", bg: "dock" },
  { name: "brand on dock", fg: "brand", bg: "dock" },
]

/** @type {{ name: string, fg: string, bg: string, large?: boolean, scope?: string }[]} */
const PAIRS = [
  // Platform catalog shell
  { name: "platform body", fg: "foreground", bg: "background", scope: "root" },
  { name: "platform muted", fg: "muted-foreground", bg: "background", scope: "root" },
  { name: "platform brand link", fg: "brand", bg: "background", scope: "root" },
  { name: "platform on-brand", fg: "brand-foreground", bg: "brand", scope: "root" },
]

for (const id of CONTRACTS) {
  for (const mode of ["", "-dark"]) {
    for (const pair of SKIN_PAIRS) {
      PAIRS.push({ ...pair, name: `${id}${mode} ${pair.name}`, scope: `${id}${mode}` })
    }
    for (const pair of THEATER_PAIRS) {
      PAIRS.push({
        ...pair,
        name: `${id}${mode} ${pair.name}`,
        scope: `${id}${mode}-theater`,
      })
    }
  }
}

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

/** Merge every rule with this selector (tokens are split across @layer blocks). */
function extractAllBlocks(css, startMarker) {
  const rule = `${startMarker} {`
  let out = ""
  let from = 0
  for (;;) {
    const start = css.indexOf(rule, from)
    if (start < 0) break
    let depth = 0
    let i = css.indexOf("{", start)
    const open = i
    for (; i < css.length; i++) {
      if (css[i] === "{") depth++
      else if (css[i] === "}") {
        depth--
        if (depth === 0) break
      }
    }
    out += css.slice(open + 1, i) + "\n"
    from = i + 1
  }
  return out
}

const css = await readFile(CSS_PATH, "utf8")
const skins = await readFile(SKINS_PATH, "utf8")
const root = parseTokens(extractAllBlocks(css, ":root"))
/** Stage-tone remap lives in globals (tone is contract-agnostic). */
const toneTheater = parseTokens(extractAllBlocks(css, '[data-tone="theater"]'))

const scopes = { root }

for (const id of CONTRACTS) {
  const light = {
    ...root,
    ...parseTokens(extractBlock(skins, `[data-contract="${id}"]`)),
  }
  const dark = {
    ...light,
    ...parseTokens(extractBlock(skins, `.dark [data-contract="${id}"]`)),
  }
  const lift = parseTokens(
    extractBlock(skins, `[data-contract="${id}"] [data-tone="theater"]`),
  )
  scopes[id] = light
  scopes[`${id}-dark`] = dark
  scopes[`${id}-theater`] = { ...light, ...toneTheater, ...lift }
  scopes[`${id}-dark-theater`] = { ...dark, ...toneTheater, ...lift }
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
