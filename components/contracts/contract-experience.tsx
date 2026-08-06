import Link from "next/link"

import { AtlasLanding } from "@/components/contracts/layouts/atlas-landing"
import { HarborLanding } from "@/components/contracts/layouts/harbor-landing"
import { VellumLanding } from "@/components/contracts/layouts/vellum-landing"
import { DnaProof } from "@/components/contracts/showcase/dna-proof"
import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { Button } from "@/components/ui/button"
import { priceLabel, type DesignContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { cn } from "@/lib/utils"

/**
 * Contract landing pages.
 *
 * Every contract shares routes, MCP tools, and JSON keys (lib/platform/
 * skeleton.ts). What a contract does NOT share is how its own home page is
 * built: a page architecture is part of the DNA, so each system gets a layout
 * that argues its case in its own idiom —
 *
 *   meridian → cinematic film      (app/meridian/page.tsx)
 *   harbor   → ops console         (layouts/harbor-landing.tsx)
 *   atlas    → editor workbench    (layouts/atlas-landing.tsx)
 *   vellum   → typeset document    (layouts/vellum-landing.tsx)
 *
 * `GenericLanding` below is the fallback for a contract whose surface pack
 * has not landed yet. It is not the house style — a new contract is expected
 * to grow its own layout, not settle here.
 */

const layouts: Record<
  string,
  (props: { contract: DesignContract }) => React.ReactElement
> = {
  harbor: HarborLanding,
  atlas: AtlasLanding,
  vellum: VellumLanding,
}

/* ── Fallback layout — neutral bands, no borrowed personality ─────── */

function Band({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string
  tone?: "paper" | "sunk"
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 border-b border-border/60 px-5 py-20 md:px-8 md:py-24",
        tone === "sunk" && "bg-muted/20",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

function BandHead({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string
  title: string
  lead: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        <p className="type-label text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-2.5 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {lead}
        </p>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="type-meta inline-flex min-h-8 shrink-0 items-center text-foreground underline-offset-4 hover:underline sm:mt-1"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  )
}

function GenericLanding({ contract }: { contract: DesignContract }) {
  const base = pathTemplates.base(contract.id)
  const jsonHref = pathTemplates.contractJson(contract.id)

  return (
    <main data-slot="contract-experience" data-surface="marketing">
      <Band className="pt-28 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <div className="max-w-xl">
            <p className="type-label text-muted-foreground">
              Design contract · {contract.status}
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,6vw,4rem)] leading-[1.02] font-medium tracking-[-0.04em] text-foreground">
              {contract.name}
            </h1>
            <p className="mt-5 text-lg leading-snug tracking-tight text-foreground sm:text-xl">
              {contract.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {contract.aesthetic}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Button size="pill" asChild>
                <Link href={`${base}/install`}>Install MCP · API · npx</Link>
              </Button>
              <Button size="pill" variant="outline" asChild>
                <Link href={`${base}/ui`}>UI gallery</Link>
              </Button>
              <Button size="pill" variant="ghost" asChild>
                <Link href={jsonHref} className="font-mono">
                  contract.json
                </Link>
              </Button>
            </div>
            <p className="type-meta mt-5 text-muted-foreground">
              {priceLabel()} · mcp/{contract.mcpSlug}
            </p>
          </div>

          <DnaProof
            contractId={contract.id}
            name={contract.name}
            aesthetic={contract.aesthetic}
          />
        </div>

        <dl className="mt-14 grid gap-x-8 gap-y-6 border-t border-border/60 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {contract.features.map((feature, i) => (
            <div key={feature}>
              <dt className="type-meta text-brand">
                {String(i + 1).padStart(2, "0")}
              </dt>
              <dd className="mt-2 text-sm leading-snug tracking-tight text-foreground">
                {feature}
              </dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band id="install" tone="sunk">
        <InstallPanel contractId={contract.id} />
      </Band>

      <Band id="ui">
        <BandHead
          eyebrow="UI gallery"
          title={`Shared shadcn — ${contract.name} skin`}
          lead="One component set under components/ui. This route applies the DNA through CSS variables; we never fork controls per contract."
          action={{ href: `${base}/ui`, label: "Open full UI page" }}
        />
        <div className="mt-8">
          <PrimitivesGallery />
        </div>
      </Band>

      <Band id="shells" tone="sunk">
        <BandHead
          eyebrow="App shells"
          title="Workbench & composer proofs"
          lead={`Detailed product chrome — the same shells every contract ships, restyled by ${contract.name}.`}
          action={{ href: `${base}/surfaces`, label: "Open surfaces" }}
        />
        <div className="mt-8">
          <ShellShowcase variant="studio" />
        </div>
      </Band>
    </main>
  )
}

/** Routes a contract to its own landing architecture. */
function ContractExperience({ contract }: { contract: DesignContract }) {
  const Layout = layouts[contract.id] ?? GenericLanding
  return <Layout contract={contract} />
}

export { ContractExperience }
