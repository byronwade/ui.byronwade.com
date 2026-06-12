"use client"

import * as React from "react"
import {
  BookOpen,
  CaretRight,
  ChartBar,
  ChatCircle,
  Gear,
  House,
  Lifebuoy,
  Lightning,
  Question,
  Tray,
  X,
} from "@/lib/icons"

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
  { id: "inbox", label: "Inbox", icon: Tray, href: "#", core: true },
  { id: "reports", label: "Reports", icon: ChartBar, href: "#", core: true },
  {
    id: "settings",
    label: "Settings",
    icon: Gear,
    href: "#",
    pinned: true,
  },
]

const topics = [
  {
    icon: BookOpen,
    title: "Getting started",
    desc: "Set up your first project",
  },
  {
    icon: Lightning,
    title: "Keyboard shortcuts",
    desc: "Work faster across the app",
  },
  {
    icon: ChatCircle,
    title: "Contact support",
    desc: "We usually reply within an hour",
  },
]

/** A help center blooming from the dock, the SignalRoute help panel design. */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-72 items-start justify-center p-8">
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Help", icon: Lifebuoy }}
        panelWidth={320}
        items={items}
      >
        <div>
          <div className="flex items-center gap-2.5 border-b border-dock-muted px-3 py-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
              <Question className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-dock-active-foreground">
                Help center
              </p>
              <p className="truncate text-xs text-dock-foreground/60">
                Search the docs or ask us
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid size-7 shrink-0 place-items-center rounded-lg text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-2">
            <input
              aria-label="Search help"
              placeholder="Search help…"
              className="h-8 w-full rounded-lg bg-dock-foreground/5 px-3 text-sm text-dock-active-foreground outline-none placeholder:text-dock-foreground/50"
            />
          </div>

          <div className="px-2 pb-2">
            {topics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-dock-active"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-dock-foreground/5 text-dock-foreground">
                  <topic.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-dock-active-foreground">
                    {topic.title}
                  </span>
                  <span className="block truncate text-[11px] text-dock-foreground/60">
                    {topic.desc}
                  </span>
                </span>
                <CaretRight className="size-4 shrink-0 text-dock-foreground/40" />
              </button>
            ))}
          </div>
        </div>
      </MorphDock>
    </div>
  )
}
