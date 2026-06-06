import { Suspense } from "react"

import { archetypes } from "@/app/layouts/_archetypes"
import {
  getArchetypeSurface,
  parseSurfaceParam,
} from "@/content/catalog-surfaces"
import { Gallery, type GalleryItem } from "@/app/_components/gallery"
import { DocsIntro } from "@/app/(docs)/_components/docs-prose"

const items: GalleryItem[] = archetypes.map((a) => ({
  slug: a.slug,
  name: a.name,
  category: a.category,
  surface: getArchetypeSurface(a),
  uses: a.uses,
  href: `/layouts/${a.slug}`,
  previewSrc: `/preview/${a.slug}`,
}))

function LayoutsGallery({
  initialSurface,
}: {
  initialSurface: ReturnType<typeof parseSurfaceParam>
}) {
  return (
    <Gallery
      items={items}
      noun="layout"
      initialSurface={initialSurface}
      syncSurfaceQuery
    />
  )
}

export default async function LayoutsGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ surface?: string }>
}) {
  const { surface } = await searchParams
  const initialSurface = parseSurfaceParam(surface)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Layout archetypes
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-normal tracking-tight text-balance text-foreground">
          Whole pages, not just parts.
        </h1>
        <DocsIntro>
          Opinionated full-page archetypes — each built around one signature
          centerpiece from the same tokens and primitives. Filter by application
          or marketing surface, then inspect at any viewport.
        </DocsIntro>
      </header>

      <div className="mt-10">
        <Suspense fallback={null}>
          <LayoutsGallery initialSurface={initialSurface} />
        </Suspense>
      </div>
    </div>
  )
}
