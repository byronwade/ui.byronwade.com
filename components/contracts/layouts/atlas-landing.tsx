import Link from "next/link"

import { InstallPanel } from "@/components/contracts/showcase/install-panel"
import { PrimitivesGallery } from "@/components/contracts/showcase/primitives-gallery"
import { ShellShowcase } from "@/components/contracts/showcase/shell-showcase"
import { FileText, Terminal } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { priceLabel, type DesignContract } from "@/lib/contracts/catalog"
import { pathTemplates } from "@/lib/platform/skeleton"
import { cn } from "@/lib/utils"

/**
 * Atlas landing — the page IS a workbench.
 *
 * Atlas's DNA is "developer workbench: mono metadata, keyboard-first
 * scanning", so the page is framed like an editor: title bar, explorer rail
 * listing the sections as files, gutter-numbered panes with tab headers, and
 * a status bar. Density is `desktop` — 28px controls, 32px rows, 13px type,
 * the tightest lane the shell contract defines.
 *
 * Deliberately unlike Harbor (ops console) and Vellum (document).
 */

const files = [
  { id: "install", name: "install.mcp", meta: "4 steps", kbd: "1" },
  { id: "ui", name: "primitives.tsx", meta: "shadcn", kbd: "2" },
  { id: "shells", name: "surfaces.tsx", meta: "5 lanes", kbd: "3" },
  { id: "contract", name: "atlas.contract.json", meta: "kit", kbd: "4" },
]

const paletteRows = [
  { title: "bootAgent()", path: "src/agent/boot.ts", meta: "edited 2m", key: "↵" },
  { title: "validate_ui", path: "tool.call", meta: "passed", key: "⌘↵" },
  { title: "Jump to recipe", path: "recipe", meta: "palette", key: "⌘K" },
  { title: "stageInk()", path: "src/design/cx.ts", meta: "read", key: "↵" },
  { title: "Review 4 hunks", path: "diff", meta: "staged", key: "⌘⇧D" },
]

/** Editor pane — tab strip header, gutter index, content well. */
function Pane({
  id,
  tab,
  meta,
  action,
  children,
}: {
  id?: string
  tab: string
  meta?: string
  action?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-16 overflow-hidden rounded-lg bg-card edge">
      <header className="flex items-stretch justify-between gap-3 border-b border-border/60 bg-muted/25">
        <div className="flex min-w-0 items-center gap-1.5 border-r border-border/60 bg-card px-3 py-2">
          <FileText className="size-3.5 text-muted-foreground" />
          <p className="type-row truncate font-mono text-foreground">{tab}</p>
        </div>
        <div className="flex items-center gap-3 px-3">
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

function AtlasLanding({ contract }: { contract: DesignContract }) {
  const base = pathTemplates.base(contract.id)
  const jsonHref = pathTemplates.contractJson(contract.id)

  return (
    <main
      data-slot="atlas-landing"
      data-surface="desktop"
      className="px-3 pt-16 pb-20 md:px-5"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Title bar ── */}
        <div className="flex items-center gap-3 rounded-t-lg border border-border bg-muted/30 px-3 py-2">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-muted-foreground/40" />
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/20" />
          </div>
          <p className="type-meta min-w-0 flex-1 truncate text-center text-muted-foreground">
            {contract.name.toLowerCase()} — design contract
          </p>
          <kbd className="type-label shrink-0 rounded-lg border border-border bg-card px-1.5 py-1 text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* ── Workbench body: explorer rail + main column ── */}
        <div className="grid border-x border-b border-border md:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="hidden flex-col border-r border-border bg-muted/15 md:flex">
            <p className="type-label px-3 pt-3 pb-1.5 text-muted-foreground">
              Explorer
            </p>
            <nav aria-label="Contract sections" className="flex flex-col px-1.5">
              {files.map((file) => (
                <Link
                  key={file.id}
                  href={file.id === "contract" ? jsonHref : `#${file.id}`}
                  className="motion-select flex h-row items-center gap-2 rounded-lg px-2 hover:bg-muted/50"
                >
                  <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="type-row min-w-0 flex-1 truncate font-mono text-foreground">
                    {file.name}
                  </span>
                  <kbd className="type-label shrink-0 text-muted-foreground">
                    {file.kbd}
                  </kbd>
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-border/60 p-3">
              <p className="type-label text-muted-foreground">Ships with</p>
              <ul className="space-y-1.5">
                {contract.features.map((f) => (
                  <li key={f} className="type-meta text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 bg-background">
            {/* Hero pane — gutter + statement, like an open file */}
            <div className="grid grid-cols-[2.75rem_minmax(0,1fr)]">
              <div
                aria-hidden
                className="border-r border-border/60 bg-muted/15 py-6 text-right"
              >
                {["01", "02", "03", "04", "05", "06"].map((n) => (
                  <p key={n} className="type-meta px-2 leading-7 text-muted-foreground">
                    {n}
                  </p>
                ))}
              </div>
              <div className="px-5 py-6 md:px-7">
                <p className="type-label text-brand">
                  Design contract · {contract.status}
                </p>
                <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  {contract.name}
                </h1>
                <p className="type-ui mt-2.5 max-w-xl text-foreground">
                  {contract.tagline}
                </p>
                <p className="type-row mt-2 max-w-xl text-muted-foreground">
                  {contract.aesthetic}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
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
              </div>
            </div>

            {/* Palette pane — the DNA proof, in the lane Atlas claims */}
            <div className="border-t border-border">
              <div className="flex h-control items-center gap-2 border-b border-border/60 bg-muted/20 px-3">
                <Terminal className="size-3.5 shrink-0 text-brand" />
                <span className="type-row min-w-0 flex-1 truncate text-foreground">
                  validate<span className="text-muted-foreground">_</span>
                </span>
                <span className="type-label shrink-0 text-muted-foreground">
                  5 results
                </span>
              </div>
              <ul className="divide-y divide-border/40">
                {paletteRows.map((row, i) => (
                  <li
                    key={row.path}
                    className={cn(
                      "motion-select flex h-row items-center gap-3 px-3",
                      i === 0 ? "bg-brand/10" : "hover:bg-muted/30",
                    )}
                  >
                    <span className="type-row min-w-0 flex-1 truncate text-foreground">
                      {row.title}
                    </span>
                    <span className="type-meta hidden min-w-0 flex-1 truncate text-muted-foreground sm:block">
                      {row.path}
                    </span>
                    <span className="type-meta w-16 shrink-0 text-muted-foreground">
                      {row.meta}
                    </span>
                    <kbd className="type-label shrink-0 rounded-lg border border-border bg-muted/40 px-1.5 py-1 text-muted-foreground">
                      {row.key}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Status bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-lg border-x border-b border-border bg-muted/30 px-3 py-1.5">
          <p className="type-meta text-muted-foreground">
            {priceLabel()} · mcp/{contract.mcpSlug}
          </p>
          <p className="type-meta text-muted-foreground">
            desktop · 28px controls · 32px rows
          </p>
        </div>

        {/* ── Panes for the shared kit ── */}
        <div className="mt-4 space-y-3">
          <Pane
            id="install"
            tab="install.mcp"
            meta={`CONTRACT_ID=${contract.id}`}
            action={{ href: `${base}/install`, label: "Full install" }}
          >
            <InstallPanel contractId={contract.id} compact />
          </Pane>

          <Pane
            id="ui"
            tab="primitives.tsx"
            meta="components/ui"
            action={{ href: `${base}/ui`, label: "Open gallery" }}
          >
            <PrimitivesGallery />
          </Pane>

          <Pane
            id="shells"
            tab="surfaces.tsx"
            meta="5 density lanes"
            action={{ href: `${base}/surfaces`, label: "Open surfaces" }}
          >
            <ShellShowcase variant="studio" />
          </Pane>
        </div>
      </div>
    </main>
  )
}

export { AtlasLanding }
