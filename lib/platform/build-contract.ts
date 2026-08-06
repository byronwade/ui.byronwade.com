/**
 * Build the lightweight MCP consistency kit for a contract.
 * Fat docs stay in design.md / agents.md — JSON stays small and agent-actionable.
 */

import {
  CONTRACT_JSON_KEYS,
  MCP_PRICE_USD,
  MCP_TOOLS,
  PLATFORM_ID,
  PLATFORM_VERSION,
  PRICING_MODEL,
  contractUrls,
} from "@/lib/platform/skeleton"
import {
  agentMandate,
  approvedPrimitives,
  consistencyBans,
  depthIntents,
  radiusIntents,
} from "@/lib/platform/consistency"
import { getDna, type ContractDna } from "@/lib/contracts/dna"
import { taskRecipes } from "@/lib/contracts/task-recipes"
import {
  activityRoles,
  banned,
  colorRoles,
  depths,
  provenanceRoles,
  radii,
  surfaces,
} from "@/lib/design/grammar"
import {
  brandPresets,
  knobDefaults,
  paperPresets,
  radiusPresets,
} from "@/lib/design/knobs"
import { prefsNotAllowed } from "@/lib/design/prefs"
import { typesetPresets } from "@/lib/design/typeset"

export function platformBlock() {
  return {
    id: PLATFORM_ID,
    version: PLATFORM_VERSION,
    mcpTools: [...MCP_TOOLS],
    pricingModel: PRICING_MODEL,
    priceMonthlyUsd: MCP_PRICE_USD,
    contractJsonKeys: [...CONTRACT_JSON_KEYS],
    kit: "consistency",
  } as const
}

/** Compact recipe — must/never only (what keeps UI consistent). */
export function compactRecipes() {
  return taskRecipes.map((r) => ({
    id: r.id,
    intent: r.intent,
    surface: r.surface,
    must: r.must,
    never: r.never,
  }))
}

export type ContractJson = {
  $schema: string
  platform: ReturnType<typeof platformBlock>
  id: string
  name: string
  version: string
  priceMonthlyUsd: number
  mcp: { slug: string; tools: string[] }
  urls: {
    home: string
    design: string
    agents: string
    contract: string
    install: string
    schema: string
  }
  aesthetic: string
  /** Imperative consistency law — read first */
  mandate: typeof agentMandate
  tokens: {
    colorRoles: readonly string[]
    radii: readonly string[]
    radiusIntents: typeof radiusIntents
    depths: readonly string[]
    depthIntents: readonly string[]
    surfaces: readonly string[]
    activityRoles: readonly string[]
    provenanceRoles: readonly string[]
    typesetPresets: readonly string[]
  }
  banned: readonly string[]
  consistencyBans: readonly string[]
  primitives: readonly string[]
  recipes: ReturnType<typeof compactRecipes>
  /** Closed consumer tweaks — brand/radius/paper only (not layout/motion). */
  prefs: {
    defaults: typeof knobDefaults
    brand: typeof brandPresets
    radius: typeof radiusPresets
    paper: typeof paperPresets
    notPrefs: typeof prefsNotAllowed
    applyTool: "apply_prefs"
  }
}

export type LiveGrammar = {
  colorRoles?: readonly string[]
  radii?: readonly string[]
  depths?: readonly string[]
  surfaces?: readonly string[]
  activityRoles?: readonly string[]
  provenanceRoles?: readonly string[]
  banned?: readonly string[]
  typesetPresets?: readonly string[]
}

/** Structural envelope — same for live and stub contracts. */
export function buildContractEnvelope(
  dna: ContractDna,
  grammar?: LiveGrammar,
): ContractJson {
  const urls = contractUrls(dna.id)
  return {
    $schema: "https://ui.byronwade.com/r/contract.schema.json",
    platform: platformBlock(),
    id: dna.id,
    name: dna.name,
    version: dna.version,
    priceMonthlyUsd: MCP_PRICE_USD,
    mcp: {
      slug: dna.id,
      tools: [...MCP_TOOLS],
    },
    urls: {
      home: urls.home,
      design: urls.design,
      agents: urls.agents,
      contract: urls.contract,
      install: `${urls.home}/install`,
      schema: "https://ui.byronwade.com/r/contract.schema.json",
    },
    aesthetic: dna.aesthetic,
    mandate: agentMandate,
    tokens: {
      colorRoles: grammar?.colorRoles ?? colorRoles,
      radii: grammar?.radii ?? radii,
      radiusIntents,
      depths: grammar?.depths ?? depths,
      depthIntents,
      surfaces: grammar?.surfaces ?? surfaces,
      activityRoles: grammar?.activityRoles ?? activityRoles,
      provenanceRoles: grammar?.provenanceRoles ?? provenanceRoles,
      typesetPresets: grammar?.typesetPresets ?? typesetPresets,
    },
    banned: grammar?.banned ?? banned,
    consistencyBans,
    primitives: approvedPrimitives,
    recipes: compactRecipes(),
    prefs: {
      defaults: knobDefaults,
      brand: brandPresets,
      radius: radiusPresets,
      paper: paperPresets,
      notPrefs: prefsNotAllowed,
      applyTool: "apply_prefs",
    },
  }
}

export function buildContractById(
  id: string,
  grammar?: LiveGrammar,
): ContractJson {
  const dna = getDna(id)
  if (!dna) throw new Error(`No DNA pack for contract: ${id}`)
  return buildContractEnvelope(dna, grammar)
}
