import { contractPreviewAccents } from "@/lib/design/knobs"
import type { DesignContract } from "@/lib/contracts/catalog"
import { cn } from "@/lib/utils"

/**
 * Catalog thumbnails — one drawing per contract, not one wash in four colors.
 *
 * The index is where someone decides which system to open, so each preview
 * shows that contract's actual page architecture in miniature: Meridian a
 * cinema stage with the app bleeding off-frame, Harbor a dense index, Atlas
 * an explorer + editor, Vellum a document with a contents rail. Colors come
 * from the contract's own tokens (the card scopes `data-contract`).
 */

/* Abstractions kept tiny and token-only — these are drawings, not screens. */
const bar = "rounded-full bg-current/20"
const barSoft = "rounded-full bg-current/12"

function Rows({ count, accentRow = 0 }: { count: number; accentRow?: number }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-1 items-center gap-1.5 rounded-lg px-1.5",
            i === accentRow ? "bg-current/10" : "bg-current/4",
          )}
        >
          <span className={cn(barSoft, "h-1 w-4 shrink-0")} />
          <span className={cn(bar, "h-1 flex-1")} style={{ maxWidth: `${70 - i * 6}%` }} />
          <span
            className="ml-auto h-1.5 w-4 shrink-0 rounded-full"
            style={{
              background:
                i % 3 === 0
                  ? "color-mix(in oklch, var(--preview-accent) 55%, transparent)"
                  : "color-mix(in oklch, currentColor 15%, transparent)",
            }}
          />
        </div>
      ))}
    </div>
  )
}

/** Meridian — theater stage, product frame bleeding off the right edge. */
function MeridianDrawing() {
  return (
    <div className="flex h-full items-stretch gap-3">
      <div className="flex w-[38%] shrink-0 flex-col justify-center gap-2">
        <span
          className="h-1 w-8 rounded-full"
          style={{ background: "var(--preview-accent)" }}
        />
        <span className={cn(bar, "h-2.5 w-full")} />
        <span className={cn(bar, "h-2.5 w-3/5")} />
        <span className={cn(barSoft, "mt-1 h-1 w-4/5")} />
        <span className={cn(barSoft, "h-1 w-2/3")} />
      </div>
      {/* App window runs past the frame — full-bleed law, never an inset card */}
      <div className="-mr-8 flex-1 rounded-l-lg bg-current/8 p-1.5 edge">
        <div className="flex h-full gap-1">
          <div className="w-[18%] rounded-lg bg-current/10" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-2 rounded-lg bg-current/10" />
            <div className="flex-1 rounded-lg bg-current/6" />
          </div>
          <div
            className="w-[26%] rounded-lg"
            style={{
              background:
                "color-mix(in oklch, var(--preview-accent) 22%, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

/** Harbor — ops console: toolbar, column head, dense index rows. */
function HarborDrawing() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className={cn(bar, "h-1.5 w-10")} />
        <span className={cn(barSoft, "h-1.5 w-6")} />
        <span
          className="ml-auto h-1.5 w-8 rounded-full"
          style={{ background: "color-mix(in oklch, var(--preview-accent) 55%, transparent)" }}
        />
      </div>
      <div className="flex items-center gap-1.5 border-b border-current/12 pb-1">
        <span className={cn(barSoft, "h-1 w-6")} />
        <span className={cn(barSoft, "h-1 w-10")} />
        <span className={cn(barSoft, "ml-auto h-1 w-5")} />
      </div>
      <Rows count={6} accentRow={1} />
    </div>
  )
}

/** Atlas — workbench: explorer rail, gutter, editor lines, status bar. */
function AtlasDrawing() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1" aria-hidden>
        <span className="size-1 rounded-full bg-current/25" />
        <span className="size-1 rounded-full bg-current/18" />
        <span className="size-1 rounded-full bg-current/12" />
        <span className={cn(barSoft, "ml-2 h-1 w-14")} />
      </div>
      <div className="flex flex-1 gap-1.5">
        <div className="flex w-[26%] flex-col gap-1 rounded-lg bg-current/6 p-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full",
                i === 0 ? "bg-current/28" : "bg-current/14",
              )}
              style={{ width: `${88 - i * 12}%` }}
            />
          ))}
        </div>
        <div className="flex flex-1 gap-1">
          <div className="flex w-2 flex-col gap-1 pt-0.5" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="h-1 w-full rounded-full bg-current/10" />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-1 pt-0.5">
            {[72, 54, 84, 40, 64, 30].map((w, i) => (
              <span
                key={i}
                className="h-1 rounded-full"
                style={{
                  width: `${w}%`,
                  background:
                    i === 2
                      ? "color-mix(in oklch, var(--preview-accent) 60%, transparent)"
                      : "color-mix(in oklch, currentColor 18%, transparent)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-current/12 pt-1">
        <span className={cn(barSoft, "h-1 w-8")} />
        <span className={cn(barSoft, "ml-auto h-1 w-12")} />
      </div>
    </div>
  )
}

/** Vellum — document: contents rail, title, measured prose column. */
function VellumDrawing() {
  return (
    <div className="flex h-full gap-3">
      <div className="flex w-[24%] shrink-0 flex-col gap-1.5 border-r border-current/12 pr-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span
              className="h-1 w-4 rounded-full"
              style={{
                background:
                  i === 0
                    ? "var(--preview-accent)"
                    : "color-mix(in oklch, currentColor 14%, transparent)",
              }}
            />
            <span className={cn(barSoft, "h-1 w-full")} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className={cn(bar, "h-2.5 w-3/5")} />
        <div className="mt-1 flex flex-col gap-1">
          {[96, 92, 98, 70].map((w, i) => (
            <span key={i} className={cn(barSoft, "h-1")} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-1">
          {[94, 98, 88, 52].map((w, i) => (
            <span key={i} className={cn(barSoft, "h-1")} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-auto rounded-lg bg-current/6 p-1.5">
          <span
            className="block h-1 w-1/3 rounded-full"
            style={{ background: "color-mix(in oklch, var(--preview-accent) 55%, transparent)" }}
          />
        </div>
      </div>
    </div>
  )
}

const drawings: Record<string, () => React.ReactElement> = {
  meridian: MeridianDrawing,
  harbor: HarborDrawing,
  atlas: AtlasDrawing,
  vellum: VellumDrawing,
}

function ContractPreview({
  contract,
  className,
}: {
  contract: DesignContract
  className?: string
}) {
  const tone =
    contract.preview === "theater"
      ? "bg-dock text-dock-foreground"
      : contract.preview === "ink"
        ? "bg-foreground text-background"
        : contract.preview === "mist"
          ? "bg-muted/60 text-foreground"
          : "bg-card text-card-foreground"

  const Drawing = drawings[contract.id] ?? HarborDrawing

  return (
    <div
      data-slot="contract-preview"
      data-preview={contract.preview}
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-3xl edge",
        tone,
        className,
      )}
      style={
        {
          "--preview-accent": contractPreviewAccents[contract.preview],
        } as React.CSSProperties
      }
      aria-hidden
    >
      {/* Soft atmospheric wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(120% 80% at 20% 0%, var(--preview-accent) 0%, transparent 55%),
            radial-gradient(90% 70% at 90% 100%, color-mix(in oklch, var(--preview-accent) 35%, transparent) 0%, transparent 60%)`,
        }}
      />
      {/* Depth vignette from tokens — pure black/white is banned (design.md) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top,
            color-mix(in oklch, var(--dock) 25%, transparent) 0%,
            transparent 55%,
            color-mix(in oklch, var(--background) 6%, transparent) 100%)`,
        }}
      />

      <div className="absolute inset-x-5 top-5 bottom-5 sm:inset-x-6 sm:top-6 sm:bottom-6">
        <Drawing />
      </div>
    </div>
  )
}

export { ContractPreview }
