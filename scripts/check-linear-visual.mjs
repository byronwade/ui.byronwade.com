#!/usr/bin/env node
/**
 * Fails when Linear app UI / composite source contains patterns that fight
 * LINEAR-DESIGN-SYSTEM.md.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = path.join(root, "apps/linear/components/ui")
const linearDir = path.join(root, "apps/linear/components/linear")

/**
 * Allowlist is relative to the scanned file basename (e.g. "drawer.tsx")
 * or a path suffix under components/ (e.g. "ui/sidebar.tsx").
 */
const RULES = [
  {
    id: "light-overlay",
    pattern: /bg-black\/(?:5|10|15|20)\b/,
    message: "Overlays should use bg-black/85 (Linear --color-overlay-primary)",
    allow: ["drawer.tsx"],
  },
  {
    id: "heavy-ring",
    pattern: /ring-foreground\/10/,
    message: "Floating surfaces use hairline border + shadow, not ring-foreground/10",
  },
  {
    id: "bold-headings",
    pattern: /\bfont-bold\b/,
    message: "Linear uses 510/590 weights, not font-bold",
  },
  {
    id: "pill-button",
    pattern: /rounded-full/,
    message: "Controls are 4–6px radius; rounded-full is for avatars/switches only",
    allow: [
      "switch.tsx",
      "checkbox.tsx",
      "radio-group.tsx",
      "slider.tsx",
      "avatar.tsx",
      "carousel.tsx",
      "progress.tsx",
      "drawer.tsx",
      "message.tsx",
      // Linear composites: filter chips, send affordances, status dots, pills
      "search-shell.tsx",
      "ask-linear-welcome.tsx",
      "ask-linear-panel.tsx",
      "ask-linear-chat-panel.tsx",
      "backlog-issue-row.tsx",
      "settings-shell.tsx",
      "project-detail.tsx",
      "workspace-shell.tsx",
      "issue-row.tsx",
    ],
  },
  {
    id: "shadow-sm",
    pattern: /\bshadow-sm\b/,
    message: "Prefer shadow-none + hairline border; depth comes from linear-components.css",
    allow: [
      // Floating / inset chrome that still uses Tailwind elevation
      "ui/sidebar.tsx",
      "ui/tabs.tsx",
    ],
  },
  {
    id: "shadow-md",
    pattern: /\bshadow-md\b/,
    message: "Prefer shadow-none + hairline border; depth comes from linear-components.css",
    allow: [
      "ui/popover.tsx",
      "ui/dropdown-menu.tsx",
      "ui/navigation-menu.tsx",
      "ui/combobox.tsx",
      "ui/select.tsx",
      "ui/context-menu.tsx",
      "ui/hover-card.tsx",
      "ui/menubar.tsx",
    ],
  },
  {
    id: "rounded-2xl",
    pattern: /\brounded-2xl\b/,
    message: "Linear control/panel radius is 4–12px (rounded-md/lg), not rounded-2xl",
  },
  {
    id: "raw-hex-bg",
    pattern: /\bbg-\[#/,
    message: "Use semantic tokens / CSS variables, not raw hex backgrounds",
  },
]

function isAllowed(rule, relativePath) {
  if (!rule.allow?.length) return false
  const base = path.basename(relativePath)
  return rule.allow.some(
    (name) => relativePath.endsWith(name) || base === name || relativePath === name,
  )
}

function scanFile(filePath, relativePath) {
  const text = fs.readFileSync(filePath, "utf8")
  const hits = []
  for (const rule of RULES) {
    if (isAllowed(rule, relativePath)) continue
    if (rule.pattern.test(text)) {
      hits.push(rule)
    }
  }
  return hits
}

function scanDir(dir, prefix) {
  let failed = false
  if (!fs.existsSync(dir)) return failed
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const full = path.join(dir, file)
    const relativePath = `${prefix}/${file}`
    const hits = scanFile(full, relativePath)
    if (hits.length) {
      failed = true
      console.error(`${relativePath}:`)
      for (const hit of hits) {
        console.error(`  - [${hit.id}] ${hit.message}`)
      }
    }
  }
  return failed
}

let failed = false
failed = scanDir(uiDir, "ui") || failed
failed = scanDir(linearDir, "linear") || failed

if (failed) {
  console.error(
    "\ncheck-linear-visual: failed — fix patterns above or update allowlist in scripts/check-linear-visual.mjs.",
  )
  process.exit(1)
}

console.log(
  "check-linear-visual: OK — no off-brand patterns in apps/linear/components/{ui,linear}",
)
