import { Suspense } from "react"

import { templates } from "@/app/templates/_templates"
import {
  getTemplateSurface,
  parseSurfaceParam,
} from "@/content/catalog-surfaces"
import { Gallery, type GalleryItem } from "@/app/_components/gallery"
import { DocsIntro } from "@/app/(docs)/_components/docs-prose"

const items: GalleryItem[] = templates.map((t) => ({
  slug: t.slug,
  name: t.name,
  category: t.category,
  surface: getTemplateSurface(t),
  uses: t.uses,
  href: `/templates/${t.slug}`,
  previewSrc: `/preview/${t.slug}`,
  price: t.price,
}))

function TemplatesGallery({
  initialSurface,
}: {
  initialSurface: ReturnType<typeof parseSurfaceParam>
}) {
  return (
    <Gallery
      items={items}
      noun="template"
      initialSurface={initialSurface}
      syncSurfaceQuery
    />
  )
}

export default async function TemplatesGalleryPage({
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
          Starter templates
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-normal tracking-tight text-balance text-foreground">
          Full website templates, ready to ship.
        </h1>
        <DocsIntro>
          Complete, content-filled pages — marketing, dashboard, account —
          composed from byronwade/ui tokens. Filter by surface, buy one, drop it
          in, re-skin from a single CSS variable.
        </DocsIntro>
      </header>

      <div className="mt-10">
        <Suspense fallback={null}>
          <TemplatesGallery initialSurface={initialSurface} />
        </Suspense>
      </div>
    </div>
  )
}
