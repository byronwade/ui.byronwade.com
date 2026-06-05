"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChromeMorph } from "@/lib/use-chrome-morph"

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

export type MorphPlacement = "top" | "bottom" | "left" | "right"
export type MorphGrow = "height" | "width" | "both"

/** Anchor the morphing box so it grows the right direction (top edge fixed →
 *  grows down, bottom edge fixed → grows up, etc.). `top` stays in normal flow. */
const ANCHOR: Record<MorphPlacement, string> = {
  top: "",
  bottom: "absolute inset-x-0 bottom-0",
  left: "absolute inset-y-0 left-0",
  right: "absolute inset-y-0 right-0",
}

export interface MorphSurfaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Grow direction (sets the box's anchoring). */
  placement?: MorphPlacement
  /** Which axes animate. The non-growing axis holds the box's current size. */
  grow?: MorphGrow
  /** Resting nav content; fades OUT as the panel blooms. */
  collapsed: React.ReactNode
  /** Bloomed panel; fades IN. */
  panel: React.ReactNode
  /** Open-box target in px; the growing axis falls back to measuring the panel. */
  size?: { w?: number; h?: number }
  /** Accessible name for the nav landmark. */
  navLabel?: string
  /** Consumer styles the vessel (bg, radius, shadow, border). Applied to the box. */
  className?: string
}

/**
 * The morph technique, made agnostic. Wraps `useChromeMorph` with the common
 * orchestration — open state's refs, the rest↔panel cross-fade, box sizing per
 * `grow`, and Esc + outside-click close — and NO visual style of its own. Nav
 * styles (bar, sidebar, tabs, menubar, rail) compose it with their layout.
 */
export function MorphSurface({
  open,
  onOpenChange,
  placement = "top",
  grow = "height",
  collapsed,
  panel,
  size,
  navLabel = "Navigation",
  className,
}: MorphSurfaceProps) {
  const rootRef = React.useRef<HTMLElement>(null)
  const morphRef = React.useRef<HTMLDivElement>(null)
  const restRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  useChromeMorph({
    morphRef,
    restRef,
    panelRef,
    open,
    growHeight: grow !== "width",
    // Non-growing axis holds current size; growing axis uses `size` or measures the panel.
    width: () =>
      grow === "height"
        ? (morphRef.current?.offsetWidth ?? 0)
        : (size?.w ?? panelRef.current?.offsetWidth ?? 0),
    height:
      grow === "width"
        ? undefined
        : () => size?.h ?? panelRef.current?.offsetHeight ?? 0,
    deps: [grow, placement, size?.w, size?.h],
  })

  // The hook sets panel opacity:1 / rest opacity:0 inline on open but doesn't
  // reset them on close. Restore the collapsed view (panel hidden, rest shown)
  // so the panel doesn't stay visible inside the shrunken box.
  useIsoLayoutEffect(() => {
    if (open) return
    if (panelRef.current) panelRef.current.style.opacity = "0"
    if (restRef.current) restRef.current.style.opacity = ""
  })

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        onOpenChange(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open, onOpenChange])

  return (
    <nav
      ref={rootRef}
      data-slot="morph-surface"
      data-placement={placement}
      data-open={open || undefined}
      aria-label={navLabel}
      className={cn(
        "relative",
        placement === "left" || placement === "right" ? "h-full" : "w-full",
      )}
    >
      <div
        ref={morphRef}
        data-slot="morph-box"
        className={cn("relative overflow-hidden", ANCHOR[placement], className)}
      >
        <div ref={restRef} data-slot="morph-rest" aria-hidden={open}>
          {collapsed}
        </div>
        <div
          ref={panelRef}
          data-slot="morph-panel"
          aria-hidden={!open}
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-150",
            !open && "pointer-events-none",
          )}
        >
          {panel}
        </div>
      </div>
    </nav>
  )
}
