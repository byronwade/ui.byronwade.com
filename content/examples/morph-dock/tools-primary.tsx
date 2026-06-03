"use client";

import { Check, Download, Home, Share2 } from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

/**
 * A tool zone with a brand `primary` action and grouped secondaries — a seam is
 * drawn automatically between actions whose `group` differs.
 */
export default function Example() {
  return (
    <div className="flex min-h-40 items-start justify-center p-8">
      <MorphDock
        navLabel="Document"
        items={[{ id: "home", label: "Home", icon: Home, href: "#", active: true, core: true }]}
        tools={[
          { id: "save", label: "Save", icon: Check, primary: true, group: "primary", onSelect: () => {} },
          { id: "share", label: "Share", icon: Share2, group: "secondary", onSelect: () => {} },
          { id: "export", label: "Export", icon: Download, group: "secondary", onSelect: () => {} },
        ]}
      />
    </div>
  );
}
