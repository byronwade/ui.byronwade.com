import type { Metadata } from "next"
import Link from "next/link"
import { Workbench } from "@/components/surfaces/workbench"
import { ComposerShell } from "@/components/surfaces/composer-shell"
import { MarketingFrame } from "@/components/surfaces/marketing-frame"
import { MobileFrame } from "@/components/surfaces/mobile-frame"
import { DesktopFrame } from "@/components/surfaces/desktop-frame"
import { SkillLoop } from "@/components/site/skill-loop"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import { proofs, designCn, radiusIntent, typeClass, text } from "@/lib/design"
import { surfaces } from "@/lib/surfaces"

export const metadata: Metadata = {
  title: "Surfaces",
  description:
    "Meridian proofs — workbench, composer, and density lanes across application, marketing, mobile, and desktop.",
}

const laneDemos = {
  marketing: MarketingFrame,
  mobile: MobileFrame,
  desktop: DesktopFrame,
} as const

export default function SurfacesPage() {
  const workbench = proofs.workbench

  return (
    <DocShell
      eyebrow="Surfaces"
      title="Density by task."
      lead="Canonical compose proofs first — then every surface lane. Same tokens, remapped hit targets."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/skills">Skills</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/theme">Theme</Link>
          </Button>
        </>
      }
      measure="wide"
      className="pb-24 md:pb-32"
    >
      <section id="proofs" className="scroll-mt-24">
        <p
          className={designCn(
            typeClass("label"),
            text("muted"),
            "text-[10px] tracking-[0.14em]",
          )}
        >
          Compose · meridian-compose
        </p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
          Live proofs
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Workbench ({workbench.surface}, agent → {workbench.agent?.boundTo}) and
          composer shell — typed via{" "}
          <span className="font-mono text-[12px]">@/lib/design</span>.
        </p>
        <div className="mt-8 space-y-8">
          <div
            className={designCn(
              "overflow-hidden bg-muted/20 edge",
              radiusIntent("shell"),
            )}
          >
            <Workbench />
          </div>
          <div
            className={designCn(
              "overflow-hidden bg-muted/20 edge",
              radiusIntent("shell"),
            )}
          >
            <ComposerShell />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <p
          className={designCn(
            typeClass("label"),
            text("muted"),
            "text-[10px] tracking-[0.14em]",
          )}
        >
          Skill loop
        </p>
        <h2 className="mt-2 text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Prove every skill
        </h2>
        <div className="mt-6">
          <SkillLoop dense />
        </div>
      </section>

      <ul className="mt-16 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {surfaces.map((surface) => (
          <li key={surface.id}>
            <a
              href={`#${surface.id}`}
              className={designCn(
                "flex flex-col gap-0.5 bg-card px-4 py-3.5 transition-colors edge hover:bg-muted/30 active:bg-muted/40",
                radiusIntent("panel"),
              )}
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
        <section id="application" className="scroll-mt-24">
          <div className="mb-6 max-w-xl">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Web
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
              Application
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Operate data-rich work — indexes, forms, detail, object-bound AI.
              The workbench above is the canonical proof.
            </p>
          </div>
          <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <Workbench withAgent />
          </div>
        </section>

        {surfaces
          .filter((s) => s.id !== "application")
          .map((surface) => {
            const Demo = laneDemos[surface.id as keyof typeof laneDemos]
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
