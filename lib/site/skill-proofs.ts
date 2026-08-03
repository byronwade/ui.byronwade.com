import { CONTRACT_BASE } from "@/lib/docs/catalog"
import type { SkillSlug } from "@/lib/skills/catalog"

/**
 * On-site proof for every Meridian skill — the website must exercise
 * the full loop, not only list install commands.
 */
export type SkillProof = {
  slug: SkillSlug
  step: number
  label: string
  summary: string
  /** Primary in-product demo */
  proveHref: string
  proveLabel: string
  /** Skill detail page */
  skillHref: string
}

export const skillProofs: readonly SkillProof[] = [
  {
    slug: "meridian-theme",
    step: 1,
    label: "Theme",
    summary: "Re-skin OKLCH knobs — one accent, warm paper, closed radius.",
    proveHref: `${CONTRACT_BASE}/theme`,
    proveLabel: "Theme grammar",
    skillHref: `${CONTRACT_BASE}/skills/meridian-theme`,
  },
  {
    slug: "meridian-surface",
    step: 2,
    label: "Surface",
    summary: "Pick a density lane — application, marketing, mobile, desktop.",
    proveHref: `${CONTRACT_BASE}/surfaces`,
    proveLabel: "Surface gallery",
    skillHref: `${CONTRACT_BASE}/skills/meridian-surface`,
  },
  {
    slug: "meridian-compose",
    step: 3,
    label: "Compose",
    summary: "Workbench + composer wholes — object-bound AI, quiet chrome.",
    proveHref: `${CONTRACT_BASE}/surfaces#proofs`,
    proveLabel: "Live proofs",
    skillHref: `${CONTRACT_BASE}/skills/meridian-compose`,
  },
  {
    slug: "meridian-cinematic",
    step: 4,
    label: "Cinematic",
    summary: "One idea per frame — full-bleed stages, paper ↔ theater.",
    proveHref: `${CONTRACT_BASE}/#product`,
    proveLabel: "Contract film",
    skillHref: `${CONTRACT_BASE}/skills/meridian-cinematic`,
  },
  {
    slug: "meridian-a11y",
    step: 5,
    label: "A11y",
    summary: "Contrast pairs + banned cheats — WCAG AA on every change.",
    proveHref: `${CONTRACT_BASE}/theme#contrast`,
    proveLabel: "Contrast audit",
    skillHref: `${CONTRACT_BASE}/skills/meridian-a11y`,
  },
] as const
