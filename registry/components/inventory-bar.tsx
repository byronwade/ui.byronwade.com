"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type InventoryTone = "ok" | "low" | "out"

interface InventoryBarProps extends React.ComponentProps<"div"> {
  available: number
  total: number
  lowStockThreshold?: number
  showCount?: boolean
  showStatus?: boolean
}

// Tonal state mapped to semantic tokens — never a literal colour — so the bar
// re-skins with `--brand`/`--success`/`--warning`/`--destructive` like the rest
// of the system. The tone recolours the progress primitive's own indicator via a
// descendant-slot selector (the same house pattern as
// `[&_[data-slot=scroll-area-scrollbar]]:hidden`) so we compose the bar rather
// than re-implementing one — and never double-render the auto-injected track.
const toneMap: Record<
  InventoryTone,
  { indicator: string; text: string; label: string }
> = {
  ok: {
    indicator: "[&_[data-slot=progress-indicator]]:bg-success",
    text: "text-success",
    label: "In stock",
  },
  low: {
    indicator: "[&_[data-slot=progress-indicator]]:bg-warning",
    text: "text-warning",
    label: "Low stock",
  },
  out: {
    indicator: "[&_[data-slot=progress-indicator]]:bg-destructive",
    text: "text-destructive",
    label: "Out of stock",
  },
}

function InventoryBar({
  available,
  total,
  lowStockThreshold = 10,
  showCount = true,
  showStatus = true,
  className,
  ...props
}: InventoryBarProps) {
  const tone: InventoryTone =
    available <= 0 ? "out" : available <= lowStockThreshold ? "low" : "ok"
  const { indicator, text, label } = toneMap[tone]

  // Guard a non-positive total (divide-by-zero) → empty bar; clamp the ratio so
  // an over-stocked count can never overflow past 100%.
  const percent =
    total <= 0 ? 0 : Math.min(100, Math.max(0, (available / total) * 100))

  return (
    <div
      data-slot="inventory-bar"
      data-tone={tone}
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {(showCount || showStatus) && (
        <div
          data-slot="inventory-bar-meta"
          className="flex items-center justify-between gap-3 text-xs"
        >
          {showCount && (
            <span
              data-slot="inventory-bar-count"
              className="font-mono tabular-nums text-muted-foreground"
            >
              {available} / {total}
            </span>
          )}
          {showStatus && (
            <span
              data-slot="inventory-bar-status"
              className={cn("font-medium", text)}
            >
              {label}
            </span>
          )}
        </div>
      )}
      <Progress
        value={percent}
        aria-label={label}
        data-slot="inventory-bar-progress"
        className={indicator}
      />
    </div>
  )
}

export { InventoryBar }
export type { InventoryBarProps }
