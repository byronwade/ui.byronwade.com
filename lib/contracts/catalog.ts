/**
 * Design contracts — product surface for agent-native UI systems.
 * Each contract is a fail-closed rule pack + MCP access, not a component zoo.
 */

import type { ContractPreviewTone } from "@/lib/design/knobs"

export const MCP_PRICE_USD = 9

export type ContractStatus = "live" | "preview" | "soon"

export type DesignContract = {
  id: string
  name: string
  tagline: string
  /** Soft cinematic preview tone — resolves via contractPreviewAccents */
  preview: ContractPreviewTone
  status: ContractStatus
  href: string
  mcpSlug: string
  priceMonthly: number
  features: readonly string[]
}

export const designContracts: readonly DesignContract[] = [
  {
    id: "meridian",
    name: "Meridian",
    tagline:
      "Cinematic app UI for agents — OKLCH, shell rhythm, typeset, UX/DX laws.",
    preview: "theater",
    status: "live",
    href: "/meridian",
    mcpSlug: "meridian",
    priceMonthly: MCP_PRICE_USD,
    features: [
      "MCP + contract JSON",
      "Closed grammar + check gates",
      "shadcn compose · typeset",
      "Object-bound AI rails",
    ],
  },
  {
    id: "harbor",
    name: "Harbor",
    tagline: "Calm ops admin — dense indexes, quiet chrome, semantic status.",
    preview: "paper",
    status: "soon",
    href: "/harbor",
    mcpSlug: "harbor",
    priceMonthly: MCP_PRICE_USD,
    features: [
      "MCP + contract JSON",
      "Task density recipes",
      "Index / detail intents",
      "Eval harness",
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    tagline: "Developer workbench — mono metadata, keyboard-first scanning.",
    preview: "ink",
    status: "soon",
    href: "/atlas",
    mcpSlug: "atlas",
    priceMonthly: MCP_PRICE_USD,
    features: [
      "MCP + contract JSON",
      "Desktop density lane",
      "Command-palette patterns",
      "Few-shot recipes",
    ],
  },
  {
    id: "vellum",
    name: "Vellum",
    tagline: "Reading-first docs & help — typeset lanes, measured prose.",
    preview: "mist",
    status: "preview",
    href: "/vellum",
    mcpSlug: "vellum",
    priceMonthly: MCP_PRICE_USD,
    features: [
      "MCP + typeset presets",
      "Docs / chat / reading",
      "Streaming-stable copy",
      "Context budgets",
    ],
  },
] as const

/** Alias for platform surfaces that list the catalog. */
export const contracts = designContracts

export function getContract(id: string): DesignContract | undefined {
  return designContracts.find((c) => c.id === id)
}

export function liveContracts() {
  return designContracts.filter((c) => c.status === "live")
}

/** Primary nav inside a live contract (Meridian today). */
export function contractPrimaryNav(contractId: string) {
  if (contractId === "meridian") {
    return [
      { href: "/meridian", label: "Film" },
      { href: "/meridian/design", label: "Design" },
      { href: "/meridian/theme", label: "Theme" },
      { href: "/meridian/surfaces", label: "Surfaces" },
      { href: "/meridian/skills", label: "Skills" },
      { href: "/meridian/system", label: "System" },
      { href: "/meridian/for-agents", label: "Agents" },
    ] as const
  }
  return [] as const
}
