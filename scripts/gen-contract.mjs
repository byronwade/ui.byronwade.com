#!/usr/bin/env node
/**
 * Emit slim consistency-kit JSON for EVERY DNA pack + shared MCP kit snapshot.
 * Fat docs stay in markdown — MCP payloads stay small and imperative.
 */
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { banIds } from "../lib/design/bans.mjs"

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
  "mandate",
  "tokens",
  "banned",
  "consistencyBans",
  "primitives",
  "recipes",
]

async function readTsStringArray(rel, exportName) {
  const src = await readFile(join(ROOT, rel), "utf8")
  const arrayMatch = src.match(
    new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`),
  )
  if (!arrayMatch) return []
  return [...arrayMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
}

async function readMandate() {
  const src = await readFile(join(ROOT, "lib/platform/consistency.ts"), "utf8")
  function block(name) {
    const m = src.match(
      new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`, "m"),
    )
    if (!m) return []
    return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
  }
  const purpose =
    src.match(/purpose:\s*"([^"]+)"/)?.[1] ??
    "Keep application UI consistent across the product."
  return {
    purpose,
    beforeUi: block("beforeUi"),
    beforeDone: block("beforeDone"),
    must: block("must"),
    mustNot: block("mustNot"),
  }
}

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

function parseRecipes(src) {
  const recipes = []
  const chunks = src.split(/{\s*id:\s*"/).slice(1)
  for (const chunk of chunks) {
    const id = chunk.match(/^([^"]+)"/)?.[1]
    const intent = chunk.match(/intent:\s*"([^"]+)"/)?.[1]
    const surface = chunk.match(/surface:\s*"([^"]+)"/)?.[1]
    const mustBlock = chunk.match(/must:\s*\[([^\]]*)\]/)?.[1] ?? ""
    const neverBlock = chunk.match(/never:\s*\[([^\]]*)\]/)?.[1] ?? ""
    const must = [...mustBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const never = [...neverBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1])
    if (id) recipes.push({ id, intent, surface, must, never })
  }
  return recipes
}

const mandate = await readMandate()
const colorRoles = await readTsStringArray("lib/design/grammar.ts", "colorRoles")
const radii = await readTsStringArray("lib/design/grammar.ts", "radii")
const depths = await readTsStringArray("lib/design/grammar.ts", "depths")
const surfaces = await readTsStringArray("lib/design/grammar.ts", "surfaces")
const activityRoles = await readTsStringArray(
  "lib/design/grammar.ts",
  "activityRoles",
)
const provenanceRoles = await readTsStringArray(
  "lib/design/grammar.ts",
  "provenanceRoles",
)
/* Bans come from the shared module, not a text-parse of grammar.ts. */
const banned = banIds
const typesetPresets = await readTsStringArray(
  "lib/design/typeset.ts",
  "typesetPresets",
)
const consistencyBans = await readTsStringArray(
  "lib/platform/consistency.ts",
  "consistencyBans",
)
const primitives = await readTsStringArray(
  "lib/platform/consistency.ts",
  "approvedPrimitives",
)
const depthIntents = await readTsStringArray(
  "lib/platform/consistency.ts",
  "depthIntents",
)

const radiusIntents = {
  control: "rounded-full",
  pill: "rounded-full",
  input: "rounded-lg",
  panel: "rounded-2xl",
  shell: "rounded-3xl",
}

const recipesSrc = await readFile(
  join(ROOT, "lib/contracts/task-recipes.ts"),
  "utf8",
)
const recipes = parseRecipes(recipesSrc)

const dnas = await readDnaFiles()
await mkdir(outDir, { recursive: true })

const site = "https://ui.byronwade.com"

for (const dna of dnas) {
  const live = dna.status === "live" && dna.id === "meridian"
  const contract = {
    $schema: `${site}/r/${dna.id}.contract.schema.json`,
    platform: {
      id: "design-contracts",
      version: "1.0.0",
      mcpTools: MCP_TOOLS,
      pricingModel: "open-source",
      priceMonthlyUsd: 0,
      contractJsonKeys: CONTRACT_JSON_KEYS,
      kit: "consistency",
    },
    id: dna.id,
    name: dna.name,
    version: dna.version,
    priceMonthlyUsd: 0,
    mcp: { slug: dna.id, tools: [...MCP_TOOLS] },
    urls: {
      home: `${site}/${dna.id}`,
      design: `${site}/${dna.id}/design.md`,
      agents: `${site}/${dna.id}/agents.md`,
      contract: `${site}/r/${dna.id}.contract.json`,
    },
    aesthetic: dna.aesthetic,
    status: dna.status,
    mandate,
    tokens: {
      colorRoles: live ? colorRoles : colorRoles,
      radii: live ? radii : radii,
      radiusIntents,
      depths: live ? depths : depths,
      depthIntents,
      surfaces: live ? surfaces : surfaces,
      activityRoles,
      provenanceRoles,
      typesetPresets,
    },
    banned,
    consistencyBans,
    primitives,
    recipes,
    generatedAt: new Date().toISOString(),
  }

  await writeFile(
    join(outDir, `${dna.id}.contract.json`),
    `${JSON.stringify(contract, null, 2)}\n`,
  )
  console.log(`wrote public/r/${dna.id}.contract.json`)
}

await writeFile(
  join(ROOT, "packages/contract-mcp/kit.json"),
  `${JSON.stringify(
    {
      kit: "consistency",
      mandate,
      tokens: { colorRoles, radiusIntents, depthIntents, surfaces },
      primitives,
      recipes: recipes.map((r) => ({
        id: r.id,
        must: r.must,
        never: r.never,
      })),
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
)
console.log("wrote packages/contract-mcp/kit.json")
console.log(
  `gen:contract OK — ${dnas.length} slim consistency kit(s), open-source MCP`,
)
