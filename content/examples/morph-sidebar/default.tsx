"use client"

import { Home, Inbox, BarChart3, Settings } from "lucide-react"
import { MorphSidebar } from "@/components/ui/morph-sidebar"

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
      <div className="flex-1 space-y-3 bg-background p-5">
        <div className="h-6 w-40 rounded-md bg-muted" />
        <div className="h-24 rounded-lg border border-border bg-card" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 rounded-lg border border-border bg-card" />
          <div className="h-16 rounded-lg border border-border bg-card" />
        </div>
      </div>
    </div>
  )
}
