"use client"

import { SurfaceStudio } from "@/components/site/surface-studio"
import { Workbench } from "@/components/surfaces/workbench"
import { ComposerShell } from "@/components/surfaces/composer-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Detailed app-shell proofs — shared shells, contract skin via ancestors.
 *
 * `studio` shows only the lane switcher (the landing page already has its own
 * DNA frame above, and the studio contains both shells anyway). `full` adds
 * the isolated shells for the dedicated surfaces route.
 *
 * The isolated shells stack one per row rather than sitting two-up: these are
 * real application chrome with three internal columns, and at half a page
 * width their list rows collide with their own metadata.
 */
function ShellShowcase({
  className,
  variant = "full",
}: {
  className?: string
  variant?: "full" | "studio"
}) {
  return (
    <div data-slot="shell-showcase" className={cn("space-y-10", className)}>
      <section className="space-y-4">
        <div>
          <p className="type-label text-muted-foreground">Surface studio</p>
          <h3 className="mt-1.5 text-lg font-medium tracking-tight text-foreground">
            Switch density lanes in one chrome
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Workbench, composer, marketing, mobile, desktop — same tokens,
            remapped hit targets. This is the product-shaped proof of the
            contract.
          </p>
        </div>
        <SurfaceStudio />
      </section>

      {variant === "full" ? (
        <section className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Application workbench</CardTitle>
              <CardDescription>
                Object list + detail + agent rail — compose shadcn, don&apos;t
                twin shells.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="overflow-hidden rounded-2xl edge">
                <Workbench />
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Composer shell</CardTitle>
              <CardDescription>
                Bound AI next to the object — provenance and activity stay
                readable.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="overflow-hidden rounded-2xl edge">
                <ComposerShell />
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  )
}

export { ShellShowcase }
