import {
  byCategory,
  categories,
  components,
  type ComponentDoc,
} from "@/content/components"

/** Application UI vs marketing/editorial — one token system, two composition modes. */
export type CatalogSurface = "app" | "marketing"

export type SurfaceFilter = CatalogSurface | "all"

const MARKETING_CATEGORIES = new Set<ComponentDoc["category"]>([
  "Media",
  "Video",
  "Commerce",
])

/** Slugs filed under app categories but composed primarily on marketing surfaces. */
const MARKETING_SLUGS = new Set([
  "hero-section",
  "marketing-layout",
  "description-box",
])

const MARKETING_TEMPLATE_CATEGORIES = new Set(["Marketing"])
const MARKETING_ARCHETYPE_CATEGORIES = new Set(["Media"])

export function getSurface(doc: ComponentDoc): CatalogSurface {
  if (doc.category === "Foundation" || doc.category === "Libraries")
    return "app"
  if (MARKETING_CATEGORIES.has(doc.category)) return "marketing"
  if (MARKETING_SLUGS.has(doc.slug)) return "marketing"
  return "app"
}

export function getTemplateSurface(meta: { category: string }): CatalogSurface {
  if (MARKETING_TEMPLATE_CATEGORIES.has(meta.category)) return "marketing"
  return "app"
}

export function getArchetypeSurface(meta: {
  category: string
}): CatalogSurface {
  if (MARKETING_ARCHETYPE_CATEGORIES.has(meta.category)) return "marketing"
  return "app"
}

export const catalogSurfaces: {
  id: CatalogSurface
  label: string
  shortLabel: string
  description: string
  href: string
}[] = [
  {
    id: "app",
    label: "Application UI",
    shortLabel: "Application",
    description:
      "Dashboards, forms, data surfaces, shells — sans UI lane, compact chrome, dense layouts.",
    href: "/catalog?surface=app",
  },
  {
    id: "marketing",
    label: "Marketing & editorial",
    shortLabel: "Marketing",
    description:
      "Landing pages, media, commerce, essays — reading-prose, hero compositions, full-bleed marketing scaffolds.",
    href: "/catalog?surface=marketing",
  },
]

export function surfaceLabel(surface: CatalogSurface): string {
  return catalogSurfaces.find((s) => s.id === surface)?.label ?? surface
}

export function surfaceShortLabel(surface: CatalogSurface): string {
  return catalogSurfaces.find((s) => s.id === surface)?.shortLabel ?? surface
}

export function surfaceCounts() {
  const app = bySurface("app").length
  const marketing = bySurface("marketing").length
  return { app, marketing, total: app + marketing }
}

export function bySurface(surface: CatalogSurface) {
  return components.filter(
    (c) => c.category !== "Foundation" && getSurface(c) === surface,
  )
}

export function categoriesForSurface(surface: CatalogSurface) {
  const inSurface = new Set(bySurface(surface).map((c) => c.category))
  return categories.filter((cat) => inSurface.has(cat))
}

export function byCategoryAndSurface(cat: string, surface: CatalogSurface) {
  return byCategory(cat).filter((c) => getSurface(c) === surface)
}

export function matchesSurfaceFilter(
  surface: CatalogSurface,
  filter: SurfaceFilter,
): boolean {
  return filter === "all" || surface === filter
}

export function parseSurfaceParam(
  value: string | string[] | undefined,
): SurfaceFilter {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === "app" || raw === "marketing") return raw
  return "all"
}
