import Link from "next/link"

import { ContractPreview } from "@/components/catalog/contract-preview"
import {
  priceLabel,
  type DesignContract,
} from "@/lib/contracts/catalog"

function ComingSoonContract({ contract }: { contract: DesignContract }) {
  return (
    <main
      data-slot="coming-soon"
      data-surface="marketing"
      className="px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Design contract · {contract.status}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {contract.name}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            {contract.tagline}
          </p>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            {priceLabel()} · mcp/{contract.mcpSlug} when live
          </p>
          <ul className="mt-6 space-y-2">
            {contract.features.map((f) => (
              <li
                key={f}
                className="text-sm text-muted-foreground before:mr-2 before:text-brand before:content-['·']"
              >
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#contracts"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium tracking-tight text-primary-foreground"
            >
              Back to contracts
            </Link>
            <Link
              href="/meridian"
              className="inline-flex h-10 items-center rounded-full px-5 text-sm tracking-tight text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            >
              Explore Meridian (live)
            </Link>
          </div>
        </div>
        <ContractPreview contract={contract} className="depth-soft" />
      </div>
    </main>
  )
}

export { ComingSoonContract }
