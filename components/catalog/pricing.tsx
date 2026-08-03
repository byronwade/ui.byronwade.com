import Link from "next/link"

import { contracts, MCP_PRICE_USD } from "@/lib/contracts/catalog"

function Pricing() {
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
              ${MCP_PRICE_USD} / month per MCP server
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              One contract, one MCP, one monthly seat for your agent stack.
              Install Meridian today; Harbor, Atlas, and Vellum follow the same
              price as they ship.
            </p>
          </div>
          <div className="rounded-3xl bg-muted/30 p-6 edge sm:p-8">
            <p className="text-sm font-medium tracking-tight text-foreground">
              Included with every contract
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>MCP tools — contract, tokens, validate, recipes</li>
              <li>Machine docs — design.md · agents.md · contract.json</li>
              <li>CLI gate — npx meridian check --json</li>
              <li>Few-shots + task recipes for common app intents</li>
              <li>Eval harness stub for agent UI drift</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {contracts.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="inline-flex h-8 items-center rounded-full bg-background/80 px-3 font-mono text-[11px] text-foreground transition-colors hover:bg-brand/10 edge"
                >
                  {c.name} · ${c.priceMonthly}
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
