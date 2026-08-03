import type { ContractDna } from "@/lib/contracts/dna/types"

export const harborDna = {
  id: "harbor",
  name: "Harbor",
  tagline: "Calm ops admin — dense indexes, quiet chrome, semantic status.",
  preview: "paper",
  status: "soon",
  version: "0.0.0",
  features: [
    "MCP + contract JSON",
    "Task density recipes",
    "Index / detail intents",
    "Eval harness",
  ],
  aesthetic:
    "Quiet paper ops surfaces, semantic status chips, dense index rows.",
} as const satisfies ContractDna
