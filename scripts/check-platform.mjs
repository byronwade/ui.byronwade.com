#!/usr/bin/env node
/**
 * Platform consistency gate — structural parity + slim consistency kit.
 */
import { readFile, readdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const hits = []

async function read(rel) {
  return readFile(join(ROOT, rel), "utf8")
}

const skeleton = await read("lib/platform/skeleton.ts")
const consistency = await read("lib/platform/consistency.ts")
const agents = await read("agents.md")
const buildContract = await read("lib/platform/build-contract.ts")
const catalog = await read("lib/contracts/catalog.ts")
const sharedMcp = await read("packages/contract-mcp/server.mjs")
const meridianMcp = await read("packages/meridian-mcp/server.mjs")

for (const id of [
  "export const PLATFORM_VERSION",
  "export const MCP_TOOLS",
  "export const MACHINE_FILES",
  "export const ROUTE_SLOTS",
  "export const AGENTS_MD_SECTIONS",
  "export const CONTRACT_JSON_KEYS",
  "export const platformZones",
]) {
  if (!skeleton.includes(id)) hits.push(`skeleton.ts: missing ${id}`)
}

for (const id of [
  "export const agentMandate",
  "export const radiusIntents",
  "export const approvedPrimitives",
  "export const consistencyBans",
]) {
  if (!consistency.includes(id)) hits.push(`consistency.ts: missing ${id}`)
}

const toolMatch = skeleton.match(
  /export const MCP_TOOLS = \[([\s\S]*?)\] as const/,
)
const tools = toolMatch
  ? [...toolMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : []
if (tools.length < 5) hits.push("skeleton.ts: MCP_TOOLS incomplete")

for (const tool of tools) {
  if (!sharedMcp.includes(`"${tool}"`) && !sharedMcp.includes(`'${tool}'`)) {
    hits.push(`contract-mcp: missing platform tool ${tool}`)
  }
}

if (!sharedMcp.includes("withMandate") && !sharedMcp.includes("obey")) {
  hits.push("contract-mcp: every response must carry consistency mandate (obey)")
}
if (!sharedMcp.includes("REQUIRED FIRST") && !sharedMcp.includes("get_contract")) {
  hits.push("contract-mcp: get_contract must be described as required first")
}
if (!sharedMcp.includes("REQUIRED BEFORE DONE") && !sharedMcp.includes("validate_ui")) {
  hits.push("contract-mcp: validate_ui must be required before done")
}

if (!meridianMcp.includes("contract-mcp")) {
  hits.push("meridian-mcp: must delegate to packages/contract-mcp (no fork)")
}
if (/const MCP_TOOLS\s*=/.test(meridianMcp)) {
  hits.push("meridian-mcp: must not redefine MCP_TOOLS — use shared server")
}

const dnaDir = join(ROOT, "lib/contracts/dna")
const dnaFiles = (await readdir(dnaDir)).filter(
  (f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts",
)
const dnaIds = []
for (const f of dnaFiles) {
  const src = await read(`lib/contracts/dna/${f}`)
  const id = src.match(/id:\s*"([^"]+)"/)?.[1]
  if (!id) hits.push(`dna/${f}: missing id`)
  else dnaIds.push(id)
}

const index = await read("lib/contracts/dna/index.ts")
for (const id of dnaIds) {
  if (!index.includes(`${id}Dna`) && !index.includes(`"${id}"`)) {
    hits.push(`dna/index.ts: must register ${id}`)
  }
}

if (!catalog.includes("listDna") || !catalog.includes("pathTemplates")) {
  hits.push("catalog.ts: must derive from DNA + platform pathTemplates")
}
if (/priceMonthly:\s*\d+/.test(catalog)) {
  hits.push("catalog.ts: do not hardcode price — use MCP_PRICE_USD from skeleton")
}

const requiredSections = [
  "0. Hard rules (fail closed)",
  "1. Load order (mandatory)",
  "2. Platform consistency (all contracts)",
  "8. Done gate",
]
for (const section of requiredSections) {
  if (!agents.includes(section)) {
    hits.push(`agents.md: missing required section "${section}"`)
  }
}
for (const phrase of [
  "change it for every contract",
  "lib/platform/skeleton.ts",
  "Design DNA may differ",
  "MUST NOT fork",
  "get_contract",
  "validate_ui",
]) {
  if (!agents.toLowerCase().includes(phrase.toLowerCase())) {
    hits.push(`agents.md: must stress platform consistency ("${phrase}")`)
  }
}

if (!buildContract.includes("buildContractEnvelope")) {
  hits.push("build-contract.ts: missing buildContractEnvelope")
}
if (!buildContract.includes("agentMandate") && !buildContract.includes("mandate")) {
  hits.push("build-contract.ts: must embed consistency mandate")
}
if (!buildContract.includes("compactRecipes")) {
  hits.push("build-contract.ts: recipes must be compact (must/never)")
}
if (buildContract.includes("fewShots")) {
  hits.push("build-contract.ts: fewShots bloated the MCP kit — keep docs-only")
}

const meridianContract = await read("lib/contracts/meridian-contract.ts")
if (!meridianContract.includes("buildContractEnvelope")) {
  hits.push("meridian-contract.ts: must use platform builder (no bespoke JSON shape)")
}

try {
  const pub = join(ROOT, "public/r")
  const files = (await readdir(pub)).filter((f) => f.endsWith(".contract.json"))
  if (files.length === 0) {
    hits.push("public/r: run npm run gen:contract — no contract JSON found")
  }
  const shapes = []
  for (const f of files) {
    const json = JSON.parse(await read(`public/r/${f}`))
    if (!json.platform?.mcpTools) {
      hits.push(`${f}: missing platform.mcpTools`)
      continue
    }
    if (!json.mandate?.must || !json.mandate?.mustNot) {
      hits.push(`${f}: missing mandate.must / mandate.mustNot`)
    }
    if (!json.tokens?.colorRoles || !json.primitives || !json.recipes) {
      hits.push(`${f}: slim kit requires tokens + primitives + recipes`)
    }
    if (json.laws || json.fewShots || json.taskRecipes) {
      hits.push(`${f}: fat fields (laws/fewShots/taskRecipes) banned from MCP kit`)
    }
    const toolKey = JSON.stringify(json.platform.mcpTools)
    shapes.push({ f, toolKey })
    if (toolKey !== JSON.stringify(tools)) {
      hits.push(`${f}: mcpTools diverge from skeleton MCP_TOOLS`)
    }
    if (json.priceMonthlyUsd !== 0) {
      hits.push(`${f}: priceMonthlyUsd must be 0 (open-source)`)
    }
    if (
      json.platform?.pricingModel &&
      json.platform.pricingModel !== "open-source"
    ) {
      hits.push(`${f}: platform.pricingModel must be open-source`)
    }
  }
  if (new Set(shapes.map((s) => s.toolKey)).size > 1) {
    hits.push("public/r: contract JSON mcpTools not identical across contracts")
  }
} catch {
  hits.push("public/r: unable to read generated contract JSON")
}

try {
  const platformDoc = await read("docs/platform.md")
  if (!platformDoc.includes("lib/platform/skeleton.ts")) {
    hits.push("docs/platform.md: must document skeleton as single source")
  }
} catch {
  hits.push("docs/platform.md: missing — required platform law doc")
}

if (hits.length === 0) {
  console.log(
    `check:platform OK — ${dnaIds.length} DNA packs, slim consistency MCP, agents.md locked`,
  )
  process.exit(0)
}

console.error(`check:platform FAILED — ${hits.length} hit(s)\n`)
for (const h of hits) console.error(`  ${h}`)
process.exit(1)
