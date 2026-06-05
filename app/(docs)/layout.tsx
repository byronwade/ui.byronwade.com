import { SiteNav } from "@/app/(docs)/_components/site-nav"
import { DocsNavDock } from "@/app/(docs)/_components/docs-nav-dock"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Full-width docs shell — sidebar + main, shadcn-style. Top padding clears
          the floating launcher / breadcrumb / nav dock from the root chrome. */}
      <div className="flex w-full">
        {/* pt-20 reserves the floating-chrome height so the sticky nav clears the
            header even at scroll-0 / on short pages (sticky top-20 alone only
            engages once you scroll). Mirrors <main>'s top padding. */}
        <aside className="hidden w-56 shrink-0 pt-20 lg:block xl:w-60">
          <div className="sticky top-20 max-h-[calc(100dvh-5rem)] overflow-y-auto pb-8 pl-6 pr-4 scrollbar-thin">
            <SiteNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="px-6 pb-20 pt-20 sm:px-8 sm:pt-24 lg:px-10 lg:pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile/tablet docs nav — hamburger bottom-left blooming SiteNav (lg:hidden). */}
      <DocsNavDock />
    </div>
  )
}
