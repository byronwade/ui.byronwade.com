import type { ContractDna } from "@/lib/contracts/dna/types"

export const vellumDna = {
  id: "vellum",
  name: "Vellum",
  tagline: "Reading-first docs & help — typeset lanes, measured prose.",
  preview: "mist",
  status: "preview",
  version: "0.1.0",
  features: [
    "Law book + vellum-* skills + CI gates",
    "Typeset presets (docs / chat / reading)",
    "Measured prose + context budgets",
    "Streaming-stable copy",
    "Optional contract MCP accelerator",
  ],
  aesthetic:
    "Mist reading lanes, measured prose, typeset-first help surfaces.",
  dnaDoc: "docs/vellum.md",
  lawBookDir: "contracts/vellum",
  voice: "Quiet scholarship — measured, human, never chatbot-cliché",
  paper: "Mist paper — soft warm-cool reading ground",
  accentName: "Bronze mist (reading brand)",
  density: "Reading lanes 65ch · open leading · compact only in chrome",
  cinema: "subtle",
  must: [
    "typesetClass / reading-ui · reading-prose for long-form — never full-bleed text-sm essays",
    "Measure ~65ch (never exceed 80ch) on reading surfaces",
    "Streaming-stable copy — no layout jump when tokens arrive",
  ],
  mustNot: [
    "Dashboard card grids as the primary help surface",
    "Dense ops indexes (Harbor) or IDE workbench chrome (Atlas) as default",
    "Bionic Reading, sepia gimmicks, or decorative activity pastels in prose",
  ],
  skillSlugs: [
    "vellum-theme",
    "vellum-compose",
    "vellum-reading",
    "vellum-surface",
    "vellum-a11y",
  ],
  preferredRecipes: [
    "object-detail",
    "settings-form",
    "empty-recovery",
    "agent-rail",
  ],
} as const satisfies ContractDna
