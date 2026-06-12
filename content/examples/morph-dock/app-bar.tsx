"use client"

import {
  GridFour,
  House,
  Layout,
  MagnifyingGlass,
  Stack,
  Sun,
  Terminal,
} from "@/lib/icons"

import { MorphDock } from "@/components/ui/morph-dock"

/**
 * A full app bar built from several MorphDock pills inline, exactly how the docs
 * shell composes its chrome: a launcher, a breadcrumb, the centered main nav, then
 * a toolbar pushed to the far right. Each pill is its own capsule; the row wires
 * them together.
 */
export default function Example() {
  return (
    <div className="flex min-h-40 w-full items-start p-8">
      <div className="flex w-full items-center gap-2">
        {/* Launcher, a single identity/menu pill */}
        <MorphDock
          navLabel="Launcher"
          expandable={false}
          items={[
            {
              id: "menu",
              label: "Menu",
              icon: GridFour,
              core: true,
              onSelect: () => {},
            },
          ]}
        />

        {/* Breadcrumb, where you are */}
        <MorphDock
          navLabel="Path"
          items={[]}
          breadcrumb={[
            { label: "byronwade/ui", href: "#" },
            { label: "Components" },
          ]}
        />

        {/* Main nav, the primary destinations */}
        <MorphDock
          navLabel="Primary"
          expandable={false}
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
              id: "components",
              label: "Components",
              icon: Stack,
              href: "#",
              core: true,
            },
            {
              id: "layouts",
              label: "Layouts",
              icon: Layout,
              href: "#",
              core: true,
            },
            {
              id: "templates",
              label: "Templates",
              icon: Layout,
              href: "#",
              core: true,
            },
          ]}
        />

        {/* Toolbar, pinned to the rear right */}
        <div className="ml-auto">
          <MorphDock
            navLabel="Tools"
            expandable={false}
            items={[
              {
                id: "search",
                label: "Search",
                icon: MagnifyingGlass,
                core: true,
                onSelect: () => {},
              },
              {
                id: "theme",
                label: "Theme",
                icon: Sun,
                core: true,
                onSelect: () => {},
              },
            ]}
            action={{ label: "Install", icon: Terminal }}
          />
        </div>
      </div>
    </div>
  )
}
