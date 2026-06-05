"use client";

import { Home, Inbox, BarChart3, Settings } from "lucide-react";
import { MorphSidebar } from "@/components/ui/morph-sidebar";

export default function Example() {
  return (
    <div className="flex h-80 overflow-hidden rounded-xl edge">
      <MorphSidebar
        brand="UI"
        items={[
          { id: "home", label: "Home", icon: Home, active: true },
          { id: "inbox", label: "Inbox", icon: Inbox },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ]}
      />
      <div className="flex-1 bg-background" />
    </div>
  );
}
