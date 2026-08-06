import type { ContractDna } from "@/lib/contracts/dna/types"

export const harborDna = {
  id: "harbor",
  name: "Harbor",
  tagline: "Calm ops admin — dense indexes, quiet chrome, semantic status.",
  preview: "paper",
  status: "preview",
  version: "0.1.0",
  features: [
    "Law book + harbor-* skills + CI gates",
    "Task density recipes for indexes",
    "Semantic status chips (not brand decoration)",
    "Index / detail intents",
    "Optional contract MCP accelerator",
  ],
  aesthetic:
    "Quiet paper ops surfaces, semantic status chips, dense index rows — no cinema.",
  dnaDoc: "docs/harbor.md",
  lawBookDir: "contracts/harbor",
  voice: "Calm operations — trustworthy, scannable, unhurried",
  paper: "Cool quiet paper — admin daylight, not marketing cream",
  accentName: "Harbor green (ops brand)",
  density: "Compact index rows · stable heights · status-first scanning",
  cinema: "none",
  must: [
    "Semantic status chips for open / warning / healthy — never status-as-brand wash",
    "Dense list-resource recipes with mono IDs and stable row height",
    "Quiet chrome — no full-bleed cinema, no theater tone",
  ],
  mustNot: [
    "Cinematic full-bleed heroes or overlay stickers on ops screens",
    "Purple/dev-tool aesthetics (that is Atlas) or mist reading lanes (Vellum)",
    "Marketing card grids as the primary resource index",
  ],
  skillSlugs: [
    "harbor-theme",
    "harbor-compose",
    "harbor-ops",
    "harbor-surface",
    "harbor-a11y",
  ],
  preferredRecipes: [
    "list-resource",
    "object-detail",
    "edit-record",
    "settings-form",
    "empty-recovery",
  ],
} as const satisfies ContractDna
