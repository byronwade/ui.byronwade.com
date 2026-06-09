/**
 * Flat search index for the ⌘K command palette.
 * Two kinds of entries: Section (anchor on the home page) and Component.
 *
 * Component entries are DERIVED from content/components.ts so the palette can
 * never drift from the actual set of documented components. Section entries are
 * hand-curated because they map to anchors on the home styleguide page.
 */

import { components } from "@/content/components"
import { getSurface } from "@/content/catalog-surfaces"
import { getFamilyRoot } from "@/content/docs-nav"
import { archetypes } from "@/app/layouts/_archetypes"
import { templates } from "@/app/templates/_templates"

export type SearchEntry = {
  label: string
  kind: "Component" | "Section"
  href: string
  /** Space-separated additional terms for fuzzy matching. */
  keywords?: string
  /** Category label shown on the right for components. */
  meta?: string
}

/* ── Pages (top-level destinations) ────────────────────────────────── */

const pageEntries: SearchEntry[] = [
  {
    kind: "Section",
    label: "Home",
    href: "/",
    meta: "Page",
    keywords: "landing hero start",
  },
  {
    kind: "Section",
    label: "Introduction",
    href: "/docs",
    meta: "Guide",
    keywords: "introduction overview get started why shadcn registry",
  },
  {
    kind: "Section",
    label: "Installation",
    href: "/docs/installation",
    meta: "Guide",
    keywords:
      "install installation setup quick start shadcn registry cli init add namespace",
  },
  {
    kind: "Section",
    label: "Theming",
    href: "/docs/theming",
    meta: "Guide",
    keywords:
      "theming theme re-skin reskin brand color tokens css variable dark mode",
  },
  {
    kind: "Section",
    label: "Surfaces",
    href: "/docs/surfaces",
    meta: "Guide",
    keywords:
      "surfaces application marketing editorial catalog split app shell hero layout",
  },
  {
    kind: "Section",
    label: "Readability",
    href: "/docs/readability",
    meta: "Guide",
    keywords:
      "readability reading measure line length line height WCAG research consortium prose 65ch font size contrast web typography",
  },
  {
    kind: "Section",
    label: "AI rules",
    href: "/docs/ai",
    meta: "Guide",
    keywords:
      "ai rules cursor claude copilot windsurf codex agent on-system design rules",
  },
  {
    kind: "Section",
    label: "Application catalog",
    href: "/catalog?surface=app",
    meta: "Catalog",
    keywords:
      "application app dashboard forms components catalog filter surface",
  },
  {
    kind: "Section",
    label: "Marketing catalog",
    href: "/catalog?surface=marketing",
    meta: "Catalog",
    keywords:
      "marketing editorial media video commerce landing hero catalog filter surface",
  },
  {
    kind: "Section",
    label: "Catalog",
    href: "/catalog",
    meta: "Page",
    keywords:
      "catalog all components index list grid browse gallery search filter",
  },
  {
    kind: "Section",
    label: "Styleguide",
    href: "/styleguide",
    meta: "Page",
    keywords: "styleguide design philosophy tokens showcase",
  },
]

/* ── Sections (styleguide anchors) ─────────────────────────────────── */

const sectionEntries: SearchEntry[] = [
  {
    kind: "Section",
    label: "Philosophy",
    href: "/styleguide#philosophy",
    keywords: "calm chrome single accent",
  },
  {
    kind: "Section",
    label: "Principles",
    href: "/styleguide#principles",
    keywords: "rules do dont status spacing radius",
  },
  {
    kind: "Section",
    label: "Foundations",
    href: "/styleguide#foundations",
    keywords: "color tokens radius elevation typography utilities",
  },
  {
    kind: "Section",
    label: "Primitives",
    href: "/styleguide#primitives",
    keywords: "button badge card filter pill segmented control status dot",
  },
  {
    kind: "Section",
    label: "Forms",
    href: "/styleguide#forms",
    keywords: "input textarea select checkbox switch radio label toggle",
  },
  {
    kind: "Section",
    label: "Overlays",
    href: "/styleguide#overlays",
    keywords:
      "tooltip popover dropdown menu dialog hover card sheet command navigation",
  },
  {
    kind: "Section",
    label: "Feedback",
    href: "/styleguide#feedback",
    keywords: "alert progress skeleton toast",
  },
  {
    kind: "Section",
    label: "Data display",
    href: "/styleguide#data",
    keywords:
      "tabs accordion avatar separator breadcrumb table aspect ratio scroll collapsible",
  },
  {
    kind: "Section",
    label: "Patterns",
    href: "/styleguide#patterns",
    keywords:
      "page header metric stat stat card gauge activity grid gradient avatar empty state",
  },
  {
    kind: "Section",
    label: "Charts",
    href: "/styleguide#charts",
    keywords: "area chart bar chart recharts",
  },
  {
    kind: "Section",
    label: "House components",
    href: "/styleguide#house",
    keywords:
      "detail header settings panel event timeline section verification",
  },
  {
    kind: "Section",
    label: "Layout archetypes",
    href: "/styleguide#layouts",
    keywords:
      "hero section centered focal split with rail timeline rail layouts",
  },
  {
    kind: "Section",
    label: "Side by side",
    href: "/styleguide#comparison",
    keywords: "comparison vercel linear stripe github shopify",
  },
]

/* ── Components (derived from the canonical docs manifest) ─────────── */

const componentEntries: SearchEntry[] = components.map((c) => {
  const family = getFamilyRoot(c.slug)
  const familyKeywords = family
    ? `family:${family.slug.replace(/-/g, " ")} ${family.name}`
    : ""
  return {
    kind: "Component",
    label: c.name,
    href: `/docs/${c.slug}`,
    meta: `${c.category} · ${getSurface(c) === "marketing" ? "Marketing" : "Application"}`,
    keywords:
      `${c.slug.replace(/-/g, " ")} ${c.category} ${getSurface(c)} ${familyKeywords} ${c.description}`.toLowerCase(),
  }
})

/* ── Variants (authored only, derived from the canonical manifest) ─── */

const variantEntries: SearchEntry[] = components.flatMap((c) =>
  (c.variants ?? []).map((v) => ({
    kind: "Component" as const,
    label: `${c.name}, ${v.name}`,
    href: `/docs/${c.slug}#${v.id}`,
    meta: "Variant",
    keywords:
      `${c.slug.replace(/-/g, " ")} ${v.name} ${v.tags.join(" ")} ${c.category}`.toLowerCase(),
  })),
)

/* ── Layout archetypes (derived from the gallery metadata) ────────── */

const layoutEntries: SearchEntry[] = [
  {
    kind: "Section",
    label: "Layouts gallery",
    href: "/catalog?type=layouts",
    meta: "Browse",
    keywords: "archetypes full page layouts gallery showcase browse catalog",
  },
  ...archetypes.map<SearchEntry>((a) => ({
    kind: "Section",
    label: `${a.name} layout`,
    href: `/layouts/${a.slug}`,
    meta: "Layout",
    keywords: `${a.tagline} ${a.uses.join(" ")} archetype layout`.toLowerCase(),
  })),
]

/* ── Starter templates (derived from the gallery metadata) ────────── */

const templateEntries: SearchEntry[] = [
  {
    kind: "Section",
    label: "Templates gallery",
    href: "/templates",
    meta: "Templates",
    keywords:
      "templates starter screens pages gallery pricing dashboard settings",
  },
  ...templates.map<SearchEntry>((t) => ({
    kind: "Section",
    label: `${t.name} template`,
    href: `/templates/${t.slug}`,
    meta: "Template",
    keywords:
      `${t.tagline} ${t.uses.join(" ")} ${t.category} starter template screen`.toLowerCase(),
  })),
]

export const searchIndex: SearchEntry[] = [
  ...pageEntries,
  ...sectionEntries,
  ...layoutEntries,
  ...templateEntries,
  ...componentEntries,
  ...variantEntries,
]
