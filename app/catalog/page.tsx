import type { Metadata } from "next"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import { Suspense } from "react"

import { components } from "@/content/components"
import { catalogItems } from "@/content/catalog"
import { parseSurfaceParam } from "@/content/catalog-surfaces"
import { ComponentGallery } from "@/app/(docs)/_components/component-gallery"
import { DocsIntro } from "@/app/(docs)/_components/docs-prose"

export const metadata: Metadata = {
  title: "Catalog, byronwade/ui",
  description:
    "Every component in the registry — filter by application UI or marketing & editorial, search by name, variant, or tag.",
}

function exampleCounts(): Record<string, number> {
  const dir = join(process.cwd(), "content/examples")
  const counts: Record<string, number> = {}
  for (const c of components) {
    try {
      counts[c.slug] = readdirSync(join(dir, c.slug)).filter((f) =>
        f.endsWith(".tsx"),
      ).length
    } catch {
      counts[c.slug] = 0
    }
  }
  return counts
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ surface?: string }>
}) {
  const { surface: surfaceParam } = await searchParams
  const initialSurface = parseSurfaceParam(surfaceParam)
  const items = catalogItems(exampleCounts())

  return (
    <div className="mx-auto w-full max-w-[110rem] px-6 pb-24 pt-24 sm:px-8 sm:pt-28 lg:px-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Catalog
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-normal leading-[1.0] tracking-tight text-foreground text-balance">
          One registry, two surfaces.
        </h1>
        <DocsIntro>
          Application UI and marketing/editorial share foundation tokens — filter
          by surface, search by name or tag, and open any component for variants
          and install.
        </DocsIntro>
      </header>
      <div className="mt-10">
        <Suspense fallback={null}>
          <ComponentGallery items={items} initialSurface={initialSurface} />
        </Suspense>
      </div>
    </div>
  )
}
