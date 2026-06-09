// Reads registry.json: copies each item's files to its `target` inside the app,
// and generates app/foundation.generated.css from the foundation item's cssVars.
// Source of truth is registry/ ; the synced files are generated (git-ignored).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"

const root = process.cwd()
const reg = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))

// Write only when content actually differs. Rewriting an identical file still
// bumps its mtime, which makes Turbopack treat it as changed and re-process it
// on every `npm run dev` — that churn accumulates and bloats `.next/dev`
// (seen at 9.3 GB → OOM crash). Skipping unchanged writes keeps the dev cache
// stable across launches. See docs/superpowers memory on the dev-server cache.
function writeIfChanged(dest, content) {
  if (existsSync(dest) && readFileSync(dest, "utf8") === content) return false
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, content)
  return true
}

// Only sync files that belong in the app tree (components/*, lib/*). Items like
// `registry:file` (e.g. the design-rules Cursor rule) ship to a consumer project
// path and must not be materialized into this repo.
const isAppTarget = (target) =>
  target.startsWith("components/") || target.startsWith("lib/")

let written = 0
let skipped = 0
for (const item of reg.items) {
  for (const f of item.files ?? []) {
    if (!isAppTarget(f.target)) continue
    const dest = join(root, f.target)
    const src = readFileSync(join(root, f.path), "utf8")
    if (writeIfChanged(dest, src)) written++
    else skipped++
  }
}

const foundation = reg.items.find((i) => i.name === "foundation")
const v = foundation.cssVars
const lines = (obj) =>
  Object.entries(obj)
    .map(([k, val]) => `  --${k}: ${val};`)
    .join("\n")

function emitCss(obj, indent = "") {
  let out = ""
  for (const [k, val] of Object.entries(obj)) {
    if (val && typeof val === "object")
      out += `${indent}${k} {\n${emitCss(val, indent + "  ")}${indent}}\n`
    else out += `${indent}${k}: ${val};\n`
  }
  return out
}

let css =
  `/* GENERATED from registry.json (foundation) — do not edit. Run \`npm run sync\`. */\n` +
  `@theme inline {\n${lines(v.theme)}\n}\n\n` +
  `:root {\n${lines(v.light)}\n}\n\n` +
  `.dark {\n${lines(v.dark)}\n}\n`

if (foundation.css) {
  css += "\n" + emitCss(foundation.css)
}

const cssChanged = writeIfChanged(
  join(root, "app/foundation.generated.css"),
  css,
)

console.log(
  `sync-registry: ${written} written, ${skipped} unchanged` +
    `${cssChanged ? " + foundation.css" : ""}`,
)
