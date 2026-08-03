import Link from "next/link"

import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { getLlmsTxt } from "@/lib/contracts/machine-docs"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

async function ContractLlmsLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const source = await getLlmsTxt(contractId)
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="llms.txt"
      title={`${contract.name} for models`}
      lead="Compact entrypoint for agents — contract JSON, MCP, and machine docs."
      filename="llms.txt"
      rawHref={`${base}/llms.txt?raw=1`}
      source={source}
      measure="split"
      actions={
        <Button variant="outline" size="default" asChild>
          <Link href={`${base}/install`}>Install</Link>
        </Button>
      }
      className="pb-24"
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

export { ContractLlmsLabPage }
