/**
 * Live proof — same chrome, four shells. Spacing / sizing / type stay clean
 * because they remap through data-surface CSS vars.
 */
import { Surface } from "@/components/surfaces/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  designCn,
  radiusIntent,
  shellRhythm,
  surfaces,
} from "@/lib/design"
import { cn } from "@/lib/utils"

type ShellRhythmProps = {
  className?: string
}

function ShellRhythmProof({ className }: ShellRhythmProps) {
  return (
    <div
      data-slot="shell-rhythm"
      className={designCn("grid gap-4 lg:grid-cols-2", className)}
    >
      {surfaces.map((id) => {
        const rhythm = shellRhythm[id]
        return (
          <Surface
            key={id}
            id={id}
            className={designCn(
              "overflow-hidden bg-card edge",
              radiusIntent("panel"),
            )}
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-[var(--surface-pad)] py-2">
              <div className="min-w-0">
                <p className="type-label text-muted-foreground">{rhythm.label}</p>
                <p className="type-ui mt-0.5 font-medium tracking-tight">
                  {rhythm.job}
                </p>
              </div>
              <p className="type-meta shrink-0 text-muted-foreground">
                {rhythm.controlPx}/{rhythm.rowPx} · {rhythm.typeUiPx}px
              </p>
            </header>

            <div className="shell-stack">
              <div className="flex shell-gap">
                <Button
                  size="sm"
                  className="h-control type-ui px-3"
                  variant={id === "marketing" ? "default" : "outline"}
                >
                  Primary
                </Button>
                <Button size="sm" variant="ghost" className="h-control type-ui px-3">
                  Ghost
                </Button>
              </div>

              <Input
                placeholder="Search or jump…"
                aria-label={`${rhythm.label} search`}
                className="h-control type-ui shadow-none"
              />

              <ul className="overflow-hidden bg-muted/20 edge" data-slot="shell-rows">
                {["Selected row", "Quiet neighbor", "Meta line"].map(
                  (title, i) => (
                    <li
                      key={title}
                      className={cn(
                        "flex h-row items-center justify-between border-b border-border/60 px-3 last:border-b-0",
                        i === 0 && "bg-brand/10",
                      )}
                    >
                      <span className="type-row tracking-tight">{title}</span>
                      <span className="type-meta text-muted-foreground">
                        {i === 0 ? "active" : `${i + 2}h`}
                      </span>
                    </li>
                  ),
                )}
              </ul>

              <p className="type-meta text-muted-foreground">
                pad {rhythm.padPx} · gap {rhythm.gapPx} · meta{" "}
                {rhythm.typeMetaPx}px
              </p>
            </div>
          </Surface>
        )
      })}
    </div>
  )
}

export { ShellRhythmProof }
export type { ShellRhythmProps }
