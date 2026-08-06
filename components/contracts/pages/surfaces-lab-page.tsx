import Link from "next/link"

import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

function ContractSurfacesLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="Surfaces"
      title={`${contract.name} app shells`}
      lead="Detailed workbench and composer proofs — density by task. Shared shells from components/surfaces, styled by this contract."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/ui`}>UI gallery</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/theme`}>Theme</Link>
          </Button>
        </>
      }
      measure="wide"
      className="pb-24"
    >
      <ShellShowcase />
    </DocShell>
  )
}

export { ContractSurfacesLabPage }
