import { archetypes } from "@/app/layouts/_archetypes";
import { Gallery, type GalleryItem } from "@/app/_components/gallery";

const items: GalleryItem[] = archetypes.map((a) => ({
  slug: a.slug,
  name: a.name,
  category: a.category,
  uses: a.uses,
  href: `/layouts/${a.slug}`,
  previewSrc: `/preview/${a.slug}`,
}));

export default function LayoutsGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Layout archetypes</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Whole pages, not just parts.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Most libraries hand you parts and a blank canvas. byronwade/ui ships
          opinionated, full-page archetypes — each built around a single signature
          centerpiece and composed entirely from the same tokens and primitives. Open
          one to inspect it at any viewport, in either theme.
        </p>
      </header>

      <div className="mt-10">
        <Gallery items={items} noun="layout" />
      </div>
    </div>
  );
}
