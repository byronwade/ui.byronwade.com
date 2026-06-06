import { readFileSync } from "node:fs"
import { join } from "node:path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { bySlug, components } from "@/content/components"
import { getSurface, surfaceLabel } from "@/content/catalog-surfaces"
import { examples } from "@/content/examples/registry"
import { ExampleTabs } from "@/app/(docs)/_components/example-tabs"
import {
  VariantBrowser,
  type VariantView,
} from "@/app/(docs)/_components/variant-browser"
import { InstallCommand } from "@/app/(docs)/_components/install-command"
import { DocsDemoSection, DocsIntro } from "@/app/(docs)/_components/docs-prose"
import { ComponentReferenceSections } from "@/app/(docs)/_components/component-reference-sections"

export function generateStaticParams() {
  // Bespoke static routes take precedence; exclude them from this template.
  return components
    .filter(
      (c) =>
        c.slug !== "foundation" &&
        c.slug !== "readability" &&
        c.slug !== "surfaces",
    )
    .map((c) => ({ slug: c.slug }))
}

/* Shared section label, the mono eyebrow used across the docs specimen pages. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  )
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = bySlug(slug)
  if (!doc) notFound()

  const demos = examples[slug] ?? []
  const rendered = demos.map((d) => ({
    name: d.name,
    Component: d.Component,
    code: readFileSync(
      join(process.cwd(), "content/examples", d.file),
      "utf8",
    ).trimEnd(),
  }))

  const byBase = new Map(
    demos.map((d) => [
      d.file
        .split("/")
        .pop()!
        .replace(/\.tsx$/, ""),
      d,
    ]),
  )
  const variantViews: VariantView[] = (doc.variants ?? []).map((v) => {
    const demo = byBase.get(v.example)
    const Comp = demo?.Component
    return {
      id: v.id,
      name: v.name,
      tags: v.tags,
      install: v.install ?? `npx shadcn@latest add @byronwade/${doc.slug}`,
      preview: Comp ? <Comp /> : null,
      code: demo
        ? readFileSync(
            join(process.cwd(), "content/examples", demo.file),
            "utf8",
          ).trimEnd()
        : "",
    }
  })

  const surface = getSurface(doc)
  const deps = [...(doc.registryDeps ?? []), ...(doc.npmDeps ?? [])]

  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <header>
        <Link
          href={`/catalog?surface=${surface}`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          {surfaceLabel(surface)}
        </Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          {doc.category} · {surfaceLabel(surface)}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-normal tracking-tight text-foreground text-balance">
          {doc.name}
        </h1>
        <DocsIntro>{doc.description}</DocsIntro>
        {deps.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {deps.map((d) => (
              <span
                key={d}
                className="rounded-full edge bg-card px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}
        {doc.category === "AI" && (
          <p className="mt-6 max-w-2xl rounded-lg edge bg-muted/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-muted-foreground">
            Adapted from{" "}
            <a
              href="https://ai-sdk.dev/elements"
              target="_blank"
              rel="noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              Vercel AI Elements
            </a>{" "}
            , the original components, repurposed onto the byronwade/ui design
            system (semantic tokens, dark mode, small subtle refinements). ©
            Vercel.
          </p>
        )}
      </header>

      {variantViews.length > 0 ? (
        <DocsDemoSection
          label={
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Feature showcase
            </h2>
          }
        >
          <VariantBrowser variants={variantViews} />
        </DocsDemoSection>
      ) : (
        rendered.length > 0 && (
          <DocsDemoSection
            label={
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Feature showcase
              </h2>
            }
          >
            <div className="space-y-8">
              {rendered.map(({ name, Component, code }) => (
                <ExampleTabs
                  key={name}
                  title={name}
                  preview={<Component />}
                  code={code}
                />
              ))}
            </div>
          </DocsDemoSection>
        )
      )}

      {doc.slug !== "foundation" && (
        <section className="space-y-3">
          <Label>Installation</Label>
          <InstallCommand slug={doc.slug} />
        </section>
      )}

      <ComponentReferenceSections doc={doc} />

      {/* ── Footer nav ── */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs#catalog"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Browse all components
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Installation
        </Link>
      </div>
    </article>
  )
}
