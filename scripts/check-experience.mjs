#!/usr/bin/env node
/**
 * Ensures UX + DX twin pillars are frozen in grammar and documented.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const hits = []

async function read(rel) {
  return readFile(join(ROOT, rel), "utf8")
}

const experience = await read("lib/design/experience.ts")
const primitives = await read("lib/design/primitives.ts")
const index = await read("lib/design/index.ts")
const recipes = await read("lib/design/recipes.ts")
const northStar = await read("docs/north-star.md")
const ux = await read("docs/ux.md")
const dx = await read("docs/dx.md")
const systemDocs = await read("lib/docs/system-docs.ts")
const agents = await read("agents.md")
const forAgents = await read("app/meridian/for-agents/page.tsx")
const keyboard = await read("components/site/keyboard-proof.tsx")
const button = await read("components/ui/button.tsx")

for (const id of [
  "export const uxLaws",
  "export const dxLaws",
  "export const dxLoadTiers",
  "export const requiredUiStates",
  "export const interactionStateRecipe",
]) {
  if (!experience.includes(id)) {
    hits.push(`experience.ts: missing ${id}`)
  }
}

for (const key of [
  "usefulnessFirst",
  "emptyAndErrorOwned",
  "agentOutcomeThenTrace",
  "selfVerification",
  "closedTokenApi",
  "progressiveComplexity",
  "interactionClasses",
]) {
  if (!experience.includes(key)) {
    hits.push(`experience.ts: missing law ${key}`)
  }
}

for (const id of [
  "export const primitiveContracts",
  "export const primitiveLaws",
  "button",
  "input",
  "iconOnlyNeedsLabel",
]) {
  if (!primitives.includes(id.replace(/^export const /, "")) && !primitives.includes(id)) {
    hits.push(`primitives.ts: missing ${id}`)
  }
}

if (!index.includes('export * from "@/lib/design/experience"')) {
  hits.push("lib/design/index.ts: must re-export experience")
}
if (!index.includes('export * from "@/lib/design/primitives"')) {
  hits.push("lib/design/index.ts: must re-export primitives")
}

for (const z of [
  "uxLaws",
  "dxLaws",
  "dxLoadTiers",
  "requiredUiStates",
  "primitiveContracts",
  "interactionClasses",
]) {
  if (!recipes.includes(`"${z}"`) && !recipes.includes(z)) {
    hits.push(`recipes.ts zones.frozen: missing ${z}`)
  }
}

if (!forAgents.includes("GoldenPath") || !forAgents.includes("PrimitiveContractsPanel")) {
  hits.push("for-agents page: must lead with GoldenPath + PrimitiveContractsPanel")
}

if (!keyboard.includes("KeyboardProof") || !keyboard.includes("focus-visible")) {
  hits.push("keyboard-proof.tsx: missing KeyboardProof / focus-visible coverage")
}

if (!button.includes("motion-press") || !button.includes("focus-visible:ring-ring")) {
  hits.push("button.tsx: must keep motion-press + focus-visible ring (interactionClasses.control)")
}

if (!/twin pillars/i.test(northStar)) {
  hits.push("north-star.md: must declare UX + DX twin pillars")
}

if (!ux.includes("dx.md") || !/twin pillar/i.test(ux)) {
  hits.push("ux.md: must reference twin pillars / dx.md")
}

if (!dx.includes("Golden path") || !dx.includes("Always / Ask / Never")) {
  hits.push("dx.md: must document golden path + load tiers")
}

if (!systemDocs.includes('slug: "dx"') || !systemDocs.includes('slug: "ux"')) {
  hits.push("system-docs.ts: must list ux + dx")
}

if (!agents.includes("/system/ux") && !agents.includes("docs/ux.md") && !agents.includes("uxLaws")) {
  hits.push("agents.md: must reference UX/DX in load order")
}

if (hits.length === 0) {
  console.log("check:experience OK — UX/DX pillars frozen + documented")
  process.exit(0)
}

console.error(`check:experience FAILED — ${hits.length} issue(s)\n`)
for (const hit of hits) console.error(`  ${hit}`)
process.exit(1)
