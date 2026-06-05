// Reads registry.json: copies each item's files to its `target` inside the app,
// and generates app/foundation.generated.css from the foundation item's cssVars.
// Source of truth is registry/ ; the synced files are generated (git-ignored).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs"
import { dirname, join } from "node:path"

const root = process.cwd()
const reg = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))

// Only sync files that belong in the app tree (components/*, lib/*). Items like
// `registry:file` (e.g. the design-rules Cursor rule) ship to a consumer project
// path and must not be materialized into this repo.
const isAppTarget = (target) =>
  target.startsWith("components/") || target.startsWith("lib/")

let copied = 0
for (const item of reg.items) {
  for (const f of item.files ?? []) {
    if (!isAppTarget(f.target)) continue
    const dest = join(root, f.target)
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(join(root, f.path), dest)
    copied++
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

writeFileSync(join(root, "app/foundation.generated.css"), css)

console.log(
  `sync-registry: copied ${copied} files + app/foundation.generated.css`,
)
