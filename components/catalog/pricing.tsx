import Link from "next/link"

import {
  designContracts,
  priceLabel,
  PRICING_MODEL,
} from "@/lib/contracts/catalog"

function Pricing() {
  const open = PRICING_MODEL === "open-source"

  return (
    <section
      id="pricing"
      data-slot="pricing"
      data-site="platform"
      className="scroll-mt-14 border-t border-border/70 px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
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
                  stdio. Every design contract MCP is free to install — pick a
                  system and stay inside its skin.
                </>
              ) : (
                <>One contract, one MCP, one monthly seat.</>
              )}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Cost notes live on Meridian&apos;s system doc:{" "}
              <Link
                href="/meridian/system/pricing"
                className="text-foreground underline-offset-4 hover:underline"
              >
                why we open-sourced
              </Link>
              .
            </p>
          </div>
          <div className="border border-border/80 bg-muted/20 p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.14em] text-foreground uppercase">
              What you get
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Per-contract DNA on every page of that route</li>
              <li>Shared architecture — MCP tools, JSON keys, recipes</li>
              <li>Machine docs + contract.json per system</li>
              <li>CLI gate against the contract you installed</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {designContracts.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="inline-flex h-8 items-center border border-border bg-background px-3 font-mono text-[11px] text-foreground transition-colors hover:border-foreground/30"
                >
                  {c.name}
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
