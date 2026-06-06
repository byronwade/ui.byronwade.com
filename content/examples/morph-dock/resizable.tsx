"use client"

import * as React from "react"
import { BarChart3, Home, Inbox, Settings, SquareTerminal } from "lucide-react"

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
 * `resizable` adds a corner grip, drag it to resize the panel; the morph box
 * follows live. Combined with `draggable` it's a full detachable window.
 */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-72 items-start justify-center p-8">
      <MorphDock
        resizable
        draggable
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Console", icon: SquareTerminal }}
        panelTitle="Console"
        panelWidth={320}
        panelHeight={200}
        items={items}
      >
        <div className="px-3 pb-3">
          <pre className="rounded-lg bg-dock-foreground/[0.06] p-2.5 font-mono text-[11px] leading-relaxed text-dock-foreground">
            <span className="text-brand">$</span> drag the corner grip ↘{"\n"}
            resizing…{"\n"}
            ready.
          </pre>
        </div>
      </MorphDock>
    </div>
  )
}
