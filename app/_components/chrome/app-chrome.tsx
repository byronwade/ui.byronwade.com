"use client"

import { usePathname } from "next/navigation"

import { CommandPalette } from "./command-palette"
import { SiteHeader } from "./site-header"

/**
 * Global application chrome: a full-width top header (primary nav + app switcher
 * + search/theme/source) plus the command palette (⌘K). Chrome-free preview
 * routes (`/preview/*`) render without it.
 */
export function AppChrome() {
  const pathname = usePathname()
  if (pathname?.startsWith("/preview")) return null

  return (
    <>
      <SiteHeader />
      <CommandPalette />
    </>
  )
}
