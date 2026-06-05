"use client"

import * as React from "react"
import { Home, Save } from "lucide-react"

import { MorphDock, type MorphDockStatus } from "@/components/ui/morph-dock"

/**
 * The pill blooms into a tone-styled status. Success/info auto-dismiss; errors
 * persist (here they carry an error code, like SignalRoute's save panels). All
 * three tones are shown side by side; hit Save on any to replay it.
 */
const STATES: MorphDockStatus[] = [
  { tone: "success", title: "Saved", message: "All changes synced just now." },
  {
    tone: "error",
    title: "Save failed",
    message: "ERR_CONN_RESET · Couldn't reach the server. Retry.",
  },
  {
    tone: "info",
    title: "Draft kept",
    message: "Saved a local draft on this device.",
  },
]

function StatusDock({ base }: { base: MorphDockStatus }) {
  const [status, setStatus] = React.useState<MorphDockStatus | null>(base)
  return (
    <MorphDock
      navLabel={base.title}
      origin="center"
      panelWidth={212}
      statusDismissMs={1_000_000}
      status={status}
      onStatusDismiss={() => setStatus(null)}
      items={[
        {
          id: "home",
          label: "Home",
          icon: Home,
          href: "#",
          active: true,
          core: true,
        },
      ]}
      tools={[
        {
          id: "save",
          label: "Save",
          icon: Save,
          primary: true,
          onSelect: () => setStatus(base),
        },
      ]}
    />
  )
}

export default function Example() {
  return (
    <div className="flex min-h-56 flex-wrap items-start justify-center gap-2 p-6">
      {STATES.map((s) => (
        <div key={s.tone} className="flex w-56 shrink-0 justify-center">
          <StatusDock base={s} />
        </div>
      ))}
    </div>
  )
}
