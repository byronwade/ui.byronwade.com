"use client"

import { usePathname } from "next/navigation"
import { List } from "@/lib/icons"

import { AppLauncher } from "./app-launcher"
import { AppBreadcrumb } from "./app-breadcrumb"
import { DockToolbar } from "./dock-toolbar"
import { NavDock } from "./nav-dock"

/**
 * Mobile-only docs-nav trigger. Pinned furthest left in the header group, it
 * blooms the docs sidebar sheet by dispatching the event `DocsSidebar` listens
 * for — the same decoupled pattern the ⌘K launcher uses for search.
 */
function DocsMenuButton() {
  return (
    <div className="pointer-events-auto rounded-3xl bg-dock p-[3px] edge md:hidden">
      <button
        type="button"
        aria-label="Open documentation menu"
        onClick={() => window.dispatchEvent(new Event("open-docs-nav"))}
        className="flex size-8 items-center justify-center rounded-full text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <List className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

/**
 * The global floating shell, ported from SignalRoute's app shell. The top-left
 * **header group** pins to the window corner and holds two matched-sibling
 * overlays, the identity launcher and the breadcrumb pill. The contextual
 * toolbar pins top-right; the primary nav dock floats centered (top on sm+,
 * bottom on phones). `pointer-events-none` on the group keeps the gap from
 * blocking content; each pill re-enables its own events.
 */
export function AppChrome() {
  const pathname = usePathname()
  // Embedded archetype previews (`/preview/<slug>`) render inside iframes and
  // are meant to be pure, chrome-free surfaces, never overlay the shell there.
  if (pathname?.startsWith("/preview")) return null

  const isDocs = pathname?.startsWith("/docs")

  return (
    <>
      <div className="pointer-events-none fixed top-3 left-3 z-50 flex items-start gap-2 print:hidden">
        {isDocs ? <DocsMenuButton /> : null}
        <AppLauncher />
        {/* Breadcrumb is desktop-only — hidden on phones to declutter the corner. */}
        <div className="hidden sm:contents">
          <AppBreadcrumb />
        </div>
      </div>
      <DockToolbar />
      <NavDock />
    </>
  )
}
