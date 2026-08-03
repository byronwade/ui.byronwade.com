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
 */
function ShellShowcase({ className }: { className?: string }) {
  return (
    <div data-slot="shell-showcase" className={cn("space-y-8", className)}>
      <section className="space-y-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Surface studio
          </p>
          <h3 className="mt-1 text-lg font-medium tracking-tight text-foreground">
            Switch density lanes in one chrome
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Workbench, composer, marketing, mobile, desktop — same tokens,
            remapped hit targets. This is the product-shaped proof of the
            contract.
          </p>
        </div>
        <SurfaceStudio />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Application workbench</CardTitle>
            <CardDescription>
              Object list + detail + agent rail — compose shadcn, don&apos;t twin
              shells.
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
    </div>
  )
}

export { ShellShowcase }
