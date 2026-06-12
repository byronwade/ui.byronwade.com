import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "@/lib/icons"

import {
  bySurface,
  catalogSurfaces,
  categoriesForSurface,
  getSurface,
  surfaceCounts,
} from "@/content/catalog-surfaces"
import { byCategory } from "@/content/components"
import { DocsIntro, DocsProse } from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Surfaces, byronwade/ui",
  description:
    "One foundation, two composition modes — application UI vs marketing and editorial, without splitting the registry.",
}

const ROUTING = [
  {
    surface: "Application UI",
    typography: "UI lane — font-sans, text-sm/text-base",
    layout: "app-shell, sidebar, tables, morph-dock",
    examples: "Button, Table, App Shell, Morph Dock",
  },
  {
    surface: "Marketing & editorial",
    typography: "reading-prose / reading-ui for copy",
    layout: "marketing-layout, hero-section, full-bleed media",
    examples: "Hero Section, Video Shelf, Marketing Layout",
  },
] as const

export default function SurfacesPage() {
  const counts = surfaceCounts()

  return (
    <article className="max-w-none">
      <section className="py-12 lg:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Foundation · Surfaces
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
          One system. Two surfaces.
        </h1>
        <DocsIntro>
          Dashboards and landing pages look nothing alike — but they should not
          require two design systems. byronwade/ui routes composition by surface
          while sharing every{" "}
          <Link
            href="/docs/foundation"
            className="text-brand underline-offset-4 hover:underline"
          >
            shared token
          </Link>{" "}
          and install path.
        </DocsIntro>
      </section>

      <section className="border-y border-border bg-card py-12">
        <DocsProse className="mx-auto">
          <p className="reading-muted font-mono text-xs uppercase tracking-[0.2em]">
            Do not split the registry
          </p>
          <p>
            Keep a single <code>@byronwade/foundation</code> and one{" "}
            <Link
              href="/docs/theming"
              className="text-brand underline-offset-4 hover:underline"
            >
              <code>--brand</code>
            </Link>{" "}
            knob. Split navigation,{" "}
            <Link
              href="/docs/readability"
              className="text-brand underline-offset-4 hover:underline"
            >
              typography lane
            </Link>
            , and layout primitive — not packages. Install what you need; ignore
            the rest.
          </p>
          <ul>
            <li>
              <span className="text-foreground">{counts.app}</span> application
              components
            </li>
            <li>
              <span className="text-foreground">{counts.marketing}</span>{" "}
              marketing & editorial components
            </li>
          </ul>
        </DocsProse>
      </section>

      <section className="py-12">
        <DocsProse>
          <h2>Agent routing</h2>
          <div className="not-prose mt-6 overflow-hidden rounded-2xl edge">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Surface
                  </th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Typography
                  </th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Layout
                  </th>
                  <th className="hidden px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground sm:table-cell">
                    Reach for
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROUTING.map((row) => (
                  <tr key={row.surface} className="border-b border-border">
                    <td className="px-4 py-3 text-foreground">{row.surface}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.typography}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.layout}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                      {row.examples}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsProse>
      </section>

      {catalogSurfaces.map((surface) => (
        <section key={surface.id} className="border-t border-border py-10">
          <DocsProse>
            <h2>{surface.label}</h2>
            <p>{surface.description}</p>
            <p className="reading-muted">
              {bySurface(surface.id).length} components ·{" "}
              <Link href={surface.href} className="text-brand">
                Browse in catalog
              </Link>
            </p>
            {categoriesForSurface(surface.id).map((cat) => {
              const items = byCategory(cat).filter(
                (c) => getSurface(c) === surface.id,
              )
              if (items.length === 0) return null
              return (
                <div key={cat} className="mt-6">
                  <h3>{cat}</h3>
                  <ul>
                    {items.slice(0, 6).map((c) => (
                      <li key={c.slug}>
                        <Link href={`/docs/${c.slug}`}>{c.name}</Link>
                      </li>
                    ))}
                    {items.length > 6 ? (
                      <li className="reading-muted">
                        + {items.length - 6} more in{" "}
                        <Link href={surface.href}>catalog</Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )
            })}
          </DocsProse>
        </section>
      ))}

      <section className="flex flex-wrap gap-3 py-12">
        <Button render={<Link href="/catalog" />}>
          Open catalog
          <ArrowRight />
        </Button>
        <Button variant="outline" render={<Link href="/docs/readability" />}>
          Readability lanes
        </Button>
      </section>

      <GuidePager current="/docs/surfaces" />
    </article>
  )
}
