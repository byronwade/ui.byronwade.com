"use client"

import { usePathname } from "next/navigation"

import { CommandPalette } from "./command-palette"
import { SiteHeader } from "./site-header"

/**
 * Global application chrome: fixed header + ⌘K palette.
 * Chrome-free preview routes (`/preview/*`) render without it.
 * Footer is mounted from the root layout after page content.
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
