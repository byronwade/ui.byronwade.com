import { ContractFooter } from "@/components/chrome/contract-footer"
import { ContractHeader } from "@/components/chrome/contract-header"

/**
 * Scopes the entire contract route tree to that DNA's tokens + chrome.
 * Landing /{id} must feel like that design system — no platform leak.
 */
function ContractFrame({
  contractId,
  children,
}: {
  contractId: string
  children: React.ReactNode
}) {
  return (
    <div
      data-contract={contractId}
      data-slot="contract-frame"
      className="min-h-svh bg-background text-foreground"
    >
      <ContractHeader contractId={contractId} />
      {children}
      <ContractFooter contractId={contractId} />
    </div>
  )
}

export { ContractFrame }
