import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { priceLabel, type DesignContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { cn } from "@/lib/utils"

const demos: Record<
  string,
  {
    eyebrow: string
    sampleRows: { id: string; title: string; meta: string; tone: string }[]
    panelTitle: string
    panelBody: string
    density: string
  }
> = {
  harbor: {
    eyebrow: "Ops index",
    sampleRows: [
      {
        id: "ORD-2401",
        title: "Restock ceramic vessels",
        meta: "Open · 12m",
        tone: "warning",
      },
      {
        id: "ORD-2398",
        title: "Refund #4821",
        meta: "Needs review",
        tone: "brand",
      },
      {
        id: "ORD-2390",
        title: "Ship queue — West",
        meta: "Healthy",
        tone: "success",
      },
    ],
    panelTitle: "Quiet paper ops",
    panelBody:
      "Dense rows, semantic status, calm chrome. Harbor is the admin contract — indexes and details agents can keep consistent.",
    density: "Compact rows · semantic chips · no cinema",
  },
  atlas: {
    eyebrow: "Workbench",
    sampleRows: [
      {
        id: "src/app.ts",
        title: "bootAgent()",
        meta: "edited 2m",
        tone: "brand",
      },
      {
        id: "tool.call",
        title: "validate_ui",
        meta: "passed",
        tone: "success",
      },
      {
        id: "cmd+k",
        title: "Jump to recipe",
        meta: "palette",
        tone: "muted",
      },
    ],
    panelTitle: "Ink-forward scanning",
    panelBody:
      "Mono metadata, sharp radius, keyboard-first chrome. Atlas is the developer workbench contract.",
    density: "Desktop density · mono meta · steel ink",
  },
  vellum: {
    eyebrow: "Reading lane",
    sampleRows: [
      {
        id: "§01",
        title: "How agents load the contract",
        meta: "3 min read",
        tone: "brand",
      },
      {
        id: "§02",
        title: "Typeset presets for help",
        meta: "streaming-safe",
        tone: "muted",
      },
      {
        id: "§03",
        title: "Context budgets",
        meta: "measured",
        tone: "success",
      },
    ],
    panelTitle: "Mist, measured prose",
    panelBody:
      "Docs and help surfaces with reading lanes — not dashboard chrome. Vellum keeps long-form honest for agents and humans.",
    density: "reading-ui · soft radius · bronze accent",
  },
}

function statusClass(tone: string) {
  if (tone === "warning") return "bg-warning/15 text-foreground"
  if (tone === "success") return "bg-brand/10 text-foreground"
  if (tone === "brand") return "bg-brand/10 text-foreground"
  return "bg-muted/50 text-muted-foreground"
}

/**
 * Feature-rich contract home for non-film systems.
 * Showcases DNA + shared UI/shells + install DX under [data-contract].
 */
function ContractExperience({ contract }: { contract: DesignContract }) {
  const demo = demos[contract.id] ?? demos.harbor!
  const base = pathTemplates.base(contract.id)
  const jsonHref = pathTemplates.contractJson(contract.id)

  return (
    <main
      data-slot="contract-experience"
      data-surface="marketing"
      className="px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32"
    >
      <div className="mx-auto max-w-6xl space-y-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Design contract · {contract.status}
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {contract.name}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {contract.tagline}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {contract.aesthetic}
            </p>
            <p className="mt-6 font-mono text-sm text-muted-foreground">
              {priceLabel()} · mcp/{contract.mcpSlug}
            </p>
            <ul className="mt-6 space-y-2">
              {contract.features.map((f) => (
                <li
                  key={f}
                  className="text-sm text-muted-foreground before:mr-2 before:text-brand before:content-['·']"
                >
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${base}/install`}
                className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium tracking-tight text-primary-foreground"
              >
                Install MCP · API · npx
              </Link>
              <Link
                href={`${base}/ui`}
                className="inline-flex h-10 items-center rounded-full px-5 text-sm tracking-tight text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              >
                UI gallery
              </Link>
              <Link
                href={jsonHref}
                className="inline-flex h-10 items-center rounded-full px-5 font-mono text-sm tracking-tight text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              >
                contract.json
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-card edge depth-soft">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                {demo.eyebrow}
              </p>
              <p className="font-mono text-[11px] text-brand">{demo.density}</p>
            </div>
            <ul className="divide-y divide-border/50">
              {demo.sampleRows.map((row) => (
                <li
                  key={row.id}
                  className="flex h-row items-center justify-between gap-3 px-4 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm tracking-tight text-foreground">
                      {row.title}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {row.id}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase",
                      statusClass(row.tone),
                    )}
                  >
                    {row.meta}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border/60 bg-muted/25 px-4 py-4">
              <p className="text-sm font-medium tracking-tight text-foreground">
                {demo.panelTitle}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {demo.panelBody}
              </p>
            </div>
          </div>
        </div>

        <section id="install" className="scroll-mt-24 space-y-6 border-t border-border/50 pt-12">
          <InstallPanel contractId={contract.id} />
        </section>

        <section id="ui" className="scroll-mt-24 space-y-4 border-t border-border/50 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                UI gallery
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                Shared shadcn — {contract.name} skin
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                One component set under{" "}
                <span className="font-mono text-foreground">components/ui</span>
                . This route applies the DNA; we do not fork controls per
                contract.
              </p>
            </div>
            <Link
              href={`${base}/ui`}
              className="font-mono text-[12px] text-foreground underline-offset-4 hover:underline"
            >
              Open full UI page →
            </Link>
          </div>
          <PrimitivesGallery />
        </section>

        <section
          id="shells"
          className="scroll-mt-24 space-y-4 border-t border-border/50 pt-12"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                App shells
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                Workbench & composer proofs
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Detailed product chrome — same shells as Meridian, restyled by{" "}
                {contract.name}.
              </p>
            </div>
            <Link
              href={`${base}/surfaces`}
              className="font-mono text-[12px] text-foreground underline-offset-4 hover:underline"
            >
              Open surfaces →
            </Link>
          </div>
          <ShellShowcase />
        </section>
      </div>
    </main>
  )
}

export { ContractExperience }
