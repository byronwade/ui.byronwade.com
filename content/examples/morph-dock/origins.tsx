"use client"

import * as React from "react"
import { BarChart3, Home, Inbox, Search, Settings } from "lucide-react"

import type { MorphDockOrigin } from "@/components/ui/morph-dock"
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
  { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "#",
    pinned: true,
  },
]

const ROWS: { origin: MorphDockOrigin; align: string; label: string }[] = [
  {
    origin: "start",
    align: "justify-start",
    label: "Left dock → blooms from the start",
  },
  {
    origin: "center",
    align: "justify-center",
    label: "Centered dock → blooms from the center",
  },
  {
    origin: "end",
    align: "justify-end",
    label: "Right dock → blooms from the end",
  },
]

function Row({ origin, align }: { origin: MorphDockOrigin; align: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={`flex w-full ${align}`}>
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin={origin}
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
        </div>
      </MorphDock>
    </div>
  )
}

/**
 * The panel grows from wherever the dock sits, `origin` pins the bloom to the
 * dock's start, center, or end so a centered dock expands symmetrically.
 */
export default function Example() {
  return (
    <div className="flex min-h-72 w-full flex-col gap-8 p-8">
      {ROWS.map((r) => (
        <div key={r.origin} className="w-full space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">
            {r.label}
          </p>
          <Row origin={r.origin} align={r.align} />
        </div>
      ))}
    </div>
  )
}
