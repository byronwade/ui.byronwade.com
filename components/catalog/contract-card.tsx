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
  const interactive = contract.status === "live"

  const body = (
    <>
      <ContractPreview contract={contract} />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              {contract.name}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase",
                contract.status === "live"
                  ? "bg-brand/10 text-foreground"
                  : "bg-muted/50 text-muted-foreground",
              )}
            >
              {statusLabel[contract.status]}
            </span>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {contract.tagline}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
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
        <div className="shrink-0 text-left sm:text-right">
          <p className="font-mono text-xs text-muted-foreground">
            {priceLabel(contract.priceMonthly)} · mcp/{contract.mcpSlug}
          </p>
          <p className="mt-1 text-sm tracking-tight text-muted-foreground">
            {interactive ? "Open system →" : "Preview →"}
          </p>
        </div>
      </div>
    </>
  )

  const className = cn(
    "group block w-full rounded-[1.75rem] p-3 transition-[background-color,transform] duration-300 sm:p-4",
    "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    "motion-safe:hover:-translate-y-0.5",
  )

  if (interactive) {
    return (
      <Link
        href={contract.href}
        className={className}
        style={{ animationDelay: `${index * 60}ms` }}
        data-slot="contract-card"
      >
        {body}
      </Link>
    )
  }

  return (
    <Link
      href={contract.href}
      className={cn(className, "opacity-95")}
      style={{ animationDelay: `${index * 60}ms` }}
      data-slot="contract-card"
    >
      {body}
    </Link>
  )
}

export { ContractCard }
