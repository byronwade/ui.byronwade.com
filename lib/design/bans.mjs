/**
 * Consistency bans — the ONE definition of what this design system forbids.
 *
 * Every consumer reads this file. Before it existed there were four
 * divergent implementations (CI gate, MCP `validate_ui`, an orphan script,
 * an eval harness), so an agent could pass the tool it was told was
 * authoritative and still fail CI. Never re-declare a pattern elsewhere.
 *
 * Consumers:
 *   scripts/check-design.mjs        — repository gate (file mode)
 *   packages/contract-mcp/server.mjs — `validate_ui` tool (snippet mode)
 *   scripts/gen-contract.mjs        — `banned` in every contract JSON
 *   lib/design/grammar.ts           — typed `banned` names for the app
 *
 * Plain `.mjs` on purpose: node scripts and the stdio MCP server run it with
 * no build step, and TypeScript imports it through `allowJs`.
 *
 * Each ban has:
 *   id       stable name — appears in contract JSON and agent output
 *   why      one line an agent can act on
 *   fix      the on-system alternative
 *   re       pattern, or null when the ban needs human/visual review
 *   mode     "both" (file + snippet) | "file" (needs path context)
 *   include/exclude/allow  file-mode path scoping
 */

/** Upstream shadcn may still carry Tailwind shadows and raw color fns. */
const SHADCN_UI = /components\/ui\//
const TS_FILES = /\.(tsx|ts)$/

/** @typedef {{id:string,why:string,fix:string,re:RegExp|null,mode:"both"|"file",include?:RegExp,exclude?:RegExp,allow?:RegExp}} Ban */

/** @type {readonly Ban[]} */
export const bans = [
  {
    id: "arbitrary-color-utility",
    why: "Arbitrary color utility escapes the token layer",
    fix: "Use a semantic token (bg-brand, text-foreground, border-border)",
    re: /(?:text|bg|border|ring|fill|stroke)-\[#(?:[0-9a-fA-F]{3,8})\]/,
    mode: "both",
  },
  {
    id: "raw-hex-color",
    why: "Raw hex bypasses OKLCH roles and breaks re-skinning",
    fix: "Use tokens; OKLCH literals belong in knobs.ts / globals.css",
    re: /['"`]#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})['"`]/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "non-oklch-color",
    why: "Non-OKLCH color function — tokens must be oklch(...) or var(--token)",
    fix: "Convert to oklch() or reference a CSS variable",
    re: /(?:^|[\s:,(])(?:hsl|hsla|rgb|rgba|hwb|lab|lch)\(/i,
    mode: "both",
    include: /\.(tsx|ts|css)$/,
    exclude: SHADCN_UI,
  },
  {
    id: "tailwind-shadow",
    why: "Tailwind shadow-* is off the depth ramp",
    fix: "Use edge / depth-soft / depth-raised",
    re: /(?:^|[\s"'`])shadow-(?:sm|md|lg|xl|2xl|inner)(?:$|[\s"'`])/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "dvh-viewport",
    why: "Dynamic viewport units jerk the page when mobile chrome hides",
    fix: "Use svh (stable viewport)",
    re: /min-h-dvh|h-dvh|100dvh/,
    mode: "both",
  },
  {
    id: "font-bold-display",
    why: "Bold display weight — hierarchy comes from size and tracking",
    fix: "font-medium at most",
    re: /text-\[clamp[^\]]*\][^"'`\n]*font-bold|font-bold[^"'`\n]*text-\[clamp/,
    mode: "both",
  },
  {
    id: "pure-white",
    why: "Pure white is not in the paper stack",
    fix: "Use background / card / muted",
    re: /(?:bg|text|border|fill|stroke|from|via|to)-(?:white)(?:\/|\s|"|'|`|$)|['"`]#(?:fff|ffffff|FFF|FFFFFF)['"`]|oklch\(\s*1\s+0\s+0\s*\)/,
    mode: "both",
    include: /\.(tsx|ts|css)$/,
  },
  {
    id: "pure-black",
    why: "Pure black is not in the ink stack",
    fix: "Use dock / foreground charcoal",
    re: /(?:bg|text|border|fill|stroke|from|via|to)-(?:black)(?:\/|\s|"|'|`|$)|['"`]#(?:000|000000)['"`]|oklch\(\s*0\s+0\s+0/,
    mode: "both",
    include: /\.(tsx|ts|css)$/,
  },
  {
    id: "foreground-opacity-cheat",
    why: "Opacity on foreground fakes hierarchy and fails contrast audits",
    fix: "Use muted-foreground / dock-muted / stage-ink-muted",
    re: /text-(?:dock-)?foreground\/(?:[1-9]\d?|100)\b/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "low-contrast-on-dock",
    why: "Brand on dock without the theater lift fails AA",
    fix: 'Wrap in data-tone="theater" or use dock tokens',
    re: /bg-dock[^"'`\n]*text-brand\b|text-brand[^"'`\n]*bg-dock\b/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "direct-lucide-import",
    why: "lucide-react is not this system's icon set",
    fix: 'Import from "@/lib/icons" (Phosphor, duotone)',
    re: /from\s+["']lucide-react["']/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "direct-phosphor-import",
    why: "Direct Phosphor import skips the duotone barrel",
    fix: 'Import from "@/lib/icons"',
    re: /from\s+["']@phosphor-icons\/react(?:\/ssr)?["']/,
    mode: "both",
    include: TS_FILES,
    allow: /lib\/icons\.tsx$/,
  },
  {
    id: "off-scale-radius",
    why: "Radius outside the control/panel/shell/pill set",
    fix: "rounded-lg (control) · 2xl (panel) · 3xl (shell) · full (pill)",
    re: /(?:^|[\s"'`])rounded-(?:md|xl|sm|4xl)(?:$|[\s"'`/:])/,
    mode: "both",
    include: TS_FILES,
  },
  {
    id: "arbitrary-px-height",
    why: "Off-scale height breaks shell rhythm across density lanes",
    fix: "h-control / h-row / h-(--control-h*)",
    re: /(?:^|[\s"'`])(?:h|min-h|max-h)-\[\d+(?:\.\d+)?px\]/,
    mode: "both",
    include: TS_FILES,
    exclude: SHADCN_UI,
  },
  {
    id: "arbitrary-px-type",
    why: "Off-scale type does not remap with data-surface",
    fix: "type-ui / type-row / type-meta / type-label (9–16px chrome allowed)",
    re: /(?:^|[\s"'`])text-\[(?!(?:9|10|11|12|13|14|15|16)px\b)\d+(?:\.\d+)?px\]/,
    mode: "both",
    include: TS_FILES,
    exclude: SHADCN_UI,
  },
  {
    id: "arbitrary-px-padding",
    why: "Off-scale padding breaks the 4px grid",
    fix: "shell-pad / shell-gap or the 4px scale",
    re: /(?:^|[\s"'`])(?:p|px|py|pt|pb|pl|pr|gap)-\[\d+(?:\.\d+)?px\]/,
    mode: "both",
    include: TS_FILES,
    exclude: SHADCN_UI,
  },
  {
    id: "mix-blend-chrome",
    why: "mix-blend on chrome causes scroll and paint jank",
    fix: "Use a token wash instead",
    re: /mix-blend-(?:difference|exclusion)/,
    mode: "both",
  },
  {
    id: "content-visibility-auto",
    why: "content-visibility:auto causes reverse-scroll jumps",
    fix: "Remove it; keep stages stable",
    re: /content-visibility:\s*auto/,
    mode: "both",
  },
  {
    id: "app-lane-gradient-spectacle",
    why: "Application lane must stay quiet — no marketing collage",
    fix: "Neutral surfaces; save spectacle for cinema tiles",
    re: /bg-gradient-|from-(?:purple|violet|fuchsia|pink|orange)|via-(?:purple|violet|fuchsia)/,
    mode: "file",
    include: /components\/surfaces\/(?:workbench|composer|application)/,
  },
  {
    id: "oklch-outside-token-files",
    why: "OKLCH literals scattered in components defeat the token layer",
    fix: "Use presets from lib/design/knobs.ts or CSS variables",
    re: /oklch\(/,
    mode: "file",
    include: TS_FILES,
    allow: /lib\/design\/(?:knobs|contrast)\.ts$/,
  },

  /* ── Review-only bans ────────────────────────────────────────────
     Real rules with no reliable pattern. They ship in the contract
     vocabulary so agents and reviewers share one list; a mechanical
     sensor here would be noise, not a ratchet. */
  {
    id: "scroll-choreography",
    why: "Scroll-driven animation fights the reader; motion stays micro",
    fix: "Quiet entrance at most",
    re: null,
    mode: "both",
  },
  {
    id: "overlay-stickers-on-media",
    why: "Badges pasted on media break the full-bleed frame",
    fix: "Put copy beside the media, not on it",
    re: null,
    mode: "both",
  },
  {
    id: "inset-hero-media",
    why: "Hero media is full-bleed — never an inset card",
    fix: "Bleed to the edge, or use an app window",
    re: null,
    mode: "both",
  },
  {
    id: "bright-neon-accent",
    why: "One deep accent; neon reads as noise",
    fix: "Use --brand from the contract skin",
    re: null,
    mode: "both",
  },
  {
    id: "second-accent",
    why: "A second accent destroys the single-accent contract",
    fix: "primary / ring / selected / success all resolve to --brand",
    re: null,
    mode: "both",
  },
  {
    id: "cream-terracotta-cliche",
    why: "Stock warm-minimal palette is not this system's paper",
    fix: "Use the contract's OKLCH neutrals",
    re: null,
    mode: "both",
  },
  {
    id: "influence-brand-labels",
    why: "Influences are absorbed, never labelled in UI",
    fix: "Ship the behavior, drop the brand name",
    re: null,
    mode: "both",
  },
  {
    id: "floating-chatbot",
    why: "AI binds to an object, not to a corner bubble",
    fix: "Bind the rail to the selected object with provenance",
    re: null,
    mode: "both",
  },
  {
    id: "nested-demo-scrollports",
    why: "Scrollports inside scrollports trap the wheel",
    fix: "One scroll owner per region",
    re: null,
    mode: "both",
  },
]

/** Stable ban names — mirrored by `banned` in lib/design/grammar.ts. */
export const banIds = bans.map((b) => b.id)

/** Bans with a pattern, i.e. the ones a machine can enforce. */
export const mechanicalBans = bans.filter((b) => b.re !== null)

/**
 * Lint a snippet (no file path). Used by the MCP `validate_ui` tool, so the
 * verdict an agent gets is the verdict CI will give.
 * @param {string} source
 */
export function lintSource(source) {
  const hits = []
  for (const ban of mechanicalBans) {
    if (ban.mode !== "both") continue
    if (ban.re.test(source)) {
      hits.push({ ban: ban.id, why: ban.why, fix: ban.fix })
    }
  }
  return hits
}

/**
 * Lint one line of a known file, applying path scoping.
 * @param {string} line
 * @param {string} relPath repo-relative path
 */
export function lintLine(line, relPath) {
  const hits = []
  for (const ban of mechanicalBans) {
    if (ban.include && !ban.include.test(relPath)) continue
    if (ban.exclude && ban.exclude.test(relPath)) continue
    if (ban.allow && ban.allow.test(relPath)) continue
    if (ban.re.test(line)) {
      hits.push({ ban: ban.id, why: ban.why, fix: ban.fix })
    }
  }
  return hits
}
