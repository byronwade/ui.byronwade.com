"use client"

import { createContext, useContext } from "react"

import { getContract } from "@/lib/contracts/catalog"

type ContractScope = {
  /** Contract id, e.g. "meridian" — matches `[data-contract]` on the frame. */
  id: string
  /** Display name, e.g. "Meridian". */
  name: string
}

const ContractScopeContext = createContext<ContractScope | null>(null)

/**
 * Names the contract that owns the current route tree.
 *
 * Shared product shells (workbench, composer, desktop) render on every
 * contract page. Anything that spells a system name in chrome must read it
 * from here — a literal "Meridian" leaks the wrong brand onto /harbor.
 */
function ContractScopeProvider({
  contractId,
  children,
}: {
  contractId: string
  children: React.ReactNode
}) {
  const name = getContract(contractId)?.name ?? contractId
  return (
    <ContractScopeContext.Provider value={{ id: contractId, name }}>
      {children}
    </ContractScopeContext.Provider>
  )
}

/** Contract scope, or the platform fallback when rendered outside a frame. */
function useContractScope(): ContractScope {
  return useContext(ContractScopeContext) ?? { id: "platform", name: "Contract" }
}

/** Inline name of the owning contract — for chrome copy inside shared shells. */
function ContractName() {
  return <>{useContractScope().name}</>
}

export { ContractName, ContractScopeProvider, useContractScope }
export type { ContractScope }
