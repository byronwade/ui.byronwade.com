import type { Metadata } from "next"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import { Suspense } from "react"

import { components } from "@/content/components"
import { catalogItems } from "@/content/catalog"
import {
  getArchetypeSurface,
  parseSurfaceParam,
} from "@/content/catalog-surfaces"
import { parseTypeParam, type BrowseItem } from "@/content/browse"
import { archetypes } from "@/app/layouts/_archetypes"
import { BrowseGallery } from "@/app/_components/browse-gallery"
import { DocsIntro } from "@/app/(docs)/_components/docs-prose"

export const metadata: Metadata = {
  title: "Browse, byronwade/ui",
  description:
    "Browse everything in the system — components and full-page layouts. Filter by type and surface, search by name, variant, or tag.",
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

function thumbnailSlugs(): Set<string> {
  const dir = join(process.cwd(), "public/thumbs")
  try {
    return new Set(
      readdirSync(dir)
        .filter((f) => f.endsWith(".png"))
        .map((f) => f.replace(/\.png$/, "")),
    )
  } catch {
    return new Set()
  }
}

/** Components + layout archetypes, normalized into one unified browse list. */
function browseItems(): BrowseItem[] {
  const availableThumbnails = thumbnailSlugs()
  const componentItems: BrowseItem[] = catalogItems(exampleCounts()).map(
    (i) => ({
      kind: "component",
      slug: i.slug,
      name: i.name,
      surface: i.surface,
      group: i.group,
      href: i.href,
      search: i.search,
      description: i.description,
      variantCount: i.variantCount,
      thumbnailAvailable: availableThumbnails.has(i.slug),
    }),
  )
  const layoutItems: BrowseItem[] = archetypes.map((a) => ({
    kind: "layout",
    slug: a.slug,
    name: a.name,
    surface: getArchetypeSurface(a),
    group: a.category,
    href: `/layouts/${a.slug}`,
    previewSrc: `/preview/${a.slug}`,
    search: `${a.name} ${a.category} ${a.uses.join(" ")}`.toLowerCase(),
  }))
  return [...componentItems, ...layoutItems]
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ surface?: string; type?: string }>
}) {
  const { surface, type } = await searchParams
  const initialSurface = parseSurfaceParam(surface)
  const initialType = parseTypeParam(type)
  const items = browseItems()

  return (
    <div className="mx-auto w-full max-w-[110rem] px-6 pt-16 pb-24 sm:px-8 lg:px-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
          Browse
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-normal tracking-tight text-balance text-foreground">
          Browse the whole system.
        </h1>
        <DocsIntro>
          Components and full-page layouts in one place — filter by type and
          surface, search by name or tag, and open any item for variants,
          install, or a full-viewport inspect.
        </DocsIntro>
      </header>
      <div className="mt-10">
        <Suspense fallback={null}>
          <BrowseGallery
            items={items}
            initialType={initialType}
            initialSurface={initialSurface}
          />
        </Suspense>
      </div>
    </div>
  )
}
