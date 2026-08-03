/**
 * Platform barrel — structural SSOT for every design contract.
 */
export * from "@/lib/platform/skeleton"
export * from "@/lib/platform/consistency"
export {
  buildContractById,
  buildContractEnvelope,
  compactRecipes,
  platformBlock,
  type ContractJson,
  type LiveGrammar,
} from "@/lib/platform/build-contract"
