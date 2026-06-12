"use client"

import { ChartBar, Gear, House, Tray } from "@/lib/icons"

import { MorphDock } from "@/components/ui/morph-dock"

const items = [
  {
    id: "home",
    label: "Home",
    icon: House,
    href: "#",
    active: true,
    core: true,
  },
  { id: "inbox", label: "Inbox", icon: Tray, href: "#", core: true, badge: 2 },
  { id: "reports", label: "Reports", icon: ChartBar, href: "#" },
  {
    id: "settings",
    label: "Settings",
    icon: Gear,
    href: "#",
    pinned: true,
  },
]

/** The dark `--dock` pill (default) and the light `surface` tone. */
export default function Example() {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-6 p-8">
      <MorphDock tone="dock" items={items} />
      <MorphDock tone="surface" items={items} />
    </div>
  )
}
