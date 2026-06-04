import { components, getVariants, type ComponentDoc } from "@/content/components";

export type CatalogItem = {
  slug: string;
  name: string;
  /** Primary group — the component's `category`. */
  group: string;
  description: string;
  /** Clean type-level facet tags (`doc.tags`). */
  tags: string[];
  /** Authored (or synthesized) variant count. */
  variantCount: number;
  href: string;
  /** Precomputed lowercased haystack for free-text search (name, slug, group, description, type tags, variant names + tags). */
  search: string;
};

const toItem = (doc: ComponentDoc): CatalogItem => {
  const variants = getVariants(doc);
  const tags = doc.tags ?? [];
  const variantTokens = variants.flatMap((v) => [v.name, ...v.tags]);
  return {
    slug: doc.slug,
    name: doc.name,
    group: doc.category,
    description: doc.description,
    tags,
    variantCount: variants.length,
    href: `/docs/${doc.slug}`,
    search: [doc.name, doc.slug.replace(/-/g, " "), doc.category, doc.description, ...tags, ...variantTokens]
      .join(" ")
      .toLowerCase(),
  };
};

export const catalogItems = (): CatalogItem[] =>
  components.map(toItem).sort((a, b) => a.name.localeCompare(b.name));

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
