import Link from "next/link"

import { DocShell } from "@/components/docs/doc-shell"
import { ThemePlayground } from "@/components/site/theme-playground"
import { Button } from "@/components/ui/button"
import { getContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { notFound } from "next/navigation"

function ContractThemeLabPage({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  if (!contract) notFound()
  const base = pathTemplates.base(contractId)

  return (
    <DocShell
      eyebrow="Theme"
      title={`${contract.name} tokens in a live workbench`}
      lead="The page chrome already uses this contract's OKLCH skin. The playground lets you try closed knob presets on a scoped preview — still one component set."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/ui`}>UI gallery</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/install`}>Install</Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <div className="space-y-4">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {contract.aesthetic} Brand, paper, and radius knobs are frozen
          presets — agents must not invent new OKLCH at call sites.
        </p>
        <ThemePlayground />
      </div>
    </DocShell>
  )
}

export { ContractThemeLabPage }
