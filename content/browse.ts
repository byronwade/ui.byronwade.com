import type { CatalogSurface } from "@/content/catalog-surfaces"

/** A component, layout archetype, or starter template in the unified Browse grid. */
export type BrowseKind = "component" | "layout" | "template"

/** One unified card in the merged Browse grid. Card-specific fields are optional
 *  and keyed off `kind` at render time. */
export type BrowseItem = {
  kind: BrowseKind
  slug: string
  name: string
  surface: CatalogSurface
  /** Component group OR layout/template category — drives the card's secondary tag. */
  group: string
  href: string
  /** Lowercased free-text haystack for search. */
  search: string
  // component-only
  description?: string
  variantCount?: number
  thumbnailAvailable?: boolean
  // layout / template
  previewSrc?: string
  price?: string
}

export type BrowseTypeFilter = "all" | BrowseKind

/** Parse a `?type=` query param (accepts singular or plural) into a filter. */
export function parseTypeParam(value: string | undefined): BrowseTypeFilter {
  if (value === "component" || value === "components") return "component"
  if (value === "layout" || value === "layouts") return "layout"
  if (value === "template" || value === "templates") return "template"
  return "all"
}
