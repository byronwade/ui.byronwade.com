"use client"

import * as React from "react"
import { Sidebar, type Icon } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { MorphSurface } from "@/components/ui/morph-surface"

export interface MorphSidebarItem {
  id: string
  label: string
  icon: Icon
  href?: string
  onSelect?: () => void
  active?: boolean
}

export interface MorphSidebarProps {
  items: MorphSidebarItem[]
  /** Brand/logo shown at the top of the rail. */
  brand?: React.ReactNode
  /** Expanded sidebar width in px. */
  expandedWidth?: number
  navLabel?: string
  className?: string
}

/** A left icon rail that morphs WIDER into a labeled sidebar via the morph
 *  technique (`placement="left"`, `grow="width"`). The rail is the resting
 *  state; a toggle blooms the labeled panel. */
export function MorphSidebar({
  items,
  brand,
  expandedWidth = 240,
  navLabel = "Sidebar",
  className,
}: MorphSidebarProps) {
  const [open, setOpen] = React.useState(false)

  const toggle = (
    <button
      type="button"
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className="grid size-9 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Sidebar className="size-4" />
    </button>
  )

  const link = (item: MorphSidebarItem, expanded: boolean) => {
    const Icon = item.icon
    return (
      <a
        key={item.id}
        href={item.href ?? "#"}
        aria-current={item.active ? "page" : undefined}
        aria-label={expanded ? undefined : item.label}
        onClick={(e) => {
          if (item.onSelect) {
            e.preventDefault()
            item.onSelect()
          }
        }}
        className={cn(
          "flex h-9 items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          expanded ? "gap-3 px-2.5 text-sm" : "w-9 justify-center",
          item.active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="size-4 shrink-0" />
        {expanded ? <span className="truncate">{item.label}</span> : null}
      </a>
    )
  }

  const Rail = (
    <div className="flex h-full w-14 flex-col gap-1 p-2">
      {brand ? (
        <div className="mb-2 grid h-9 place-items-center">{brand}</div>
      ) : null}
      {items.map((item) => link(item, false))}
      <div className="mt-auto">{toggle}</div>
    </div>
  )

  const Expanded = (
    <div
      className="flex h-full flex-col gap-1 p-2"
      style={{ width: expandedWidth }}
    >
      {brand ? (
        <div className="mb-2 flex h-9 items-center px-1 text-sm font-medium tracking-tight">
          {brand}
        </div>
      ) : null}
      {items.map((item) => link(item, true))}
      <div className="mt-auto">{toggle}</div>
    </div>
  )

  return (
    <MorphSurface
      data-slot="morph-sidebar"
      open={open}
      onOpenChange={setOpen}
      placement="left"
      grow="width"
      navLabel={navLabel}
      size={{ w: expandedWidth }}
      className={cn("h-full border-r border-border bg-card", className)}
      collapsed={Rail}
      panel={Expanded}
    />
  )
}
