"use client"

import { Check, DownloadSimple, House, ShareNetwork } from "@/lib/icons"

import { MorphDock } from "@/components/ui/morph-dock"

/**
 * A tool zone with a brand `primary` action and grouped secondaries, a seam is
 * drawn automatically between actions whose `group` differs.
 */
export default function Example() {
  return (
    <div className="flex min-h-40 items-start justify-center p-8">
      <MorphDock
        navLabel="Document"
        items={[
          {
            id: "home",
            label: "Home",
            icon: House,
            href: "#",
            active: true,
            core: true,
          },
        ]}
        tools={[
          {
            id: "save",
            label: "Save",
            icon: Check,
            primary: true,
            group: "primary",
            onSelect: () => {},
          },
          {
            id: "share",
            label: "Share",
            icon: ShareNetwork,
            group: "secondary",
            onSelect: () => {},
          },
          {
            id: "export",
            label: "Export",
            icon: DownloadSimple,
            group: "secondary",
            onSelect: () => {},
          },
        ]}
      />
    </div>
  )
}
