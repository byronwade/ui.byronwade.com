import Link from "next/link"
import { notFound } from "next/navigation"

import { DocShell } from "@/components/docs/doc-shell"
import { MarkdownBody } from "@/components/docs/markdown-body"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { loadSource } from "@/lib/docs/load-source"
import { getSystemDoc } from "@/lib/docs/system-docs"
import { pathTemplates } from "@/lib/platform/skeleton"

async function ContractSystemDocLabPage({
  contractId,
  slug,
}: {
  contractId: string
  slug: string
}) {
  const contract = getContract(contractId)
  const doc = getSystemDoc(slug)
  if (!contract || !doc) notFound()

  const source = await loadSource(doc.sourcePath)
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow={`System · ${contract.name}`}
      title={doc.title}
      lead={doc.summary}
      filename={doc.filename}
      rawHref={`${base}/system/${doc.slug}/raw`}
      source={source}
      measure="split"
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/system`}>All specs</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/design`}>Design</Link>
          </Button>
        </>
      }
      className="pb-24"
    >
      <MarkdownBody source={source} />
    </DocShell>
  )
}

export { ContractSystemDocLabPage }
