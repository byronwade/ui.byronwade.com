import type { Metadata } from "next";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { components } from "@/content/components";
import { catalogItems } from "@/content/catalog";
import { ComponentGallery } from "@/app/(docs)/_components/component-gallery";

export const metadata: Metadata = {
  title: "Catalog — byronwade/ui",
  description:
    "Every component in the registry — search by name, variant, or tag, filter by group, and open any one for its variants and install.",
};

/** Real example-demo count per component (server-side fs read) so the catalog
 *  reflects what actually exists rather than a synthetic "1 variant". */
function exampleCounts(): Record<string, number> {
  const dir = join(process.cwd(), "content/examples");
  const counts: Record<string, number> = {};
  for (const c of components) {
    try {
      counts[c.slug] = readdirSync(join(dir, c.slug)).filter((f) => f.endsWith(".tsx")).length;
    } catch {
      counts[c.slug] = 0;
    }
  }
  return counts;
}

export default function CatalogPage() {
  const items = catalogItems(exampleCounts());
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-8 sm:pt-28 lg:px-10">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Catalog</p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-normal leading-[1.0] tracking-tight text-foreground text-balance">
          Every component, one grid.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          The whole registry — search by name, variant, or tag, filter by group, and open any
          component for its variants and install command.
        </p>
      </header>
      <div className="mt-10">
        <ComponentGallery items={items} />
      </div>
    </div>
  );
}
