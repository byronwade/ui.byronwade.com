import Link from "next/link"

import { ContractPreview } from "@/components/catalog/contract-preview"
import {
  priceLabel,
  type DesignContract,
} from "@/lib/contracts/catalog"
import { cn } from "@/lib/utils"

const statusLabel: Record<DesignContract["status"], string> = {
  live: "Live",
  preview: "Preview",
  soon: "Soon",
}

function ContractCard({
  contract,
  index,
}: {
  contract: DesignContract
  index: number
}) {
  return (
    <Link
      href={contract.href}
      className={cn(
        "group grid gap-0 overflow-hidden border border-border/80 bg-background transition-colors",
        "hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
      )}
      style={{ animationDelay: `${index * 40}ms` }}
      data-slot="contract-card"
    >
      {/* Skin window — preview inherits that contract's tokens */}
      <div
        data-contract={contract.id}
        className="bg-background p-3 sm:p-4"
      >
        <ContractPreview contract={contract} />
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-border/70 p-5 sm:p-6 lg:border-t-0 lg:border-l">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              {contract.name}
            </h3>
            <span className="border border-border px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {statusLabel[contract.status]}
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {contract.tagline}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {contract.aesthetic}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {contract.features.map((f) => (
              <li
                key={f}
                className="font-mono text-[11px] text-muted-foreground"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-border/50 pt-4">
          <p className="font-mono text-[11px] text-muted-foreground">
            {priceLabel(contract.priceMonthly)} · mcp/{contract.mcpSlug}
          </p>
          <p className="font-mono text-[12px] tracking-tight text-foreground">
            {contract.status === "live" ? "Enter system →" : "Experience DNA →"}
          </p>
        </div>
      </div>
    </Link>
  )
}

export { ContractCard }
