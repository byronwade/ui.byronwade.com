import { SiteNav } from "@/app/(docs)/_components/site-nav";
import { DocsNavDock } from "@/app/(docs)/_components/docs-nav-dock";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Full-width docs shell — sidebar + main, shadcn-style. Top padding clears
          the floating launcher / breadcrumb / nav dock from the root chrome. */}
      <div className="flex w-full">
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
          <div className="sticky top-20 max-h-[calc(100dvh-5rem)] overflow-y-auto border-r border-border py-8 pl-6 pr-4 scrollbar-thin">
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
  );
}
