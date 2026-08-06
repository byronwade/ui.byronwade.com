/**
 * Route parity — every contract ships the same primary DX surface.
 * check:platform enforces the files exist on disk.
 */

import {
  MACHINE_FILES,
  ROUTE_SLOTS,
  pathTemplates,
} from "@/lib/platform/skeleton"
import { contractDnaById, getDna } from "@/lib/contracts/dna"

/** Primary nav segments every contract must ship (incl. home ""). */
export const REQUIRED_CONTRACT_SEGMENTS = [
  "",
  "install",
  "ui",
  "theme",
  "surfaces",
  "design",
  "skills",
  "system",
  "for-agents",
] as const

/** Negotiated machine docs every contract must serve. */
export const REQUIRED_MACHINE_FILES = MACHINE_FILES

/** All native skill slugs across contracts (from DNA packs). */
export const PLATFORM_SKILL_SLUGS = Object.values(contractDnaById).flatMap(
  (dna) => dna.skillSlugs,
) as readonly string[]

export function contractSkillSlugs(contractId: string): readonly string[] {
  return getDna(contractId)?.skillSlugs ?? []
}

export function contractNav(contractId: string) {
  const dna = getDna(contractId)
  if (!dna) return []
  return ROUTE_SLOTS.filter((s) => s.nav).map((s) => ({
    href: s.segment
      ? `${pathTemplates.base(contractId)}/${s.segment}`
      : pathTemplates.base(contractId),
    label: s.label,
    segment: s.segment,
  }))
}

/** Theme skill slug — every contract ships a native `{id}-theme`. */
export function advertisedThemeSkill(contractId: string) {
  const preferred = `${contractId}-theme`
  const slugs = contractSkillSlugs(contractId)
  if (slugs.includes(preferred)) return preferred
  return "meridian-theme"
}
