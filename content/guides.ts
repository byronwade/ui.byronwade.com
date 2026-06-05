/**
 * "Get Started" guide pages that live alongside the component catalog under
 * /docs. These are the informational / install-related sidebar items
 * alongside the component catalog (installation, theming, AI rules).
 *
 * Because these slugs are static segments, Next.js resolves them ahead of the
 * /docs/[slug] dynamic route — and none collides with a component slug.
 */

/** Deployed registry base URL (the Vercel deployment or your custom domain). */
export const REGISTRY_URL = "https://ui.byronwade.com"

export type Guide = {
  /** Path segment under /docs ("" is the Introduction / catalog index). */
  slug: string
  href: string
  /** Sidebar label. */
  label: string
  /** In-page heading + document title. */
  title: string
  description: string
}

export const guides: Guide[] = [
  {
    slug: "",
    href: "/docs",
    label: "Introduction",
    title: "Introduction",
    description:
      "What byronwade/ui is, why it exists, and the whole catalog at a glance.",
  },
  {
    slug: "philosophy",
    href: "/docs/philosophy",
    label: "Philosophy",
    title: "Philosophy",
    description:
      "The whole idea, start to finish — calm, warm, token-driven, and entirely yours.",
  },
  {
    slug: "installation",
    href: "/docs/installation",
    label: "Installation",
    title: "Installation",
    description:
      "Every way in — the easiest being the shadcn registry, which wires everything up once.",
  },
  {
    slug: "foundation",
    href: "/docs/foundation",
    label: "Foundation",
    title: "Foundation",
    description:
      "The complete token base — surfaces, brand, charts, the radius scale, and the hairline depth model.",
  },
  {
    slug: "theming",
    href: "/docs/theming",
    label: "Theming",
    title: "Theming",
    description:
      "Re-skin the entire system — light and dark — from a single CSS variable.",
  },
  {
    slug: "typography",
    href: "/docs/typography",
    label: "Typography",
    title: "Typography",
    description:
      "The type system — three families, one scale, and the editorial restraint that makes it read clean.",
  },
  {
    slug: "ai",
    href: "/docs/ai",
    label: "AI rules",
    title: "Keep your AI on-system",
    description:
      "Install one rule so Cursor, Claude, Copilot, and others keep building with these components and tokens.",
  },
]

/** Guides that are real sub-pages (everything except the Introduction index). */
export const guidePages = guides.filter((g) => g.slug !== "")
