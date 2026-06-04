import { components, getVariants, type ComponentDoc } from "@/content/components";

export type CatalogItem = {
  slug: string;
  name: string;
  /** Primary group — the component's `category`. */
  group: string;
  description: string;
  /** Clean type-level facet tags (`doc.tags`). */
  tags: string[];
  /**
   * Number of variants/specimens shown on the component's page — the count of
   * authored variants when present, otherwise the real number of example demos
   * (passed in via `exampleCounts`), so the catalog reflects what actually
   * exists rather than a synthetic "1".
   */
  variantCount: number;
  /** Registry dependency count (composability signal). */
  depCount: number;
  href: string;
  /** Precomputed lowercased haystack for free-text search (name, slug, group, description, type tags, variant names + tags). */
  search: string;
};

const toItem = (doc: ComponentDoc, exampleCounts: Record<string, number>): CatalogItem => {
  const variants = getVariants(doc);
  const tags = doc.tags ?? [];
  const variantTokens = variants.flatMap((v) => [v.name, ...v.tags]);
  const authored = doc.variants?.length ?? 0;
  return {
    slug: doc.slug,
    name: doc.name,
    group: doc.category,
    description: doc.description,
    tags,
    variantCount: authored > 0 ? authored : (exampleCounts[doc.slug] ?? 0),
    depCount: (doc.registryDeps?.length ?? 0) + (doc.npmDeps?.length ?? 0),
    href: `/docs/${doc.slug}`,
    search: [doc.name, doc.slug.replace(/-/g, " "), doc.category, doc.description, ...tags, ...variantTokens]
      .join(" ")
      .toLowerCase(),
  };
};

/**
 * Build the catalog items. `exampleCounts` maps slug → number of example demo
 * files (supplied by the server, which can read the filesystem); when omitted,
 * components without authored variants report a variant count of 0.
 */
export const catalogItems = (exampleCounts: Record<string, number> = {}): CatalogItem[] =>
  components.map((doc) => toItem(doc, exampleCounts)).sort((a, b) => a.name.localeCompare(b.name));

export type CatalogFilter = {
  query: string;
  groups: string[];
  tags: string[];
  sort: "featured" | "az";
};

export function filterCatalog(items: CatalogItem[], f: CatalogFilter): CatalogItem[] {
  const q = f.query.trim().toLowerCase();
  const r = items.filter(
    (i) =>
      (q === "" || i.search.includes(q)) &&
      (f.groups.length === 0 || f.groups.includes(i.group)) &&
      (f.tags.length === 0 || f.tags.some((t) => i.tags.includes(t))),
  );
  return f.sort === "az" ? [...r].sort((a, b) => a.name.localeCompare(b.name)) : r;
}
