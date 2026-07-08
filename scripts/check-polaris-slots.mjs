#!/usr/bin/env node
/**
 * Ensures apps/polaris/app/polaris-components.css covers the core admin
 * data-slots that define the Polaris look. Full Linear-style coverage is a
 * follow-up; this gate keeps the intentional core from regressing.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const cssPath = path.join(root, "apps/polaris/app/polaris-components.css")
const uiDir = path.join(root, "apps/polaris/components/ui")

/** Slots that must stay styled for the Polaris admin signature. */
const CORE_SLOTS = [
  "card",
  "empty",
  "table-container",
  "button",
  "badge",
  "input",
  "textarea",
  "select-trigger",
  "dropdown-menu-content",
  "dialog-content",
  "popover-content",
  "command",
  "card-title",
  "switch",
  "checkbox",
]

function collectSlotsFromCss(text) {
  const slots = new Set()
  for (const match of text.matchAll(/\[data-slot="([^"]+)"\]/g)) {
    slots.add(match[1])
  }
  return slots
}

function collectSlotsFromUi() {
  const slots = new Set()
  for (const file of fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx"))) {
    const text = fs.readFileSync(path.join(uiDir, file), "utf8")
    for (const match of text.matchAll(/data-slot="([^"]+)"/g)) {
      slots.add(match[1])
    }
  }
  return slots
}

const MAIN_SITE_ONLY_SLOTS = new Set([
  "card-frame",
  "card-frame-title",
  "stat-card",
  "metric",
  "demo-preview-card",
  "pill",
  "filter-pill",
  "section",
  "page-header-title",
  "detail-header-title",
  "badge",
  "sidebar-menu-button",
])

const cssText = fs.readFileSync(cssPath, "utf8")
const cssSlots = collectSlotsFromCss(cssText)
const uiSlots = collectSlotsFromUi()

const missingCore = CORE_SLOTS.filter((s) => !cssSlots.has(s))
const orphaned = [...cssSlots]
  .filter((s) => !uiSlots.has(s) && !MAIN_SITE_ONLY_SLOTS.has(s))
  .sort()

if (missingCore.length) {
  console.error("polaris-components.css is missing core data-slot rules:\n")
  for (const slot of missingCore) console.error(`  - ${slot}`)
  process.exit(1)
}

if (orphaned.length) {
  console.warn(
    `check-polaris-slots: warning — CSS references slots not found in UI: ${orphaned.join(", ")}`,
  )
}

console.log(
  `check-polaris-slots: OK — ${cssSlots.size} styled slots, ${CORE_SLOTS.length} core slots covered.`,
)
