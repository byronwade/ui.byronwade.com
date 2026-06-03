"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";
import { SiteNav } from "@/app/(docs)/_components/site-nav";

/**
 * Mobile docs navigation — a hamburger pill pinned bottom-left (below `lg`, where
 * the sidebar `<aside>` is hidden) that blooms `SiteNav` upward as a scrollable
 * MorphDock panel. Closes on navigation, Esc, and click-away.
 */
export function DocsNavDock() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the panel whenever the route changes (a nav link was tapped).
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed bottom-4 left-4 z-50 lg:hidden print:hidden">
      <MorphDock
        tone="surface"
        navLabel="Documentation navigation"
        expandable={false}
        open={open}
        onOpenChange={setOpen}
        placement="top"
        origin="start"
        panelTitle="Documentation"
        panelWidth={264}
        panelHeight={420}
        items={[
          {
            id: "menu",
            label: open ? "Close navigation" : "Open navigation",
            icon: Menu,
            core: true,
            onSelect: () => setOpen((v) => !v),
          },
        ]}
      >
        <div className="p-3">
          <SiteNav />
        </div>
      </MorphDock>
    </div>
  );
}
