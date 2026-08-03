import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { DocShell } from "@/components/docs/doc-shell"
import { GoldenPath } from "@/components/site/golden-path"
import { PrimitiveContractsPanel } from "@/components/site/primitive-contracts"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

function ContractAgentsLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="For agents"
      title={`Keep ${contract.name} coherent`}
      lead="Load the contract, compose shadcn under frozen laws, validate before done. Install paths below — same tools on every system."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/install`}>Full install</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={pathTemplates.contractJson(contractId)}>
              contract.json
            </Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <div className="space-y-12">
        <GoldenPath />
        <PrimitiveContractsPanel />
        <InstallPanel contractId={contractId} />
      </div>
    </DocShell>
  )
}

export { ContractAgentsLabPage }
