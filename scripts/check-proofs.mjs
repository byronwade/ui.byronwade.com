#!/usr/bin/env node
/**
 * Interactive proof + agent-rail completeness gate.
 *
 * - Agent surfaces must ship ActivityLegend + outcome-then-trace disclosure
 * - Resource proofs must own empty / loading / error
 * - Theme playground must use frozen knobs (no local OKLCH preset tables)
 * - Interactive proof recipes must exist in lib/design/recipes
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const hits = []

async function read(rel) {
  return readFile(join(ROOT, rel), "utf8")
}

const workbench = await read("components/surfaces/workbench.tsx")
const composer = await read("components/surfaces/composer-shell.tsx")
const playground = await read("components/site/theme-playground.tsx")
const recipes = await read("lib/design/recipes.ts")
const knobs = await read("lib/design/knobs.ts")

for (const [name, src] of [
  ["workbench.tsx", workbench],
  ["composer-shell.tsx", composer],
]) {
  if (!src.includes("ActivityLegend")) {
    hits.push(`${name}: agent proof missing ActivityLegend import/usage`)
  }
  if (!src.includes('"use client"') && !src.includes("'use client'")) {
    hits.push(`${name}: interactive proof must be a client component`)
  }
  if (!src.includes('data-slot="agent-outcome"') || !src.includes('data-slot="agent-trace"')) {
    hits.push(`${name}: agent disclosure needs agent-outcome + agent-trace`)
  }
  for (const state of ["loading", "error", "empty"]) {
    if (!src.toLowerCase().includes(state)) {
      hits.push(`${name}: resource proof must demonstrate "${state}" state`)
    }
  }
  if (!src.includes("role=\"alert\"") && !src.includes("role='alert'")) {
    hits.push(`${name}: error state needs role="alert"`)
  }
  if (!src.includes("aria-busy")) {
    hits.push(`${name}: loading state needs aria-busy`)
  }
}

if (!playground.includes("from \"@/lib/design\"") && !playground.includes("from '@/lib/design'")) {
  hits.push("theme-playground.tsx: must import presets from @/lib/design")
}
if (!playground.includes("brandPresets") || !playground.includes("knobStyleVars")) {
  hits.push("theme-playground.tsx: must use brandPresets + knobStyleVars from knobs")
}
if (/const brandPresets\s*=/.test(playground)) {
  hits.push("theme-playground.tsx: local brandPresets table banned — use lib/design/knobs")
}
const playgroundOklchLiterals = playground.match(/oklch\([^)]+\)/g) ?? []
if (playgroundOklchLiterals.length > 0) {
  hits.push(
    `theme-playground.tsx: ${playgroundOklchLiterals.length} OKLCH literal(s) — move presets to lib/design/knobs.ts`,
  )
}

for (const id of [
  "interactiveWorkbench",
  "interactiveComposer",
  "interactiveStudio",
  "defineInteractiveProof",
  "laneLaws",
  "motionLaws",
  "resourceProofStates",
  "ownsResourceStates",
  'disclosure: "outcome-then-trace"',
]) {
  if (!recipes.includes(id)) {
    hits.push(`recipes.ts: missing ${id}`)
  }
}

for (const id of ["brandPresets", "radiusPresets", "paperPresets", "knobDefaults"]) {
  if (!knobs.includes(`export const ${id}`)) {
    hits.push(`knobs.ts: missing export ${id}`)
  }
}

if (hits.length === 0) {
  console.log(
    "check:proofs OK — resource states, disclosure, legends, knobs present",
  )
  process.exit(0)
}

console.error(`check:proofs FAILED — ${hits.length} issue(s)\n`)
for (const hit of hits) console.error(`  ${hit}`)
process.exit(1)
