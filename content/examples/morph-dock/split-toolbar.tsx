"use client"

import { Chat, House, Phone, Plus, Tray } from "@/lib/icons"

import { MorphDock } from "@/components/ui/morph-dock"

/**
 * Combined nav + toolbar in one pill. The `tools` zone paints a lighter
 * `bg-dock-tool` shelf beside the `bg-dock` nav, the two-tone "split color".
 */
export default function Example() {
  return (
    <div className="flex min-h-40 items-start justify-center p-8">
      <MorphDock
        navLabel="Workspace"
        items={[
          {
            id: "home",
            label: "Home",
            icon: House,
            href: "#",
            active: true,
            core: true,
          },
          {
            id: "inbox",
            label: "Inbox",
            icon: Tray,
            href: "#",
            core: true,
            badge: 2,
          },
        ]}
        tools={[
          { id: "call", label: "Call", icon: Phone, onSelect: () => {} },
          {
            id: "text",
            label: "Text",
            icon: Chat,
            onSelect: () => {},
          },
          {
            id: "new",
            label: "New",
            icon: Plus,
            primary: true,
            onSelect: () => {},
          },
        ]}
      />
    </div>
  )
}
