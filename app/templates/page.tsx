import { Suspense } from "react"

import { Gallery, type GalleryItem } from "@/app/_components/gallery"
import { templates } from "@/app/templates/_templates"

const items: GalleryItem[] = templates.map((t) => ({
  slug: t.slug,
  name: t.name,
  category: t.category,
  surface: t.category === "Marketing" ? "marketing" : "app",
  uses: t.uses,
  href: `/templates/${t.slug}`,
  previewSrc: `/preview/${t.slug}`,
  price: t.price,
}))

export default function TemplatesPage() {
  return (
    <div className="w-full px-6 pb-24 pt-14 sm:px-8 lg:px-12">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          byronwade/ui templates
        </p>
        <h1 className="mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          Starter templates
        </h1>
        <p className="reading-ui mt-3 text-sm text-muted-foreground sm:text-base">
          Ready-to-ship screens composed from the design system — pricing,
          dashboard, and settings. Open any card to inspect, reskin, and preview.
        </p>
      </header>

      <Suspense fallback={null}>
        <Gallery items={items} noun="templates" syncSurfaceQuery />
      </Suspense>
    </div>
  )
}
