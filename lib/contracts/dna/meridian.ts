import type { ContractDna } from "@/lib/contracts/dna/types"

export const meridianDna = {
  id: "meridian",
  name: "Meridian",
  tagline:
    "Cinematic app UI for agents — OKLCH, shell rhythm, typeset, UX/DX laws.",
  preview: "theater",
  status: "live",
  version: "0.1.0",
  features: [
    "Law book + verified skills + CI gates",
    "Closed grammar + check gates",
    "shadcn compose · typeset",
    "Object-bound AI rails",
    "Optional contract MCP accelerator",
  ],
  aesthetic:
    "Soft warm neutrals, one deep ink accent, full-bleed cinema, dense app chrome.",
  dnaDoc: "docs/meridian.md",
  lawBookDir: "contracts/meridian",
  voice: "Operational editorial — crisp, calm, softly warm",
  paper: "Warm soft neutrals — never pure white/black",
  accentName: "Ink-teal brand",
  density: "Cursor-application density · one idea per cinema frame",
  cinema: "full",
  must: [
    "Full-bleed cinema frames with ideas: 1 — never overlay stickers",
    "Import structure from @/lib/design (grammar · recipes · typeset)",
    "Theater tone only when staging product emotion — app chrome stays quiet",
  ],
  mustNot: [
    "Inset hero media cards or floating promo chips on cinema frames",
    "Cold stark Vercel pastiche or purple Linear accent",
    "Ship without meridian-* skill when composing product wholes",
  ],
  skillSlugs: [
    "meridian-theme",
    "meridian-compose",
    "meridian-cinematic",
    "meridian-surface",
    "meridian-a11y",
  ],
  preferredRecipes: [
    "list-resource",
    "object-detail",
    "agent-rail",
    "edit-record",
    "settings-form",
    "empty-recovery",
  ],
} as const satisfies ContractDna
