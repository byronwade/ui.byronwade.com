import Link from "next/link"

import {
  contracts,
  priceLabel,
  PRICING_MODEL,
} from "@/lib/contracts/catalog"

function Pricing() {
  const open = PRICING_MODEL === "open-source"

  return (
    <section
      id="pricing"
      data-slot="pricing"
      data-surface="marketing"
      className="scroll-mt-16 border-t border-border/40 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Pricing
        </p>
        <div className="mt-3 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {open ? "Open source — $0 / month" : priceLabel()}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {open ? (
                <>
                  The MCP runs on{" "}
                  <span className="text-foreground">your machine</span> over
                  stdio — our hosting cost per contract is effectively zero. Even
                  a shared remote host would be a few dollars a month for the
                  whole platform, so charging per seat fails a honest cost-plus
                  bar. Every design contract MCP is free to install and use.
                </>
              ) : (
                <>
                  One contract, one MCP, one monthly seat for your agent stack.
                </>
              )}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Cost notes:{" "}
              <Link
                href="/meridian/system/pricing"
                className="text-foreground underline-offset-4 hover:underline"
              >
                why we open-sourced
              </Link>
              .
            </p>
          </div>
          <div className="rounded-3xl bg-muted/30 p-6 edge sm:p-8">
            <p className="text-sm font-medium tracking-tight text-foreground">
              What you get
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Lightweight MCP — must/mustNot, closed tokens, validate_ui</li>
              <li>Machine docs — design.md · agents.md · contract.json</li>
              <li>CLI gate — check your UI against the contract</li>
              <li>Task recipes with must/never for common app intents</li>
              <li>Same consistency kit on every future contract</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {contracts.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="inline-flex h-8 items-center rounded-full bg-background/80 px-3 font-mono text-[11px] text-foreground transition-colors hover:bg-brand/10 edge"
                >
                  {c.name} · {priceLabel(c.priceMonthly)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Pricing }
