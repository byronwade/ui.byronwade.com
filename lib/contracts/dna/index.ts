import type { ContractDna } from "@/lib/contracts/dna/types"
import { atlasDna } from "@/lib/contracts/dna/atlas"
import { harborDna } from "@/lib/contracts/dna/harbor"
import { meridianDna } from "@/lib/contracts/dna/meridian"
import { vellumDna } from "@/lib/contracts/dna/vellum"

/** Every catalogued contract MUST have a DNA pack here. */
export const contractDnaById = {
  meridian: meridianDna,
  harbor: harborDna,
  atlas: atlasDna,
  vellum: vellumDna,
} as const satisfies Record<string, ContractDna>

export type ContractId = keyof typeof contractDnaById

export function getDna(id: string): ContractDna | undefined {
  return contractDnaById[id as ContractId]
}

export function listDna(): ContractDna[] {
  return Object.values(contractDnaById)
}

export {
  atlasDna,
  harborDna,
  meridianDna,
  vellumDna,
}
export type { ContractDna } from "@/lib/contracts/dna/types"
