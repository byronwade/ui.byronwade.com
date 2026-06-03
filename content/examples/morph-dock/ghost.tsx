"use client";

import * as React from "react";
import { BarChart3, Home, Inbox, Search, Settings } from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

/**
 * A "ghost" dock — `bare` drops the resting pill background and shadow, so the
 * items float free until a panel blooms. The bloomed panel still brings its own
 * surface, so the morph reads as a panel materialising out of thin air.
 */
export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-52 items-start justify-center p-8">
      <MorphDock
        bare
        tone="surface"
        open={open}
        onOpenChange={setOpen}
        origin="center"
        panelWidth={300}
        items={[
          { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
          { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true, badge: 2 },
          { id: "reports", label: "Reports", icon: BarChart3, href: "#", core: true },
          { id: "search", label: "Search", icon: Search, core: true, onSelect: () => setOpen(true) },
          { id: "settings", label: "Settings", icon: Settings, href: "#", pinned: true },
        ]}
      >
        <div className="p-3">
          <input
            placeholder="Search…"
            aria-label="Search"
            className="h-9 w-full rounded-lg bg-muted px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            No pill at rest — the panel brings its own surface.
          </p>
        </div>
      </MorphDock>
    </div>
  );
}
