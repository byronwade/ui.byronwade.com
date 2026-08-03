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
    proveHref: "/theme",
    proveLabel: "Theme grammar",
    skillHref: "/skills/meridian-theme",
  },
  {
    slug: "meridian-surface",
    step: 2,
    label: "Surface",
    summary: "Pick a density lane — application, marketing, mobile, desktop.",
    proveHref: "/surfaces",
    proveLabel: "Surface gallery",
    skillHref: "/skills/meridian-surface",
  },
  {
    slug: "meridian-compose",
    step: 3,
    label: "Compose",
    summary: "Workbench + composer wholes — object-bound AI, quiet chrome.",
    proveHref: "/surfaces#proofs",
    proveLabel: "Live proofs",
    skillHref: "/skills/meridian-compose",
  },
  {
    slug: "meridian-cinematic",
    step: 4,
    label: "Cinematic",
    summary: "One idea per frame — full-bleed stages, paper ↔ theater.",
    proveHref: "/#product",
    proveLabel: "Home film",
    skillHref: "/skills/meridian-cinematic",
  },
  {
    slug: "meridian-a11y",
    step: 5,
    label: "A11y",
    summary: "Contrast pairs + banned cheats — WCAG AA on every change.",
    proveHref: "/theme#contrast",
    proveLabel: "Contrast audit",
    skillHref: "/skills/meridian-a11y",
  },
] as const
