"use client";

import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  Inbox,
  Settings,
  Users,
} from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

/**
 * Compact ↔ full. Only core + pinned + active items show at rest; the chevron
 * reveals the rest (each item morphs its own width). Plus a badge and a custom
 * trailing cluster.
 */
export default function Example() {
  return (
    <div className="flex min-h-44 items-center justify-center p-8">
      <MorphDock
        cluster={
          <span className="ml-1 flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-brand">
            <span className="size-1.5 rounded-full bg-brand" />3 new
          </span>
        }
        items={[
          { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
          { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true, badge: 3 },
          { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
          { id: "team", label: "Team", icon: Users, href: "#" },
          { id: "docs", label: "Docs", icon: FileText, href: "#" },
          { id: "billing", label: "Billing", icon: CreditCard, href: "#" },
          { id: "settings", label: "Settings", icon: Settings, href: "#", pinned: true },
        ]}
      />
    </div>
  );
}
