"use client"

import * as React from "react"
import { BarChart3, Home, Inbox, Settings, StickyNote } from "lucide-react"

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
 * `draggable` detaches the open panel — grab the header to drag it free, then
 * close (Esc, click-away, or the ✕) flies it home. The header carries the drag
 * handle, the title, and the close button; `onSave` would add a Save button.
 */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-72 items-start justify-center p-8">
      <MorphDock
        draggable
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Notes", icon: StickyNote }}
        panelTitle="Scratch pad"
        onSave={() => setOpen(false)}
        panelWidth={280}
        panelHeight={190}
        items={items}
      >
        <div className="px-3 pb-3">
          <textarea
            aria-label="Notes"
            placeholder="Drag the header to move me anywhere…"
            className="h-24 w-full resize-none rounded-lg bg-dock-foreground/5 p-2 text-[13px] text-dock-active-foreground outline-none placeholder:text-dock-foreground/50"
          />
        </div>
      </MorphDock>
    </div>
  )
}
