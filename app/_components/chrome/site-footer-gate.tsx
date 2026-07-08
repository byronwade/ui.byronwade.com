"use client"

import { usePathname } from "next/navigation"

import { SiteFooter } from "./site-footer"

/** Hides the footer on chrome-free preview routes. */
export function SiteFooterGate() {
  const pathname = usePathname()
  if (pathname?.startsWith("/preview")) return null
  return <SiteFooter />
}
