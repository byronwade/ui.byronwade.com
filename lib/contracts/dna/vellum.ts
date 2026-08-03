import type { ContractDna } from "@/lib/contracts/dna/types"

export const vellumDna = {
  id: "vellum",
  name: "Vellum",
  tagline: "Reading-first docs & help — typeset lanes, measured prose.",
  preview: "mist",
  status: "preview",
  version: "0.0.0",
  features: [
    "MCP + typeset presets",
    "Docs / chat / reading",
    "Streaming-stable copy",
    "Context budgets",
  ],
  aesthetic:
    "Mist reading lanes, measured prose, typeset-first help surfaces.",
} as const satisfies ContractDna
