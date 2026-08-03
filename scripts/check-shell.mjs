#!/usr/bin/env node
/**
 * Ensures shell rhythm CSS vars + utilities exist for every data-surface.
 * Keeps app shells from drifting off the spacing / sizing / type contract.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const globals = await readFile(join(ROOT, "app/globals.css"), "utf8")
const shellSrc = await readFile(join(ROOT, "lib/design/shell.ts"), "utf8")

const surfaceIds = ["application", "marketing", "mobile", "desktop"]
const requiredVars = [
  "--control-h",
  "--row-h",
  "--surface-pad",
  "--surface-gap",
  "--type-ui",
  "--type-row",
  "--type-meta",
  "--type-label",
  "--leading-ui",
  "--leading-tight",
]

const hits = []

for (const id of surfaceIds) {
  const blockRe = new RegExp(
    `\\[data-surface="${id}"\\]\\s*\\{([\\s\\S]*?)\\n\\s*\\}`,
    "m",
  )
  const match = globals.match(blockRe)
  if (!match) {
    hits.push(`Missing [data-surface="${id}"] block in globals.css`)
    continue
  }
  const body = match[1]
  for (const v of requiredVars) {
    if (!body.includes(`${v}:`)) {
      hits.push(`[data-surface="${id}"] missing ${v}`)
    }
  }
  if (!shellSrc.includes(`${id}:`)) {
    hits.push(`shell.ts missing rhythm entry for ${id}`)
  }
}

for (const util of [
  ".type-ui",
  ".type-row",
  ".type-meta",
  ".type-label",
  ".shell-pad",
  ".shell-gap",
  ".shell-stack",
  ".h-control",
  ".h-row",
]) {
  if (!globals.includes(util)) {
    hits.push(`Missing utility ${util} in globals.css`)
  }
}

for (const key of ["shellRhythm", "shellLaws", "controlScale", "spaceScale"]) {
  if (!shellSrc.includes(`export const ${key}`)) {
    hits.push(`shell.ts missing export const ${key}`)
  }
}

if (!shellSrc.includes("export function getShellRhythm")) {
  hits.push("shell.ts missing getShellRhythm")
}

if (hits.length === 0) {
  console.log(
    `check:shell OK — ${surfaceIds.length} surfaces × ${requiredVars.length} vars + utilities`,
  )
  process.exit(0)
}

console.error(`check:shell FAILED — ${hits.length} issue(s)\n`)
for (const hit of hits) console.error(`  ${hit}`)
process.exit(1)
