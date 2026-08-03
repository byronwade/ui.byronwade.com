/**
 * Merge platform skeleton + contract DNA (+ optional live grammar) → contract JSON.
 * One builder for every contract — never hand-shape a sibling JSON.
 */

import {
  CONTRACT_JSON_KEYS,
  MCP_PRICE_USD,
  MCP_TOOLS,
  PLATFORM_ID,
  PLATFORM_VERSION,
  contractUrls,
} from "@/lib/platform/skeleton"
import { getDna, type ContractDna } from "@/lib/contracts/dna"
import { taskRecipes } from "@/lib/contracts/task-recipes"
import { fewShots } from "@/lib/contracts/few-shots"

/** Shared platform payload every contract JSON embeds. */
export function platformBlock() {
  return {
    id: PLATFORM_ID,
    version: PLATFORM_VERSION,
    mcpTools: [...MCP_TOOLS],
    priceMonthlyUsd: MCP_PRICE_USD,
    contractJsonKeys: [...CONTRACT_JSON_KEYS],
  } as const
}

export type ContractJson = {
  $schema: string
  platform: ReturnType<typeof platformBlock>
  id: string
  name: string
  version: string
  priceMonthlyUsd: number
  mcp: { slug: string; tools: string[] }
  urls: ReturnType<typeof contractUrls>
  aesthetic: string
  frozen?: Record<string, unknown>
  laws?: Record<string, unknown>
  typesetPresets?: string[]
  shellSurfaces?: string[]
  taskRecipes: typeof taskRecipes
  fewShots: typeof fewShots
}

export type LiveGrammar = {
  frozen: Record<string, unknown>
  laws: Record<string, unknown>
  typesetPresets: string[]
  shellSurfaces: string[]
}

/** Structural envelope — same for live and stub contracts. */
export function buildContractEnvelope(
  dna: ContractDna,
  grammar?: LiveGrammar,
): ContractJson {
  const base: ContractJson = {
    $schema: `https://ui.byronwade.com/r/${dna.id}.contract.schema.json`,
    platform: platformBlock(),
    id: dna.id,
    name: dna.name,
    version: dna.version,
    priceMonthlyUsd: MCP_PRICE_USD,
    mcp: {
      slug: dna.id,
      tools: [...MCP_TOOLS],
    },
    urls: contractUrls(dna.id),
    aesthetic: dna.aesthetic,
    taskRecipes,
    fewShots,
  }

  if (grammar) {
    base.frozen = grammar.frozen
    base.laws = grammar.laws
    base.typesetPresets = grammar.typesetPresets
    base.shellSurfaces = grammar.shellSurfaces
  }

  return base
}

export function buildContractById(
  id: string,
  grammar?: LiveGrammar,
): ContractJson {
  const dna = getDna(id)
  if (!dna) throw new Error(`No DNA pack for contract: ${id}`)
  return buildContractEnvelope(dna, grammar)
}
