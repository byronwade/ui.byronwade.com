"use client"

import * as React from "react"
import { BarChart3, Home, Inbox, Search, Settings } from "lucide-react"

import { MorphDock } from "@/components/ui/morph-dock"

export default function Example() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex min-h-52 items-start justify-center p-8">
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Search", icon: Search }}
        panelWidth={320}
        items={[
          {
            id: "home",
            label: "Home",
            icon: Home,
            href: "#",
            active: true,
            core: true,
          },
          {
            id: "inbox",
            label: "Inbox",
            icon: Inbox,
            href: "#",
            core: true,
            badge: 3,
          },
          { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "#",
            pinned: true,
          },
        ]}
      >
        <div className="p-3">
          <input
            placeholder="Search…"
            aria-label="Search"
            className="h-8 w-full rounded-lg bg-dock-foreground/5 px-3 text-sm text-dock-active-foreground outline-none placeholder:text-dock-foreground/60"
          />
          <p className="mt-2 px-1 text-[11px] text-dock-foreground/60">
            Esc or click away to close
          </p>
        </div>
      </MorphDock>
    </div>
  )
}
