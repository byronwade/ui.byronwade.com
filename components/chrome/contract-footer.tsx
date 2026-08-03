import Link from "next/link"

import { getContract, priceLabel } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"

function ContractFooter({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  const name = contract?.name ?? contractId
  const live = contract?.status === "live"
  const base = pathTemplates.base(contractId)

  return (
    <footer
      data-slot="contract-footer"
      data-surface="marketing"
      className="border-t border-border/50 bg-background px-5 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium tracking-tight text-foreground">
            {name}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {contract?.aesthetic ??
              "Design contract — tokens, density, and agent laws."}
          </p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            {priceLabel()} · mcp/{contractId}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            In this system
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={base}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {live ? "Film home" : "Experience"}
              </Link>
            </li>
            {live ? (
              <>
                <li>
                  <Link
                    href={`${base}/theme`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Theme
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/surfaces`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Surfaces
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/for-agents`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    For agents
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/#contracts"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to catalog
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Machine
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={pathTemplates.contractJson(contractId)}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {contractId}.contract.json
              </Link>
            </li>
            {live ? (
              <>
                <li>
                  <Link
                    href={`${base}/design.md`}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    design.md
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/agents.md`}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    agents.md
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { ContractFooter }
