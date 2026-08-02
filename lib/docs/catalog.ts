/**
 * Human + machine document catalog.
 * Designed routes render Meridian UI; rawHref stays fetchable for agents.
 */

export type DocId =
  | "design"
  | "architecture"
  | "llms"
  | "for-agents"
  | "theme"
  | "surfaces"

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

export const docs: readonly DocEntry[] = [
  {
    id: "design",
    title: "Design",
    summary: "AI contract — cinematic laws, MUST, bans, theme knobs.",
    href: "/design",
    rawHref: "/design.md",
    sourcePath: "design.md",
    filename: "design.md",
    nav: true,
    navLabel: "Design",
  },
  {
    id: "theme",
    title: "Theme",
    summary: "Live grammar — knobs, roles, density, bans.",
    href: "/theme",
    nav: true,
    navLabel: "Theme",
  },
  {
    id: "surfaces",
    title: "Surfaces",
    summary: "Application · marketing · mobile · desktop proofs.",
    href: "/surfaces",
    nav: true,
    navLabel: "Surfaces",
  },
  {
    id: "for-agents",
    title: "Agents",
    summary: "Frozen vs creative, skills, agents, load order.",
    href: "/for-agents",
    nav: true,
    navLabel: "Agents",
  },
  {
    id: "architecture",
    title: "Architecture",
    summary: "How the typed theme system is layered for AIs.",
    href: "/architecture",
    rawHref: "/architecture.md",
    sourcePath: "docs/architecture.md",
    filename: "architecture.md",
  },
  {
    id: "llms",
    title: "llms.txt",
    summary: "Discovery map for agents and crawlers.",
    href: "/llms",
    rawHref: "/llms.txt",
    sourcePath: "public/llms.txt",
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
