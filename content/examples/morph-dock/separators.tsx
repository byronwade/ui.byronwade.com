"use client";

import { BarChart3, Home, Inbox, Settings, Users } from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

/**
 * Grouped nav items — a thin seam (`bg-dock-muted`) is drawn automatically
 * between adjacent items whose `group` differs.
 */
export default function Example() {
  return (
    <div className="flex min-h-40 items-start justify-center p-8">
      <MorphDock
        navLabel="Sections"
        items={[
          { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true, group: "main" },
          { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true, group: "main", badge: 3 },
          { id: "reports", label: "Reports", icon: BarChart3, href: "#", core: true, group: "work" },
          { id: "team", label: "Team", icon: Users, href: "#", core: true, group: "work" },
          { id: "settings", label: "Settings", icon: Settings, href: "#", core: true, group: "account" },
        ]}
      />
    </div>
  );
}
