import Link from "next/link"

import { contracts, MCP_PRICE_USD } from "@/lib/contracts/catalog"
import { docs, primaryNav } from "@/lib/docs/catalog"
import { skillProofs } from "@/lib/site/skill-proofs"

function SiteFooter() {
  const files = docs.filter((d) => Boolean(d.filename))
  const live = contracts.filter((c) => c.status === "live").length

  return (
    <footer
      data-slot="site-footer"
      data-surface="marketing"
      className="border-t border-border/50 bg-background px-5 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium tracking-tight text-foreground">
            Design contracts
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Strict AI design systems — MCP servers agents install so every
            surface they ship looks like it came from one hand.
          </p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            {live} live · {contracts.length} catalogued · ${MCP_PRICE_USD}/mo
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Platform
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/#contracts"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contracts
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
            </li>
            {primaryNav.slice(0, 3).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Meridian · {item.navLabel ?? item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Skills · prove
          </p>
          <ul className="mt-3 space-y-2">
            {skillProofs.map((proof) => (
              <li key={proof.slug}>
                <Link
                  href={proof.proveHref}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {proof.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Machine
          </p>
          <ul className="mt-3 space-y-2">
            {files.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.rawHref ?? item.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.filename}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/r/meridian.contract.json"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                meridian.contract.json
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
