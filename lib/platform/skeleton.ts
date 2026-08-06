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
  { segment: "", label: "Home", nav: true, scope: "all" },
  { segment: "install", label: "Install", nav: true, scope: "all" },
  { segment: "ui", label: "UI", nav: true, scope: "all" },
  { segment: "theme", label: "Theme", nav: true, scope: "all" },
  { segment: "surfaces", label: "Surfaces", nav: true, scope: "all" },
  { segment: "design", label: "Design", nav: true, scope: "authored" },
  { segment: "skills", label: "Skills", nav: true, scope: "authored" },
  { segment: "system", label: "System", nav: true, scope: "authored" },
  { segment: "for-agents", label: "Agents", nav: true, scope: "authored" },
  { segment: "architecture", label: "Architecture", nav: false, scope: "authored" },
  { segment: "llms", label: "llms.txt", nav: false, scope: "authored" },
] as const

export type RouteSlot = (typeof ROUTE_SLOTS)[number]
/** Slots every contract gets from shared components — no authored content. */
export type RouteSegment = RouteSlot["segment"]

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

/**
 * Primary nav for a contract.
 *
 * `scope: "all"` slots are built from shared components, so every contract has
 * them. `scope: "authored"` slots need per-contract prose (design.md, skills,
 * research specs) and only appear when the DNA declares them — a nav link to a
 * page a contract has not authored is a 404 with extra steps.
 */
export function contractPrimaryNavFromSkeleton(
  contractId: string,
  authored: readonly string[] = [],
) {
  return ROUTE_SLOTS.filter(
    (s) => s.nav && (s.scope === "all" || authored.includes(s.segment)),
  ).map((s) => ({
    href: s.segment ? `/${contractId}/${s.segment}` : `/${contractId}`,
    label: s.label,
  }))
}

/** Every segment a contract actually serves, for parity checks. */
export function contractSegments(authored: readonly string[] = []) {
  return ROUTE_SLOTS.filter(
    (s) => s.scope === "all" || authored.includes(s.segment),
  ).map((s) => s.segment)
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
    "Landing page architecture at /{id} (the route is shared, the layout is not)",
    "Default data-surface density lane for that contract's own pages",
    "Skill body copy (prefix stays {id}-*)",
    "Influence mapping details inside the closed behaviors",
  ],
} as const
