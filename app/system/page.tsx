import type { Metadata } from "next"
import Link from "next/link"
import { DocShell, DocLinkRow } from "@/components/docs/doc-shell"
import { SkillLoop } from "@/components/site/skill-loop"
import { Button } from "@/components/ui/button"
import { systemDocs } from "@/lib/docs/system-docs"

export const metadata: Metadata = {
  title: "System",
  description:
    "Ranked influences and detailed merge specs — layout, UX, motion, color, density, AI.",
}

export default function SystemIndexPage() {
  return (
    <DocShell
      eyebrow="System"
      title="Research specs."
      lead="Influences ranked and merged — Fluent 2, Cursor app, Polaris, Linear, anti-drift — into detailed layout, architecture, UX, and motion contracts. DNA and sources live here too."
      measure="split"
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/system/influences">Influences</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/surfaces#proofs">Proofs</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/design">Design</Link>
          </Button>
        </>
      }
    >
      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Live skill loop
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Specs inform the product — proofs live on Theme, Surfaces, and Home.
        </p>
        <div className="mt-6">
          <SkillLoop dense />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
          Specs
        </h2>
        <DocLinkRow
          items={systemDocs.map((doc) => ({
            href: `/system/${doc.slug}`,
            label: doc.filename,
            summary: doc.summary,
          }))}
        />
      </section>
    </DocShell>
  )
}
