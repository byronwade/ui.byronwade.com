"use client"

import { SurfaceStudio } from "@/components/site/surface-studio"
import { Workbench } from "@/components/surfaces/workbench"
import { ComposerShell } from "@/components/surfaces/composer-shell"
import { cn } from "@/lib/utils"

/**
 * Detailed app-shell proofs — shared shells, contract skin via ancestors.
 * Product chrome sits in an edge frame — not nested marketing cards.
 */
function ShellShowcase({ className }: { className?: string }) {
  return (
    <div data-slot="shell-showcase" className={cn("space-y-12", className)}>
      <section className="space-y-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Surface studio
          </p>
          <h3 className="mt-1 text-lg font-medium tracking-tight text-foreground">
            Switch density lanes in one chrome
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Workbench, composer, marketing, mobile, desktop — same tokens,
            remapped hit targets.
          </p>
        </div>
        <SurfaceStudio />
      </section>

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 space-y-3">
          <div>
            <h3 className="text-base font-medium tracking-tight text-foreground">
              Application workbench
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Object list + detail + agent rail — compose shadcn, don&apos;t twin
              shells.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-card edge">
            <Workbench />
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <h3 className="text-base font-medium tracking-tight text-foreground">
              Composer shell
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Bound AI next to the object — provenance and activity stay
              readable.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-card edge">
            <ComposerShell />
          </div>
        </div>
      </section>
    </div>
  )
}

export { ShellShowcase }
