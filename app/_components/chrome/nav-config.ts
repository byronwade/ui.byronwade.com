import {
  Home,
  BookOpen,
  Component,
  LayoutTemplate,
  AppWindow,
  type LucideIcon,
} from "lucide-react"

/**
 * Primary destinations surfaced in the floating nav dock — the docs-site analogue
 * of SignalRoute's per-product `nav-config`. Kept deliberately small: the dock is
 * the always-visible primary nav, while the full component catalog is reached via
 * the launcher's browse panel, the breadcrumb, and the ⌘K command palette.
 */
export interface DocsNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Custom active matcher; defaults to exact / prefix match on `href`. */
  match?: (pathname: string) => boolean
}

export const navItems: DocsNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    match: (p) => p === "/",
  },
  {
    // Guides + the Introduction landing + every component reference page (the
    // restored docs sidebar lists them all).
    label: "Docs",
    href: "/docs",
    icon: BookOpen,
    match: (p) => p === "/docs" || p.startsWith("/docs/"),
  },
  {
    // The faceted, searchable component catalog grid.
    label: "Catalog",
    href: "/catalog",
    icon: Component,
    match: (p) => p.startsWith("/catalog"),
  },
  {
    label: "Layouts",
    href: "/layouts",
    icon: LayoutTemplate,
    match: (p) => p.startsWith("/layouts"),
  },
  {
    label: "Templates",
    href: "/templates",
    icon: AppWindow,
    match: (p) => p.startsWith("/templates"),
  },
]

export function isActive(item: DocsNavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname)
  return pathname === item.href || pathname.startsWith(item.href + "/")
}
