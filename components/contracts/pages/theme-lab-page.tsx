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
      lead="Chrome already uses this contract's DNA. Tweak closed prefs (brand · radius · paper), then install them into any project via MCP apply_prefs."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href={`${base}/install`}>Install MCP</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href={`${base}/ui`}>UI gallery</Link>
          </Button>
        </>
      }
      measure="split"
      className="pb-24"
    >
      <div className="space-y-4">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {contract.aesthetic} Prefs are closed presets only — not layout
          builders or animation pickers. Those stay laws (
          <Link
            href={`${base}/system/layout`}
            className="text-foreground underline-offset-4 hover:underline"
          >
            layout
          </Link>
          ,{" "}
          <Link
            href={`${base}/system/animations`}
            className="text-foreground underline-offset-4 hover:underline"
          >
            animations
          </Link>
          ).
        </p>
        <ThemePlayground contractId={contractId} />
      </div>
    </DocShell>
  )
}

export { ContractThemeLabPage }
