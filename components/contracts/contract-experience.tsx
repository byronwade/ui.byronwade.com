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
      {
        id: "ORD-2384",
        title: "Carrier delay — East",
        meta: "Watching",
        tone: "muted",
      },
    ],
    panelTitle: "Quiet paper ops",
    panelBody:
      "Dense rows, semantic status, calm chrome — cinema banned. Agents reuse list-resource before inventing admin shells.",
    density: "Compact · semantic chips",
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
        title: "check:design",
        meta: "passed",
        tone: "success",
      },
      {
        id: "cmd+k",
        title: "Jump to recipe",
        meta: "palette",
        tone: "muted",
      },
      {
        id: "run/1842",
        title: "validate · contrast",
        meta: "33 pairs",
        tone: "success",
      },
    ],
    panelTitle: "Ink-forward scanning",
    panelBody:
      "Mono metadata, keyboard-first chrome, command palette patterns — not Meridian theater.",
    density: "Desktop · mono meta",
  },
  vellum: {
    eyebrow: "Contents",
    sampleRows: [
      {
        id: "§01",
        title: "How agents load the contract",
        meta: "3 min",
        tone: "brand",
      },
      {
        id: "§02",
        title: "Typeset presets for help",
        meta: "stable",
        tone: "muted",
      },
      {
        id: "§03",
        title: "Context budgets",
        meta: "65ch",
        tone: "success",
      },
    ],
    panelTitle: "Mist, measured prose",
    panelBody:
      "Reading lanes and typeset presets — not dashboard card grids. Measure stays honest at ~65ch.",
    density: "reading-ui · 65ch",
  },
}

function statusClass(tone: string) {
  if (tone === "warning") return "bg-warning/15 text-foreground"
  if (tone === "success") return "bg-brand/10 text-foreground"
  if (tone === "brand") return "bg-brand/10 text-foreground"
  return "bg-muted/50 text-muted-foreground"
}

function IndexRows({
  rows,
  dense = false,
}: {
  rows: { id: string; title: string; meta: string; tone: string }[]
  dense?: boolean
}) {
  return (
    <ul className="divide-y divide-border/60">
      {rows.map((row, i) => (
        <li
          key={row.id}
          className={cn(
            "flex items-center justify-between gap-4 transition-colors hover:bg-muted/30",
            dense ? "h-10 px-4 md:px-5" : "h-12 px-4 md:px-5",
            i === 0 && "bg-brand/10",
          )}
        >
          <div className="min-w-0 flex items-baseline gap-3">
            <p className="shrink-0 font-mono text-[11px] tracking-tight text-muted-foreground">
              {row.id}
            </p>
            <p className="truncate text-sm tracking-tight text-foreground">
              {row.title}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-tight uppercase",
              statusClass(row.tone),
            )}
          >
            {row.meta}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ContractHero({
  contract,
  demo,
}: {
  contract: DesignContract
  demo: (typeof demos)[string]
}) {
  const base = pathTemplates.base(contract.id)

  if (contract.id === "vellum") {
    return (
      <section
        data-slot="contract-hero"
        data-dna="vellum"
        className="border-b border-border/60 px-5 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24"
      >
        <div className="reading-ui mx-auto">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Design contract · {contract.status}
          </p>
          <h1 className="mt-5 text-[clamp(2.75rem,7vw,4.5rem)] font-medium leading-[0.96] tracking-[-0.04em] text-foreground">
            {contract.name}
          </h1>
          <p className="reading-lead mt-6 text-foreground">
            {contract.tagline}
          </p>
          <p className="reading-muted mt-4">{demo.panelBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href={`${base}/install`}
              className="text-[15px] font-medium tracking-tight text-foreground underline underline-offset-[0.2em] transition-opacity hover:opacity-70"
            >
              Install
            </Link>
            <Link
              href={`${base}/design`}
              className="text-[15px] tracking-tight text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-[0.2em]"
            >
              design.md
            </Link>
          </div>
          <nav
            aria-label="Contents"
            className="mt-12 border-t border-border/70 pt-6"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              {demo.eyebrow}
            </p>
            <ol className="mt-4 space-y-3">
              {demo.sampleRows.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 border-b border-border/40 pb-3"
                >
                  <span className="text-base tracking-tight text-foreground">
                    <span className="mr-3 font-mono text-[12px] text-muted-foreground">
                      {row.id}
                    </span>
                    {row.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {row.meta}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>
    )
  }

  const isAtlas = contract.id === "atlas"

  return (
    <section
      data-slot="contract-hero"
      data-dna={contract.id}
      className="relative flex min-h-[calc(100svh-2.75rem)] flex-col justify-end overflow-hidden md:min-h-svh md:justify-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-0 h-[55vh] w-[70vw] rounded-full bg-brand/[0.06] blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-[92rem] flex-1 items-end gap-8 px-5 pt-24 pb-0 md:grid-cols-[minmax(15rem,26rem)_minmax(0,1fr)] md:items-center md:gap-12 md:px-8 md:pt-0 lg:grid-cols-[minmax(16rem,28rem)_minmax(0,1fr)]">
        <div className="max-w-md pb-2 md:pb-0">
          <p className="font-mono text-[11px] tracking-[0.18em] text-brand uppercase">
            {demo.eyebrow} · {contract.status}
          </p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,5rem)] font-medium leading-[0.94] tracking-[-0.045em] text-foreground">
            {contract.name}
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed tracking-tight text-muted-foreground md:text-[1.0625rem]">
            {contract.tagline}
          </p>
          <p className="mt-6 font-mono text-[11px] tracking-tight text-muted-foreground">
            {priceLabel()} · {demo.density}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href={`${base}/install`}
              className="text-[15px] font-medium tracking-tight text-foreground underline underline-offset-[0.2em] transition-opacity hover:opacity-70"
            >
              Install
            </Link>
            <Link
              href={`${base}/ui`}
              className="text-[15px] tracking-tight text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-[0.2em]"
            >
              UI gallery
            </Link>
          </div>
        </div>

        <div className="relative min-h-0 w-full md:self-end">
          <div
            className={cn(
              "overflow-hidden bg-card edge",
              "rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none md:rounded-br-none",
              isAtlas && "font-mono",
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 md:px-5">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                {demo.eyebrow}
              </p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {demo.density}
              </p>
            </div>
            <IndexRows rows={demo.sampleRows} dense={isAtlas} />
            <div className="border-t border-border/60 px-4 py-3.5 md:px-5">
              <p className="text-sm font-medium tracking-tight text-foreground">
                {demo.panelTitle}
              </p>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                {demo.panelBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Feature-rich contract home for non-film systems.
 * First viewport is DNA-specific; below folds share install / UI / shells.
 */
function ContractExperience({ contract }: { contract: DesignContract }) {
  const demo = demos[contract.id] ?? demos.harbor!
  const base = pathTemplates.base(contract.id)

  return (
    <main data-slot="contract-experience" data-surface="marketing">
      <ContractHero contract={contract} demo={demo} />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <section
          id="install"
          className="scroll-mt-24 border-t border-border/60 py-16 md:py-20"
        >
          <InstallPanel contractId={contract.id} />
        </section>

        <section
          id="ui"
          className="scroll-mt-24 border-t border-border/60 py-16 md:py-20"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                UI gallery
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Shared shadcn — {contract.name} skin
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
          className="scroll-mt-24 border-t border-border/60 py-16 md:py-20"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                App shells
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Workbench & composer proofs
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Product chrome — same shells as Meridian, restyled by{" "}
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
