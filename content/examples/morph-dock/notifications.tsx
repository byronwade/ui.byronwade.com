"use client"

import * as React from "react"
import {
  Bell,
  ChartBar,
  Chat,
  Checks,
  Gear,
  House,
  PhoneX,
  ShieldCheck,
  Tray,
  X,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
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
  { id: "reports", label: "Reports", icon: ChartBar, href: "#" },
  {
    id: "settings",
    label: "Settings",
    icon: Gear,
    href: "#",
    pinned: true,
  },
]

type Note = {
  id: number
  icon: typeof Bell
  tone: string
  title: string
  body?: string
  time: string
  unread?: boolean
}

const TODAY: Note[] = [
  {
    id: 1,
    icon: Chat,
    tone: "text-brand",
    title: "New message from Mira",
    body: "Can you review the latest flow?",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    icon: PhoneX,
    tone: "text-destructive",
    title: "Missed call",
    body: "+1 (415) 555-0136",
    time: "18m ago",
    unread: true,
  },
  {
    id: 3,
    icon: ShieldCheck,
    tone: "text-success",
    title: "Verification approved",
    time: "1h ago",
  },
]

const EARLIER: Note[] = [
  {
    id: 4,
    icon: ChartBar,
    tone: "text-brand",
    title: "Weekly report is ready",
    body: "Calls up 12% over last week",
    time: "Yesterday",
  },
]

function Row({ note }: { note: Note }) {
  const Icon = note.icon
  return (
    <div className="group/n relative flex gap-2.5 rounded-lg p-2 transition-colors hover:bg-dock-foreground/[0.04]">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-dock-foreground/[0.07]">
        <Icon className={cn("size-3.5", note.tone)} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5 text-sm font-medium leading-snug text-dock-active-foreground">
          {note.unread ? (
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
          ) : null}
          <span className="min-w-0">{note.title}</span>
        </div>
        {note.body ? (
          <p className="mt-0.5 truncate text-xs text-dock-foreground">
            {note.body}
          </p>
        ) : null}
        <p className="mt-0.5 text-[11px] text-dock-foreground/60">
          {note.time}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md text-dock-foreground opacity-0 transition hover:bg-dock-foreground/[0.08] hover:text-dock-active-foreground focus-visible:opacity-100 group-hover/n:opacity-100"
      >
        <X className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}

function Section({ label, notes }: { label: string; notes: Note[] }) {
  return (
    <div>
      <div className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-dock-foreground/60">
        {label}
      </div>
      {notes.map((n) => (
        <Row key={n.id} note={n} />
      ))}
    </div>
  )
}

/**
 * A notifications center blooming from the dock, the SignalRoute notifications
 * panel: a title + mark-all-read header, grouped scrollable rows, a footer link,
 * and a corner resize grip (drag it to set the body height).
 */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex min-h-[28rem] items-start justify-center p-8">
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin="center"
        resizable
        action={{ label: "Notifications", icon: Bell }}
        panelWidth={344}
        panelHeight={384}
        items={items}
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-3.5">
            <div className="pl-1 text-[15px] font-semibold text-dock-active-foreground">
              Notifications
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-dock-foreground transition-colors hover:text-dock-active-foreground"
              >
                <Checks className="size-3.5" />
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="flex size-7 items-center justify-center rounded-full text-dock-foreground transition-colors hover:bg-dock-foreground/[0.08] hover:text-dock-active-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-2 pb-2">
            <Section label="Today" notes={TODAY} />
            <Section label="Earlier" notes={EARLIER} />
          </div>

          <div className="flex shrink-0 items-center justify-center border-t border-white/10 px-3.5 py-2.5">
            <button
              type="button"
              className="text-xs font-semibold text-dock-foreground transition-colors hover:text-dock-active-foreground"
            >
              View all notifications
            </button>
          </div>
        </div>
      </MorphDock>
    </div>
  )
}
