import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { getContractInstall } from "@/lib/contracts/install"
import { notFound } from "next/navigation"

function ContractInstallPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  const install = getContractInstall(contractId)
  if (!contract || !install) notFound()

  return (
    <DocShell
      eyebrow="Install"
      title={`Use ${contract.name} in your agent stack`}
      lead="MCP for consistency, JSON API for the kit, npx for skills, shadcn for atoms — one path, this contract's DNA."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={install.pages.ui}>UI gallery</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={install.pages.surfaces}>App shells</Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <InstallPanel contractId={contractId} />
    </DocShell>
  )
}

export { ContractInstallPage }
