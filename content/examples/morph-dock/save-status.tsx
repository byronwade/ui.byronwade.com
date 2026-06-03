"use client";

import * as React from "react";
import { Home, Inbox, Save } from "lucide-react";

import { MorphDock, type MorphDockStatus } from "@/components/ui/morph-dock";

/** The pill blooms into a tone-styled status. Success/info auto-dismiss; errors stay. */
const cycle: MorphDockStatus[] = [
  { tone: "success", title: "Saved", message: "All changes synced." },
  { tone: "error", title: "Save failed", message: "Check your connection and retry." },
  { tone: "info", title: "Draft kept", message: "We saved a local draft." },
];

export default function Example() {
  const [status, setStatus] = React.useState<MorphDockStatus | null>(null);
  const next = React.useRef(0);

  return (
    <div className="flex min-h-44 items-start justify-center p-8">
      <MorphDock
        navLabel="Editor"
        origin="center"
        items={[
          { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
          { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true },
        ]}
        tools={[
          {
            id: "save",
            label: "Save",
            icon: Save,
            primary: true,
            onSelect: () => {
              setStatus(cycle[next.current % cycle.length]);
              next.current += 1;
            },
          },
        ]}
        status={status}
        statusDismissMs={2400}
        onStatusDismiss={() => setStatus(null)}
      />
    </div>
  );
}
