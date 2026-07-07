#!/usr/bin/env node
/**
 * Fails when Linear app UI source contains patterns that fight LINEAR-DESIGN-SYSTEM.md.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = path.join(root, "apps/linear/components/ui")

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
    ],
  },
]

function scanFile(filePath, relativePath) {
  const text = fs.readFileSync(filePath, "utf8")
  const hits = []
  for (const rule of RULES) {
    if (rule.allow?.some((name) => relativePath.endsWith(name))) continue
    if (rule.pattern.test(text)) {
      hits.push(rule)
    }
  }
  return hits
}

let failed = false

for (const file of fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx"))) {
  const full = path.join(uiDir, file)
  const hits = scanFile(full, file)
  if (hits.length) {
    failed = true
    console.error(`${file}:`)
    for (const hit of hits) {
      console.error(`  - ${hit.message}`)
    }
  }
}

if (failed) {
  console.error("\ncheck-linear-visual: failed — fix patterns above or update allowlist.")
  process.exit(1)
}

console.log("check-linear-visual: OK — no off-brand patterns in apps/linear/components/ui")
