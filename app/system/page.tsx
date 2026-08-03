import type { Metadata } from "next"
import Link from "next/link"
import { DocShell, DocLinkRow } from "@/components/docs/doc-shell"
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
      lead="Influences ranked and merged — Fluent 2, Cursor app, Polaris, Linear, anti-drift — into detailed layout, architecture, UX, and motion contracts."
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/system/influences">Influences</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/design">Design</Link>
          </Button>
        </>
      }
    >
      <section>
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
