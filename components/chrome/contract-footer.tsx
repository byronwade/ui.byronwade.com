import Link from "next/link"

import {
  contractPrimaryNav,
  getContract,
  priceLabel,
} from "@/lib/contracts/catalog"
import { MACHINE_FILES, pathTemplates } from "@/lib/platform/skeleton"

/**
 * Footer links are derived, never hand-listed.
 *
 * "In this system" mirrors the primary nav, so it can only offer routes the
 * contract actually serves. Machine files appear once the DNA declares the
 * docs as authored — status is not the right gate, since a preview contract
 * can publish docs and a live one could lag.
 */
function ContractFooter({ contractId }: { contractId: string }) {
  const contract = getContract(contractId)
  const name = contract?.name ?? contractId
  const base = pathTemplates.base(contractId)
  const nav = contractPrimaryNav(contractId).filter((i) => i.href !== base)
  const hasMachineDocs = contract?.authored.includes("design") ?? false

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

        <nav aria-label={`${name} footer`}>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            In this system
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={base}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contracts"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Back to catalog
              </Link>
            </li>
          </ul>
        </nav>

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
            {hasMachineDocs
              ? MACHINE_FILES.map((file) => (
                  <li key={file}>
                    <Link
                      href={`${base}/${file}`}
                      className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {file}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { ContractFooter }
