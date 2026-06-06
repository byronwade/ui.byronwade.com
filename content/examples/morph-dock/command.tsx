"use client"

import * as React from "react"
import {
  BarChart3,
  Command,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
} from "lucide-react"

import { MorphDock } from "@/components/ui/morph-dock"

const actions = [
  { icon: Plus, label: "New file" },
  { icon: Search, label: "Search everything" },
  { icon: Settings, label: "Open settings" },
]

/** The panel can be any content, here a command list blooms out of the dock. */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-56 items-start justify-center p-8">
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Command", icon: Command }}
        panelWidth={340}
        items={[
          {
            id: "home",
            label: "Home",
            icon: Home,
            href: "#",
            active: true,
            core: true,
          },
          { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true },
          {
            id: "reports",
            label: "Reports",
            icon: BarChart3,
            href: "#",
            core: true,
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "#",
            pinned: true,
          },
        ]}
      >
        <div className="p-1.5">
          <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dock-foreground/50">
            Actions
          </div>
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
            >
              <a.icon className="size-4 shrink-0 opacity-70" />
              {a.label}
            </button>
          ))}
        </div>
      </MorphDock>
    </div>
  )
}
