import { Badge } from "@/components/ui/badge"
import { designCn, radiusIntent, typesetClass } from "@/lib/design"
import { cn } from "@/lib/utils"

/**
 * The one frame on a contract landing page that is allowed to differ.
 *
 * Architecture, routes, and MCP stay identical across contracts (see
 * lib/platform/skeleton.ts). What a system *feels* like is its density lane
 * and its subject — so each proof renders in the surface that contract
 * actually claims, not in the marketing lane the page happens to sit in.
 * A "compact rows" tagline rendered at 44px marketing rows is a lie.
 */

type ProofChrome = {
  /** Mono eyebrow, top-left of the panel. */
  eyebrow: string
  /** Mono density claim, top-right — must match the surface below it. */
  density: string
  /** One-line reading of what the frame proves. */
  caption: string
}

function ProofPanel({
  chrome,
  surface,
  children,
  className,
}: {
  chrome: ProofChrome
  surface: "application" | "desktop" | "marketing"
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure
      data-slot="dna-proof"
      className={designCn(
        "overflow-hidden bg-card edge depth-soft",
        radiusIntent("panel"),
        className,
      )}
    >
      <div
        data-surface={surface}
        className="flex h-control items-center justify-between gap-3 border-b border-border/60 px-4"
      >
        <p className="type-label text-muted-foreground">{chrome.eyebrow}</p>
        <p className="type-meta text-brand">{chrome.density}</p>
      </div>
      <div data-surface={surface}>{children}</div>
      <figcaption className="border-t border-border/60 bg-muted/25 px-4 py-3.5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {chrome.caption}
        </p>
      </figcaption>
    </figure>
  )
}

/* ── Harbor — dense ops index at application density ─────────────── */

const harborRows = [
  { id: "ORD-2401", title: "Restock ceramic vessels", meta: "12m", state: "attention" },
  { id: "ORD-2398", title: "Refund #4821", meta: "2h", state: "review" },
  { id: "ORD-2390", title: "Ship queue — West", meta: "4h", state: "healthy" },
  { id: "ORD-2377", title: "Reconcile carrier invoice", meta: "1d", state: "healthy" },
  { id: "ORD-2362", title: "Damaged pallet — inbound", meta: "2d", state: "review" },
] as const

/** Status stays semantic: attention is the only non-brand tone (bans §4). */
const harborState: Record<
  (typeof harborRows)[number]["state"],
  { label: string; className: string }
> = {
  attention: {
    label: "Open",
    className: "border-warning/40 bg-warning/12 text-foreground",
  },
  review: {
    label: "Review",
    className: "border-brand/30 bg-brand/10 text-foreground",
  },
  healthy: {
    label: "Healthy",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
}

function HarborProof() {
  return (
    <ProofPanel
      surface="application"
      chrome={{
        eyebrow: "Ops index",
        density: "application · 40px rows",
        caption:
          "Indexes are dense, status is semantic, chrome stays quiet. Detail breathes; the list does not.",
      }}
    >
      <div className="flex h-control items-center gap-3 border-b border-border/60 bg-muted/20 px-4">
        <p className="type-label flex-1 text-muted-foreground">Order</p>
        <p className="type-label w-20 text-muted-foreground">Age</p>
        <p className="type-label w-16 text-right text-muted-foreground">State</p>
      </div>
      <ul className="divide-y divide-border/50">
        {harborRows.map((row) => {
          const state = harborState[row.state]
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
              <span className="type-meta w-20 text-muted-foreground">
                {row.meta}
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
    </ProofPanel>
  )
}

/* ── Atlas — keyboard-first workbench at desktop density ─────────── */

const atlasRows = [
  { id: "src/agent/boot.ts", title: "bootAgent()", key: "↵", meta: "edited 2m" },
  { id: "tool.call", title: "validate_ui", key: "⌘↵", meta: "passed" },
  { id: "recipe", title: "Jump to recipe", key: "⌘K", meta: "palette" },
  { id: "src/design/cx.ts", title: "stageInk()", key: "↵", meta: "read" },
  { id: "diff", title: "Review 4 hunks", key: "⌘⇧D", meta: "staged" },
] as const

function AtlasProof() {
  return (
    <ProofPanel
      surface="desktop"
      chrome={{
        eyebrow: "Command palette",
        density: "desktop · 32px rows",
        caption:
          "Mono metadata, tight chrome, every row reachable from the keyboard. Pointer is the fallback, not the plan.",
      }}
    >
      <div className="flex h-control items-center gap-2 border-b border-border/60 bg-muted/20 px-3">
        <span className="type-meta text-brand">&gt;</span>
        <span className="type-row flex-1 text-foreground">
          validate<span className="text-muted-foreground">_</span>
        </span>
        <span className="type-label text-muted-foreground">5 results</span>
      </div>
      <ul className="divide-y divide-border/40">
        {atlasRows.map((row, i) => (
          <li
            key={row.id}
            className={cn(
              "motion-select flex h-row items-center gap-3 px-3",
              i === 0 ? "bg-brand/10" : "hover:bg-muted/30",
            )}
          >
            <span className="type-row min-w-0 flex-1 truncate text-foreground">
              {row.title}
            </span>
            <span className="type-meta hidden min-w-0 flex-1 truncate text-muted-foreground sm:block">
              {row.id}
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
    </ProofPanel>
  )
}

/* ── Vellum — a reading lane, not dashboard chrome ───────────────── */

const vellumSections = [
  { id: "§01", label: "Loading the contract", meta: "3 min read" },
  { id: "§02", label: "Typeset presets", meta: "streaming-safe" },
  { id: "§03", label: "Context budgets", meta: "measured" },
] as const

function VellumProof() {
  return (
    <ProofPanel
      surface="marketing"
      chrome={{
        eyebrow: "Reading lane",
        density: "typeset · reading preset",
        caption:
          "Docs and help read as prose — one measure, one rhythm, stable while a model streams into it.",
      }}
    >
      {/* min-w-0 on both tracks: a grid column sizes to its widest item's
          min-content, so an unwrapped nav would push the prose past the
          panel and get clipped by the panel's overflow. */}
      <div className="grid min-w-0 gap-0 sm:grid-cols-[10.5rem_minmax(0,1fr)]">
        <nav
          aria-label="Reading lane sections"
          className="flex min-w-0 flex-wrap gap-x-6 gap-y-2 border-b border-border/50 px-4 py-3 sm:flex-col sm:flex-nowrap sm:gap-3 sm:border-r sm:border-b-0 sm:py-4"
        >
          {vellumSections.map((section, i) => (
            <div key={section.id} className="min-w-0">
              <p
                className={cn(
                  "type-meta",
                  i === 0 ? "text-brand" : "text-muted-foreground",
                )}
              >
                {section.id}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-foreground">
                {section.label}
              </p>
              <p className="type-meta mt-0.5 hidden text-muted-foreground sm:block">
                {section.meta}
              </p>
            </div>
          ))}
        </nav>
        <div className={cn(typesetClass("reading"), "min-w-0 px-5 py-5")}>
          <h3>Loading the contract</h3>
          <p>
            An agent reads the contract before it reads the codebase. Rules
            first, then the shape of the thing it is editing — so the first
            draft is already on-system.
          </p>
          <p>
            Prose is the interface here. Measure is capped, leading is fixed,
            and spacing only ever grows downward, so a streaming answer never
            reflows the paragraph above it.
          </p>
        </div>
      </div>
    </ProofPanel>
  )
}

/* ── Fallback — any contract without a bespoke frame yet ─────────── */

function GenericProof({ name, aesthetic }: { name: string; aesthetic: string }) {
  return (
    <ProofPanel
      surface="application"
      chrome={{
        eyebrow: "Contract",
        density: "application · 40px rows",
        caption: aesthetic,
      }}
    >
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {name} ships the shared architecture — MCP tools, contract JSON,
          routes, and recipes. Its frame lands with the first surface pack.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["get_contract", "validate_ui", "get_recipe"].map((tool) => (
            <Badge key={tool} variant="secondary" className="type-meta">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </ProofPanel>
  )
}

const proofs: Record<string, () => React.ReactElement> = {
  harbor: HarborProof,
  atlas: AtlasProof,
  vellum: VellumProof,
}

/** DNA frame for a contract landing page — falls back for unbuilt systems. */
function DnaProof({
  contractId,
  name,
  aesthetic,
}: {
  contractId: string
  name: string
  aesthetic: string
}) {
  const Proof = proofs[contractId]
  if (!Proof) return <GenericProof name={name} aesthetic={aesthetic} />
  return <Proof />
}

export { DnaProof }
