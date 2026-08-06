import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

import { contractDnaById } from "@/lib/contracts/dna"

const SKILLS_DIR = "skills"
const REPO = "byronwade/ui.byronwade.com"

/** Display order — Meridian first, then Harbor · Atlas · Vellum packs. */
const FEATURED_ORDER = Object.values(contractDnaById).flatMap(
  (dna) => dna.skillSlugs,
) as readonly string[]

export type SkillSlug = (typeof FEATURED_ORDER)[number]

export type SkillMeta = {
  slug: string
  name: string
  description: string
  /** Relative path from repo root */
  path: string
  href: string
  install: string
  order: number
  contractId: string
}

export type SkillDetail = SkillMeta & {
  /** Full SKILL.md including frontmatter */
  source: string
  /** Body without YAML frontmatter */
  body: string
}

function contractIdFromSlug(slug: string): string {
  const id = slug.split("-")[0] ?? "meridian"
  return id in contractDnaById ? id : "meridian"
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

function toMeta(
  slug: string,
  source: string,
  order: number,
): SkillMeta {
  const { name, description } = parseFrontmatter(source)
  const contractId = contractIdFromSlug(slug)
  return {
    slug,
    name: name ?? slug,
    description: description ?? "",
    path: `${SKILLS_DIR}/${slug}/SKILL.md`,
    href: `/${contractId}/skills/${slug}`,
    install: installCommand(slug),
    order,
    contractId,
  }
}

/** All featured skills across contracts. */
async function listSkills(): Promise<SkillMeta[]> {
  const entries = await Promise.all(
    FEATURED_ORDER.map(async (slug, order) => {
      const source = await readSkillFile(slug)
      return toMeta(slug, source, order)
    }),
  )
  return entries
}

async function listSkillsForContract(contractId: string): Promise<SkillMeta[]> {
  const dna = contractDnaById[contractId as keyof typeof contractDnaById]
  if (!dna) return []
  const entries = await Promise.all(
    dna.skillSlugs.map(async (slug, order) => {
      const source = await readSkillFile(slug)
      return toMeta(slug, source, order)
    }),
  )
  return entries
}

async function getSkill(slug: string): Promise<SkillDetail | null> {
  if (!FEATURED_ORDER.includes(slug)) return null
  try {
    const source = await readSkillFile(slug)
    const { body } = parseFrontmatter(source)
    const meta = toMeta(slug, source, FEATURED_ORDER.indexOf(slug))
    return { ...meta, source, body }
  } catch {
    return null
  }
}

async function getSkillSlugs(): Promise<string[]> {
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
  listSkillsForContract,
  parseFrontmatter,
}
