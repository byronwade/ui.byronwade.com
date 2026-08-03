import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const SKILLS_DIR = "skills"
const REPO = "byronwade/ui.byronwade.com"

/** Display order for the public top-skills list. */
const FEATURED_ORDER = [
  "meridian-theme",
  "meridian-compose",
  "meridian-cinematic",
  "meridian-surface",
  "meridian-a11y",
] as const

export type SkillSlug = (typeof FEATURED_ORDER)[number]

export type SkillMeta = {
  slug: SkillSlug
  name: string
  description: string
  /** Relative path from repo root */
  path: string
  href: string
  install: string
  order: number
}

export type SkillDetail = SkillMeta & {
  /** Full SKILL.md including frontmatter */
  source: string
  /** Body without YAML frontmatter */
  body: string
}

function parseFrontmatter(source: string): {
  name?: string
  description?: string
  body: string
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { body: source }

  const yaml = match[1] ?? ""
  const body = (match[2] ?? "").trimStart()
  const name = yaml.match(/^name:\s*(.+)$/m)?.[1]?.trim()
  const description = yaml.match(/^description:\s*(.+)$/m)?.[1]?.trim()
  return { name, description, body }
}

function installCommand(slug: string): string {
  return `npx skills add ${REPO} --skill ${slug}`
}

async function readSkillFile(slug: string): Promise<string> {
  return readFile(
    join(/* turbopackIgnore: true */ process.cwd(), SKILLS_DIR, slug, "SKILL.md"),
    "utf8",
  )
}

/** Featured Meridian skills for /skills (skills.sh-ready layout). */
async function listSkills(): Promise<SkillMeta[]> {
  const entries = await Promise.all(
    FEATURED_ORDER.map(async (slug, order) => {
      const source = await readSkillFile(slug)
      const { name, description } = parseFrontmatter(source)
      return {
        slug,
        name: name ?? slug,
        description: description ?? "",
        path: `${SKILLS_DIR}/${slug}/SKILL.md`,
        href: `/meridian/skills/${slug}`,
        install: installCommand(slug),
        order,
      } satisfies SkillMeta
    }),
  )
  return entries
}

async function getSkill(slug: string): Promise<SkillDetail | null> {
  if (!FEATURED_ORDER.includes(slug as SkillSlug)) return null
  try {
    const source = await readSkillFile(slug)
    const { name, description, body } = parseFrontmatter(source)
    return {
      slug: slug as SkillSlug,
      name: name ?? slug,
      description: description ?? "",
      path: `${SKILLS_DIR}/${slug}/SKILL.md`,
      href: `/meridian/skills/${slug}`,
      install: installCommand(slug),
      order: FEATURED_ORDER.indexOf(slug as SkillSlug),
      source,
      body,
    }
  } catch {
    return null
  }
}

async function getSkillSlugs(): Promise<SkillSlug[]> {
  try {
    const dirs = await readdir(
      join(/* turbopackIgnore: true */ process.cwd(), SKILLS_DIR),
      { withFileTypes: true },
    )
    const found = new Set(
      dirs.filter((d) => d.isDirectory()).map((d) => d.name),
    )
    return FEATURED_ORDER.filter((slug) => found.has(slug))
  } catch {
    return [...FEATURED_ORDER]
  }
}

export {
  FEATURED_ORDER,
  REPO as SKILLS_REPO,
  getSkill,
  getSkillSlugs,
  installCommand,
  listSkills,
  parseFrontmatter,
}
