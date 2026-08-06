import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { contractDnaById } from "@/lib/contracts/dna"

const BASE_ALLOWED = [
  "design.md",
  "agents.md",
  "llms.txt",
  "docs/architecture.md",
  "docs/north-star.md",
  "docs/platform.md",
  "docs/pricing.md",
  "docs/influences.md",
  "docs/absorb.md",
  "docs/layout.md",
  "docs/ux.md",
  "docs/dx.md",
  "docs/animations.md",
  "docs/color.md",
  "docs/typography.md",
  "docs/density.md",
  "docs/ai-surfaces.md",
  "docs/prefs.md",
  "docs/stack.md",
  "docs/meridian.md",
  "docs/harbor.md",
  "docs/atlas.md",
  "docs/vellum.md",
  "docs/sources.md",
  ".cursor/agents/meridian-author.md",
  ".cursor/agents/meridian-reviewer.md",
] as const

const dnaAllowed = Object.values(contractDnaById).flatMap((dna) => [
  dna.dnaDoc,
  `${dna.lawBookDir}/DESIGN.md`,
  `${dna.lawBookDir}/AGENTS.md`,
  ...dna.skillSlugs.flatMap((slug) => [
    `skills/${slug}/SKILL.md`,
    `.cursor/skills/${slug}/SKILL.md`,
    `.claude/skills/${slug}/SKILL.md`,
  ]),
])

const ALLOWED = new Set<string>([...BASE_ALLOWED, ...dnaAllowed])

/** Load a known repo file as UTF-8 text for designed docs + copy actions. */
async function loadSource(relativePath: string): Promise<string> {
  if (!ALLOWED.has(relativePath)) {
    throw new Error(`Source not allowlisted: ${relativePath}`)
  }
  return readFile(
    join(/* turbopackIgnore: true */ process.cwd(), relativePath),
    "utf8",
  )
}

export { loadSource, ALLOWED }
