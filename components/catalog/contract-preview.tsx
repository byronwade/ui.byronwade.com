import { contractPreviewAccents } from "@/lib/design/knobs"
import type { DesignContract } from "@/lib/contracts/catalog"
import { cn } from "@/lib/utils"

/**
 * Soft cinematic preview — abstract chrome wash, not a screenshot zoo.
 * Tone follows the contract's preview lane.
 */
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />

      {/* Mini product chrome */}
      <div className="absolute inset-x-5 top-5 bottom-5 flex flex-col gap-2.5 sm:inset-x-6 sm:top-6 sm:bottom-6">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-current/30" />
          <span className="size-1.5 rounded-full bg-current/20" />
          <span className="size-1.5 rounded-full bg-current/15" />
          <span className="ml-2 h-1.5 w-16 rounded-full bg-current/15" />
        </div>
        <div className="grid flex-1 grid-cols-[0.28fr_1fr] gap-2 min-h-0">
          <div className="rounded-2xl bg-current/8 edge" />
          <div className="flex min-h-0 flex-col gap-2">
            <div className="h-[38%] rounded-2xl bg-current/10 edge" />
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div className="rounded-2xl bg-current/8 edge" />
              <div
                className="rounded-2xl edge"
                style={{
                  background:
                    "color-mix(in oklch, var(--preview-accent) 28%, transparent)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-10 rounded-full bg-current/20" />
          <span className="h-2 w-6 rounded-full bg-current/12" />
          <span
            className="ml-auto h-2 w-8 rounded-full"
            style={{
              background:
                "color-mix(in oklch, var(--preview-accent) 55%, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export { ContractPreview }
