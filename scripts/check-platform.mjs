#!/usr/bin/env node
/**
 * Platform consistency gate — structural parity + slim consistency kit.
 */
import { access, readFile, readdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const hits = []

async function read(rel) {
  return readFile(join(ROOT, rel), "utf8")
}

async function exists(rel) {
  try {
    await access(join(ROOT, rel))
    return true
  } catch {
    return false
  }
}

/** Every DNA id must ship these page slots (see lib/contracts/routes.ts). */
const REQUIRED_CONTRACT_SEGMENTS = [
  "",
  "install",
  "ui",
  "theme",
  "surfaces",
  "design",
  "skills",
  "system",
  "for-agents",
]

const REQUIRED_MACHINE_FILES = [
  "design.md",
  "agents.md",
  "architecture.md",
  "llms.txt",
]

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
if (tools.length < 6) hits.push("skeleton.ts: MCP_TOOLS incomplete")
if (!tools.includes("apply_prefs")) {
  hits.push("skeleton.ts: MCP_TOOLS must include apply_prefs for closed theme tweaks")
}

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
if (!sharedMcp.includes("apply_prefs") || !sharedMcp.includes("unknown-brand")) {
  hits.push("contract-mcp: apply_prefs must fail closed on unknown preset ids")
}
if (!sharedMcp.includes("prompts/list") || !sharedMcp.includes("build_surface")) {
  hits.push("contract-mcp: must expose MCP prompts (build_surface)")
}
if (!sharedMcp.includes("resources/list") || !sharedMcp.includes("contract://kit")) {
  hits.push("contract-mcp: must expose MCP resources (contract://kit)")
}
if (!sharedMcp.includes("kit.json")) {
  hits.push("contract-mcp: must load kit.json offline snapshot")
}
if (!consistency.includes('control: "rounded-lg"')) {
  hits.push("consistency.ts: radiusIntents.control must be rounded-lg (live controls)")
}
try {
  const rootPkg = JSON.parse(await read("package.json"))
  if (!rootPkg.bin?.["contract-mcp"]) {
    hits.push("package.json: root bin.contract-mcp required for npx github install")
  }
} catch {
  hits.push("package.json: unable to verify contract-mcp bin")
}
if (!(await exists("public/r/contract.schema.json"))) {
  hits.push("public/r/contract.schema.json: missing shared kit schema")
}
if (!(await exists("packages/contract-mcp/README.md"))) {
  hits.push("packages/contract-mcp/README.md: consumer install docs required")
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

for (const id of dnaIds) {
  if (!(await exists(`app/${id}/layout.tsx`))) {
    hits.push(`app/${id}/layout.tsx: missing ContractFrame layout`)
  }
  for (const seg of REQUIRED_CONTRACT_SEGMENTS) {
    const pageRel = seg
      ? `app/${id}/${seg}/page.tsx`
      : `app/${id}/page.tsx`
    if (!(await exists(pageRel))) {
      hits.push(`${pageRel}: required ROUTE_SLOTS page missing`)
    }
  }
  for (const file of REQUIRED_MACHINE_FILES) {
    const routeRel = `app/${id}/${file}/route.ts`
    if (!(await exists(routeRel))) {
      hits.push(`${routeRel}: required MACHINE_FILES handler missing`)
    }
  }
  if (!(await exists(`app/${id}/system/[slug]/page.tsx`))) {
    hits.push(`app/${id}/system/[slug]/page.tsx: system doc page missing`)
  }
  if (!(await exists(`app/${id}/system/[slug]/raw/route.ts`))) {
    hits.push(`app/${id}/system/[slug]/raw/route.ts: system raw route missing`)
  }
}

const routesHelper = await read("lib/contracts/routes.ts")
if (!routesHelper.includes("REQUIRED_CONTRACT_SEGMENTS")) {
  hits.push("lib/contracts/routes.ts: must export REQUIRED_CONTRACT_SEGMENTS")
}
if (!routesHelper.includes("advertisedThemeSkill")) {
  hits.push("lib/contracts/routes.ts: must export advertisedThemeSkill")
}
const installSrc = await read("lib/contracts/install.ts")
if (!installSrc.includes("themeSkillNote") || !installSrc.includes("checkCli")) {
  hits.push("lib/contracts/install.ts: must expose themeSkillNote + checkCli")
}
if (!(await exists("lib/contracts/machine-docs.ts"))) {
  hits.push("lib/contracts/machine-docs.ts: missing machine markdown generators")
}
if (!(await exists("lib/contracts/machine-route.ts"))) {
  hits.push("lib/contracts/machine-route.ts: missing shared negotiated GET helper")
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
  if (!platformDoc.includes("data-contract") && !platformDoc.includes("contract-skins")) {
    hits.push("docs/platform.md: must document per-contract skins vs platform homepage")
  }
} catch {
  hits.push("docs/platform.md: missing — required platform law doc")
}

try {
  const skins = await read("app/contract-skins.css")
  for (const id of dnaIds) {
    if (!skins.includes(`[data-contract="${id}"]`)) {
      hits.push(`contract-skins.css: missing [data-contract="${id}"] token pack`)
    }
  }
  const frame = await read("components/chrome/contract-frame.tsx")
  if (!frame.includes("data-contract")) {
    hits.push("contract-frame.tsx: must set data-contract for skin scoping")
  }
  const rootLayout = await read("app/layout.tsx")
  if (rootLayout.includes("SiteHeader") || rootLayout.includes("site-header")) {
    hits.push("app/layout.tsx: must not wrap all routes in Meridian/global site chrome")
  }
  if (!rootLayout.includes("globals.css")) {
    hits.push("app/layout.tsx: must import globals.css")
  }
} catch (err) {
  hits.push(
    `skins/chrome: ${err instanceof Error ? err.message : String(err)}`,
  )
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
