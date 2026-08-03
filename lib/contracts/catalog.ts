/**
 * Design contracts catalog — derived from DNA packs + platform skeleton.
 * Do not hand-duplicate MCP price, nav slots, or href shapes here.
 */

import { listDna, getDna, type ContractDna } from "@/lib/contracts/dna"
import {
  MCP_PRICE_USD,
  PRICING_MODEL,
  contractPrimaryNavFromSkeleton,
  pathTemplates,
} from "@/lib/platform/skeleton"

export { MCP_PRICE_USD, PRICING_MODEL }

/** Human label for catalog / pricing surfaces. */
export function priceLabel(priceMonthly = MCP_PRICE_USD) {
  if (PRICING_MODEL === "open-source" || priceMonthly <= 0) return "Open source"
  return `$${priceMonthly}/mo`
}

export type ContractStatus = ContractDna["status"]

export type DesignContract = {
  id: string
  name: string
  tagline: string
  preview: ContractDna["preview"]
  status: ContractStatus
  href: string
  mcpSlug: string
  priceMonthly: number
  features: readonly string[]
  aesthetic: string
}

function toCatalogEntry(dna: ContractDna): DesignContract {
  return {
    id: dna.id,
    name: dna.name,
    tagline: dna.tagline,
    preview: dna.preview,
    status: dna.status,
    href: pathTemplates.base(dna.id),
    mcpSlug: dna.id,
    priceMonthly: MCP_PRICE_USD,
    features: dna.features,
    aesthetic: dna.aesthetic,
  }
}

export const designContracts: readonly DesignContract[] =
  listDna().map(toCatalogEntry)

/** Alias for platform surfaces that list the catalog. */
export const contracts = designContracts

export function getContract(id: string): DesignContract | undefined {
  const dna = getDna(id)
  return dna ? toCatalogEntry(dna) : undefined
}

export function liveContracts() {
  return designContracts.filter((c) => c.status === "live")
}

/** Primary nav — always from platform ROUTE_SLOTS (same for every live contract). */
export function contractPrimaryNav(contractId: string) {
  return contractPrimaryNavFromSkeleton(contractId)
}
