import Link from "next/link"

import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

function ContractUiPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="UI primitives"
      title={`${contract.name} on one component set`}
      lead="These are the shared shadcn controls under components/ui. This page only applies the contract skin — we never fork Buttons per system."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/install`}>Install</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/surfaces`}>Shells</Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <section className="space-y-3">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Aesthetic brief: {contract.aesthetic} Status{" "}
          <span className="font-mono text-foreground">{contract.status}</span>.
          Compose with{" "}
          <span className="font-mono text-foreground">
            npx shadcn@latest add …
          </span>{" "}
          then keep agents inside this contract&apos;s tokens via MCP.
        </p>
        <PrimitivesGallery />
      </section>
    </DocShell>
  )
}

export { ContractUiPage }
