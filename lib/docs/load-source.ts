import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ALLOWED = new Set([
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
  "docs/meridian.md",
  "docs/sources.md",
  "skills/meridian-theme/SKILL.md",
  "skills/meridian-surface/SKILL.md",
  "skills/meridian-compose/SKILL.md",
  "skills/meridian-cinematic/SKILL.md",
  "skills/meridian-a11y/SKILL.md",
  ".cursor/skills/meridian-theme/SKILL.md",
  ".cursor/skills/meridian-surface/SKILL.md",
  ".cursor/skills/meridian-compose/SKILL.md",
  ".cursor/skills/meridian-cinematic/SKILL.md",
  ".cursor/skills/meridian-a11y/SKILL.md",
  ".cursor/agents/meridian-author.md",
  ".cursor/agents/meridian-reviewer.md",
])

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

export { loadSource }
