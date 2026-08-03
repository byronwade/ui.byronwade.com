import Link from "next/link"

import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { systemDocs } from "@/lib/docs/system-docs"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

function ContractSystemLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="System"
      title={`${contract.name} · platform specs`}
      lead="Shared research and platform law. Architecture is identical across contracts — DNA only changes aesthetics."
      actions={
        <Button variant="outline" size="default" asChild>
          <Link href={`${base}/install`}>Install</Link>
        </Button>
      }
      measure="split"
      className="pb-24"
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {systemDocs.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`${base}/system/${doc.slug}`}
              className="block rounded-2xl bg-card p-5 transition-colors hover:bg-muted/30 edge"
            >
              <p className="text-sm font-medium tracking-tight text-foreground">
                {doc.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {doc.summary}
              </p>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                {doc.filename}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </DocShell>
  )
}

export { ContractSystemLabPage }
