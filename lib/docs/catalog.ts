/**
 * Human + machine document catalog for a design contract.
 * Meridian lives under /meridian — machine URLs content-negotiate.
 */

export const CONTRACT_BASE = "/meridian" as const

export type DocId =
  | "design"
  | "architecture"
  | "llms"
  | "for-agents"
  | "theme"
  | "surfaces"
  | "skills"
  | "system"

export type DocEntry = {
  id: DocId
  title: string
  summary: string
  href: string
  rawHref?: string
  sourcePath?: string
  filename?: string
  nav?: boolean
  navLabel?: string
}

function path(segment: string) {
  return `${CONTRACT_BASE}${segment}`
}

export const docs: readonly DocEntry[] = [
  {
    id: "design",
    title: "Design",
    summary: "AI contract — cinematic laws, MUST, bans, theme knobs.",
    href: path("/design"),
    rawHref: `${path("/design.md")}?raw=1`,
    sourcePath: "design.md",
    filename: "design.md",
    nav: true,
    navLabel: "Design",
  },
  {
    id: "theme",
    title: "Theme",
    summary: "Live grammar — knobs, roles, density, bans.",
    href: path("/theme"),
    nav: true,
    navLabel: "Theme",
  },
  {
    id: "surfaces",
    title: "Surfaces",
    summary: "Application · marketing · mobile · desktop proofs.",
    href: path("/surfaces"),
    nav: true,
    navLabel: "Surfaces",
  },
  {
    id: "skills",
    title: "Skills",
    summary: "Top Meridian agent skills — ready for skills.sh.",
    href: path("/skills"),
    nav: true,
    navLabel: "Skills",
  },
  {
    id: "system",
    title: "System",
    summary:
      "Ranked influences + detailed layout, UX, motion, color, density, AI specs.",
    href: path("/system"),
    nav: true,
    navLabel: "System",
  },
  {
    id: "for-agents",
    title: "Agents",
    summary: "Frozen vs creative, skills, agents, load order.",
    href: path("/for-agents"),
    rawHref: `${path("/agents.md")}?raw=1`,
    sourcePath: "agents.md",
    filename: "agents.md",
    nav: true,
    navLabel: "Agents",
  },
  {
    id: "architecture",
    title: "Architecture",
    summary: "How the typed theme system is layered for AIs.",
    href: path("/architecture"),
    rawHref: `${path("/architecture.md")}?raw=1`,
    sourcePath: "docs/architecture.md",
    filename: "architecture.md",
  },
  {
    id: "llms",
    title: "llms.txt",
    summary: "Discovery map for agents and crawlers.",
    href: path("/llms"),
    rawHref: `${path("/llms.txt")}?raw=1`,
    sourcePath: "llms.txt",
    filename: "llms.txt",
  },
]

export function getDoc(id: DocId): DocEntry {
  const entry = docs.find((d) => d.id === id)
  if (!entry) throw new Error(`Unknown doc: ${id}`)
  return entry
}

export function requireSource(doc: DocEntry): string {
  if (!doc.sourcePath) throw new Error(`Doc ${doc.id} has no sourcePath`)
  return doc.sourcePath
}

export const primaryNav = docs.filter((d) => d.nav)
