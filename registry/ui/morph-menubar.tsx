"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MorphSurface } from "@/components/ui/morph-surface"

export interface MorphMenubarMenuItem {
  id: string
  label: string
  onSelect?: () => void
}

export interface MorphMenubarMenu {
  id: string
  label: string
  items: MorphMenubarMenuItem[]
}

export interface MorphMenubarProps {
  menus: MorphMenubarMenu[]
  navLabel?: string
  className?: string
}

const BAR_H = 40 // px — slim menubar row
const ITEM_H = 32 // px — one dropdown item

/** A slim menubar that blooms the active menu's dropdown IN PLACE — positioned
 *  under its trigger — via the morph technique (`placement="top"`,
 *  `grow="height"`). The dropdown offset is measured inside this component, so
 *  the agnostic MorphSurface primitive stays untouched. */
export function MorphMenubar({
  menus,
  navLabel = "Menubar",
  className,
}: MorphMenubarProps) {
  const [active, setActive] = React.useState<{
    id: string
    left: number
  } | null>(null)
  const open = active !== null
  const activeMenu = active ? menus.find((m) => m.id === active.id) : undefined
  const dropdownH = activeMenu ? activeMenu.items.length * ITEM_H + 8 : 0

  const close = () => setActive(null)

  const Bar = (
    <div className="flex items-center gap-0.5 px-2" style={{ height: BAR_H }}>
      {menus.map((menu) => (
        <button
          key={menu.id}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open && active?.id === menu.id}
          onClick={(e) => {
            const left = e.currentTarget.offsetLeft
            setActive((cur) =>
              cur?.id === menu.id ? null : { id: menu.id, left },
            )
          }}
          className={cn(
            "rounded px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
            open && active?.id === menu.id
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {menu.label}
        </button>
      ))}
    </div>
  )

  return (
    <MorphSurface
      data-slot="morph-menubar"
      open={open}
      onOpenChange={() => close()}
      placement="top"
      grow="height"
      navLabel={navLabel}
      size={{ h: BAR_H + dropdownH }}
      className={cn("border-b border-border bg-card", className)}
      collapsed={Bar}
      panel={
        <div className="relative h-full">
          {Bar}
          {activeMenu ? (
            <div
              role="menu"
              aria-label={activeMenu.label}
              style={{ left: active!.left, top: BAR_H }}
              className="absolute min-w-40 rounded-lg bg-popover p-1 text-popover-foreground edge"
            >
              {activeMenu.items.map((mi) => (
                <button
                  key={mi.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    mi.onSelect?.()
                    close()
                  }}
                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                >
                  {mi.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      }
    />
  )
}
