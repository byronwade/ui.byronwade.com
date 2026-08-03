#!/usr/bin/env node
/**
 * Emit public/r/meridian.contract.json from the TypeScript contract builder
 * via a small dynamic import of the built route helper logic duplicated here
 * for Node (no TS runtime). Keep in sync with lib/contracts/*.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(ROOT, "public", "r")
const outFile = join(outDir, "meridian.contract.json")

async function readTsExports(rel, names) {
  const src = await readFile(join(ROOT, rel), "utf8")
  const result = {}
  for (const name of names) {
    const arrayMatch = src.match(
      new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`),
    )
    if (arrayMatch) {
      result[name] = [...arrayMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      continue
    }
  }
  return result
}

const grammar = await readTsExports("lib/design/grammar.ts", [
  "colorRoles",
  "activityRoles",
  "provenanceRoles",
  "radii",
  "depths",
  "surfaces",
  "banned",
])

const typeset = await readTsExports("lib/design/typeset.ts", ["typesetPresets"])

const recipesSrc = await readFile(
  join(ROOT, "lib/contracts/task-recipes.ts"),
  "utf8",
)
const recipeIds = [...recipesSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1])

const fewSrc = await readFile(join(ROOT, "lib/contracts/few-shots.ts"), "utf8")
const fewIds = [...fewSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1])

const contract = {
  $schema: "https://ui.byronwade.com/r/meridian.contract.schema.json",
  id: "meridian",
  name: "Meridian",
  version: "0.1.0",
  priceMonthlyUsd: 9,
  mcp: {
    slug: "meridian",
    tools: [
      "get_contract",
      "resolve_token",
      "validate_ui",
      "list_primitives",
      "get_recipe",
    ],
  },
  urls: {
    home: "https://ui.byronwade.com/meridian",
    design: "https://ui.byronwade.com/meridian/design.md",
    agents: "https://ui.byronwade.com/meridian/agents.md",
    llms: "https://ui.byronwade.com/meridian/llms.txt",
    contract: "https://ui.byronwade.com/r/meridian.contract.json",
  },
  frozen: {
    colorRoles: grammar.colorRoles ?? [],
    activityRoles: grammar.activityRoles ?? [],
    provenanceRoles: grammar.provenanceRoles ?? [],
    radii: grammar.radii ?? [],
    depths: grammar.depths ?? [],
    surfaces: grammar.surfaces ?? [],
    banned: grammar.banned ?? [],
  },
  typesetPresets: typeset.typesetPresets ?? [],
  taskRecipeIds: recipeIds,
  fewShotIds: fewIds,
  generatedAt: new Date().toISOString(),
}

await mkdir(outDir, { recursive: true })
await writeFile(outFile, `${JSON.stringify(contract, null, 2)}\n`)
console.log(`wrote ${relativeSafe(outFile)}`)

function relativeSafe(p) {
  return p.replace(`${ROOT}/`, "")
}
