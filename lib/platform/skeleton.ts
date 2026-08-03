/**
 * Platform skeleton — ONE place to change architecture for ALL design contracts.
 *
 * Design DNA (tokens, cinema, voice) may differ per contract.
 * Everything listed here is STRUCTURAL and MUST stay identical across Meridian,
 * Harbor, Atlas, Vellum, and every future contract.
 *
 * Agents: if you change a filename, MCP tool, route slot, or JSON key here,
 * you change it for every contract — never fork a one-off shape.
 */

export const PLATFORM_ID = "design-contracts" as const
export const PLATFORM_VERSION = "1.0.0" as const

/**
 * Pricing — open source.
 * Stdio MCP runs on the customer machine ($0 COGS). Remote hosting, if ever
 * needed, is shared ~$0–5/mo infra — not a per-contract seat. See docs/pricing.md.
 */
export const MCP_PRICE_USD = 0 as const
export const PRICING_MODEL = "open-source" as const

/**
 * MCP tools — identical names + jobs on every contract server.
 * Add/rename here only; regenerate packages + docs for all contracts.
 */
export const MCP_TOOLS = [
  "get_contract",
  "resolve_token",
  "validate_ui",
  "list_primitives",
  "get_recipe",
  "apply_prefs",
] as const

export type McpToolName = (typeof MCP_TOOLS)[number]

/** Machine docs every contract ships (negotiated HTML ↔ raw). */
export const MACHINE_FILES = [
  "design.md",
  "agents.md",
  "architecture.md",
  "llms.txt",
] as const

export type MachineFile = (typeof MACHINE_FILES)[number]

/**
 * Public page slots under /{contractId}/…
 * Home is "" (the contract root). Order = primary nav for every contract.
 */
export const ROUTE_SLOTS = [
  { segment: "", label: "Home", nav: true },
  { segment: "install", label: "Install", nav: true },
  { segment: "ui", label: "UI", nav: true },
  { segment: "theme", label: "Theme", nav: true },
  { segment: "surfaces", label: "Surfaces", nav: true },
  { segment: "design", label: "Design", nav: true },
  { segment: "skills", label: "Skills", nav: true },
  { segment: "system", label: "System", nav: true },
  { segment: "for-agents", label: "Agents", nav: true },
  { segment: "architecture", label: "Architecture", nav: false },
  { segment: "llms", label: "llms.txt", nav: false },
] as const

/** Required sections in every contract's agents.md (order fixed). */
export const AGENTS_MD_SECTIONS = [
  "0. Hard rules (fail closed)",
  "1. Load order (mandatory)",
  "2. Platform consistency (all contracts)",
  "3. Design influences → mapping",
  "4. Material laws (app chrome)",
  "5. Skills",
  "6. Agents",
  "7. Negotiated endpoints",
  "8. Done gate",
] as const

/** Contract JSON top-level keys — slim consistency kit (never rename for one contract). */
export const CONTRACT_JSON_KEYS = [
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
  "prefs",
] as const

/** Paths relative to a contract id — templates only. */
export const pathTemplates = {
  /** App route base */
  base: (id: string) => `/${id}`,
  /** Machine contract JSON — static only (never dual App Router; conflicts with public/) */
  contractJson: (id: string) => `/r/${id}.contract.json`,
  contractJsonFile: (id: string) => `public/r/${id}.contract.json`,
  /** Negotiated machine docs */
  machine: (id: string, file: MachineFile) => `/${id}/${file}`,
  /** DNA pack (the only place aesthetic may diverge) */
  dna: (id: string) => `lib/contracts/dna/${id}.ts`,
  /** Per-contract design grammar (may diverge) */
  designLib: (id: string) =>
    id === "meridian" ? "lib/design" : `lib/contracts/${id}/design`,
  /** MCP package — thin wrapper; tools come from platform */
  mcpPackage: (id: string) => `packages/${id}-mcp`,
  /** Skills prefix */
  skillPrefix: (id: string) => `${id}-`,
} as const

export function contractUrls(id: string, site = "https://ui.byronwade.com") {
  const base = `${site}/${id}`
  return {
    home: base,
    design: `${base}/design.md`,
    agents: `${base}/agents.md`,
    architecture: `${base}/architecture.md`,
    llms: `${base}/llms.txt`,
    contract: `${site}/r/${id}.contract.json`,
  } as const
}

export function contractPrimaryNavFromSkeleton(contractId: string) {
  return ROUTE_SLOTS.filter((s) => s.nav).map((s) => ({
    href: s.segment ? `/${contractId}/${s.segment}` : `/${contractId}`,
    label: s.label,
  }))
}

/** What agents MAY change per contract vs MUST keep shared. */
export const platformZones = {
  shared: [
    "MCP tool names and argument shapes",
    "Machine filenames (design.md, agents.md, architecture.md, llms.txt)",
    "Route slot names under /{id}/…",
    "Contract JSON schema keys",
    "agents.md section order (AGENTS_MD_SECTIONS)",
    "Task recipe ids (list-resource, agent-rail, …)",
    "CLI surface (check / gen:contract)",
    "Price model (open-source / MCP_PRICE_USD = 0)",
    "UX/DX platform pillars (experience laws shape)",
  ],
  perContract: [
    "OKLCH token values / brand presets / paper tone",
    "Cinema voice, preview wash, marketing copy",
    "Which surfaces/proofs emphasize the DNA",
    "Skill body copy (prefix stays {id}-*)",
    "Influence mapping details inside the closed behaviors",
  ],
} as const
