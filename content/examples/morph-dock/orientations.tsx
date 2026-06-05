"use client"

import * as React from "react"
import { BarChart3, Home, Inbox, Search, Settings } from "lucide-react"

import { MorphDock } from "@/components/ui/morph-dock"

const items = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "#",
    active: true,
    core: true,
  },
  { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true },
  { id: "reports", label: "Reports", icon: BarChart3, href: "#", core: true },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "#",
    pinned: true,
  },
]

/**
 * `placement` sets the bloom direction. Here the dock sits low and blooms
 * UPWARD — the hook is position-agnostic, so the same morph works in any
 * orientation (top / bottom / left / right).
 */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-64 items-end justify-center p-8">
      <MorphDock
        placement="top"
        origin="center"
        open={open}
        onOpenChange={setOpen}
        action={{ label: "Search", icon: Search }}
        panelWidth={300}
        items={items}
      >
        <div className="p-3">
          <input
            placeholder="Search…"
            aria-label="Search"
            className="h-8 w-full rounded-lg bg-dock-foreground/5 px-3 text-sm text-dock-active-foreground outline-none placeholder:text-dock-foreground/60"
          />
          <p className="mt-2 px-1 text-[11px] text-dock-foreground/60">
            Blooms upward
          </p>
        </div>
      </MorphDock>
    </div>
  )
}
