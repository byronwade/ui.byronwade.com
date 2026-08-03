import type { ContractDna } from "@/lib/contracts/dna/types"

export const atlasDna = {
  id: "atlas",
  name: "Atlas",
  tagline: "Developer workbench — mono metadata, keyboard-first scanning.",
  preview: "ink",
  status: "soon",
  version: "0.0.0",
  features: [
    "MCP + contract JSON",
    "Desktop density lane",
    "Command-palette patterns",
    "Few-shot recipes",
  ],
  aesthetic:
    "Ink-forward workbench, mono metadata, keyboard-first scanning chrome.",
} as const satisfies ContractDna
