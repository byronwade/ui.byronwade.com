"use client"

import { Pencil } from "lucide-react"

import { MorphDock } from "@/components/ui/morph-dock"

/**
 * A breadcrumb dock, the leading region is a crumb trail (last crumb is the
 * current page) with a trailing tool action, instead of icon tabs.
 */
export default function Example() {
  return (
    <div className="flex min-h-40 items-start justify-center p-8">
      <MorphDock
        navLabel="Path"
        items={[]}
        breadcrumb={[
          { label: "Acme", href: "#" },
          { label: "Reports", href: "#" },
          { label: "Q2 2026" },
        ]}
        tools={[
          {
            id: "edit",
            label: "Edit",
            icon: Pencil,
            primary: true,
            onSelect: () => {},
          },
        ]}
      />
    </div>
  )
}
