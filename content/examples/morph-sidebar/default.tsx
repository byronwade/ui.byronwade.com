"use client"

import { Home, Inbox, BarChart3, Settings } from "lucide-react"
import { MorphSidebar } from "@/components/ui/morph-sidebar"

export default function Example() {
  return (
    // App-shell frame: the rail is absolute-anchored to the left edge and
    // blooms WIDER over the content, so the content clears it with left padding.
    <div className="relative h-80 w-full overflow-hidden rounded-xl edge bg-background">
      <MorphSidebar
        brand="UI"
        items={[
          { id: "home", label: "Home", icon: Home, active: true },
          { id: "inbox", label: "Inbox", icon: Inbox },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ]}
      />
      <div className="h-full space-y-3 overflow-auto py-5 pr-5 pl-[76px]">
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
