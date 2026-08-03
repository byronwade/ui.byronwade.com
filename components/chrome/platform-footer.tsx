import Link from "next/link"

import { contracts, priceLabel } from "@/lib/contracts/catalog"

function PlatformFooter() {
  const live = contracts.filter((c) => c.status === "live").length

  return (
    <footer
      data-slot="platform-footer"
      data-site="platform"
      className="border-t border-border/70 bg-background px-4 py-14 md:px-6 md:py-16"
    >
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-foreground uppercase">
            Design contracts
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A platform index of AI design systems. Open a contract to experience
            that system end-to-end — tokens, chrome, density, and voice.
          </p>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            {live} live · {contracts.length} catalogued · {priceLabel()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Index
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/#contracts"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Systems
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Open source
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Contracts
          </p>
          <ul className="mt-3 space-y-2">
            {contracts.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.name}
                  <span className="ml-2 text-[11px] opacity-70">
                    {c.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { PlatformFooter }
