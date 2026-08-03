import Link from "next/link"

import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { getDesignMarkdown } from "@/lib/contracts/machine-docs"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

async function ContractDesignLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const source = await getDesignMarkdown(contractId)
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="Design"
      title={`${contract.name} contract`}
      lead={contract.tagline}
      filename="design.md"
      rawHref={`${base}/design.md?raw=1`}
      source={source}
      measure="split"
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/install`}>Install</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/ui`}>UI gallery</Link>
          </Button>
        </>
      }
      className="pb-24"
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

export { ContractDesignLabPage }
