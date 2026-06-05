"use client"

import { Home, Inbox, BarChart3, Settings } from "lucide-react"
import { MorphSidebar } from "@/components/ui/morph-sidebar"

export default function Example() {
  return (
    // App-shell frame. The rail's <nav> collapses to 0 width in the flex row (its
    // box is absolute-anchored to the left edge and blooms WIDER over the
    // content), so the content fills the row and clears the rail with left padding.
    <div className="relative flex h-80 w-full overflow-hidden rounded-xl edge bg-background">
      <MorphSidebar
        brand="UI"
        items={[
          { id: "home", label: "Home", icon: Home, active: true },
          { id: "inbox", label: "Inbox", icon: Inbox },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ]}
      />
      <div className="min-w-0 flex-1 space-y-3 overflow-auto p-5">
        <div className="h-7 w-40 rounded-md bg-muted" />
        <div className="h-28 rounded-lg bg-muted/60" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-lg bg-muted/60" />
          <div className="h-20 rounded-lg bg-muted/60" />
        </div>
      </div>
    </div>
  )
}
