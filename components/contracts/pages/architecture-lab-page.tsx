import Link from "next/link"

import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { getArchitectureMarkdown } from "@/lib/contracts/machine-docs"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

async function ContractArchitectureLabPage({
  contractId,
}: {
  contractId: string
}) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const source = await getArchitectureMarkdown(contractId)
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="Architecture"
      title={`${contract.name} architecture`}
      lead="Shared platform architecture with this contract's DNA preface."
      filename="architecture.md"
      rawHref={`${base}/architecture.md?raw=1`}
      source={source}
      measure="split"
      actions={
        <Button variant="outline" size="default" asChild>
          <Link href={`${base}/system/architecture`}>System spec</Link>
        </Button>
      }
      className="pb-24"
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

export { ContractArchitectureLabPage }
