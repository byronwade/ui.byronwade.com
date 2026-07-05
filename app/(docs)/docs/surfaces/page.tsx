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
import { Reveal } from "@/app/_components/cinematic/reveal"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Surfaces, byronwade/ui",
  description:
    "An app-only system: application UI is the primary lane; marketing and editorial are a secondary docs/screenshot lane — one foundation, no registry split.",
}

const ROUTING = [
  {
    surface: "Application UI — primary",
    typography: "UI lane — font-sans, text-sm/text-base",
    layout: "app-shell, sidebar, tables, morph-dock",
    examples: "App Shell, Table, Resource List, Command",
  },
  {
    surface: "Marketing & editorial — secondary",
    typography: "reading-prose / reading-ui for copy",
    layout: "marketing-layout, hero-section, full-bleed media",
    examples: "Hero Section, Video Shelf, Marketing Layout",
  },
] as const

export default function SurfacesPage() {
  const counts = surfaceCounts()

  return (
    <article className="max-w-none">
      <section className="relative isolate py-12 lg:py-16">
        <div
          aria-hidden
          className="glow-brand pointer-events-none absolute inset-x-0 -top-8 -z-10 h-64 opacity-60"
        />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Foundation · Surfaces
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
          App-first.{" "}
          <span className="text-gradient-brand">One foundation.</span>
        </h1>
        <DocsIntro>
          byronwade/ui is an app-only system: build{" "}
          <span className="text-foreground">application surfaces</span> by
          default — dashboards, admin panels, developer tools, AI workbenches,
          resource lists, and object-detail workflows. Marketing and editorial
          are a <span className="text-foreground">secondary</span> lane for
          docs, screenshots, and demos — sharing every{" "}
          <Link
            href="/docs/foundation"
            className="text-brand underline-offset-4 hover:underline"
          >
            shared token
          </Link>{" "}
          and install path, never the default for product screens.
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
              components (primary lane)
            </li>
            <li>
              <span className="text-foreground">{counts.marketing}</span>{" "}
              marketing & editorial components (secondary: docs / screenshots /
              demos)
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

      {catalogSurfaces.map((surface, i) => (
        <section key={surface.id} className="border-t border-border py-10">
          <Reveal delay={i * 0.05}>
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
          </Reveal>
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
