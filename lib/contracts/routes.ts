/**
 * Route parity — every contract ships the same primary DX surface.
 * check:platform enforces the files exist on disk.
 */

import {
  MACHINE_FILES,
  ROUTE_SLOTS,
  pathTemplates,
} from "@/lib/platform/skeleton"
import { getDna } from "@/lib/contracts/dna"

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

/** Skills currently in the repo (platform pack). DNA-specific packs may add later. */
export const PLATFORM_SKILL_SLUGS = [
  "meridian-theme",
  "meridian-compose",
  "meridian-cinematic",
  "meridian-surface",
  "meridian-a11y",
] as const

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

/** Theme skill slug to advertise — falls back to platform theme skill. */
export function advertisedThemeSkill(contractId: string) {
  const preferred = `${contractId}-theme`
  if ((PLATFORM_SKILL_SLUGS as readonly string[]).includes(preferred)) {
    return preferred
  }
  return "meridian-theme"
}
