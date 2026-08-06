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
    "MCP + contract JSON",
    "Closed grammar + check gates",
    "shadcn compose · typeset",
    "Object-bound AI rails",
  ],
  aesthetic:
    "Soft warm neutrals, one deep ink accent, full-bleed cinema, dense app chrome.",
  authored: [
    "design",
    "skills",
    "system",
    "for-agents",
    "architecture",
    "llms",
  ],
} as const satisfies ContractDna
