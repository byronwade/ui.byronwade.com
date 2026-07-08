import {
  AppWindow,
  BookOpen,
  House,
  Palette,
  PuzzlePiece,
  type Icon,
} from "@/lib/icons"

/**
 * Primary destinations in the fixed site header. Kept small: full catalog
 * depth lives in Browse + ⌘K; Styleguide is the token specimen page.
 */
export interface DocsNavItem {
  label: string
  href: string
  icon: Icon
  /** Custom active matcher; defaults to exact / prefix match on `href`. */
  match?: (pathname: string) => boolean
}

export const navItems: DocsNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: House,
    match: (p) => p === "/",
  },
  {
    label: "Docs",
    href: "/docs",
    icon: BookOpen,
    match: (p) => p === "/docs" || p.startsWith("/docs/"),
  },
  {
    label: "Browse",
    href: "/catalog",
    icon: PuzzlePiece,
    match: (p) => p.startsWith("/catalog") || p.startsWith("/layouts"),
  },
  {
    label: "Styleguide",
    href: "/styleguide",
    icon: Palette,
    match: (p) => p.startsWith("/styleguide"),
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
