#!/usr/bin/env node
/**
 * Emit public/r/{id}.contract.json for EVERY DNA pack.
 * Structural fields come from lib/platform/skeleton.ts (parsed).
 * Never hand-edit a single contract JSON into a unique shape.
 */
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(ROOT, "public", "r")
const DNA_DIR = join(ROOT, "lib/contracts/dna")

const MCP_TOOLS = [
  "get_contract",
  "resolve_token",
  "validate_ui",
  "list_primitives",
  "get_recipe",
]

const CONTRACT_JSON_KEYS = [
  "$schema",
  "platform",
  "id",
  "name",
  "version",
  "priceMonthlyUsd",
  "mcp",
  "urls",
  "aesthetic",
  "frozen",
  "laws",
  "typesetPresets",
  "shellSurfaces",
  "taskRecipes",
  "fewShots",
]

async function readDnaFiles() {
  const entries = await readdir(DNA_DIR)
  const ids = []
  for (const name of entries) {
    if (!name.endsWith(".ts")) continue
    if (name === "index.ts" || name === "types.ts") continue
    const src = await readFile(join(DNA_DIR, name), "utf8")
    const id = src.match(/id:\s*"([^"]+)"/)?.[1]
    const display = src.match(/name:\s*"([^"]+)"/)?.[1]
    const version = src.match(/version:\s*"([^"]+)"/)?.[1] ?? "0.0.0"
    const aesthetic = src.match(/aesthetic:\s*"([^"]+)"/)?.[1] ?? ""
    const status = src.match(/status:\s*"([^"]+)"/)?.[1] ?? "soon"
    if (id) ids.push({ id, name: display ?? id, version, aesthetic, status })
  }
  return ids.sort((a, b) => a.id.localeCompare(b.id))
}

async function readTsStringArray(rel, exportName) {
  const src = await readFile(join(ROOT, rel), "utf8")
  const arrayMatch = src.match(
    new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`),
  )
  if (!arrayMatch) return []
  return [...arrayMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
}

const grammar = {
  colorRoles: await readTsStringArray("lib/design/grammar.ts", "colorRoles"),
  activityRoles: await readTsStringArray(
    "lib/design/grammar.ts",
    "activityRoles",
  ),
  provenanceRoles: await readTsStringArray(
    "lib/design/grammar.ts",
    "provenanceRoles",
  ),
  radii: await readTsStringArray("lib/design/grammar.ts", "radii"),
  depths: await readTsStringArray("lib/design/grammar.ts", "depths"),
  surfaces: await readTsStringArray("lib/design/grammar.ts", "surfaces"),
  banned: await readTsStringArray("lib/design/grammar.ts", "banned"),
  typesetPresets: await readTsStringArray(
    "lib/design/typeset.ts",
    "typesetPresets",
  ),
}

const recipesSrc = await readFile(
  join(ROOT, "lib/contracts/task-recipes.ts"),
  "utf8",
)
const recipeIds = [...recipesSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1])

const fewSrc = await readFile(join(ROOT, "lib/contracts/few-shots.ts"), "utf8")
const fewIds = [...fewSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1])

const dnas = await readDnaFiles()
await mkdir(outDir, { recursive: true })

for (const dna of dnas) {
  const site = "https://ui.byronwade.com"
  const live = dna.status === "live"
  const contract = {
    $schema: `${site}/r/${dna.id}.contract.schema.json`,
    platform: {
      id: "design-contracts",
      version: "1.0.0",
      mcpTools: MCP_TOOLS,
      priceMonthlyUsd: 9,
      contractJsonKeys: CONTRACT_JSON_KEYS,
    },
    id: dna.id,
    name: dna.name,
    version: dna.version,
    priceMonthlyUsd: 9,
    mcp: { slug: dna.id, tools: [...MCP_TOOLS] },
    urls: {
      home: `${site}/${dna.id}`,
      design: `${site}/${dna.id}/design.md`,
      agents: `${site}/${dna.id}/agents.md`,
      architecture: `${site}/${dna.id}/architecture.md`,
      llms: `${site}/${dna.id}/llms.txt`,
      contract: `${site}/r/${dna.id}.contract.json`,
    },
    aesthetic: dna.aesthetic,
    status: dna.status,
    taskRecipeIds: recipeIds,
    fewShotIds: fewIds,
    generatedAt: new Date().toISOString(),
  }

  // Live contracts embed Meridian grammar today; stubs stay structural-only.
  if (live && dna.id === "meridian") {
    contract.frozen = {
      colorRoles: grammar.colorRoles,
      activityRoles: grammar.activityRoles,
      provenanceRoles: grammar.provenanceRoles,
      radii: grammar.radii,
      depths: grammar.depths,
      surfaces: grammar.surfaces,
      banned: grammar.banned,
    }
    contract.typesetPresets = grammar.typesetPresets
  }

  const outFile = join(outDir, `${dna.id}.contract.json`)
  await writeFile(outFile, `${JSON.stringify(contract, null, 2)}\n`)
  console.log(`wrote public/r/${dna.id}.contract.json`)
}

console.log(`gen:contract OK — ${dnas.length} contract(s), shared platform shape`)
