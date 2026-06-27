"use client"

import * as React from "react"
import { List } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { MorphSurface } from "@/components/ui/morph-surface"

export interface MorphBarItem {
  id: string
  label: string
  href?: string
  onSelect?: () => void
  active?: boolean
}

export interface MorphBarProps {
  brand: React.ReactNode
  items: MorphBarItem[]
  /** Content bloomed below the bar (mega-menu / search / command). */
  panel: React.ReactNode
  /** Open height in px (the bloomed bar + panel). */
  panelHeight?: number
  navLabel?: string
  className?: string
}

/** A full-width top navigation bar that blooms a panel DOWN via the morph
 *  technique (`placement="top"`, `grow="height"`). The bar row is MorphSurface's
 *  collapsed state and re-appears at the top of the panel, so the bloom looks
 *  seamless and the trigger stays inside the outside-click boundary. */
export function MorphBar({
  brand,
  items,
  panel,
  panelHeight = 320,
  navLabel = "Primary",
  className,
}: MorphBarProps) {
  const [open, setOpen] = React.useState(false)

  const links = (
    <ul data-slot="morph-bar-nav" className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href ?? "#"}
            aria-current={item.active ? "page" : undefined}
            onClick={(e) => {
              if (item.onSelect) {
                e.preventDefault()
                item.onSelect()
              }
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
              item.active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )

  const Row = (
    <div
      data-slot="morph-bar-row"
      className="flex h-14 items-center justify-between gap-4 px-4"
    >
      <span className="text-sm font-medium tracking-tight">{brand}</span>
      <div className="flex items-center gap-2">
        {links}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <List className="size-4" />
        </button>
      </div>
    </div>
  )

  return (
    <MorphSurface
      data-slot="morph-bar"
      open={open}
      onOpenChange={setOpen}
      placement="top"
      grow="height"
      navLabel={navLabel}
      size={{ h: panelHeight }}
      className={cn("border-b border-border bg-card", className)}
      collapsed={Row}
      panel={
        <div className="flex h-full flex-col">
          {Row}
          <div className="min-h-0 flex-1 overflow-auto border-t border-border p-4">
            {panel}
          </div>
        </div>
      }
    />
  )
}
