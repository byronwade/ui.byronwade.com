import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { Button } from "@/components/ui/button"
import { priceLabel, type DesignContract } from "@/lib/contracts/catalog"
import { typesetClass } from "@/lib/design"
import { pathTemplates } from "@/lib/platform/skeleton"
import { cn } from "@/lib/utils"

/**
 * Vellum landing — the page IS a document.
 *
 * Vellum's DNA is "reading-first docs & help: typeset lanes, measured prose",
 * so the page is set like a document rather than a product page: a
 * frontispiece, a sticky section index, and one measured prose column that
 * actually carries the argument. Interactive panels are figures that break
 * out of the measure and carry captions — the way a manual sets an exhibit.
 *
 * Prose comes from typeset presets, never per-tag classes. Deliberately
 * unlike Harbor (ops console) and Atlas (workbench).
 */

const sections = [
  { id: "install", num: "§01", label: "Loading the contract", meta: "install" },
  { id: "ui", num: "§02", label: "Primitives under this skin", meta: "shadcn" },
  { id: "shells", num: "§03", label: "Surfaces and density", meta: "shells" },
  { id: "budget", num: "§04", label: "Context budgets", meta: "closing" },
]

/** Figure — an exhibit that breaks the measure and keeps a caption. */
function Figure({
  id,
  num,
  title,
  caption,
  action,
  children,
}: {
  id: string
  num: string
  title: string
  caption: string
  action?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="flex items-baseline gap-3 text-2xl font-medium tracking-tight text-foreground">
          <span className="font-mono text-sm text-brand">{num}</span>
          {title}
        </h2>
        {action ? (
          <Link
            href={action.href}
            className="font-mono text-[12px] text-foreground underline-offset-4 hover:underline"
          >
            {action.label} →
          </Link>
        ) : null}
      </div>
      <p className={cn(typesetClass("reading"), "mt-3 max-w-prose")}>{caption}</p>
      <figure className="mt-6 overflow-hidden rounded-2xl bg-card p-4 edge sm:p-5">
        {children}
      </figure>
    </section>
  )
}

function VellumLanding({ contract }: { contract: DesignContract }) {
  const base = pathTemplates.base(contract.id)
  const jsonHref = pathTemplates.contractJson(contract.id)

  return (
    <main
      data-slot="vellum-landing"
      data-surface="marketing"
      className="px-5 pt-24 pb-24 md:px-8 md:pt-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Frontispiece ── */}
        <header className="border-b border-border pb-10">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Design contract · {contract.status}
          </p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.03] font-medium tracking-[-0.04em] text-foreground">
            {contract.name}
          </h1>
          <p
            className={cn(
              typesetClass("reading"),
              "mt-6 max-w-prose text-lg sm:text-xl",
            )}
          >
            {contract.tagline}
          </p>
          {/* Colophon — how this document is set, stated plainly */}
          <dl className="mt-9 grid gap-x-10 gap-y-5 border-t border-border/60 pt-6 sm:grid-cols-3">
            {[
              ["Measure", "65ch · reading preset"],
              ["Flow", "margin-block-start only"],
              ["Price", `${priceLabel()} · mcp/${contract.mcpSlug}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] tracking-[0.18em] text-brand uppercase">
                  {k}
                </dt>
                <dd className="mt-1.5 font-mono text-[12px] leading-relaxed text-muted-foreground">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
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
        </header>

        {/* ── Document body: sticky index + one measured column ── */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <nav
            aria-label="Contents"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Contents
            </p>
            <ul className="mt-4 space-y-3 border-l border-border pl-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="block text-sm leading-snug tracking-tight text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="font-mono text-[11px] text-brand">
                      {section.num}
                    </span>
                    <span className="mt-0.5 block text-foreground">
                      {section.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l border-border pl-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {contract.features.join(" · ")}
            </p>
          </nav>

          <div className="min-w-0 space-y-16">
            {/* Opening prose — the argument, in the preset it advertises */}
            <section className={cn(typesetClass("reading"), "max-w-prose")}>
              <p>
                {contract.aesthetic} Reading surfaces fail differently from
                dashboards: a paragraph that reflows while a model is still
                writing into it costs the reader their place, and no amount of
                chrome polish buys that back.
              </p>
              <p>
                So Vellum fixes the three controls that matter — size, leading,
                and flow — and lets everything else follow. Spacing only ever
                grows downward. Measure is capped. Headings keep medium weight
                so hierarchy comes from scale, not shouting.
              </p>
            </section>

            <Figure
              id="install"
              num="§01"
              title="Loading the contract"
              caption="Same architecture as every other contract in the catalog: an MCP server for consistency, a JSON kit for machines, npx for skills, shadcn for atoms. Only the DNA differs."
              action={{ href: `${base}/install`, label: "Full install" }}
            >
              <InstallPanel contractId={contract.id} compact />
            </Figure>

            <Figure
              id="ui"
              num="§02"
              title="Primitives under this skin"
              caption="One component set under components/ui. This route applies Vellum's tokens through CSS variables — controls are never forked per contract, which is what keeps a skin swap honest."
              action={{ href: `${base}/ui`, label: "Open gallery" }}
            >
              <PrimitivesGallery />
            </Figure>

            <Figure
              id="shells"
              num="§03"
              title="Surfaces and density"
              caption="Reading-first does not mean there is no application. The same shells every contract ships, remapped through Vellum's tokens — switch lanes to watch hit targets change without a second component set."
              action={{ href: `${base}/surfaces`, label: "Open surfaces" }}
            >
              <ShellShowcase variant="studio" />
            </Figure>

            <section id="budget" className="scroll-mt-20">
              <h2 className="flex items-baseline gap-3 text-2xl font-medium tracking-tight text-foreground">
                <span className="font-mono text-sm text-brand">§04</span>
                Context budgets
              </h2>
              <div className={cn(typesetClass("reading"), "mt-3 max-w-prose")}>
                <p>
                  An agent reads the contract before it reads your codebase, so
                  the contract has to be cheap. Vellum ships the machine docs
                  negotiated — browsers get the designed page, agents get raw
                  markdown from the same URL — and keeps the MCP kit slim
                  enough to load on every task.
                </p>
              </div>
              {/* Only link what this contract has actually published. */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {contract.authored.includes("for-agents") ? (
                  <Button size="pill" variant="outline" asChild>
                    <Link href={`${base}/for-agents`}>agents.md</Link>
                  </Button>
                ) : null}
                <Button size="pill" variant="outline" asChild>
                  <Link href={jsonHref} className="font-mono">
                    contract.json
                  </Link>
                </Button>
                <Button size="pill" variant="ghost" asChild>
                  <Link href={`${base}/install`}>Install</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export { VellumLanding }
