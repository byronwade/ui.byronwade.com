import { bySlug } from "@/content/components";

export type VariantJump = { id: string; name: string };

/**
 * Contextual "On this page" jumps for the docs sidebar. Returns the authored
 * variants of the component at `/docs/<slug>` (so they can deep-link to the
 * VariantBrowser anchors), or null on the catalog index, guide pages, unknown
 * slugs, or components without authored variants.
 */
export function variantJumps(pathname: string): { slug: string; jumps: VariantJump[] } | null {
  const match = pathname.match(/^\/docs\/([^/#?]+)$/);
  if (!match) return null;
  const slug = match[1];
  const doc = bySlug(slug);
  if (!doc?.variants?.length) return null;
  return { slug, jumps: doc.variants.map((v) => ({ id: v.id, name: v.name })) };
}
