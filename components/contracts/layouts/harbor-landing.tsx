import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { Button } from "@/components/ui/button"
import { priceLabel, type DesignContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { cn } from "@/lib/utils"

/**
 * Harbor landing — the page IS an ops console.
 *
 * Harbor's DNA is "calm ops admin: dense indexes, quiet chrome, semantic
 * status", so the landing page is built like an admin index rather than a
 * marketing stack: a console bar, a summary strip, a work queue you can scan,
 * then detail panels. Density is `application` end to end — 32px controls,
 * 40px rows, 14px UI type. If the page claimed compact rows and rendered
 * 44px marketing rows, the contract would be advertising something it does
 * not ship.
 *
 * Structure is deliberately unlike Atlas (workbench) and Vellum (document).
 * Only routes, MCP, and JSON keys are shared — see lib/platform/skeleton.ts.
 */

const queue = [
  {
    id: "OPS-01",
    section: "install",
    title: "Install the contract MCP",
    detail: "MCP · JSON API · npx skills · shadcn",
    state: "ready" as const,
  },
  {
    id: "OPS-02",
    section: "ui",
    title: "Primitives under this skin",
    detail: "One shadcn set, Harbor tokens",
    state: "ready" as const,
  },
  {
    id: "OPS-03",
    section: "shells",
    title: "Index / detail app shells",
    detail: "Workbench + composer, density by task",
    state: "ready" as const,
  },
  {
    id: "OPS-04",
    section: "eval",
    title: "Eval harness",
    detail: "Scored against the contract before merge",
    state: "queued" as const,
  },
]

const stateChip = {
  ready: { label: "Ready", className: "border-brand/30 bg-brand/10 text-foreground" },
  queued: {
    label: "Queued",
    className: "border-warning/40 bg-warning/12 text-foreground",
  },
}

const indexRows = [
  { id: "ORD-2401", title: "Restock ceramic vessels", owner: "fulfilment", age: "12m", state: "attention" as const },
  { id: "ORD-2398", title: "Refund #4821", owner: "billing", age: "2h", state: "review" as const },
  { id: "ORD-2390", title: "Ship queue — West", owner: "logistics", age: "4h", state: "healthy" as const },
  { id: "ORD-2377", title: "Reconcile carrier invoice", owner: "billing", age: "1d", state: "healthy" as const },
  { id: "ORD-2362", title: "Damaged pallet — inbound", owner: "receiving", age: "2d", state: "review" as const },
  { id: "ORD-2344", title: "Vendor SLA breach", owner: "ops", age: "3d", state: "attention" as const },
]

const rowState = {
  attention: { label: "Open", className: "border-warning/40 bg-warning/12 text-foreground" },
  review: { label: "Review", className: "border-brand/30 bg-brand/10 text-foreground" },
  healthy: { label: "Healthy", className: "border-border bg-muted/40 text-muted-foreground" },
}

/** Console panel — hairline frame, muted caption bar, no float. */
function Panel({
  id,
  eyebrow,
  title,
  meta,
  action,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  meta?: string
  action?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 overflow-hidden rounded-lg bg-card edge"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border/60 bg-muted/25 px-4 py-2.5">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <p className="type-label text-muted-foreground">{eyebrow}</p>
          <h2 className="type-ui truncate font-medium tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {meta ? <p className="type-meta text-muted-foreground">{meta}</p> : null}
          {action ? (
            <Link
              href={action.href}
              className="type-meta text-foreground underline-offset-4 hover:underline"
            >
              {action.label} →
            </Link>
          ) : null}
        </div>
      </header>
      <div className="shell-pad">{children}</div>
    </section>
  )
}

function HarborLanding({ contract }: { contract: DesignContract }) {
  const base = pathTemplates.base(contract.id)
  const jsonHref = pathTemplates.contractJson(contract.id)

  return (
    <main
      data-slot="harbor-landing"
      data-surface="application"
      className="px-4 pt-16 pb-20 md:px-6"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Console bar — the page announces itself like a workspace ── */}
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-border pb-5">
          <div className="min-w-0">
            <p className="type-label text-muted-foreground">
              Design contract · {contract.status}
            </p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {contract.name}
            </h1>
            <p className="type-ui mt-2 max-w-xl text-muted-foreground">
              {contract.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href={`${base}/install`}>Install MCP</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`${base}/ui`}>UI gallery</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={jsonHref} className="font-mono">
                contract.json
              </Link>
            </Button>
          </div>
        </header>

        {/* ── Summary strip — the numbers an operator scans first ── */}
        <dl className="grid grid-cols-2 divide-border/60 border-b border-border/60 lg:grid-cols-4 lg:divide-x">
          {[
            { k: "Density", v: "application", note: "32px controls · 40px rows" },
            { k: "Accent", v: "one", note: "moss · status stays semantic" },
            { k: "Price", v: priceLabel(), note: `mcp/${contract.mcpSlug}` },
            { k: "Intents", v: "index · detail", note: "recipes ship with the kit" },
          ].map((stat, i) => (
            <div
              key={stat.k}
              className={cn(
                "px-4 py-4 lg:px-5",
                i === 0 && "lg:pl-0",
                i % 2 === 1 && "border-l border-border/60 lg:border-l",
              )}
            >
              <dt className="type-label text-muted-foreground">{stat.k}</dt>
              <dd className="type-ui mt-1.5 font-medium tracking-tight text-foreground">
                {stat.v}
              </dd>
              <dd className="type-meta mt-1 text-muted-foreground">{stat.note}</dd>
            </div>
          ))}
        </dl>

        {/* ── Work queue — the sections of this page as a scannable index ── */}
        <div className="mt-10 overflow-hidden rounded-lg bg-card edge">
          <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/25 px-4 py-2.5">
            <p className="type-label text-muted-foreground">On this contract</p>
            <p className="type-meta text-muted-foreground">
              {queue.length} items
            </p>
          </header>
          <ul className="divide-y divide-border/50">
            {queue.map((item) => {
              const chip = stateChip[item.state]
              const href =
                item.state === "ready" ? `#${item.section}` : `${base}/for-agents`
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className="motion-select flex h-row items-center gap-3 px-4 hover:bg-muted/30"
                  >
                    <span className="type-meta w-16 shrink-0 text-muted-foreground">
                      {item.id}
                    </span>
                    <span className="type-row min-w-0 flex-1 truncate text-foreground">
                      {item.title}
                    </span>
                    <span className="type-meta hidden min-w-0 flex-1 truncate text-muted-foreground md:block">
                      {item.detail}
                    </span>
                    <span
                      className={cn(
                        "type-label w-16 shrink-0 rounded-full border px-2 py-1 text-center",
                        chip.className,
                      )}
                    >
                      {chip.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ── The DNA itself: a real index at real density ── */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-lg bg-card edge">
            <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/25 px-4 py-2.5">
              <p className="type-label text-muted-foreground">Ops index</p>
              <p className="type-meta text-brand">6 open · semantic status</p>
            </header>
            <div className="flex h-control items-center gap-3 border-b border-border/60 px-4">
              <p className="type-label flex-1 text-muted-foreground">Order</p>
              <p className="type-label hidden w-24 text-muted-foreground sm:block">
                Owner
              </p>
              <p className="type-label w-12 text-muted-foreground">Age</p>
              <p className="type-label w-16 text-center text-muted-foreground">
                State
              </p>
            </div>
            <ul className="divide-y divide-border/50">
              {indexRows.map((row) => {
                const state = rowState[row.state]
                return (
                  <li
                    key={row.id}
                    className="motion-select flex h-row items-center gap-3 px-4 hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 flex-1 items-baseline gap-2">
                      <span className="type-meta shrink-0 text-muted-foreground">
                        {row.id}
                      </span>
                      <span className="type-row truncate text-foreground">
                        {row.title}
                      </span>
                    </div>
                    <span className="type-meta hidden w-24 truncate text-muted-foreground sm:block">
                      {row.owner}
                    </span>
                    <span className="type-meta w-12 text-muted-foreground">
                      {row.age}
                    </span>
                    <span
                      className={cn(
                        "type-label w-16 shrink-0 rounded-full border px-2 py-1 text-center",
                        state.className,
                      )}
                    >
                      {state.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-lg bg-card p-4 edge">
              <p className="type-label text-muted-foreground">Aesthetic brief</p>
              <p className="type-ui mt-2 leading-relaxed text-muted-foreground">
                {contract.aesthetic}
              </p>
            </section>
            <section className="flex-1 rounded-lg bg-card p-4 edge">
              <p className="type-label text-muted-foreground">Ships with</p>
              <ul className="mt-2.5 divide-y divide-border/50">
                {contract.features.map((f) => (
                  <li
                    key={f}
                    className="type-row flex items-center gap-2 py-2 text-foreground"
                  >
                    <span className="size-1 shrink-0 rounded-full bg-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {/* ── Detail panels — the shared kit, framed as console panels ── */}
        <div className="mt-10 space-y-4">
          <Panel
            id="install"
            eyebrow="Install"
            title="MCP · API · npx · shadcn"
            meta={`CONTRACT_ID=${contract.id}`}
            action={{ href: `${base}/install`, label: "Full install" }}
          >
            <InstallPanel contractId={contract.id} compact />
          </Panel>

          <Panel
            id="ui"
            eyebrow="Primitives"
            title={`Shared shadcn — ${contract.name} skin`}
            meta="components/ui"
            action={{ href: `${base}/ui`, label: "Open gallery" }}
          >
            <PrimitivesGallery />
          </Panel>

          <Panel
            id="shells"
            eyebrow="Shells"
            title="Index / detail app chrome"
            meta="density by task"
            action={{ href: `${base}/surfaces`, label: "Open surfaces" }}
          >
            <ShellShowcase variant="studio" />
          </Panel>
        </div>
      </div>
    </main>
  )
}

export { HarborLanding }
