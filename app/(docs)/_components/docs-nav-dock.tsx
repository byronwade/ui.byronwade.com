"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { MorphDock } from "@/components/ui/morph-dock";
import { categories, byCategory } from "@/content/components";
import { guides } from "@/content/guides";

/**
 * Mobile docs navigation — a hamburger pill pinned bottom-left (below `lg`, where
 * the sidebar `<aside>` is hidden) that blooms the docs nav upward as a scrollable
 * MorphDock panel. It uses the **dark `dock` tone** so it reads as the same chrome
 * as the floating primary `NavDock`, and the links mirror that dock's search-panel
 * styling (uppercase section labels + `dock-active` rows). Closes on navigation,
 * Esc, and click-away.
 */
export function DocsNavDock() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the panel whenever the route changes (a nav link was tapped).
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const row = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex w-full items-center rounded-lg px-2.5 py-2 text-left text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30",
          active
            ? "bg-dock-active font-semibold text-dock-active-foreground"
            : "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground",
        )}
      >
        {label}
      </Link>
    );
  };

  const section = (label: string, children: React.ReactNode) => (
    <div key={label} className="mb-1 last:mb-0">
      <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dock-foreground/50">
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <div className="fixed bottom-4 left-4 z-50 lg:hidden print:hidden">
      <MorphDock
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
        <div className="p-1.5">
          {section("Get Started", guides.map((g) => row(g.href, g.label)))}
          {categories.map((cat) =>
            section(cat, byCategory(cat).map((c) => row(`/docs/${c.slug}`, c.name))),
          )}
        </div>
      </MorphDock>
    </div>
  );
}
