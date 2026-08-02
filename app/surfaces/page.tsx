import type { Metadata } from "next"
import Link from "next/link"
import { ApplicationShell } from "@/components/surfaces/application-shell"
import { MarketingFrame } from "@/components/surfaces/marketing-frame"
import { MobileFrame } from "@/components/surfaces/mobile-frame"
import { DesktopFrame } from "@/components/surfaces/desktop-frame"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { surfaces } from "@/lib/surfaces"

export const metadata: Metadata = {
  title: "Surfaces",
  description:
    "Meridian across Web Application, Web Marketing, Mobile Native, and Desktop Native.",
}

const demos = {
  application: ApplicationShell,
  marketing: MarketingFrame,
  mobile: MobileFrame,
  desktop: DesktopFrame,
} as const

export default function SurfacesPage() {
  return (
    <DocShell
      eyebrow="Surfaces"
      title="Density by task."
      lead="Application, marketing, mobile, and desktop share tokens and primitives. Hit targets adapt to the job."
      actions={
        <Button variant="ghost" size="default" asChild>
          <Link href="/theme">Theme</Link>
        </Button>
      }
      measure="wide"
      className="pb-24 md:pb-32"
    >
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {surfaces.map((surface) => (
          <li key={surface.id}>
            <a
              href={`#${surface.id}`}
              className="flex flex-col gap-0.5 rounded-2xl bg-card px-4 py-3.5 transition-colors edge hover:bg-muted/30 active:bg-muted/40"
            >
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {surface.platform}
              </span>
              <span className="text-sm font-medium tracking-tight">
                {surface.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {surface.density}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-16 space-y-20">
        {surfaces.map((surface) => {
          const Demo = demos[surface.id]
          return (
            <section
              key={surface.id}
              id={surface.id}
              className="scroll-mt-24"
            >
              <div className="mb-6 max-w-xl">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {surface.platform}
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                  {surface.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {surface.summary}
                </p>
              </div>
              <div className="-mx-1 overflow-x-auto px-1 pb-2">
                <Demo />
              </div>
            </section>
          )
        })}
      </div>
    </DocShell>
  )
}
