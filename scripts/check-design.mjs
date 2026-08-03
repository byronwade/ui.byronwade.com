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
  /scripts\//,
]

/** Paths where upstream shadcn may still use Tailwind shadows briefly */
const SHADCN_UI = /components\/ui\//

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
    id: "direct-lucide-import",
    re: /from\s+["']lucide-react["']/,
    message: "lucide-react banned — import from @/lib/icons (Phosphor)",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "direct-phosphor-import",
    re: /from\s+["']@phosphor-icons\/react(?:\/ssr)?["']/,
    message:
      "@phosphor-icons/react direct import banned — use @/lib/icons barrel",
    include: /\.(tsx|ts)$/,
    allow: /lib\/icons\.tsx$/,
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
  {
    id: "pure-white",
    re: /(?:bg|text|border|fill|stroke)-(?:white)(?:\/|\s|"|'|`|$)|['"`]#(?:fff|ffffff|FFF|FFFFFF)['"`]|oklch\(\s*1\s+0\s+0\s*\)/,
    message: "Pure white banned — use soft warm neutrals (background/card)",
    include: /\.(tsx|ts|css)$/,
  },
  {
    id: "pure-black",
    re: /(?:bg|text|border|fill|stroke)-(?:black)(?:\/|\s|"|'|`|$)|['"`]#(?:000|000000)['"`]|oklch\(\s*0\s+0\s+0/,
    message: "Pure black banned — use soft warm dock/foreground charcoal",
    include: /\.(tsx|ts|css)$/,
  },
  {
    id: "non-oklch-color",
    re: /(?:^|[\s:,(])(?:hsl|hsla|rgb|rgba|hwb|lab|lch)\(/i,
    message: "Non-OKLCH color function — tokens must be oklch(...) or var(--token)",
    include: /\.(tsx|ts|css)$/,
    exclude: SHADCN_UI,
  },
  {
    id: "foreground-opacity-cheat",
    re: /text-(?:dock-)?foreground\/(?:[1-9]\d?|100)\b/,
    message:
      "Opacity on foreground cheats contrast — use muted-foreground or dock-muted",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "off-scale-radius",
    re: /(?:^|[\s"'`])rounded-(?:md|xl|sm|4xl)(?:$|[\s"'`/:])/,
    message:
      "Off-scale radius — use rounded-lg (control) / 2xl (panel) / 3xl (shell) / full (pill)",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "low-contrast-on-dock",
    re: /bg-dock[^"'`\n]*text-brand\b|text-brand[^"'`\n]*bg-dock\b/,
    message:
      "Brand on dock without theater lift — wrap in data-tone=theater or use dock tokens",
    include: /\.(tsx|ts)$/,
  },
  {
    id: "arbitrary-px-height",
    re: /(?:^|[\s"'`])(?:h|min-h|max-h)-\[\d+(?:\.\d+)?px\]/,
    message:
      "Arbitrary px height — use h-control / h-row / h-(--control-h*) shell rhythm",
    include: /\.(tsx|ts)$/,
    exclude: SHADCN_UI,
  },
  {
    id: "arbitrary-px-type",
    // Closed chrome sizes 9–16px; prefer type-ui/row/meta/label under data-surface.
    re: /(?:^|[\s"'`])text-\[(?!(?:9|10|11|12|13|14|15|16)px\b)\d+(?:\.\d+)?px\]/,
    message:
      "Off-scale px type — use type-ui / type-row / type-meta / type-label (or 9–16px chrome)",
    include: /\.(tsx|ts)$/,
    exclude: SHADCN_UI,
  },
  {
    id: "arbitrary-px-padding",
    re: /(?:^|[\s"'`])(?:p|px|py|pt|pb|pl|pr|gap)-\[\d+(?:\.\d+)?px\]/,
    message:
      "Arbitrary px padding/gap — use shell-pad / shell-gap or 4px scale utilities",
    include: /\.(tsx|ts)$/,
    exclude: SHADCN_UI,
  },
  {
    id: "app-lane-gradient-spectacle",
    re: /bg-gradient-|from-(?:purple|violet|fuchsia|pink|orange)|via-(?:purple|violet|fuchsia)/,
    message:
      "Application lane: gradient spotlight / marketing collage banned (laneLaws)",
    include: /components\/surfaces\/(?:workbench|composer|application)/,
  },
  {
    id: "oklch-outside-token-files",
    re: /oklch\(/,
    message:
      "OKLCH literals only in knobs.ts / contrast.ts / globals.css — use presets",
    include: /\.(tsx|ts)$/,
    allow: /lib\/design\/(?:knobs|contrast)\.ts$/,
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
      if (rule.exclude && rule.exclude.test(rel)) continue
      if (rule.allow && rule.allow.test(rel)) continue
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
