import { templates } from "@/app/templates/_templates";
import { Gallery, type GalleryItem } from "@/app/_components/gallery";

const items: GalleryItem[] = templates.map((t) => ({
  slug: t.slug,
  name: t.name,
  category: t.category,
  uses: t.uses,
  href: `/templates/${t.slug}`,
  previewSrc: `/preview/${t.slug}`,
  price: t.price,
}));

export default function TemplatesGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Starter templates</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Full website templates, ready to ship.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Complete, content-filled pages — marketing, dashboard, account — composed
          entirely from the byronwade/ui tokens and primitives. Buy one, drop it in,
          and re-skin it to your brand from a single CSS variable.
        </p>
      </header>

      <div className="mt-10">
        <Gallery items={items} noun="template" />
      </div>
    </div>
  );
}
