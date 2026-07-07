#!/usr/bin/env node
/**
 * Ensures apps/linear/app/linear-components.css styles every data-slot
 * emitted by apps/linear/components/ui (minus optional portal/trigger shells).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = path.join(root, "apps/linear/components/ui")
const cssPath = path.join(root, "apps/linear/app/linear-components.css")

const OPTIONAL_SLOTS = new Set([
  "tooltip-provider",
  "dialog-portal",
  "sheet-portal",
  "drawer-portal",
  "alert-dialog-portal",
  "popover-trigger",
  "dialog-trigger",
  "sheet-trigger",
  "drawer-trigger",
  "alert-dialog-trigger",
  "dropdown-menu-portal",
  "dropdown-menu-trigger",
  "context-menu-portal",
  "context-menu-trigger",
  "menubar-portal",
  "hover-card-portal",
  "hover-card-trigger",
  "navigation-menu-indicator",
  "select-scroll-up-button",
  "select-scroll-down-button",
  "accordion-trigger-icon",
  "combobox-collection",
  "combobox-value",
  "combobox-clear",
  "combobox-trigger",
  "combobox-label",
  "combobox-group",
  "combobox-chips",
  "combobox-chip-input",
  "combobox-chip-remove",
  "combobox-separator",
  "command-empty",
  "command-list",
  "sidebar-gap",
  "sidebar-wrapper",
  "sidebar-rail",
  "sidebar-menu-skeleton",
  "sidebar-menu-sub",
  "sidebar-menu-sub-item",
  "drawer-popup",
  "drawer-viewport",
  "drawer-swipe-handle",
  "drawer-close",
  "dialog-close",
  "sheet-close",
  "alert-action",
  "alert-dialog-media",
  "alert-dialog-header",
  "alert-dialog-footer",
  "popover-header",
  "popover-title",
  "popover-description",
  "empty-icon",
  "item-header",
  "item-separator",
  "field-content",
  "field-legend",
  "field-separator-content",
  "progress-label",
  "progress-value",
  "message-avatar",
  "message-header",
  "message-footer",
  "message-group",
  "bubble-group",
  "bubble-reactions",
  "attachment-group",
  "avatar-badge",
  "avatar-group",
  "avatar-group-count",
  "breadcrumb-ellipsis",
  "pagination-ellipsis",
  "pagination-content",
  "pagination-item",
  "table-body",
  "table-header",
  "table-footer",
  "table-head",
  "table-caption",
  "native-select-wrapper",
  "native-select-icon",
  "native-select-optgroup",
  "native-select-option",
  "input-group-control",
  "input-group-addon",
  "checkbox-indicator",
  "radio-group-indicator",
  "toggle",
  "marker-icon",
  "marker-content",
  "carousel-content",
  "carousel-item",
  "command-input-wrapper",
  "command-group",
  "command-shortcut",
  "context-menu-group",
  "context-menu-label",
  "context-menu-sub",
  "context-menu-sub-content",
  "context-menu-sub-trigger",
  "context-menu-checkbox-item",
  "context-menu-radio-group",
  "context-menu-radio-item",
  "context-menu-shortcut",
  "dropdown-menu-group",
  "dropdown-menu-label",
  "dropdown-menu-sub",
  "dropdown-menu-sub-content",
  "dropdown-menu-sub-trigger",
  "dropdown-menu-checkbox-item",
  "dropdown-menu-checkbox-item-indicator",
  "dropdown-menu-radio-group",
  "dropdown-menu-radio-item",
  "dropdown-menu-radio-item-indicator",
  "dropdown-menu-shortcut",
  "menubar-group",
  "menubar-label",
  "menubar-menu",
  "menubar-sub",
  "menubar-sub-content",
  "menubar-sub-trigger",
  "menubar-checkbox-item",
  "menubar-radio-group",
  "menubar-radio-item",
  "menubar-shortcut",
  "navigation-menu",
  "navigation-menu-list",
  "navigation-menu-link",
  "navigation-menu-trigger",
  "select-group",
  "select-label",
  "scroll-area",
  "scroll-area-viewport",
  "scroll-area-scrollbar",
  "dialog-header",
  "dialog-footer",
  "sheet-header",
  "sheet-footer",
  "drawer-header",
  "drawer-footer",
  "card-header",
  "card-content",
  "card-action",
  "resizable-panel",
  "resizable-panel-group",
  "tabs-content",
  "field-set",
  "field-group",
  "field-separator",
  "empty-header",
  "empty-content",
  "item-actions",
  "item-media",
  "item-content",
  "message-scroller-button",
  "message-scroller-content",
  "message-scroller-item",
  "message-content",
  "attachment-action",
  "attachment-actions",
  "avatar-image",
  "avatar-fallback",
  "breadcrumb-list",
  "breadcrumb-item",
  "breadcrumb-page",
  "breadcrumb-separator",
  "button-group-separator",
  "input-otp-group",
  "input-otp-separator",
  "sidebar-container",
  "sidebar-inner",
  "sidebar-content",
  "sidebar-header",
  "sidebar-footer",
  "sidebar-inset",
  "sidebar-menu",
  "sidebar-menu-item",
  "sidebar-trigger",
  "sidebar-separator",
  "sidebar-group",
  "sidebar-group-content",
])

function collectSlotsFromUi() {
  const slots = new Set()
  for (const file of fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx"))) {
    const text = fs.readFileSync(path.join(uiDir, file), "utf8")
    for (const match of text.matchAll(/data-slot="([^"]+)"/g)) {
      slots.add(match[1])
    }
    for (const match of text.matchAll(/slot:\s*"([^"]+)"/g)) {
      slots.add(match[1])
    }
  }
  return slots
}

function collectSlotsFromCss(text) {
  const slots = new Set()
  for (const match of text.matchAll(/\[data-slot="([^"]+)"\]/g)) {
    slots.add(match[1])
  }
  return slots
}

const uiSlots = collectSlotsFromUi()
const cssText = fs.readFileSync(cssPath, "utf8")
const cssSlots = collectSlotsFromCss(cssText)

const required = [...uiSlots].filter((s) => !OPTIONAL_SLOTS.has(s)).sort()
const missing = required.filter((s) => !cssSlots.has(s))

if (missing.length) {
  console.error("linear-components.css is missing rules for data-slot values:\n")
  for (const slot of missing) {
    console.error(`  - ${slot}`)
  }
  console.error(`\n${missing.length} uncovered slot(s). Add selectors or OPTIONAL_SLOTS.`)
  process.exit(1)
}

console.log(
  `check-linear-slots: OK — ${cssSlots.size} styled slots, ${required.length} required UI slots covered.`
)
